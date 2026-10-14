from django.urls import path

from .views import ContenidoView, foto

app_name = "contenido"

urlpatterns = [
    path("contenido/", ContenidoView.as_view(), name="contenido"),
    path("media/<path:ruta>", foto, name="foto"),
]
