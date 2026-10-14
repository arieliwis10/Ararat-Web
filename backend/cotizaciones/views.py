import logging
import os

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CotizacionSerializer
from .throttles import CotizacionBurstThrottle, CotizacionSustainedThrottle

logger = logging.getLogger(__name__)


class CotizacionCreateView(APIView):
    """
    POST /public/cotizaciones/  (multipart, form-urlencoded o JSON)

    Endpoint público y anónimo:
    - authentication_classes = []  → no lee JWT ni sesión, así no exige CSRF
      y no interfiere con la autenticación de app.araratchile.com.
    - Throttling por IP; honeypot y tiempo mínimo de llenado.
    """

    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [CotizacionBurstThrottle, CotizacionSustainedThrottle]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        serializer = CotizacionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if serializer.is_spam():
            # Se responde "éxito" para no darle pistas al bot.
            logger.info("Cotización descartada como spam desde %s", request.META.get("REMOTE_ADDR"))
            return Response({"ok": True}, status=status.HTTP_201_CREATED)

        cotizacion = serializer.save(
            ip=request.META.get("REMOTE_ADDR") or None,
            user_agent=request.META.get("HTTP_USER_AGENT", "")[:300],
        )
        _notificar(cotizacion)
        return Response({"ok": True, "id": cotizacion.pk}, status=status.HTTP_201_CREATED)


def _notificar(c):
    """Aviso por correo. Si el correo falla, la cotización igual queda guardada."""
    # Destino por defecto; se puede cambiar (o poner varios, separados por coma) en el .env del servidor.
    destino = os.getenv("COTIZACIONES_NOTIFY_EMAIL", "notificaciones@araratchile.com").strip()
    if not destino:
        return
    asunto = f"Nueva cotización web: {c.get_servicio_display()} — {c.nombre}"
    cuerpo = "\n".join(
        [
            f"Nombre:   {c.nombre}",
            f"Empresa:  {c.empresa or '-'}",
            f"Teléfono: {c.telefono or '-'}",
            f"Correo:   {c.email or '-'}",
            f"Servicio: {c.get_servicio_display()}",
            f"Página:   {c.origen or '-'}",
            "",
            c.mensaje,
        ]
    )
    try:
        send_mail(
            asunto,
            cuerpo,
            getattr(settings, "DEFAULT_FROM_EMAIL", None),
            [d.strip() for d in destino.split(",") if d.strip()],
            fail_silently=False,
        )
    except Exception:  # noqa: BLE001 — nunca romper el envío del formulario por el correo
        logger.exception("No se pudo enviar el aviso de la cotización %s", c.pk)
