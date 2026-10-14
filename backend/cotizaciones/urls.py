from django.urls import path

from .views import CotizacionCreateView

app_name = "cotizaciones"

urlpatterns = [
    path("cotizaciones/", CotizacionCreateView.as_view(), name="crear"),
]
