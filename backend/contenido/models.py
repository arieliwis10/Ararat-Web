"""
Contenido administrable de la web pública (araratchile.com).

Tablas propias, sin relación con las de la app interna: aquí solo vive lo que se
decide mostrar en la web. Se administra en el panel /web-admin/ (ver admin.py).
"""

import io
import uuid

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.validators import FileExtensionValidator
from django.db import models
from PIL import Image, ImageOps

# Las fotos se guardan ya reducidas: la web no necesita los 4–5 MB de un celular.
FOTO_LADO_MAX = 1600
MINIATURA_LADO_MAX = 800
# El servidor no puede recomprimir videos (no hay ffmpeg en el hosting): se suben ya listos.
VIDEO_MB_MAX = 40


def _subir_video(instance, filename):
    return f"web/trabajos/videos/{uuid.uuid4().hex}.mp4"


def _validar_peso_video(archivo):
    if archivo.size > VIDEO_MB_MAX * 1024 * 1024:
        raise ValidationError(f"El video pesa más de {VIDEO_MB_MAX} MB. Súbelo comprimido (ver LEEME.md).")


def _subir_a(instance, filename):
    return f"{instance.CARPETA}/{filename}"


def _a_jpeg(imagen, lado_max, calidad):
    copia = imagen.copy()
    copia.thumbnail((lado_max, lado_max), Image.Resampling.LANCZOS)
    salida = io.BytesIO()
    copia.save(salida, "JPEG", quality=calidad, optimize=True, progressive=True)
    return ContentFile(salida.getvalue())


class Publicable(models.Model):
    publicado = models.BooleanField("publicado", default=True, help_text="Desmárcalo para ocultarlo de la web sin borrarlo.")
    orden = models.PositiveSmallIntegerField("orden", default=0, help_text="Los números menores salen primero.")
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ConFotos(Publicable):
    """Base de lo que lleva fotos (modelo relacionado con related_name="fotos")."""

    class Meta:
        abstract = True

    def fotos_ordenadas(self):
        """Todas las fotos, con la portada primero."""
        return sorted(self.fotos.all(), key=lambda f: (not f.es_portada, f.orden, f.pk))

    def portada(self):
        fotos = self.fotos_ordenadas()
        return fotos[0] if fotos else None


class Trabajo(ConFotos):
    class Categoria(models.TextChoices):
        # Los valores son los slugs de web/src/data/servicios.ts: la web los usa para
        # mostrar cada trabajo en la página de su servicio.
        SOLDADURA = "soldadura", "Soldadura y estructuras metálicas"
        TORNO = "torno-y-mecanizado", "Torno y mecanizado"
        FERRETERIA = "insumos-de-ferreteria", "Insumos de ferretería"
        REPUESTOS = "repuestos-industriales", "Repuestos industriales"
        FLEXIBLES = "flexibles-hidraulicos", "Flexibles hidráulicos"
        FABRICACION = "fabricacion", "Fabricación de equipos y proyectos"

    titulo = models.CharField("título", max_length=120)
    categoria = models.CharField("categoría", max_length=40, choices=Categoria.choices)
    resumen = models.CharField("resumen", max_length=200, help_text="Una línea: es el texto de la tarjeta.")
    descripcion = models.TextField("descripción", blank=True, help_text="Opcional. Se muestra al abrir el trabajo.")
    destacado = models.BooleanField(
        "destacado", default=False, help_text="Lo muestra en grande, con su galería, al inicio de la página Trabajos."
    )
    video = models.FileField(
        "video",
        upload_to=_subir_video,
        blank=True,
        validators=[FileExtensionValidator(["mp4"]), _validar_peso_video],
        help_text=f"Opcional. MP4 (H.264) de hasta {VIDEO_MB_MAX} MB; se ve en la galería, después de las fotos.",
    )

    class Meta:
        ordering = ["orden", "-creado"]
        verbose_name = "trabajo realizado"
        verbose_name_plural = "trabajos realizados"

    def __str__(self):
        return self.titulo


