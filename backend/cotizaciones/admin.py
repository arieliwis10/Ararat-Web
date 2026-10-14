from django.contrib import admin

from .models import Cotizacion


@admin.register(Cotizacion)
class CotizacionAdmin(admin.ModelAdmin):
    list_display = ("creada", "nombre", "empresa", "servicio", "telefono", "email", "estado")
    list_filter = ("estado", "servicio", "creada")
    list_editable = ("estado",)
    search_fields = ("nombre", "empresa", "telefono", "email", "mensaje")
    date_hierarchy = "creada"
    readonly_fields = ("creada", "actualizada", "origen", "ip", "user_agent")
    fieldsets = (
        (None, {"fields": ("estado", "notas_internas")}),
        ("Cliente", {"fields": ("nombre", "empresa", "telefono", "email")}),
        ("Solicitud", {"fields": ("servicio", "mensaje")}),
        ("Registro", {"classes": ("collapse",), "fields": ("origen", "ip", "user_agent", "creada", "actualizada")}),
    )
