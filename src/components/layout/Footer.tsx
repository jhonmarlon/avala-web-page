import { Instagram, Linkedin, MessageCircleMore } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { companyInfo, footerLinkGroups, legalLinks, socialLinks } from '@/config/site'

const socialIcons = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  WhatsApp: MessageCircleMore,
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-950 text-white">
      <div className="page-container py-12 lg:py-16">
        <div className="grid gap-10 xl:grid-cols-[1.1fr_1fr_1fr_0.9fr]">
          <div className="max-w-sm space-y-4">
            <div>
              <p className="text-lg font-semibold text-white">{companyInfo.legalName}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{companyInfo.description}</p>
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

            <p className="text-sm text-slate-400">© 2026 {companyInfo.name}. Todos los derechos reservados.</p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">
                {group.title}
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
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
            <ul className="space-y-3 text-sm text-slate-300">
              <li>{companyInfo.address}</li>
              <li>{companyInfo.phone}</li>
              <li>{companyInfo.email}</li>
              <li>{companyInfo.hours}</li>
            </ul>

            <Button
              href="https://wa.me/573021234567"
              target="_blank"
              variant="secondary"
              className="border-emerald-400/40 bg-emerald-500/10 text-white hover:bg-emerald-500/20 hover:text-white"
            >
              <MessageCircleMore className="size-4" />
              Chatear ahora
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <p>Base lista para seguir creciendo hacia blog, CRM, reservas e IA.</p>

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
