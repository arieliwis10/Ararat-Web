from django.contrib import admin
from django.urls import include, path

from contenido.admin import panel_web

# Las tres últimas rutas son las que se agregan al urls.py del backend real.
urlpatterns = [
    path("admin/", admin.site.urls),
    path("web-admin/", panel_web.urls),
    path("public/web/", include("contenido.urls")),
    path("public/", include("cotizaciones.urls")),
]
