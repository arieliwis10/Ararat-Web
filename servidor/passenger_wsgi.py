"""Arranque para la Python App de cPanel (Passenger). Startup file: passenger_wsgi.py · Entry point: application"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
