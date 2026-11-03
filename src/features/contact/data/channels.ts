import { companyInfo, socialLinks } from '@/config/site'

export const whatsappLink = socialLinks.find((link) => link.label === 'WhatsApp')

export const contactChannels = [
  { label: 'Email', value: companyInfo.email, href: `mailto:${companyInfo.email}`, cursor: 'Escribir', external: false },
  { label: 'Teléfono', value: companyInfo.phone, href: `tel:${companyInfo.phone.replace(/\s/g, '')}`, cursor: 'Llamar', external: false },
  ...(whatsappLink
    ? [{ label: 'WhatsApp', value: 'Escribinos ahora', href: whatsappLink.href, cursor: 'Chatear', external: true }]
    : []),
  {
    label: 'Oficina',
    value: companyInfo.address,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.address)}`,
    cursor: 'Mapa',
    external: true,
  },
]
