# Web pública Ararat + Kairos — Fase 1

Contenido de este paquete y dónde va en tu repo:

| Carpeta del paquete            | Destino en el repo                    |
| ------------------------------ | ------------------------------------- |
| `web/`                         | `web/` (nueva, junto a `backend/` y `frontend/`) |
| `backend/cotizaciones/`        | `backend/cotizaciones/` (app Django nueva) |
| `backend/contenido/`           | `backend/contenido/` (app Django nueva: panel web) |
| `backend-local/`               | **no se copia**: servidor de prueba para tu PC |
| `deploy/cpanel-bloque-web.yml` | se **agrega** al final de `.cpanel.yml` |
| `deploy/htaccess-public_html.txt` | se pega **a mano** en `public_html/.htaccess` |

`frontend/` (la app interna) no se toca.

---

## 1. Backend: app `cotizaciones`

**1.1 `backend/<proyecto>/settings.py`** — tres cambios, todos aditivos:

```python
INSTALLED_APPS = [
    # ... lo que ya tienes ...
    "cotizaciones",
]

# AGREGA los dominios de la web a la lista que ya tienes. NO quites app.araratchile.com.
CORS_ALLOWED_ORIGINS = [
    # ... los que ya tienes (https://app.araratchile.com, etc.) ...
    "https://araratchile.com",
    "https://www.araratchile.com",
]
# Solo en local (dentro de tu bloque if DEBUG, si lo tienes):
#   CORS_ALLOWED_ORIGINS += ["http://localhost:4321"]
```

> Si en settings usas `CORS_ALLOW_ALL_ORIGINS = True` o `CORS_ORIGIN_WHITELIST`, avísame antes de tocar nada.

**1.2 `backend/<proyecto>/urls.py`** — una línea nueva junto a tus rutas:

```python
from django.urls import include, path

urlpatterns = [
    # ... tus rutas actuales ...
    path("public/", include("cotizaciones.urls")),
]
```

Queda: `POST https://api.araratchile.com/public/cotizaciones/`.
Si tus rutas actuales ya llevan un prefijo (por ejemplo `api/`), usa el mismo criterio y ajusta `PUBLIC_API_URL` en `web/.env.production`.

**1.3 Aviso por correo** — cada cotización se avisa a `notificaciones@araratchile.com` (valor por defecto en
`cotizaciones/views.py`). Para cambiarlo, o enviar a varios, agrega al `.env` del servidor:

```
COTIZACIONES_NOTIFY_EMAIL=notificaciones@araratchile.com,otro@araratchile.com
```

La casilla `notificaciones@araratchile.com` debe existir en cPanel (Correo electrónico → Cuentas).

Usa la configuración `EMAIL_*` que ya tengas. Si el correo falla, la cotización igual se guarda.

**1.4 Ignorar la carpeta de throttling** — agrega a `backend/.gitignore`:

```
var/
```

**1.5 Probar en local (PowerShell):**

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py migrate cotizaciones
python manage.py runserver

# En otra terminal:
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/public/cotizaciones/ -Body @{
  nombre='Prueba'; telefono='+56912345678'; servicio='soldadura';
  mensaje='Prueba del formulario web'; elapsed_ms=5000
}
# Debe responder ok=True y aparecer en /admin → Cotizaciones web
```

Las migraciones (`0001_initial.py` y `0002_servicio_pyrotect.py`, que agrega la opción Pyrotect del formulario) van
incluidas y versionadas; el `migrate` del `.cpanel.yml` las aplica en producción.

---

## 1 bis. Backend: app `contenido` (panel web)

Panel propio para administrar lo que muestra la web: **trabajos realizados**, **equipos de Kairos**,
**catálogo de Pyrotect** (categorías y productos destacados), **actividades de RSE** (página `/responsabilidad-social/`; `/comunidad/` redirige)
y **preguntas frecuentes** por página:
crear, editar, eliminar, subir fotos, elegir portada y ocultar. Usa tablas nuevas y separadas; no lee
ni modifica las de la app interna. La web consulta `GET /public/web/contenido/` y, si la API no
responde, muestra el respaldo de `web/src/data/`.

**Probar en tu PC, sin tocar el backend real:** doble clic en `iniciar-local.cmd`.

- Web: http://localhost:4321/ · Panel: http://127.0.0.1:8000/web-admin/ (usuario `admin`, clave `ararat-local`, solo local).
- La primera vez, o para partir de cero: `cd backend-local`, `venv\Scripts\python manage.py migrate`,
  `venv\Scripts\python cargar_inicial.py`.
- Pruebas automáticas: `venv\Scripts\python manage.py test contenido`.

**Instalar en el backend real** (cambios aditivos; `pillow` ya está en `requirements.txt`):

```python
# settings.py
INSTALLED_APPS = [
    # ... lo que ya tienes ...
    "contenido",
]

