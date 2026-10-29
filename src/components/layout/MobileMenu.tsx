import { ArrowUpRight, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router'
import { CtaLink } from '@/components/fx/CtaLink'
import { navigationItems } from '@/config/navigation'
import { companyInfo } from '@/config/site'
import { cn } from '@/lib/utils'

const ease = [0.76, 0, 0.24, 1] as const

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

// Menú móvil a pantalla completa: enlaces grandes numerados y soluciones con descripción
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const close = () => {
    setExpanded(null)
    onClose()
  }

  // Portal: el header usa backdrop-filter, que rompe el posicionamiento fixed de sus hijos
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-navigation"
          data-lenis-prevent
          className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-avala-ink text-avala-paper lg:hidden"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.6, ease }}
        >
          <div
            aria-hidden="true"
            className="grid-lines pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,black,transparent_70%)]"
          />

          <nav className="page-container relative flex min-h-full flex-col py-6">
            <p className="hud-label flex justify-between pb-3">
              <span>Menú</span>
              <span className="tabular">{String(navigationItems.length).padStart(2, '0')} secciones</span>
            </p>

            <ul className="border-t border-avala-paper/15">
              {navigationItems.map((item, i) => {
                const number = (
                  <span className="hud-label tabular w-8 shrink-0 pt-2 text-avala-neon">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )
                const isExpanded = expanded === item.href

                return (
                  <motion.li
                    key={item.href}
                    className="border-b border-avala-paper/15"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
                  >
                    {item.children?.length ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => setExpanded(isExpanded ? null : item.href)}
                          className="flex w-full items-start py-4 text-left"
                        >
                          {number}
                          <span className="display-tight flex-1 text-[2.4rem] leading-none text-avala-paper">{item.label}</span>
                          <span className="mt-1.5 flex size-8 items-center justify-center border border-avala-paper/20 text-avala-paper">
                            <motion.span animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.3 }}>
                              <Plus className="size-4" strokeWidth={1.5} />
                            </motion.span>
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.ul
                              className="overflow-hidden"
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.45, ease }}
                            >
                              {item.children.map((child, k) => (
                                <li key={child.href} className="pb-2 pl-8">
                                  <NavLink
                                    to={child.href}
                                    onClick={close}
                                    className={({ isActive }) =>
                                      cn(
                                        'group relative isolate grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border p-4',
                                        isActive ? 'border-avala-neon' : 'border-avala-paper/15',
                                      )
                                    }
                                  >
                                    <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-avala-neon transition-transform duration-500 group-active:scale-x-100" />
                                    <span className="hud-label tabular text-avala-neon group-active:text-avala-ink">
                                      {String(i + 1).padStart(2, '0')}.{k + 1}
                                    </span>
                                    <ArrowUpRight
                                      className="row-span-3 size-5 self-center text-avala-paper/60 group-active:text-avala-ink"
                                      strokeWidth={1.25}
                                    />
                                    <span className="display-tight text-xl leading-tight text-avala-paper group-active:text-avala-ink">
                                      {child.label}
                                    </span>
                                    <span className="text-xs leading-5 text-avala-paper/55 group-active:text-avala-ink/70">
                                      {child.description}
                                    </span>
                                  </NavLink>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <NavLink to={item.href} onClick={close} className="group flex items-start py-4">
                        {({ isActive }) => (
                          <>
                            {number}
                            <span
                              className={cn(
                                'display-tight flex-1 text-[2.4rem] leading-none transition-colors',
                                isActive ? 'text-avala-neon' : 'text-avala-paper group-active:text-avala-neon',
                              )}
                            >
                              {item.label}
                            </span>
                            <ArrowUpRight className="mt-2 size-5 text-avala-paper/40" strokeWidth={1.25} />
                          </>
                        )}
                      </NavLink>
                    )}
                  </motion.li>
                )
              })}
            </ul>

            <motion.div
              className="mt-auto space-y-6 pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <CtaLink to="/contacto" onClick={close} className="w-full">
                Agendá una reunión
              </CtaLink>
              <div className="hud-label flex justify-between gap-4">
                <a href={`mailto:${companyInfo.email}`} className="normal-case tracking-normal text-avala-paper">
                  {companyInfo.email}
                </a>
                <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`} className="text-avala-paper">
                  {companyInfo.phone}
                </a>
              </div>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
