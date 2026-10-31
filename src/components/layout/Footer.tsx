import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import background3 from '@/assets/background_3.png'
import logoImage from '@/assets/avala_logo.png'
import { companyInfo, footerLinkGroups, legalLinks, socialLinks } from '@/config/site'
import { Button } from '@/components/ui/Button'

const socialIcons = {
  LinkedIn: FaLinkedinIn,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
}

export function Footer() {
  return (
    <footer
      className="border-t border-white/10 text-white"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(4, 11, 30, 0.92) 0%, rgba(5, 13, 34, 0.95) 100%), url(${background3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="page-container py-10 lg:py-12">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.9fr_0.8fr_1fr]">
          <div className="max-w-sm space-y-5">
            <div>
              <div className="flex items-center">
                <img src={logoImage} alt="Avala Group" className="h-14 w-auto object-contain" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{companyInfo.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.label as keyof typeof socialIcons]

                return (
                  <Button
                    key={link.label}
                    variant="outline"
                    size="icon"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </Button>
                )
              })}
            </div>

            <p className="text-xs text-slate-400">© 2026 {companyInfo.name}. Todos los derechos reservados.</p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">
                {group.title}
              </p>
              <ul className="space-y-2.5 text-sm text-slate-300">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition-colors hover:text-brand-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">
              Contacto
            </p>
              <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" />{companyInfo.address}</li>
              <li className="flex items-start gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-brand-300" />{companyInfo.phone}</li>
              <li className="flex items-start gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-brand-300" />{companyInfo.email}</li>
              <li className="flex items-start gap-2.5"><Clock3 className="mt-0.5 size-4 shrink-0 text-brand-300" />{companyInfo.hours}</li>
            </ul>

            <Button
              variant="outline"
              href="https://wa.me/573126573502"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" className="size-5 shrink-0 text-green-400" />
              Hablemos por WhatsApp
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-slate-400">{companyInfo.legalName} · NIT {companyInfo.nit}</p>

          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors hover:text-brand-300">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
