import io
import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image

from .models import (
    FOTO_LADO_MAX,
    MINIATURA_LADO_MAX,
    ActividadComunidad,
    FotoActividad,
    CategoriaPyrotect,
    Equipo,
    FotoCategoriaPyrotect,
    FotoProductoPyrotect,
    FotoTrabajo,
    PreguntaFrecuente,
    ProductoPyrotect,
    Trabajo,
)

MEDIA_TEMPORAL = tempfile.mkdtemp()


def imagen(nombre="foto.png", tamano=(3000, 2000), modo="RGB"):
    datos = io.BytesIO()
    Image.new(modo, tamano, "red").save(datos, "PNG")
    return SimpleUploadedFile(nombre, datos.getvalue(), content_type="image/png")


@override_settings(MEDIA_ROOT=MEDIA_TEMPORAL)
class ContenidoTestCase(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA_TEMPORAL, ignore_errors=True)

    def trabajo(self, **campos):
        campos = {"titulo": "Tótem solar", "categoria": Trabajo.Categoria.FABRICACION, "resumen": "Resumen", **campos}
        return Trabajo.objects.create(**campos)


class FotoTests(ContenidoTestCase):
    def test_reduce_la_foto_y_crea_la_miniatura(self):
        foto = FotoTrabajo.objects.create(trabajo=self.trabajo(), imagen=imagen(modo="RGBA"))
        self.assertTrue(foto.imagen.name.startswith("web/trabajos/"))
        self.assertTrue(foto.imagen.name.endswith(".jpg"))
        with Image.open(foto.imagen.path) as grande, Image.open(foto.miniatura.path) as mini:
            self.assertEqual(max(grande.size), FOTO_LADO_MAX)
            self.assertEqual(max(mini.size), MINIATURA_LADO_MAX)
            self.assertEqual(grande.mode, "RGB")

    def test_solo_una_portada_por_trabajo(self):
        trabajo = self.trabajo()
        primera = FotoTrabajo.objects.create(trabajo=trabajo, imagen=imagen(), es_portada=True)
        segunda = FotoTrabajo.objects.create(trabajo=trabajo, imagen=imagen(), es_portada=True)
        otra = FotoTrabajo.objects.create(trabajo=self.trabajo(), imagen=imagen(), es_portada=True)
        primera.refresh_from_db()
        otra.refresh_from_db()
        self.assertFalse(primera.es_portada)
        self.assertTrue(otra.es_portada)
        self.assertEqual(trabajo.portada(), segunda)

    def test_al_borrar_se_eliminan_los_archivos(self):
        foto = FotoTrabajo.objects.create(trabajo=self.trabajo(), imagen=imagen())
        almacen, rutas = foto.imagen.storage, [foto.imagen.name, foto.miniatura.name]
        foto.trabajo.delete()
        self.assertFalse(any(almacen.exists(r) for r in rutas))


