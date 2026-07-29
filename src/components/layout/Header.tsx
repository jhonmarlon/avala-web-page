import { useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router'
import logoImage from '@/assets/avala_logo.png'
import background1 from '@/assets/background_1.png'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { navigationItems } from '@/config/navigation'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 text-white backdrop-blur-xl"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(4, 11, 30, 0.9) 0%, rgba(5, 17, 44, 0.82) 100%), url(${background1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div className="page-container relative flex min-h-18 items-center justify-between gap-4 lg:min-h-20 lg:gap-6">
        <NavLink to="/" className="relative flex min-h-12 items-center lg:min-h-14">
          <img
            src={logoImage}
            alt="Sistemas AG"
            className="pointer-events-none absolute -left-4 top-2/2 w-auto -lg:translate-y-1/2 -translate-y-1/2 object-contain lg:h-[20rem] sm:h-[16rem] h-[14rem]"
          />
          <div className="ml-[4rem] flex flex-col justify-center leading-none sm:ml-[4.15rem] md:ml-[4.45rem] lg:ml-[5.9rem] lg:translate-y-2 lg:translate-x-8 md:translate-y-2 md:translate-x-8 translate-y-2 translate-x-7">
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.24em] text-slate-400 sm:text-[0.62rem] md:text-[0.66rem] lg:text-[0.7rem]">
              Sistemas
            </p>
            <p className="mt-1 text-sm font-semibold text-white sm:text-[0.95rem] md:text-base lg:text-[1.05rem]">AG</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex xl:gap-8">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn('group relative rounded-full px-2 py-2 transition-colors duration-200', isActive ? 'text-white' : 'hover:text-brand-400')}
            >
              {({ isActive }) => (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    {item.hasChildren ? <ChevronDown className="size-3.5 opacity-70" /> : null}
                  </span>
                  <span
                    className={cn(
                      'absolute inset-x-2 -bottom-[0.15rem] h-0.5 origin-left rounded-full bg-brand-400 transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Button
          to="/contacto"
          variant="secondary"
          className="hidden border-amber-400/70 bg-transparent px-5 text-white shadow-[0_0_0_1px_rgba(251,191,36,0.2)] hover:bg-amber-400/10 lg:inline-flex"
        >
          <CalendarDays className="size-4" />
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
                className="border-amber-400/70 bg-transparent text-white hover:bg-amber-400/10 hover:text-white"
              >
                <CalendarDays className="size-4" />
                Agendá una reunión
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
