import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import background3 from '@/assets/background_3.png'
import logoImage from '@/assets/avala_logo.png'
import { companyInfo, footerLinkGroups, legalLinks, socialLinks } from '@/config/site'

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
        backgroundImage: `linear-gradient(180deg, rgba(4, 11, 30, 0.72) 0%, rgba(5, 13, 34, 0.82) 100%), url(${background3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="page-container py-10 lg:py-12">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.9fr_0.8fr_1fr]">
          <div className="max-w-sm space-y-5">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="Sistemas AG" className="h-13 w-auto object-contain h-30 absolute -translate-x-8 translate-y-1"/>
                <div className="flex flex-col translate-x-17 -translate-y-0.5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Sistemas</p>
                  <p className="text-base font-semibold text-white">AG</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{companyInfo.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.label as keyof typeof socialIcons]

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-brand-400/40 hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
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

            <a
              href="https://wa.me/573021234567"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[3.15rem] min-w-[12.8rem] items-center justify-between gap-3 rounded-[0.9rem] border border-[#30d273]/55 bg-[linear-gradient(180deg,#16a34a_0%,#0b7a3a_100%)] px-4 text-sm font-medium text-white shadow-[0_16px_32px_rgba(22,163,74,0.28)] transition-all duration-200 hover:brightness-110"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-white/12">
                  <FaWhatsapp className="size-[0.95rem]" />
                </span>
                <span>Chatear ahora</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-slate-400">{companyInfo.legalName}</p>

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
