"""
Panel propio de la web: /web-admin/

Es un AdminSite aparte del /admin/ de la app interna. Aquí solo aparecen los
contenidos de la web, y estos modelos no se registran en el /admin/ general.
Se muestra en español aunque el proyecto use otro LANGUAGE_CODE.
"""

from django import forms
from django.conf import settings
from django.contrib import admin
from django.urls import reverse
from django.utils import translation
from django.utils.html import format_html

from .models import (
    ActividadComunidad,
    CategoriaPyrotect,
    Equipo,
    FotoActividad,
    FotoCategoriaPyrotect,
    FotoEquipo,
    FotoProductoPyrotect,
    FotoTrabajo,
    PreguntaFrecuente,
    ProductoPyrotect,
    Trabajo,
)

IDIOMA = "es"


class PanelWeb(admin.AdminSite):
    site_header = "Ararat · Contenido de la web"
    site_title = "Panel web Ararat"
    index_title = "Lo que se muestra en araratchile.com"
    site_url = getattr(settings, "WEB_PUBLICA_URL", "https://araratchile.com/")

    def has_permission(self, request):
        usuario = request.user
        return usuario.is_active and usuario.is_staff and usuario.has_module_perms("contenido")

    def _en_espanol(self, vista):
        def envoltura(request, *args, **kwargs):
            with translation.override(IDIOMA):
                respuesta = vista(request, *args, **kwargs)
                # Las plantillas se dibujan después de la vista: hay que hacerlo con el idioma aún activo.
                if hasattr(respuesta, "render") and not respuesta.is_rendered:
                    respuesta.render()
            return respuesta

        return envoltura

    def admin_view(self, view, cacheable=False):
        return self._en_espanol(super().admin_view(view, cacheable))

    def login(self, request, extra_context=None):
        return self._en_espanol(super().login)(request, extra_context)


panel_web = PanelWeb(name="panel_web")


class VariosArchivos(forms.ClearableFileInput):
    allow_multiple_selected = True


class VariasFotosField(forms.ImageField):
    """Permite elegir varias fotos de una vez; valida cada una como imagen."""

    widget = VariosArchivos

    def clean(self, data, initial=None):
        if not data:
            return []
        archivos = data if isinstance(data, (list, tuple)) else [data]
        return [super(VariasFotosField, self).clean(archivo, initial) for archivo in archivos]


class ConFotosForm(forms.ModelForm):
    fotos_nuevas = VariasFotosField(
        label="Agregar fotos",
        required=False,
        help_text="Puedes elegir varias a la vez. Se reducen de tamaño automáticamente al guardar.",
    )


def _vista_previa(foto, alto=90):
    archivo = foto.miniatura or foto.imagen if foto and foto.pk else None
    if not archivo:
        return "—"
    # Por la vista propia de fotos, no por /media/: así se ve igual en local y en el servidor.
    url = reverse("contenido:foto", args=[archivo.name])
    return format_html('<img src="{}" alt="" style="height:{}px;border-radius:4px">', url, alto)


class FotoInline(admin.TabularInline):
    """Fotos ya subidas: portada, orden, descripción y borrado. Las nuevas entran por "Agregar fotos"."""

    extra = 0
    fields = ("vista_previa", "descripcion", "es_portada", "orden")
    readonly_fields = ("vista_previa",)

    def has_add_permission(self, request, obj=None):
        return False

    @admin.display(description="Vista previa")
    def vista_previa(self, foto):
        return _vista_previa(foto)


class FotoTrabajoInline(FotoInline):
    model = FotoTrabajo


class FotoEquipoInline(FotoInline):
    model = FotoEquipo


class FotoActividadInline(FotoInline):
    model = FotoActividad


class FotoCategoriaPyrotectInline(FotoInline):
    model = FotoCategoriaPyrotect


class FotoProductoPyrotectInline(FotoInline):
    model = FotoProductoPyrotect


class PublicableAdmin(admin.ModelAdmin):
    """Base de todo lo que se puede publicar u ocultar de la web."""

    actions = ("publicar", "ocultar")

    @admin.action(description="Publicar en la web")
    def publicar(self, request, queryset):
        queryset.update(publicado=True)

    @admin.action(description="Ocultar de la web")
    def ocultar(self, request, queryset):
        queryset.update(publicado=False)


class ConFotosAdmin(PublicableAdmin):
    """Base de trabajos y equipos: fotos en línea, subida múltiple y portada."""

    form = ConFotosForm
    modelo_foto = None
    campo_padre = ""
    save_on_top = True

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("fotos")

    @admin.display(description="Portada")
    def portada(self, objeto):
        return _vista_previa(objeto.portada(), alto=56)

    @admin.display(description="Fotos")
    def cantidad_fotos(self, objeto):
        return len(objeto.fotos.all())

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        objeto = form.instance
        siguiente = max((f.orden for f in objeto.fotos.all()), default=-1) + 1
        for posicion, archivo in enumerate(form.cleaned_data.get("fotos_nuevas") or []):
            self.modelo_foto.objects.create(**{self.campo_padre: objeto, "imagen": archivo, "orden": siguiente + posicion})


