"""
Deja la base LOCAL con el contenido que la web muestra hoy y un usuario para entrar
al panel. Se puede correr varias veces: no duplica nada.

    venv\\Scripts\\python cargar_inicial.py
"""

import os
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent / "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "local.settings")

import django  # noqa: E402

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402
from django.core.files import File  # noqa: E402

from contenido.models import (  # noqa: E402
    ActividadComunidad,
    CategoriaPyrotect,
    Equipo,
    FotoActividad,
    FotoCategoriaPyrotect,
    FotoEquipo,
    FotoProductoPyrotect,
    FotoTrabajo,
    PreguntaFrecuente,
    ProductoPyrotect,
    Trabajo,
)

IMAGENES = AQUI.parent / "web" / "src" / "assets" / "img"
USUARIO, CLAVE = "admin", "ararat-local"


def agregar_fotos(modelo, campo, objeto, fotos):
    for orden, (archivo, descripcion) in enumerate(fotos):
        with (IMAGENES / archivo).open("rb") as f:
            modelo.objects.create(
                **{campo: objeto},
                imagen=File(f, name=archivo),
                descripcion=descripcion,
                es_portada=orden == 0,
                orden=orden,
            )


Usuario = get_user_model()
if not Usuario.objects.filter(username=USUARIO).exists():
    Usuario.objects.create_superuser(USUARIO, "", CLAVE)
    print(f"Usuario creado: {USUARIO} / {CLAVE}")