class Equipo(ConFotos):
    nombre = models.CharField("nombre", max_length=120)
    categoria = models.CharField(
        "categoría", max_length=60, default="Maquinaria", help_text="Agrupa los equipos en el catálogo (p. ej. Maquinaria)."
    )
    detalle = models.CharField("detalle", max_length=200, blank=True, help_text="Capacidad, modelo o referencia.")
    precio_dia = models.PositiveIntegerField(
        "precio por día (CLP)", null=True, blank=True, help_text='Neto, sin IVA. Déjalo vacío para mostrar "Consultar".'
    )
    precio_semana = models.PositiveIntegerField(
        "precio por semana (CLP)", null=True, blank=True, help_text="Neto, sin IVA. Opcional."
    )
    precio_mes = models.PositiveIntegerField("precio por mes (CLP)", null=True, blank=True, help_text="Neto, sin IVA. Opcional.")
    unidades = models.PositiveSmallIntegerField("unidades disponibles", default=1)

    class Meta:
        ordering = ["orden", "nombre"]
        verbose_name = "equipo en arriendo"
        verbose_name_plural = "equipos en arriendo"

    def __str__(self):
        return self.nombre


class CategoriaPyrotect(ConFotos):
    nombre = models.CharField("nombre", max_length=80, unique=True)
    descripcion = models.CharField("descripción", max_length=200, blank=True, help_text="Una línea bajo el nombre.")
    lineas = models.TextField(
        "líneas de producto", blank=True, help_text="Una por línea. Se muestran como etiquetas dentro de la categoría."
    )

    class Meta:
        ordering = ["orden", "nombre"]
        verbose_name = "categoría de Pyrotect"
        verbose_name_plural = "Pyrotect: categorías"

    def __str__(self):
        return self.nombre

    def lista_lineas(self):
        return [linea.strip() for linea in self.lineas.splitlines() if linea.strip()]


class ProductoPyrotect(ConFotos):
    nombre = models.CharField("nombre", max_length=120)
    # PROTECT: una categoría con productos no se puede borrar por error.
    categoria = models.ForeignKey(
        CategoriaPyrotect, on_delete=models.PROTECT, related_name="productos", verbose_name="categoría"
    )

    class Meta:
        ordering = ["orden", "nombre"]
        verbose_name = "producto de Pyrotect"
        verbose_name_plural = "Pyrotect: productos destacados"

    def __str__(self):
        return self.nombre


class ActividadComunidad(ConFotos):
    """Responsabilidad social de la empresa: deporte, seguridad, educación… (página /responsabilidad-social/)."""

    class Eje(models.TextChoices):
        # Los valores son los ejes de la página web/src/pages/responsabilidad-social.astro.
        DEPORTE = "deporte", "Deporte"
        SEGURIDAD = "seguridad", "Seguridad y bienestar"
        EDUCACION = "educacion", "Educación y tecnología"
        AMBIENTE = "ambiente", "Medio ambiente"
        LABORAL = "laboral", "Trabajo seguro y cumplimiento"

    titulo = models.CharField("título", max_length=120)
    eje = models.CharField("eje", max_length=20, choices=Eje.choices)
    resumen = models.CharField("resumen", max_length=200, help_text="Una línea: es el texto de la tarjeta.")
    descripcion = models.TextField("descripción", blank=True, help_text="Opcional. Se muestra al abrir las fotos.")
    fecha = models.DateField("fecha", null=True, blank=True, help_text="Opcional. Se muestra como mes y año.")

    class Meta:
        ordering = ["orden", "-fecha", "-creado"]
        verbose_name = "actividad de RSE"
        verbose_name_plural = "RSE: actividades"

    def __str__(self):
        return self.titulo


class PreguntaFrecuente(Publicable):
    class Seccion(models.TextChoices):
        # Los valores de los servicios son sus slugs en web/src/data/servicios.ts.
        SOLDADURA = "soldadura", "Servicio: Soldadura y estructuras metálicas"
        TORNO = "torno-y-mecanizado", "Servicio: Torno y mecanizado"
        FERRETERIA = "insumos-de-ferreteria", "Servicio: Insumos de ferretería"
        REPUESTOS = "repuestos-industriales", "Servicio: Repuestos industriales"
        FLEXIBLES = "flexibles-hidraulicos", "Servicio: Flexibles hidráulicos"
        KAIROS = "kairos", "Kairos Arriendos"
        PYROTECT = "pyrotect", "Pyrotect"

    seccion = models.CharField(
        "página", max_length=40, choices=Seccion.choices, help_text="Página de la web donde se muestra la pregunta."
    )
    pregunta = models.CharField("pregunta", max_length=200)
    respuesta = models.TextField("respuesta")

    class Meta:
        ordering = ["seccion", "orden", "id"]
        verbose_name = "pregunta frecuente"
        verbose_name_plural = "preguntas frecuentes"

    def __str__(self):
        return self.pregunta


