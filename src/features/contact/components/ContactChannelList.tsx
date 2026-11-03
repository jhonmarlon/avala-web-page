import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { RowHoverFill } from '@/components/fx/RowHoverFill'
import { contactChannels } from '@/features/contact/data/channels'
import { cn } from '@/lib/utils'

// Filas de contacto a todo el ancho: al pasar el puntero se llenan de neón desde abajo
export function ContactChannelList({ className }: { className?: string }) {
  return (
    <ul className={cn('border-t border-avala-paper/15', className)}>
      {contactChannels.map((channel, i) => (
        <motion.li
          key={channel.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: [0.76, 0, 0.24, 1] }}
        >
          <a
            href={channel.href}
            target={channel.external ? '_blank' : undefined}
            rel={channel.external ? 'noreferrer' : undefined}
            data-cursor={channel.cursor}
            className="group relative isolate grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-avala-paper/15 px-4 py-4 sm:grid-cols-[3rem_9rem_minmax(0,1fr)_auto] lg:px-6 lg:py-5"
          >
            <RowHoverFill active />
            <span className="hud-label tabular text-avala-neon transition-colors duration-500 group-hover:text-avala-ink group-active:text-avala-ink">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="hud-label transition-colors duration-500 group-hover:text-avala-ink/70 group-active:text-avala-ink/70">
              {channel.label}
            </span>
            <span className="display-tight col-span-2 col-start-2 row-start-2 min-w-0 [overflow-wrap:anywhere] text-contact-value leading-tight text-avala-paper transition-colors duration-500 group-hover:text-avala-ink group-active:text-avala-ink sm:col-span-1 sm:col-start-3 sm:row-start-1">
              {channel.value}
            </span>
            <span className="col-start-3 row-start-1 flex size-10 items-center justify-center border border-avala-paper/20 bg-avala-ink text-avala-paper transition-all duration-500 group-hover:rotate-45 group-hover:text-avala-neon group-active:text-avala-neon sm:col-start-4 sm:size-14">
              <ArrowUpRight className="size-4 sm:size-7" strokeWidth={1.25} />
            </span>
          </a>
        </motion.li>
      ))}
    </ul>
  )
}
