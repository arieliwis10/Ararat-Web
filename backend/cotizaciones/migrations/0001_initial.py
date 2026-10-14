from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Cotizacion",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("nombre", models.CharField(max_length=120)),
                ("empresa", models.CharField(blank=True, max_length=120)),
                ("telefono", models.CharField(blank=True, max_length=30)),
                ("email", models.EmailField(blank=True, max_length=254)),
                (
                    "servicio",
                    models.CharField(
                        choices=[
                            ("soldadura", "Soldadura y estructuras metálicas"),
                            ("torno-y-mecanizado", "Torno y mecanizado"),
                            ("insumos-de-ferreteria", "Insumos de ferretería"),
                            ("repuestos-industriales", "Repuestos industriales"),
                            ("flexibles-hidraulicos", "Flexibles hidráulicos"),
                            ("arriendo", "Arriendo de equipos (Kairos)"),
                            ("otro", "Otro"),
                        ],
                        max_length=40,
                    ),
                ),
                ("mensaje", models.TextField(max_length=3000)),
                (
                    "estado",
                    models.CharField(
                        choices=[
                            ("nueva", "Nueva"),
                            ("contactada", "Contactada"),
                            ("cotizada", "Cotizada"),
                            ("cerrada", "Cerrada"),
                            ("descartada", "Descartada"),
                        ],
                        db_index=True,
                        default="nueva",
                        max_length=20,
                    ),
                ),
                ("notas_internas", models.TextField(blank=True)),
                ("origen", models.CharField(blank=True, max_length=200, verbose_name="página de origen")),
                ("ip", models.GenericIPAddressField(blank=True, null=True)),
                ("user_agent", models.CharField(blank=True, max_length=300)),
                ("creada", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("actualizada", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "cotización",
                "verbose_name_plural": "cotizaciones",
                "ordering": ["-creada"],
            },
        ),
    ]
