"""
Throttling del formulario público SIN tocar settings.py.

- La tasa va en la clase (no requiere DEFAULT_THROTTLE_RATES).
- Usa un caché en archivos propio: Passenger puede levantar varios procesos y el
  LocMemCache por defecto es por proceso; en archivos el límite es compartido.
- La IP sale de REMOTE_ADDR. El X-Forwarded-For lo puede inventar el cliente y
  serviría para saltarse el límite (en cPanel/Apache, REMOTE_ADDR ya es la IP real).
"""

from pathlib import Path

from django.conf import settings
from django.core.cache.backends.filebased import FileBasedCache
from rest_framework.throttling import SimpleRateThrottle

_CACHE_DIR = Path(getattr(settings, "BASE_DIR", Path(__file__).resolve().parent.parent)) / "var" / "throttle"
_cache = FileBasedCache(str(_CACHE_DIR), {"OPTIONS": {"MAX_ENTRIES": 5000}})


class _IpThrottle(SimpleRateThrottle):
    cache = _cache

    def get_ident(self, request):
        return request.META.get("REMOTE_ADDR", "")

    def get_cache_key(self, request, view):
        return self.cache_format % {"scope": self.scope, "ident": self.get_ident(request)}


class CotizacionBurstThrottle(_IpThrottle):
    scope = "cotizacion_burst"
    rate = "3/min"


class CotizacionSustainedThrottle(_IpThrottle):
    scope = "cotizacion_sustained"
    rate = "15/day"
