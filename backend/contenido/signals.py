"""Los archivos de las fotos y de los videos se borran del disco junto con su registro."""

from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Foto, Trabajo


def _borrar(*archivos):
    for archivo in archivos:
        if archivo:
            archivo.storage.delete(archivo.name)


@receiver(post_delete)
def borrar_archivos(sender, instance, **kwargs):
    if issubclass(sender, Foto):
        _borrar(instance.imagen, instance.miniatura)


@receiver(pre_save)
def borrar_archivos_reemplazados(sender, instance, **kwargs):
    if not issubclass(sender, Foto) or not instance.pk:
        return
    anterior = sender.objects.filter(pk=instance.pk).first()
    # Si se reemplazó la foto, la anterior (y su miniatura) quedan huérfanas.
    if anterior and anterior.imagen.name != instance.imagen.name:
        _borrar(anterior.imagen, anterior.miniatura)


@receiver(post_delete, sender=Trabajo)
def borrar_video(sender, instance, **kwargs):
    _borrar(instance.video)


@receiver(pre_save, sender=Trabajo)
def borrar_video_reemplazado(sender, instance, **kwargs):
    if not instance.pk:
        return
    anterior = sender.objects.filter(pk=instance.pk).only("video").first()
    if anterior and anterior.video.name != instance.video.name:
        _borrar(anterior.video)
