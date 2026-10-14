from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

from contenido.admin import panel_web

urlpatterns = [
    # La raíz del subdominio lleva al panel.
    path("", RedirectView.as_view(url="/web-admin/", permanent=False)),
    # Panel propio de la web (trabajos, equipos, Pyrotect, RSE, preguntas).
    path("web-admin/", panel_web.urls),
    # Admin general de Django: usuarios del panel y cotizaciones recibidas.
    path("admin/", admin.site.urls),
    path("public/web/", include("contenido.urls")),
    path("public/", include("cotizaciones.urls")),
]
