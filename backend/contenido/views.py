import mimetypes
import re
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse
from django.urls import reverse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ActividadComunidad, CategoriaPyrotect, Equipo, PreguntaFrecuente, ProductoPyrotect, Trabajo

RAIZ_FOTOS = "web/"


def _foto(foto, alt):
    # Rutas relativas a la raíz del servidor: la web les antepone el origen de la API.
    return {
        "src": reverse("contenido:foto", args=[foto.imagen.name]),
        "mini": reverse("contenido:foto", args=[(foto.miniatura or foto.imagen).name]),
        "alt": foto.descripcion or alt,
    }


def _fotos(objeto, alt):
    return [_foto(f, alt) for f in objeto.fotos_ordenadas()]


class ContenidoView(APIView):
    """
    GET /public/web/contenido/

    Trabajos, equipos y catálogo de Pyrotect publicados que tienen al menos una foto
    (la primera de cada lista es la portada) y las preguntas frecuentes publicadas.
    Público y de solo lectura, igual que el formulario de cotización:
    authentication_classes = [] para no interferir con el JWT de la app.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        trabajos = Trabajo.objects.filter(publicado=True).prefetch_related("fotos")
        equipos = Equipo.objects.filter(publicado=True).prefetch_related("fotos")
        categorias = CategoriaPyrotect.objects.filter(publicado=True).prefetch_related("fotos")
        productos = ProductoPyrotect.objects.filter(publicado=True).select_related("categoria").prefetch_related("fotos")
        data = {
            "trabajos": [
                {
                    "id": t.pk,
                    "titulo": t.titulo,
                    "categoria": t.categoria,
                    "categoria_nombre": t.get_categoria_display(),
                    "resumen": t.resumen,
                    "descripcion": t.descripcion,
                    "destacado": t.destacado,
                    "fotos": _fotos(t, t.titulo),
                    "video": reverse("contenido:foto", args=[t.video.name]) if t.video else None,
                }
                for t in trabajos
                if t.fotos.all()
            ],
            "equipos": [
                {
                    "id": e.pk,
                    "nombre": e.nombre,
                    "categoria": e.categoria,
                    "detalle": e.detalle,
                    "precio_dia": e.precio_dia,
                    "precio_semana": e.precio_semana,
                    "precio_mes": e.precio_mes,
                    "unidades": e.unidades,
                    "fotos": _fotos(e, e.nombre),
                }
                for e in equipos
                if e.fotos.all()
            ],
            "pyrotect": {
                "categorias": [
                    {
                        "id": c.pk,
                        "nombre": c.nombre,
                        "descripcion": c.descripcion,
                        "lineas": c.lista_lineas(),
                        "fotos": _fotos(c, c.nombre),
                    }
                    for c in categorias
                    if c.fotos.all()
                ],
                "productos": [
                    {"id": p.pk, "nombre": p.nombre, "categoria": p.categoria.nombre, "fotos": _fotos(p, p.nombre)}
                    for p in productos
                    if p.fotos.all()
                ],
            },
            "comunidad": [
                {
                    "id": a.pk,
                    "titulo": a.titulo,
                    "eje": a.eje,
                    "resumen": a.resumen,
                    "descripcion": a.descripcion,
                    "fecha": a.fecha.isoformat() if a.fecha else None,
                    "fotos": _fotos(a, a.titulo),
                }
                for a in ActividadComunidad.objects.filter(publicado=True).prefetch_related("fotos")
                if a.fotos.all()
            ],
            "preguntas": [
                {"id": p.pk, "seccion": p.seccion, "pregunta": p.pregunta, "respuesta": p.respuesta}
                for p in PreguntaFrecuente.objects.filter(publicado=True)
            ],
        }
        respuesta = Response(data)
        respuesta["Cache-Control"] = "public, max-age=60"
        return respuesta


RANGO = re.compile(r"bytes=(\d*)-(\d*)$")


def foto(request, ruta):
    """
    GET /public/web/media/<ruta>

    Sirve las fotos y videos de la web desde MEDIA_ROOT sin depender de cómo esté
    configurado /media/ en el servidor (Django no lo sirve cuando DEBUG = False).
    Solo entrega lo que está bajo web/; el resto de media/ es de la app interna.
    Atiende pedidos por rangos (Range): sin eso, Safari en iPhone no reproduce videos.
    """
    raiz = Path(settings.MEDIA_ROOT).resolve()
    archivo = (raiz / ruta).resolve()
    if not ruta.startswith(RAIZ_FOTOS) or raiz not in archivo.parents or not archivo.is_file():
        raise Http404
    tipo = mimetypes.guess_type(archivo.name)[0] or "application/octet-stream"
    tamano = archivo.stat().st_size

    rango = RANGO.match(request.headers.get("Range", "").strip())
    if rango and (rango[1] or rango[2]):
        if rango[1]:
            inicio, fin = int(rango[1]), min(int(rango[2] or tamano - 1), tamano - 1)
        else:  # bytes=-N: los últimos N bytes
            inicio, fin = max(tamano - int(rango[2]), 0), tamano - 1
        if inicio > fin or inicio >= tamano:
            respuesta = HttpResponse(status=416)
            respuesta["Content-Range"] = f"bytes */{tamano}"
            return respuesta
        with archivo.open("rb") as f:
            f.seek(inicio)
            respuesta = HttpResponse(f.read(fin - inicio + 1), status=206, content_type=tipo)
        respuesta["Content-Range"] = f"bytes {inicio}-{fin}/{tamano}"
    else:
        respuesta = FileResponse(archivo.open("rb"), content_type=tipo)
    respuesta["Accept-Ranges"] = "bytes"
    # Cada archivo tiene un nombre único que nunca se reutiliza.
    respuesta["Cache-Control"] = "public, max-age=31536000, immutable"
    return respuesta