class ApiTests(ContenidoTestCase):
    def test_solo_entrega_lo_publicado_y_con_fotos(self):
        visible = self.trabajo(titulo="Visible", destacado=True)
        FotoTrabajo.objects.create(trabajo=visible, imagen=imagen(), orden=0)
        portada = FotoTrabajo.objects.create(trabajo=visible, imagen=imagen(), orden=1, es_portada=True, descripcion="La portada")
        oculto = self.trabajo(titulo="Oculto", publicado=False)
        FotoTrabajo.objects.create(trabajo=oculto, imagen=imagen())
        self.trabajo(titulo="Sin fotos")
        Equipo.objects.create(nombre="Sin fotos")

        respuesta = self.client.get(reverse("contenido:contenido"))
        self.assertEqual(respuesta.status_code, 200)
        data = respuesta.json()
        self.assertEqual([t["titulo"] for t in data["trabajos"]], ["Visible"])
        self.assertEqual(data["equipos"], [])
        trabajo = data["trabajos"][0]
        self.assertEqual(trabajo["categoria"], "fabricacion")
        self.assertEqual(trabajo["categoria_nombre"], "Fabricación de equipos y proyectos")
        self.assertEqual(len(trabajo["fotos"]), 2)
        self.assertEqual(trabajo["fotos"][0]["alt"], "La portada")
        self.assertEqual(trabajo["fotos"][0]["src"], reverse("contenido:foto", args=[portada.imagen.name]))
        self.assertEqual(trabajo["fotos"][1]["alt"], "Visible")

    def test_entrega_el_catalogo_de_pyrotect(self):
        cascos = CategoriaPyrotect.objects.create(nombre="Cascos", descripcion="Abiertos e integrales", lineas="Juvenil\n\n Pro Deportivo \n")
        FotoCategoriaPyrotect.objects.create(categoria=cascos, imagen=imagen())
        CategoriaPyrotect.objects.create(nombre="Sin foto")
        producto = ProductoPyrotect.objects.create(nombre="Casco SA2020", categoria=cascos)
        FotoProductoPyrotect.objects.create(producto=producto, imagen=imagen())
        oculto = ProductoPyrotect.objects.create(nombre="Oculto", categoria=cascos, publicado=False)
        FotoProductoPyrotect.objects.create(producto=oculto, imagen=imagen())

        pyrotect = self.client.get(reverse("contenido:contenido")).json()["pyrotect"]
        self.assertEqual([c["nombre"] for c in pyrotect["categorias"]], ["Cascos"])
        self.assertEqual(pyrotect["categorias"][0]["lineas"], ["Juvenil", "Pro Deportivo"])
        self.assertEqual(len(pyrotect["categorias"][0]["fotos"]), 1)
        self.assertEqual([(p["nombre"], p["categoria"]) for p in pyrotect["productos"]], [("Casco SA2020", "Cascos")])

    def test_al_borrar_un_producto_de_pyrotect_se_eliminan_sus_archivos(self):
        cascos = CategoriaPyrotect.objects.create(nombre="Cascos")
        producto = ProductoPyrotect.objects.create(nombre="Casco", categoria=cascos)
        foto = FotoProductoPyrotect.objects.create(producto=producto, imagen=imagen())
        self.assertTrue(foto.imagen.name.startswith("web/pyrotect/productos/"))
        almacen, rutas = foto.imagen.storage, [foto.imagen.name, foto.miniatura.name]
        producto.delete()
        self.assertFalse(any(almacen.exists(r) for r in rutas))

    def test_entrega_las_actividades_de_comunidad_publicadas(self):
        mtb = ActividadComunidad.objects.create(titulo="Ciclismo", eje="deporte", resumen="MTB", fecha="2026-05-10")
        FotoActividad.objects.create(actividad=mtb, imagen=imagen())
        oculta = ActividadComunidad.objects.create(titulo="Pendiente", eje="educacion", resumen="x", publicado=False)
        FotoActividad.objects.create(actividad=oculta, imagen=imagen())

        comunidad = self.client.get(reverse("contenido:contenido")).json()["comunidad"]
        self.assertEqual([(a["titulo"], a["eje"], a["fecha"]) for a in comunidad], [("Ciclismo", "deporte", "2026-05-10")])
        self.assertTrue(comunidad[0]["fotos"][0]["src"].startswith("/public/web/media/web/comunidad/"))

    def test_entrega_las_preguntas_publicadas_en_orden(self):
        crear = PreguntaFrecuente.objects.create
        crear(seccion="soldadura", pregunta="Segunda", respuesta="B", orden=2)
        crear(seccion="soldadura", pregunta="Primera", respuesta="A", orden=1)
        crear(seccion="kairos", pregunta="De Kairos", respuesta="C")
        crear(seccion="soldadura", pregunta="Oculta", respuesta="D", publicado=False)

        preguntas = self.client.get(reverse("contenido:contenido")).json()["preguntas"]
        self.assertEqual([p["pregunta"] for p in preguntas], ["De Kairos", "Primera", "Segunda"])
        self.assertEqual(preguntas[1], {"id": preguntas[1]["id"], "seccion": "soldadura", "pregunta": "Primera", "respuesta": "A"})

    def test_entrega_y_sirve_el_video_del_trabajo_por_rangos(self):
        trabajo = self.trabajo()
        FotoTrabajo.objects.create(trabajo=trabajo, imagen=imagen())
        trabajo.video = SimpleUploadedFile("cinta.mp4", bytes(range(256)) * 4, content_type="video/mp4")
        trabajo.save()
        ruta = self.client.get(reverse("contenido:contenido")).json()["trabajos"][0]["video"]
        self.assertTrue(ruta.endswith(".mp4"))

        completo = self.client.get(ruta)
        self.assertEqual(completo.status_code, 200)
        self.assertEqual(completo["Accept-Ranges"], "bytes")
        self.assertEqual(len(b"".join(completo.streaming_content)), 1024)
        completo.close()  # libera el archivo (en Windows no se puede borrar mientras esté abierto)
        parte = self.client.get(ruta, HTTP_RANGE="bytes=10-19")
        self.assertEqual(parte.status_code, 206)
        self.assertEqual(parte["Content-Range"], "bytes 10-19/1024")
        self.assertEqual(parte.content, bytes(range(10, 20)))
        self.assertEqual(self.client.get(ruta, HTTP_RANGE="bytes=5000-").status_code, 416)

        almacen, nombre = trabajo.video.storage, trabajo.video.name
        trabajo.delete()
        self.assertFalse(almacen.exists(nombre))

    def test_sirve_las_fotos_y_nada_fuera_de_su_carpeta(self):
        foto = FotoTrabajo.objects.create(trabajo=self.trabajo(), imagen=imagen())
        respuesta = self.client.get(reverse("contenido:foto", args=[foto.miniatura.name]))
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta["Content-Type"], "image/jpeg")
        self.assertIn("immutable", respuesta["Cache-Control"])
        self.assertEqual(self.client.get(reverse("contenido:foto", args=["maestranza/x.jpg"])).status_code, 404)
        self.assertEqual(self.client.get(reverse("contenido:foto", args=["web/../../db.sqlite3"])).status_code, 404)


