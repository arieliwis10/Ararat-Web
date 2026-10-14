#!/usr/bin/env python
"""
Servidor SOLO para probar en tu PC las apps de backend/ (cotizaciones y contenido)
sin tocar el backend real. No se publica: en producción estas apps se instalan en
el proyecto Django existente (ver LEEME.md).
"""
import os
import sys
from pathlib import Path

if __name__ == "__main__":
    # Las apps viven en ../backend, igual que quedarán en el repo real.
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "local.settings")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