TRABAJOS = [
    {
        "titulo": "Tótem solar",
        "categoria": Trabajo.Categoria.FABRICACION,
        "resumen": "Tótems con panel solar para espacios públicos: carga de celulares e información de emergencia.",
        "descripcion": (
            "Desarrollamos y fabricamos tótems con panel solar para espacios públicos. Cada tótem indica el punto "
            "de encuentro ante una emergencia y permite cargar el celular. Los fabricamos en serie en nuestro "
            "taller y hoy están instalados en plazas y calles."
        ),
        "fotos": [
            ("totem-solar-portada.jpg", "Tótem solar instalado en la vía pública, con panel fotovoltaico y mapa del punto de encuentro"),
            ("totem-solar-2.jpg", "Tótem solar instalado en una plaza, visto de costado"),
            ("totem-solar-3.jpg", "Tótem solar sobre su base de hormigón, con el panel informativo de emergencia"),
            ("totem-solar-4.jpg", "Tótem solar con punto de carga para celulares, junto a dos asientos de hormigón"),
            ("totem-solar-5.jpg", "Tótems solares en fabricación en el taller de Ararat"),
            ("totem-solar-6.jpg", "Estructuras de los tótems recién pintadas en el taller"),
        ],
    },
    {
        "titulo": "Torre solar de iluminación",
        "categoria": Trabajo.Categoria.FABRICACION,
        "resumen": "Torres de iluminación móviles con paneles solares y batería, fabricadas para faena minera.",
        "descripcion": (
            "Diseñamos y fabricamos torres de iluminación autónomas para una faena minera. Cada torre va montada en un "
            "carro de arrastre y lleva paneles solares plegables, banco de baterías y un mástil abatible con focos. "
            "Hicimos el diseño en 3D, la estructura, la pintura y el armado en nuestro taller, y las entregamos en serie."
        ),
        "fotos": [
            ("torre-solar-1.jpg", "Torre solar de iluminación con sus cuatro paneles solares desplegados"),
            ("torre-solar-2.jpg", "Torres solares con el mástil de iluminación levantado"),
            ("torre-solar-3.jpg", "Vista frontal de la torre solar con los paneles plegados y el banco de baterías"),
            ("torre-solar-4.jpg", "Torres solares terminadas, plegadas para el traslado"),
            ("torre-solar-5.jpg", "Estructura de la torre solar en fabricación en el taller"),
            ("torre-solar-6.jpg", "Chasis del carro de arrastre de la torre solar en fabricación"),
            ("torre-solar-7.jpg", "Diseño 3D de la torre solar con el mástil levantado"),
            ("torre-solar-8.jpg", "Diseño 3D de la torre solar con el mástil abatido para el traslado"),
        ],
    },
    {
        "titulo": "Mantención de molino SAG",
        "categoria": Trabajo.Categoria.FABRICACION,
        "resumen": "Cambio de revestimientos y mantención mecánica del molino SAG de una faena minera.",
        "descripcion": "Realizamos trabajos de mantención en el molino SAG de una faena minera, durante detenciones programadas y con la documentación que exige la minera.\n\n• Cambio de revestimientos (relining): medición previa de espesores, retiro y montaje de piezas del manto, tapas, parrillas y levantadores de pulpa con máquina relainera, y torque y reapriete de pernos según fabricante.\n• Pernos de revestimiento: control de fugas, reapriete programado y reemplazo de pernos cortados.\n• Lifters: medición de perfil y altura para definir su cambio y mantener la molienda.\n• Descansos y trunnion: control de temperatura, presión de aceite, filtros y sellos.\n• Accionamiento: alineamiento, juego entre dientes, lubricación y termografía de corona y piñón.\n\nCada trabajo se ejecuta con PTS, análisis de riesgo (AST) en terreno e informe técnico con mediciones, fotos y recomendaciones.\n\nFotos referenciales de otras faenas (Zen wave, Saurav 72000 y photosmith2011, licencia CC BY-SA).",
        "destacado": True,
        "fotos": [
            ("molino-sag-1.jpg", "Imagen referencial: molinos SAG y de bolas en la planta concentradora de una minera"),
            ("molino-sag-2.jpg", "Imagen referencial: interior de un molino con sus revestimientos y levantadores (lifters)"),
            ("molino-sag-3.jpg", "Imagen referencial: casco de un molino con los pernos de sus revestimientos"),
            ("molino-sag-4.jpg", "Imagen referencial: muñón (trunnion) y boca de alimentación de un molino"),
        ],
    },
    {
        "titulo": "Buggy de competición",
        "categoria": Trabajo.Categoria.FABRICACION,
        "resumen": "Jaulas y estructuras para buggy y UTV de competición, trabajadas en nuestro taller.",
        "destacado": False,
        "fotos": [
            ("buggy-1.jpg", "UTV de competición con su jaula de seguridad, en el taller de Ararat"),
            ("buggy-2.jpg", "UTV de competición desarmado en el taller, con su jaula tubular a la vista"),
        ],
    },
    {
        "titulo": "Cintas transportadoras de banda modular",
        "categoria": Trabajo.Categoria.FABRICACION,
        "resumen": "Dos cintas transportadoras de banda modular fabricadas e instaladas para el proyecto de una empresa china.",
        "descripcion": "Fabricamos e instalamos dos cintas transportadoras de banda modular, con motorreductor y patas niveladoras, para la línea de una máquina industrial en el proyecto de una empresa china. La estructura, la pintura y el armado se hicieron en nuestro taller.",
        "destacado": False,
        "fotos": [
            ("cinta-1.jpg", "Cintas transportadoras de banda modular de Ararat instaladas junto a la máquina del cliente"),
            ("cinta-2.jpg", "Cinta transportadora de banda modular en armado en el taller de Ararat"),
            ("cinta-3.jpg", "Estructura de la cinta transportadora con su banda modular azul, en el taller"),
        ],
    },
    {
        "titulo": "Robot de limpieza Puma 2",
        "categoria": Trabajo.Categoria.FABRICACION,
        "resumen": "Robot de limpieza a control remoto, sobre orugas y con pala frontal, fabricado a pedido.",
        "descripcion": "",
        "destacado": False,
        "fotos": [
            ("robot-limpieza.jpg", "Robot de limpieza Puma 2 sobre orugas, con pala frontal y control remoto"),
        ],
    },
]

VIDEOS = AQUI.parent / "web" / "public" / "video" / "trabajos"

# Cada trabajo se carga solo si todavía no existe uno con ese título; el video se agrega si le falta.
for orden, datos in enumerate(TRABAJOS):
    video = datos.pop("video", None)
    existente = Trabajo.objects.filter(titulo=datos["titulo"]).first()
    if existente:
        if video and not existente.video:
            with (VIDEOS / video).open("rb") as f:
                existente.video.save(video, File(f), save=True)
            print(f"Video agregado: {existente.titulo}")
        continue
    fotos = datos.pop("fotos")
    datos.setdefault("destacado", True)
    trabajo = Trabajo.objects.create(**datos, orden=orden)
    agregar_fotos(FotoTrabajo, "trabajo", trabajo, fotos)
    if video:
        with (VIDEOS / video).open("rb") as f:
            trabajo.video.save(video, File(f), save=True)
    print(f"Trabajo cargado: {trabajo.titulo}")

