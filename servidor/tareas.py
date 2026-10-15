"""
Tareas de mantenimiento para cPanel sin Terminal ("Execute python script" de Setup Python App).

    tareas.py migrar                      crea o actualiza las tablas
    tareas.py estaticos                   copia los archivos del panel (CSS/JS) a staticfiles/
    tareas.py cargar contenido.json       importa el respaldo del contenido del panel
    tareas.py usuario NOMBRE CLAVE        crea (o cambia la clave de) un administrador del panel
    tareas.py reiniciar                   reinicia la app (toca tmp/restart.txt)
"""

import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
os.chdir(RAIZ)
sys.path.insert(0, str(RAIZ))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402
from django.core.management import call_command  # noqa: E402


def reiniciar():
    (RAIZ / "tmp").mkdir(exist_ok=True)
    (RAIZ / "tmp" / "restart.txt").touch()
    print("App reiniciada.")


def main(args):
    if not args:
        print(__doc__)
        return
    tarea, resto = args[0], args[1:]
    if tarea == "migrar":
        call_command("migrate", interactive=False)
    elif tarea == "estaticos":
        call_command("collectstatic", interactive=False)
    elif tarea == "cargar":
        call_command("loaddata", resto[0] if resto else "contenido.json")
        reiniciar()
    elif tarea == "usuario":
        if len(resto) != 2:
            print("Uso: tareas.py usuario NOMBRE CLAVE")
            return
        nombre, clave = resto
        Usuario = get_user_model()
        usuario, nuevo = Usuario.objects.get_or_create(username=nombre)
        usuario.is_staff = usuario.is_superuser = usuario.is_active = True
        usuario.set_password(clave)
        usuario.save()
        print(f"Usuario '{nombre}' {'creado' if nuevo else 'actualizado'}. Ya puede entrar a /web-admin/.")
    elif tarea == "reiniciar":
        reiniciar()
    else:
        print(f"Tarea desconocida: {tarea}\n{__doc__}")


if __name__ == "__main__":
    main(sys.argv[1:])
