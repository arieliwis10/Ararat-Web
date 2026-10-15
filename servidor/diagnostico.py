"""
Diagnóstico del servidor de la web, para cPanel sin Terminal.

Setup Python App → app de web.araratchile.com → "Execute python script" → diagnostico.py
Muestra qué está instalado, si el .env y la base de datos funcionan, el estado de las migraciones
y el final del registro del último deploy. No imprime contraseñas.
"""

import os
import sys
import traceback
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
os.chdir(RAIZ)
sys.path.insert(0, str(RAIZ))


def titulo(texto):
    print(f"\n=== {texto} ===")


titulo("Python")
print(sys.version)
print("ejecutable:", sys.executable)

titulo("Archivos en la carpeta de la app")
for nombre in ["manage.py", "passenger_wsgi.py", "requirements.txt", ".env", "config", "contenido", "cotizaciones", "staticfiles", "media", "tmp"]:
    print(f"  {'OK ' if (RAIZ / nombre).exists() else 'FALTA'}  {nombre}")

titulo("Variables del .env (solo nombres)")
try:
    from dotenv import dotenv_values

    valores = dotenv_values(RAIZ / ".env")
    for clave in ["SECRET_KEY", "DEBUG", "ALLOWED_HOSTS", "DB_ENGINE", "DB_NAME", "DB_USER", "DB_PASSWORD", "EMAIL_HOST", "EMAIL_HOST_PASSWORD"]:
        valor = valores.get(clave)
        estado = "vacía" if not valor else ("= " + valor if clave in ("DEBUG", "ALLOWED_HOSTS", "DB_ENGINE", "DB_NAME", "DB_USER") else "con valor")
        print(f"  {clave}: {estado if clave in valores else 'NO ESTÁ'}")
except Exception as e:  # noqa: BLE001
    print("  no se pudo leer:", e)

titulo("Paquetes")
for modulo in ["django", "rest_framework", "corsheaders", "PIL", "pymysql", "dotenv", "whitenoise"]:
    try:
        m = __import__(modulo)
        print(f"  OK     {modulo} {getattr(m, '__version__', '')}")
    except Exception as e:  # noqa: BLE001
        print(f"  FALTA  {modulo} ({e})")

titulo("Django")
try:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    import django

    django.setup()
    from django.core.management import call_command
    from django.db import connection

    connection.ensure_connection()
    print("  conexión a la base de datos: OK")
    print("  migraciones (X = aplicada):")
    call_command("showmigrations", "contenido", "cotizaciones", verbosity=1)
    from contenido.models import Trabajo
    from django.contrib.auth import get_user_model

    print("  trabajos cargados:", Trabajo.objects.count())
    print("  usuarios del panel:", list(get_user_model().objects.values_list("username", flat=True)))
except Exception:  # noqa: BLE001
    traceback.print_exc(limit=3, file=sys.stdout)

titulo("Último registro de deploy de cPanel")
logs = Path.home() / ".cpanel" / "logs"
try:
    registros = sorted((p for p in logs.iterdir() if "deploy" in p.name), key=lambda p: p.stat().st_mtime)
    if registros:
        print("  archivo:", registros[-1].name)
        print("".join(registros[-1].read_text(errors="replace").splitlines(keepends=True)[-50:]))
    else:
        print("  no hay registros de deploy en", logs)
except Exception as e:  # noqa: BLE001
    print("  no se pudo leer:", e)