@admin.register(Trabajo, site=panel_web)
class TrabajoAdmin(ConFotosAdmin):
    modelo_foto = FotoTrabajo
    campo_padre = "trabajo"
    inlines = (FotoTrabajoInline,)
    list_display = ("portada", "titulo", "categoria", "publicado", "destacado", "orden", "cantidad_fotos")
    list_display_links = ("portada", "titulo")
    list_editable = ("publicado", "destacado", "orden")
    list_filter = ("categoria", "publicado", "destacado")
    search_fields = ("titulo", "resumen", "descripcion")
    fieldsets = (
        (None, {"fields": ("titulo", "categoria", "resumen", "descripcion")}),
        ("Cómo se muestra", {"fields": ("publicado", "destacado", "orden")}),
        ("Fotos", {"fields": ("fotos_nuevas",), "description": "La foto marcada como portada es la que se ve en la tarjeta."}),
        ("Video", {"fields": ("video",)}),
    )


@admin.register(Equipo, site=panel_web)
class EquipoAdmin(ConFotosAdmin):
    modelo_foto = FotoEquipo
    campo_padre = "equipo"
    inlines = (FotoEquipoInline,)
    list_display = ("portada", "nombre", "categoria", "unidades", "precio_dia", "publicado", "orden", "cantidad_fotos")
    list_display_links = ("portada", "nombre")
    list_editable = ("unidades", "precio_dia", "publicado", "orden")
    list_filter = ("categoria", "publicado")
    search_fields = ("nombre", "detalle")
    fieldsets = (
        (None, {"fields": ("nombre", "categoria", "detalle")}),
        ("Arriendo", {"fields": ("unidades", "precio_dia")}),
        ("Cómo se muestra", {"fields": ("publicado", "orden")}),
        (
            "Fotos",
            {
                "fields": ("fotos_nuevas",),
                "description": "La portada se ve en la tarjeta del catálogo; las demás fotos forman la galería del equipo.",
            },
        ),
    )


@admin.register(PreguntaFrecuente, site=panel_web)
class PreguntaFrecuenteAdmin(PublicableAdmin):
    list_display = ("pregunta", "seccion", "publicado", "orden")
    list_editable = ("publicado", "orden")
    list_filter = ("seccion", "publicado")
    search_fields = ("pregunta", "respuesta")
    fields = ("seccion", "pregunta", "respuesta", "publicado", "orden")


@admin.register(CategoriaPyrotect, site=panel_web)
class CategoriaPyrotectAdmin(ConFotosAdmin):
    modelo_foto = FotoCategoriaPyrotect
    campo_padre = "categoria"
    inlines = (FotoCategoriaPyrotectInline,)
    list_display = ("portada", "nombre", "publicado", "orden", "cantidad_fotos")
    list_display_links = ("portada", "nombre")
    list_editable = ("publicado", "orden")
    list_filter = ("publicado",)
    search_fields = ("nombre", "descripcion", "lineas")
    fieldsets = (
        (None, {"fields": ("nombre", "descripcion", "lineas")}),
        ("Cómo se muestra", {"fields": ("publicado", "orden")}),
        ("Fotos", {"fields": ("fotos_nuevas",), "description": "La portada es la foto de la categoría en el catálogo."}),
    )


@admin.register(ProductoPyrotect, site=panel_web)
class ProductoPyrotectAdmin(ConFotosAdmin):
    modelo_foto = FotoProductoPyrotect
    campo_padre = "producto"
    inlines = (FotoProductoPyrotectInline,)
    list_display = ("portada", "nombre", "categoria", "publicado", "orden", "cantidad_fotos")
    list_display_links = ("portada", "nombre")
    list_editable = ("publicado", "orden")
    list_filter = ("categoria", "publicado")
    search_fields = ("nombre",)
    fieldsets = (
        (None, {"fields": ("nombre", "categoria")}),
        ("Cómo se muestra", {"fields": ("publicado", "orden")}),
        ("Fotos", {"fields": ("fotos_nuevas",), "description": "La portada es la foto de la tarjeta del producto."}),
    )


@admin.register(ActividadComunidad, site=panel_web)
class ActividadComunidadAdmin(ConFotosAdmin):
    modelo_foto = FotoActividad
    campo_padre = "actividad"
    inlines = (FotoActividadInline,)
    list_display = ("portada", "titulo", "eje", "fecha", "publicado", "orden", "cantidad_fotos")
    list_display_links = ("portada", "titulo")
    list_editable = ("publicado", "orden")
    list_filter = ("eje", "publicado")
    search_fields = ("titulo", "resumen", "descripcion")
    fieldsets = (
        (None, {"fields": ("titulo", "eje", "fecha", "resumen", "descripcion")}),
        ("Cómo se muestra", {"fields": ("publicado", "orden")}),
        ("Fotos", {"fields": ("fotos_nuevas",), "description": "La foto marcada como portada es la que se ve en la tarjeta."}),
    )
