from django.apps import AppConfig


class CotizacionesConfig(AppConfig):
    # Fijo aquí para que la migración no dependa de DEFAULT_AUTO_FIELD del proyecto.
    default_auto_field = "django.db.models.BigAutoField"
    name = "cotizaciones"
    verbose_name = "Cotizaciones web"