if not Equipo.objects.exists():
    autocargable = Equipo.objects.create(nombre="Autocargable para bins", detalle="Ref. A4B 20-1", unidades=20, orden=1)
    agregar_fotos(
        FotoEquipo,
        "equipo",
        autocargable,
        [
            ("equipo-autocargable.jpg", "Autocargable para bins A4B 20-1 de Kairos Arriendos"),
            ("autocargable-galeria-1.jpg", "Autocargable para bins visto desde atrás, con sus dos rieles de carga"),
            ("autocargable-galeria-2.jpg", "Autocargable para bins enganchado a un tractor, vista en diagonal"),
            ("autocargable-galeria-3.jpg", "Autocargable para bins visto desde el enganche, con sus mangueras hidráulicas"),
            ("autocargable-galeria-4.jpg", "Vista lateral del autocargable: sistema hidráulico y ruedas en tándem"),
            ("autocargable-galeria-5.jpg", "Detalle del motor hidráulico del autocargable, con la placa Ararat"),
            ("autocargable-galeria-6.jpg", "Detalle del motor hidráulico y la cadena de arrastre"),
            ("autocargable-galeria-7.jpg", "Rieles con cadena y ruedas traseras del autocargable"),
        ],
    )
    grua = Equipo.objects.create(
        nombre="Grúa horquilla 2,5 T", detalle="2,5 toneladas de carga · Ref. G2.5T 15-80", unidades=20, orden=2
    )
    agregar_fotos(FotoEquipo, "equipo", grua, [("equipo-grua-horquilla.jpg", "Grúa horquilla TCM de 2,5 toneladas de Kairos Arriendos")])
    print("Equipos cargados: Autocargable para bins, Grúa horquilla 2,5 T")

# El catálogo de Pyrotect que la web traía escrito en web/src/data/pyrotect.ts.
CATEGORIAS_PYROTECT = [
    ("Butacas", "Asientos de competición y sus accesorios de montaje.", "pyrotect-butaca.jpg", "Butaca de competición Pyrotect Ultra",
     ["Asientos Carrera Ultra", "Asientos Elite", "Asientos Fibra de Carbono", "Asientos Carrera Deportiva", "Soportes de respaldo", "Correderas y soportes de montaje"]),
    ("Cascos", "Cascos abiertos e integrales, repuestos y accesorios de cuidado.", "pyrotect-casco-carbono.jpg", "Casco integral Pyrotect en fibra de carbono",
     ["Casco Juvenil", "Casco Ultra Deportivo", "Casco Pro Deportivo", "Casco de flujo de aire profesional", "Partes de cascos", "Cuidado de cascos y bolsos"]),
    ("Trajes", "Trajes ignífugos de una y dos piezas, para adultos y juveniles.", "pyrotect-traje.jpg", "Traje de piloto Pyrotect Pro One FIA rojo",
     ["Trajes FIA", "Trajes SFI-1", "Trajes SFI-5", "Trajes Junior"]),
    ("Celdas de combustible", "Celdas de seguridad para UTV, todo terreno y turismo.", "pyrotect-celda.jpg", "Celda de combustible Pyrotect para UTV Can-Am Maverick X3",
     ["Celdas UTV", "Celdas Todo Terreno", "Celdas Especiales", "PyroCell Elite", "PyroCell Turismo"]),
    ("Partes de celdas", "Repuestos y componentes para celdas de combustible.", "pyrotect-partes.jpg", "Tapa de llenado ventilada para celda de combustible",
     ["Tapas", "Platos", "Válvulas", "Fittings", "Calibres", "Recarga rápida (refueling)"]),
]
PRODUCTOS_PYROTECT = [
    ("Asiento Carrera Ultra", "Butacas", "pyrotect-butaca.jpg"),
    ("Casco abierto SA2020 Pro Sport", "Cascos", "pyrotect-casco-abierto.jpg"),
    ("Soporte de respaldo Pro-Series", "Butacas", "pyrotect-soporte-respaldo.jpg"),
    ("Rieles deslizantes para asiento", "Butacas", "pyrotect-rieles.jpg"),
]

if not CategoriaPyrotect.objects.exists():
    for orden, (nombre, descripcion, archivo, alt, lineas) in enumerate(CATEGORIAS_PYROTECT):
        categoria = CategoriaPyrotect.objects.create(nombre=nombre, descripcion=descripcion, lineas="\n".join(lineas), orden=orden)
        agregar_fotos(FotoCategoriaPyrotect, "categoria", categoria, [(archivo, alt)])
    for orden, (nombre, categoria, archivo) in enumerate(PRODUCTOS_PYROTECT):
        producto = ProductoPyrotect.objects.create(nombre=nombre, categoria=CategoriaPyrotect.objects.get(nombre=categoria), orden=orden)
        agregar_fotos(FotoProductoPyrotect, "producto", producto, [(archivo, nombre)])
    print(f"Pyrotect cargado: {len(CATEGORIAS_PYROTECT)} categorías y {len(PRODUCTOS_PYROTECT)} productos")

