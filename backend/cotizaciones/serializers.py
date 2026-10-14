import re

from rest_framework import serializers

from .models import Cotizacion


class CotizacionSerializer(serializers.ModelSerializer):
    # Campos anti-spam: se validan pero no se guardan.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    elapsed_ms = serializers.IntegerField(required=False, min_value=0, write_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            "nombre",
            "empresa",
            "telefono",
            "email",
            "servicio",
            "mensaje",
            "origen",
            "website",
            "elapsed_ms",
        ]
        extra_kwargs = {"origen": {"required": False}}

    def validate_nombre(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Ingresa tu nombre.")
        return value

    def validate_telefono(self, value):
        value = value.strip()
        if value and len(re.sub(r"\D", "", value)) < 8:
            raise serializers.ValidationError("Revisa el número.")
        return value

    def validate_mensaje(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Cuéntanos un poco más (mínimo 10 caracteres).")
        return value

    def validate_origen(self, value):
        return value[:200]

    def validate(self, attrs):
        if not attrs.get("telefono") and not attrs.get("email"):
            raise serializers.ValidationError({"telefono": "Déjanos un teléfono o un correo."})
        return attrs

    def is_spam(self):
        """Llamar después de is_valid(). Honeypot lleno o formulario enviado en < 2,5 s."""
        data = self.validated_data
        if data.get("website"):
            return True
        elapsed = data.get("elapsed_ms")
        return elapsed is not None and elapsed < 2500

    def create(self, validated_data):
        validated_data.pop("website", None)
        validated_data.pop("elapsed_ms", None)
        return super().create(validated_data)
