from django.db import models


class Cotizacion(models.Model):
    """Solicitud de cotización recibida desde la web pública."""

    class Servicio(models.TextChoices):
        SOLDADURA = "soldadura", "Soldadura y estructuras metálicas"
        TORNO = "torno-y-mecanizado", "Torno y mecanizado"
        FERRETERIA = "insumos-de-ferreteria", "Insumos de ferretería"
        REPUESTOS = "repuestos-industriales", "Repuestos industriales"
        FLEXIBLES = "flexibles-hidraulicos", "Flexibles hidráulicos"
        ARRIENDO = "arriendo", "Arriendo de equipos (Kairos)"
        PYROTECT = "pyrotect", "Indumentaria racing (Pyrotect)"
        OTRO = "otro", "Otro"

    class Estado(models.TextChoices):
        NUEVA = "nueva", "Nueva"
        CONTACTADA = "contactada", "Contactada"
        COTIZADA = "cotizada", "Cotizada"
        CERRADA = "cerrada", "Cerrada"
        DESCARTADA = "descartada", "Descartada"

    nombre = models.CharField(max_length=120)
    empresa = models.CharField(max_length=120, blank=True)
    telefono = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    servicio = models.CharField(max_length=40, choices=Servicio.choices)
    mensaje = models.TextField(max_length=3000)

    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.NUEVA, db_index=True)
    notas_internas = models.TextField(blank=True)

    origen = models.CharField("página de origen", max_length=200, blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)
    creada = models.DateTimeField(auto_now_add=True, db_index=True)
    actualizada = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-creada"]
        verbose_name = "cotización"
        verbose_name_plural = "cotizaciones"

    def __str__(self):
        return f"{self.nombre} · {self.get_servicio_display()} · {self.creada:%d-%m-%Y}"
