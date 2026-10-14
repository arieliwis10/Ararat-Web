from django.apps import AppConfig


class ContenidoConfig(AppConfig):
    # Fijo aquí para que la migración no dependa de DEFAULT_AUTO_FIELD del proyecto.
    default_auto_field = "django.db.models.BigAutoField"
    name = "contenido"
    verbose_name = "Contenido de la web"

    def ready(self):
        from . import signals  # noqa: F401 — registra el borrado de archivos
