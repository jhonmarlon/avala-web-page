import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { navigationItems } from '@/config/navigation'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/85 text-white backdrop-blur-xl">
      <div className="page-container flex min-h-18 items-center justify-between gap-4 lg:min-h-20 lg:gap-6">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 shadow-glow ring-1 ring-brand-400/30">
            <span className="text-lg font-semibold text-brand-400">AG</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Sistemas</p>
            <p className="text-base font-semibold text-white">Avala Group</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3 py-2 transition-colors duration-200',
                  isActive
                    ? 'bg-white/6 text-white ring-1 ring-white/10'
                    : 'hover:text-brand-400',
                )
              }
            >
              <span className="inline-flex items-center gap-1.5">
                {item.label}
                {item.hasChildren ? <ChevronDown className="size-3.5 opacity-70" /> : null}
              </span>
            </NavLink>
          ))}
        </nav>

        <Button
          to="/contacto"
          variant="secondary"
          className="hidden border-brand-400/50 bg-transparent text-white hover:bg-brand-500/10 lg:inline-flex"
        >
          Agendá una reunión
        </Button>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-brand-400/40 hover:bg-white/10 lg:hidden"
        >
          <span className="sr-only">Menú</span>
          <span className="relative h-5 w-5">
            <span
              className={cn(
                'absolute left-0 top-1/2 h-0.5 w-5 -translate-y-[0.45rem] rounded-full bg-current transition-all duration-300',
                isMobileMenuOpen && 'translate-y-0 rotate-45',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-current transition-all duration-300',
                isMobileMenuOpen && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1/2 h-0.5 w-5 translate-y-[0.35rem] rounded-full bg-current transition-all duration-300',
                isMobileMenuOpen && 'translate-y-0 -rotate-45',
              )}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          'overflow-hidden border-t border-white/10 bg-surface-950/95 transition-all duration-300 lg:hidden',
          isMobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="page-container py-4">
          <nav className="panel-dark-glass rounded-[2rem] p-4 text-white">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-brand-500/15 text-white ring-1 ring-brand-400/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    {item.hasChildren ? <ChevronDown className="size-3.5 opacity-70" /> : null}
                  </span>
                </NavLink>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <Button
                to="/contacto"
                fullWidth
                variant="secondary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-brand-400/40 bg-transparent text-white hover:bg-brand-500/10 hover:text-white"
              >
                Agendá una reunión
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
