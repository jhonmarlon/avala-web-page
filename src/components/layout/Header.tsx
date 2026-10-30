import { useCallback, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import logoImage from '@/assets/avala_logo.png'
import { CtaLink } from '@/components/fx/CtaLink'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { cn } from '@/lib/utils'
import { navigationItems } from '@/config/navigation'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdownHref, setOpenDropdownHref] = useState<string | null>(null)
  const location = useLocation()
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  return (
    <header
      className="sticky top-0 z-50 border-b border-avala-paper/10 bg-avala-ink/88 text-white backdrop-blur-md"
    >
      <div className="page-container relative flex min-h-18 items-center justify-between gap-4 lg:min-h-20 lg:gap-6">
        <NavLink to="/" className="flex items-center">
          <img
            src={logoImage}
            alt="Avala Group"
            className="pointer-events-none h-11 w-auto object-contain sm:h-12 lg:h-14"
          />
        </NavLink>
        <nav className="hidden items-center gap-6 font-mono text-[0.75rem] leading-normal uppercase tracking-[0.12em] text-avala-paper/65 lg:flex xl:gap-8">
          {navigationItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const isChildActive = item.children?.some((child) => child.href === location.pathname) ?? false
            const isDropdownOpen = openDropdownHref === item.href

            if (hasChildren) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdownHref(item.href)}
                  onMouseLeave={() => setOpenDropdownHref(null)}
                  onFocus={() => setOpenDropdownHref(item.href)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenDropdownHref(null)
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setOpenDropdownHref(item.href)}
                    className={cn(
                      'relative inline-flex rounded-full px-2 py-2 transition-colors duration-200',
                      isChildActive || isDropdownOpen ? 'text-white' : 'hover:text-brand-400',
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'size-3.5 opacity-70 transition-transform duration-200',
                          isDropdownOpen && 'rotate-180',
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        'absolute inset-x-2 -bottom-[0.15rem] h-0.5 origin-left bg-avala-neon transition-transform duration-300',
                        isChildActive || isDropdownOpen ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      'absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-4 transition-all duration-300 ease-out',
                      isDropdownOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-2 opacity-0',
                    )}
                  >
                    <div className="rounded-[1.35rem] border border-white/10 bg-surface-950/96 p-2 text-white shadow-[0_22px_70px_rgba(3,8,20,0.42)] backdrop-blur-xl">
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          onClick={() => setOpenDropdownHref(null)}
                          className={({ isActive }) =>
                            cn(
                              'relative isolate block overflow-hidden rounded-[1rem] p-[1px] transition-colors duration-200',
                              isActive ? 'text-white' : 'text-slate-300 hover:text-white',
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive ? (
                                <span
                                  aria-hidden="true"
                                  className="absolute -inset-10 -z-10 bg-avala-neon/60"
                                />
                              ) : null}
                              <span
                                className={cn(
                                  'relative block rounded-[0.95rem] px-4 py-3 transition-colors duration-200',
                                  isActive
                                    ? 'bg-surface-950/96 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.18),0_0_28px_rgba(56,189,248,0.18)]'
                                    : 'hover:bg-white/6',
                                )}
                              >
                                <span className="block text-sm font-semibold">{child.label}</span>
                                <span className="mt-1 block text-xs leading-5 text-slate-400">{child.description}</span>
                              </span>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group relative rounded-full px-2 py-2 transition-colors duration-200',
                    isActive ? 'text-white' : 'hover:text-brand-400',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="inline-flex items-center gap-1.5">{item.label}</span>
                    <span
                      className={cn(
                        'absolute inset-x-2 -bottom-[0.15rem] h-0.5 origin-left bg-avala-neon transition-transform duration-300',
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <CtaLink to="/contacto" variant="line" cursor="Agendar" className="hidden h-10 border-avala-neon/70 lg:inline-flex">
          Agendá una reunión
        </CtaLink>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="group relative inline-flex h-11 w-11 items-center justify-center border border-avala-paper/20 text-white transition-colors duration-300 hover:border-avala-neon lg:hidden"
        >
          <span className="sr-only">Menú</span>
          <span className="relative h-5 w-5">
            <span
              className={cn(
                'absolute left-0 top-1/2 h-px w-5 -translate-y-[0.4rem] bg-current transition-all duration-300',
                isMobileMenuOpen && 'translate-y-0 rotate-45',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-current transition-all duration-300',
                isMobileMenuOpen && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1/2 h-px w-5 translate-y-[0.35rem] bg-current transition-all duration-300',
                isMobileMenuOpen && 'translate-y-0 -rotate-45',
              )}
            />
          </span>
        </button>
      </div>

      <MobileMenu open={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  )
}