# urls.py
from contenido.admin import panel_web

urlpatterns = [
    # ... tus rutas actuales ...
    path("web-admin/", panel_web.urls),
    path("public/web/", include("contenido.urls")),   # antes de la línea de "public/"
]
```

Las migraciones (`0001` a `0006`) van versionadas: crean tablas nuevas y agregan el campo de video a los trabajos. Después del deploy:

1. Entra a `https://api.araratchile.com/web-admin/` con un superusuario y vuelve a cargar el contenido
   (trabajos, equipos, catálogo de Pyrotect y preguntas; `backend-local/cargar_inicial.py` tiene la lista
   completa y las fotos están en `web/src/assets/img/`).
2. Para un usuario que solo administre la web: créalo en `/admin/` con "Es staff" y los permisos de
   "Contenido de la web". No verá nada de la app interna.

Notas:

- **Fotos**: se guardan en `media/web/` ya reducidas (1600 px y miniatura de 800 px) y se sirven por
  `/public/web/media/...`, una vista propia que no depende de cómo esté configurado `/media/` en el
  servidor. `backend/media/` no se versiona, así que el deploy no las pisa.
- **Subidas grandes**: si el hosting corta una subida de muchas fotos a la vez, súbelas de a pocas.
  No acepta HEIC (formato del iPhone); desde el celular el navegador normalmente las convierte a JPG.
- **Video de un trabajo**: cada trabajo admite un video MP4 (H.264) de hasta 40 MB, que se ve en su galería
  después de las fotos. El servidor no lo recomprime (no hay ffmpeg en el hosting): súbelo ya comprimido
  (720 px de ancho, sin audio; ver la receta de "Videos de portada"). Se sirve por `/public/web/media/...`
  con soporte de rangos, que Safari en iPhone exige para reproducir. Si el hosting corta subidas grandes,
  revisa el límite de tamaño de subida de Apache/LiteSpeed en cPanel.
- **Preguntas frecuentes**: cada pregunta se asigna a una página (un servicio, Kairos o Pyrotect). Una página
  sin preguntas no muestra la sección. El respaldo son las `faq` de `web/src/data/servicios.ts`.
- **Pyrotect**: cada categoría lleva nombre, descripción, líneas de producto (una por línea) y foto; los
  productos destacados van aparte y pertenecen a una categoría (que no se puede borrar mientras tenga
  productos). El menú de Pyrotect de la cabecera y el pie sale del respaldo (`web/src/data/pyrotect.ts`):
  si creas o renombras una categoría en el panel, actualiza ese archivo y recompila.
- **Categorías de trabajos**: están fijas en `contenido/models.py` y coinciden con los servicios de
  `web/src/data/servicios.ts`. Si agregas un servicio a la web, agrégalo en ambos lados.
- **Menú de Kairos**: las categorías de la cabecera salen del respaldo (`web/src/data/kairos.ts`); si
  creas una categoría nueva de equipos en el panel, actualiza ese archivo y recompila.
- Un cambio en el panel puede tardar hasta 1 minuto en verse (la respuesta se guarda en caché 60 s).

---

## 2. Web (Astro)

```powershell
# Desde la raíz del repo
Copy-Item -Recurse <ruta-del-paquete>\web .\web
cd web
npm install
Copy-Item .env.example .env
npm run dev          # http://localhost:4321
```

Antes de publicar, completa los `TODO` de **`web/src/config/site.ts`** (WhatsApp, teléfono, correo, dirección, redes, ID de YouTube).

### Contenido