# Responsabilidad social (página /responsabilidad-social/). Las fotos de seguridad y de la Liga de
# Robótica se publican con autorización (confirmada por la empresa el 2026-10-14).
ACTIVIDADES = [
    ("Ciclismo de montaña", "deporte", True,
     "Apoyamos a un ciclista de mountain bike que compite con los colores de Ararat.",
     [("comunidad-mtb-1.jpg", "Ciclista de mountain bike con la camiseta de Ararat en plena competencia"),
      ("comunidad-mtb-2.jpg", "Ciclista patrocinado por Ararat bajando un sendero en carrera"),
      ("comunidad-mtb-3.jpg", "Ciclista con la camiseta de Ararat en una carrera de MTB"),
      ("comunidad-mtb-4.jpg", "Ciclista patrocinado por Ararat junto a su bicicleta en el podio"),
      ("comunidad-mtb-5.jpg", "Ciclista con la camiseta de Ararat junto a su bicicleta en un evento de ciclismo"),
      ("comunidad-mtb-6.jpg", "Dos ciclistas con la camiseta de Ararat junto a sus bicicletas en el MTB Tour"),
      ("comunidad-mtb-7.jpg", "Partida de una cicletada de la Oficina de Deportes de Paine, con un vehículo de rally abriendo la ruta")]),
    ("Compromiso con la seguridad", "seguridad", True,
     "Colaboramos en actividades que promueven la seguridad de nuestra comunidad.",
     [("comunidad-seguridad-1.jpg", "Autoridades y representantes de la comunidad en una actividad de seguridad"),
      ("comunidad-seguridad-2.jpg", "Autoridades y vecinos en una ceremonia de seguridad comunitaria"),
      ("comunidad-seguridad-3.jpg", "Ceremonia de seguridad comunitaria en los jardines de la unidad"),
      ("comunidad-seguridad-4.jpg", "Izamiento de banderas en una ceremonia de seguridad comunitaria")]),
    ("Liga de Robótica", "educacion", True,
     "Patrocinamos la Liga de Robótica y fomentamos la tecnología entre niños y jóvenes.",
     [("comunidad-robotica-1.jpg", "Premiación de la Liga de Robótica patrocinada por Ararat")]),
]

if not ActividadComunidad.objects.exists():
    for orden, (titulo, eje, publicado, resumen, fotos) in enumerate(ACTIVIDADES):
        actividad = ActividadComunidad.objects.create(titulo=titulo, eje=eje, resumen=resumen, publicado=publicado, orden=orden)
        agregar_fotos(FotoActividad, "actividad", actividad, fotos)
    print(f"RSE cargada: {len(ACTIVIDADES)} actividades")

# Las preguntas que la web traía escritas en web/src/data/servicios.ts.
PREGUNTAS = [
    ("soldadura", "¿Hacen trabajos en terreno?", "Sí. Contamos con taller móvil para reparaciones en faena cuando el equipo no se puede trasladar."),
    ("soldadura", "¿Qué necesito para cotizar?", "Una descripción del trabajo, medidas aproximadas y, si puedes, fotos o planos. Por WhatsApp es lo más rápido."),
    ("torno-y-mecanizado", "¿Pueden fabricar una pieza sin plano?", "Sí, a partir de la pieza original o de una muestra. Tráela al taller o envíanos fotos con medidas para una primera estimación."),
    ("insumos-de-ferreteria", "¿Venden a empresas con factura?", "Sí. Envíanos tu lista de productos y te respondemos con una cotización."),
    ("repuestos-industriales", "¿Qué pasa si el repuesto ya no se fabrica?", "Lo podemos fabricar a partir de la pieza original en nuestro taller de mecanizado."),
    ("flexibles-hidraulicos", "¿Puedo llevar la manguera dañada?", "Sí, es la forma más rápida: la usamos como muestra para largo, terminales y presión de trabajo."),
]

if not PreguntaFrecuente.objects.exists():
    for orden, (seccion, pregunta, respuesta) in enumerate(PREGUNTAS):
        PreguntaFrecuente.objects.create(seccion=seccion, pregunta=pregunta, respuesta=respuesta, orden=orden)
    print(f"Preguntas frecuentes cargadas: {len(PREGUNTAS)}")

print(
    f"Listo. Trabajos: {Trabajo.objects.count()} · Equipos: {Equipo.objects.count()} · "
    f"Preguntas: {PreguntaFrecuente.objects.count()} · Pyrotect: {CategoriaPyrotect.objects.count()} categorías, "
    f"{ProductoPyrotect.objects.count()} productos · Comunidad: {ActividadComunidad.objects.count()}"
)