class PanelTests(ContenidoTestCase):
    def setUp(self):
        Usuario = get_user_model()
        self.admin = Usuario.objects.create_superuser("jefe", "", "clave")
        self.sin_permiso = Usuario.objects.create_user("operario", "", "clave", is_staff=True)

    def test_exige_permiso_sobre_el_contenido(self):
        self.client.force_login(self.sin_permiso)
        self.assertEqual(self.client.get(reverse("panel_web:index")).status_code, 302)
        self.client.force_login(self.admin)
        respuesta = self.client.get(reverse("panel_web:index"))
        self.assertContains(respuesta, "Trabajos realizados")
        self.assertContains(respuesta, "Equipos en arriendo")
        self.assertContains(respuesta, "Preguntas frecuentes")
        self.assertContains(respuesta, "Pyrotect: categorías")
        self.assertContains(respuesta, "Pyrotect: productos destacados")
        self.assertContains(respuesta, "RSE: actividades")

    def test_crear_pregunta_frecuente(self):
        self.client.force_login(self.admin)
        respuesta = self.client.post(
            reverse("panel_web:contenido_preguntafrecuente_add"),
            {"seccion": "kairos", "pregunta": "¿Arriendan por mes?", "respuesta": "Sí.", "publicado": "on", "orden": "0"},
        )
        self.assertRedirects(respuesta, reverse("panel_web:contenido_preguntafrecuente_changelist"))
        self.assertEqual(PreguntaFrecuente.objects.get().seccion, "kairos")

    def test_crear_trabajo_subiendo_varias_fotos(self):
        self.client.force_login(self.admin)
        respuesta = self.client.post(
            reverse("panel_web:contenido_trabajo_add"),
            {
                "titulo": "Estructura",
                "categoria": "soldadura",
                "resumen": "Galpón",
                "descripcion": "",
                "publicado": "on",
                "orden": "0",
                "fotos_nuevas": [imagen("a.png"), imagen("b.png"), imagen("c.png")],
                "fotos-TOTAL_FORMS": "0",
                "fotos-INITIAL_FORMS": "0",
            },
        )
        self.assertRedirects(respuesta, reverse("panel_web:contenido_trabajo_changelist"))
        trabajo = Trabajo.objects.get(titulo="Estructura")
        self.assertEqual([f.orden for f in trabajo.fotos.all()], [0, 1, 2])

    def test_rechaza_un_archivo_que_no_es_imagen(self):
        self.client.force_login(self.admin)
        respuesta = self.client.post(
            reverse("panel_web:contenido_trabajo_add"),
            {
                "titulo": "Estructura",
                "categoria": "soldadura",
                "resumen": "Galpón",
                "orden": "0",
                "fotos_nuevas": [SimpleUploadedFile("nota.txt", b"no soy una foto")],
                "fotos-TOTAL_FORMS": "0",
                "fotos-INITIAL_FORMS": "0",
            },
        )
        self.assertEqual(respuesta.status_code, 200)
        self.assertFalse(Trabajo.objects.exists())
