import { SITE } from '@/config/site';

/** Enlace a WhatsApp con mensaje prellenado (funciona en móvil y escritorio). */
export function waLink(message = 'Hola, quiero cotizar un trabajo.'): string {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