| Qué                | Dónde |
| ------------------ | ----- |
| Datos del negocio  | `src/config/site.ts` |
| Rubros de Ararat   | `src/data/servicios.ts` (una página por rubro, automática) |
| Equipos Kairos     | Panel web. `src/data/kairos.ts` es el respaldo si la API no responde |
| Trabajos           | Panel web. `src/data/trabajos.ts` es el respaldo |
| Fotos              | `src/assets/img/` — mismas rutas, reemplaza los JPG de referencia por fotos reales (Astro genera AVIF/WebP y tamaños) |
| Colores            | `src/styles/global.css` (`@theme`) |
| Imagen al compartir | `public/og-default.jpg` (1200×630) |
| Pantalla de entrada | `src/assets/img/entrada.jpg` (banner horizontal). Sale una vez por visita; para verla al probar: `/?entrada=1` |

### Videos de portada

Cada sector tiene un video de fondo en su portada (`src/components/FondoVideo.astro`): Ararat en `/`, Kairos en
`/kairos/` y Pyrotect en `/pyrotect/`. Por cada uno hay tres archivos:

| Archivo | Uso |
| --- | --- |
| `public/video/<sector>.mp4` | Escritorio (horizontal, 1280 a 1600 px de ancho) |
| `public/video/<sector>-720.mp4` | Celular (recorte vertical del centro) |
| `src/assets/img/video-<sector>.jpg` | Imagen inicial: un cuadro del mismo video |

Para cambiar uno, parte de un video horizontal de 1920×1080 y 10 a 20 s (requiere ffmpeg: `winget install Gyan.FFmpeg`):

```powershell
ffmpeg -i original.mov -an -r 30 -vf "scale=1600:-2" -c:v libx264 -profile:v high -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart web\public\video\ararat.mp4
ffmpeg -i original.mov -an -r 30 -vf "crop=ih*4/5:ih,scale=576:720" -c:v libx264 -profile:v high -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart web\public\video\ararat-720.mp4
ffmpeg -ss 1 -i original.mov -frames:v 1 -q:v 3 web\src\assets\img\video-ararat.jpg
```

Los videos de iPhone vienen en HDR (HLG): sin convertir, los colores salen lavados. Antepón al filtro
`zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,`.
Apunta a menos de 5 MB (escritorio) y 2,5 MB (celular); si pesa más, sube el `-crf` o baja a `scale=1280:-2`.
Sin video, o con conexión lenta, la portada muestra la imagen inicial.

---

## 3. Deploy

**Flujo de cada publicación** (igual que hoy con `frontend/dist`):

```powershell
cd web
npm run build
cd ..
git add web
git commit -m "web: actualización"
git push origin main
# luego: cPanel → Git Version Control → Deploy HEAD Commit
```

**Primera vez:**

1. Respaldo de `public_html` (cPanel → Administrador de archivos → comprimir `public_html`). Si hay un sitio antiguo, tus archivos `index.html` lo reemplazarán.
2. Verifica en cPanel → Dominios que la raíz de `araratchile.com` sea `/home/araratch/public_html`. Si es otra carpeta, cambia `WEBPATH`.
3. Agrega el bloque de `deploy/cpanel-bloque-web.yml` al final de tu `.cpanel.yml`.
4. Pega `deploy/htaccess-public_html.txt` al final de `public_html/.htaccess`.
5. Commit, push, deploy.

---

## Riesgos para producción (revisar)

- **`public_html/api`**: el bloque de deploy aborta si `web/dist` trae una carpeta `api/` o un `.htaccess`, y usa `cp` (nunca borra). No crees `src/pages/api/` en Astro.
- **CORS**: si reemplazas la lista en vez de agregar, la app interna deja de conectarse a la API. Solo agrega.
- **Endpoint público**: `authentication_classes = []` es solo para esta vista; no afecta el JWT de la app.
- **Imunify360**: el formulario envía `FormData` (sin preflight) y, si la API no responde o Imunify devuelve un desafío, muestra un botón para mandar la misma solicitud por WhatsApp. Si ves bloqueos en los logs, pide al hosting excluir `POST /public/cotizaciones/` del captcha. Alternativa más robusta: servir la API en el mismo dominio (`PUBLIC_API_URL=/api/public`).
- **Archivos antiguos**: `cp` no borra; cada build deja nuevos archivos en `public_html/_astro/`. Puedes limpiar esa carpeta de vez en cuando justo antes de un deploy.
