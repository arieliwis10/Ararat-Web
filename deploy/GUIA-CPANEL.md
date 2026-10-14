# Publicar la web en cPanel (proyecto aparte de la app)

Repositorio: `github.com/arieliwis10/Ararat-Web`. No comparte nada con la app interna (`AraratSpa`):
tiene su propia Python App, su propia base de datos y su propio deploy.

| Parte | Dónde queda | Qué es |
| --- | --- | --- |
| Web | `araratchile.com` → `/home/araratch/public_html/` | `web/dist` (HTML, fotos, videos) |
| Servidor | `web.araratchile.com` → `/home/araratch/web.araratchile.com/` | `servidor/` + `backend/`: panel `/web-admin/`, API y cotizaciones |

## 1. Subdominio
cPanel → **Dominios** → Crear dominio `web.araratchile.com`. Raíz del documento: `/home/araratch/web.araratchile.com`.
Después, en **SSL/TLS Status**, ejecuta AutoSSL para que tenga https.

## 2. Base de datos
cPanel → **Bases de datos MySQL**:
1. Crear la base `araratch_web`.
2. Crear el usuario `araratch_web` con una contraseña segura (guárdala).
3. Agregar el usuario a la base con **todos los privilegios**.

## 3. Casilla de correo
cPanel → **Cuentas de correo** → crear `notificaciones@araratchile.com` (recibe los avisos de cotizaciones y
también es la cuenta que los envía). Guarda su contraseña.

## 4. Python App
cPanel → **Setup Python App** → Create Application:

| Campo | Valor |
| --- | --- |
| Python version | **3.12** |
| Application root | `web.araratchile.com` |
| Application URL | `web.araratchile.com` (en el desplegable) y la ruta **vacía** |
| Application startup file | `passenger_wsgi.py` |
| Application Entry point | `application` |
| Environment variables | ninguna: todo va en el archivo `.env` (paso 5) |

Al crearla, arriba aparece un comando como
`source /home/araratch/virtualenv/web.araratchile.com/3.12/bin/activate && cd /home/araratch/web.araratchile.com`.
Si la ruta del `virtualenv` es distinta, corrige `VENV` en `.cpanel.yml`.

## 5. Archivo .env del servidor
Administrador de archivos → `/home/araratch/web.araratchile.com/` → crear `.env` con el contenido de
`servidor/.env.example`, completando:
- `SECRET_KEY`: un texto largo al azar (por ejemplo, genéralo en tu PC con
  `python -c "import secrets; print(secrets.token_urlsafe(50))"`).
- `DB_PASSWORD`: la contraseña del paso 2.
- `EMAIL_HOST_PASSWORD`: la contraseña de `notificaciones@` del paso 3.

## 6. Conectar el repositorio y desplegar
1. cPanel → **Git Version Control** → Create → *Clone a Repository*:
   - Clone URL: `https://github.com/arieliwis10/Ararat-Web.git`
   - Repository Path: `/home/araratch/repositories/Ararat-Web`
2. En el repositorio → **Pull or Deploy** → *Deploy HEAD Commit*.
   Instala dependencias, crea las tablas y copia la web a `public_html`.
3. Antes del primer deploy, **respalda `public_html`** (Administrador de archivos → seleccionar todo →
   Comprimir). Ahí está hoy el WordPress.

## 7. Cargar el contenido y crear tu usuario del panel
1. Sube `deploy/contenido-inicial/media-web.zip` a `/home/araratch/web.araratchile.com/media/` y
   extráelo ahí (debe quedar `media/web/trabajos/...`).
2. Sube `deploy/contenido-inicial/contenido.json` a `/home/araratch/web.araratchile.com/`.
3. cPanel → **Terminal**, y ejecuta:
   ```
   source /home/araratch/virtualenv/web.araratchile.com/3.12/bin/activate
   cd /home/araratch/web.araratchile.com
   python manage.py loaddata contenido.json
   python manage.py createsuperuser
   touch tmp/restart.txt
   ```
4. Entra a `https://web.araratchile.com/web-admin/` con el usuario que creaste.

## 8. .htaccess de public_html
Pega a mano, **al final** de `public_html/.htaccess`, el bloque de `deploy/htaccess-public_html.txt`
(fuerza https, quita el www y mejora la caché). Haz una copia del `.htaccess` antes.

## 9. Revisar
- `https://araratchile.com`: portada con video, trabajos, Kairos, Pyrotect, responsabilidad social.
- El formulario de contacto: envía una cotización de prueba y revisa que llegue a `notificaciones@`.
- `https://web.araratchile.com/admin/`: ahí se ven las cotizaciones recibidas.

## Actualizar la web más adelante
En el PC: `cd web` → `npm run build` → commit y push a GitHub. En cPanel → Git Version Control →
*Update from Remote* → *Deploy HEAD Commit*. Lo que cargues en el panel no necesita deploy.