class Foto(models.Model):
    """Base de las fotos: al subirlas se reducen y se les genera una miniatura."""

    CARPETA = "web"
    PADRE = ""  # nombre del campo que apunta al dueño de la foto (trabajo, equipo…)

    imagen = models.ImageField("foto", upload_to=_subir_a)
    miniatura = models.ImageField(upload_to=_subir_a, editable=False, blank=True)
    descripcion = models.CharField(
        "descripción",
        max_length=200,
        blank=True,
        help_text="Opcional. Qué se ve en la foto (ayuda a Google y a lectores de pantalla).",
    )
    es_portada = models.BooleanField("portada", default=False, help_text="La foto que se ve en la tarjeta.")
    orden = models.PositiveSmallIntegerField("orden", default=0)
    creada = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ["orden", "id"]

    def __str__(self):
        return self.descripcion or f"Foto {self.pk}"

    def save(self, *args, **kwargs):
        # _committed es False solo cuando llega un archivo nuevo desde un formulario.
        if self.imagen and not self.imagen._committed:
            self._procesar_imagen()
        super().save(*args, **kwargs)
        if self.es_portada:
            # Una sola portada por dueño: la última marcada gana.
            hermanas = type(self).objects.filter(**{f"{self.PADRE}_id": getattr(self, f"{self.PADRE}_id")})
            hermanas.exclude(pk=self.pk).update(es_portada=False)

    def _procesar_imagen(self):
        with Image.open(self.imagen) as original:
            imagen = ImageOps.exif_transpose(original)  # respeta la rotación del celular
            if imagen.mode in ("RGBA", "LA", "P"):
                imagen = imagen.convert("RGBA")
                fondo = Image.new("RGB", imagen.size, "white")
                fondo.paste(imagen, mask=imagen.getchannel("A"))
                imagen = fondo
            else:
                imagen = imagen.convert("RGB")
            nombre = uuid.uuid4().hex
            self.imagen.save(f"{nombre}.jpg", _a_jpeg(imagen, FOTO_LADO_MAX, 85), save=False)
            self.miniatura.save(f"{nombre}_m.jpg", _a_jpeg(imagen, MINIATURA_LADO_MAX, 80), save=False)


class FotoTrabajo(Foto):
    CARPETA = "web/trabajos"
    PADRE = "trabajo"

    trabajo = models.ForeignKey(Trabajo, on_delete=models.CASCADE, related_name="fotos")

    class Meta(Foto.Meta):
        verbose_name = "foto"
        verbose_name_plural = "fotos"


class FotoEquipo(Foto):
    CARPETA = "web/equipos"
    PADRE = "equipo"

    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name="fotos")

    class Meta(Foto.Meta):
        verbose_name = "foto"
        verbose_name_plural = "fotos"


class FotoCategoriaPyrotect(Foto):
    CARPETA = "web/pyrotect/categorias"
    PADRE = "categoria"

    categoria = models.ForeignKey(CategoriaPyrotect, on_delete=models.CASCADE, related_name="fotos")

    class Meta(Foto.Meta):
        verbose_name = "foto"
        verbose_name_plural = "fotos"


class FotoProductoPyrotect(Foto):
    CARPETA = "web/pyrotect/productos"
    PADRE = "producto"

    producto = models.ForeignKey(ProductoPyrotect, on_delete=models.CASCADE, related_name="fotos")

    class Meta(Foto.Meta):
        verbose_name = "foto"
        verbose_name_plural = "fotos"


class FotoActividad(Foto):
    CARPETA = "web/comunidad"
    PADRE = "actividad"

    actividad = models.ForeignKey(ActividadComunidad, on_delete=models.CASCADE, related_name="fotos")

    class Meta(Foto.Meta):
        verbose_name = "foto"
        verbose_name_plural = "fotos"
