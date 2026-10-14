@echo off
rem Levanta en tu PC el panel/API local y la web, cada uno en su ventana, y abre ambos en el navegador.
rem Para detenerlos, cierra las dos ventanas.
start "Panel y API (local)" cmd /k "cd /d %~dp0backend-local && venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"
start "Web (local)" cmd /k "cd /d %~dp0web && npm run dev"
timeout /t 8 /nobreak >nul
start "" http://localhost:4321/
start "" http://127.0.0.1:8000/web-admin/
