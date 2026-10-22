import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsLeft, Sparkles, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../lib/utils'
import { NAV } from './nav'
import { Avatar } from './ui'

interface Props {
  collapsed: boolean
  onCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 shadow-[0_8px_24px_-6px_var(--accent)]">
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19 12 5l7 14" />
          <path d="M8.5 13.5h7" />
        </svg>
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <div className="font-display text-[17px] font-semibold tracking-tight">Aurora</div>
          <div className="text-[11px] text-subtle">Admin Suite</div>
        </div>
      )}
    </div>
  )
}

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <>
      <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.section}>
            {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle">{section.section}</p>}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        collapsed && 'justify-center px-0',
                        isActive ? 'text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/18 to-accent/[0.03]"
                            style={{ border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}
                            transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }}
                          />
                        )}
                        {isActive && <span className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_12px_var(--accent)]" />}
                        <item.icon className={cn('relative size-[18px] shrink-0 transition-colors', isActive && 'text-accent')} />
                        {!collapsed && <span className="relative flex-1">{item.label}</span>}
                        {!collapsed && item.badge && <span className="relative rounded-md bg-accent px-1.5 text-[10px] font-semibold text-white">{item.badge}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="relative mb-4 overflow-hidden rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-accent-2/10 to-transparent" />
          <div className="relative">
            <Sparkles className="mb-2 size-5 text-accent" />
            <p className="font-display text-sm font-semibold">Upgrade to Pro</p>
            <p className="mt-1 text-xs text-muted">Unlock AI insights, unlimited seats & priority support.</p>
            <button className="btn-primary mt-3 w-full py-1.5 text-xs">Upgrade now</button>
          </div>
        </div>
      )}

      <div className={cn('flex items-center gap-3 rounded-xl p-2', collapsed && 'justify-center')} style={{ border: '1px solid var(--border)' }}>
        <div className="relative">
          <Avatar name="Balakrishna Undela" hue={258} size={34} />
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-success ring-2 ring-bg" />
        </div>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">Balakrishna Undela</p>
            <p className="truncate text-[11px] text-subtle">Super Admin</p>
          </div>
        )}
      </div>
    </>
  )
}

export function Sidebar({ collapsed, onCollapse, mobileOpen, onCloseMobile }: Props) {
  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 264 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
        className="glass sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-y-0 border-l-0 px-4 py-5 lg:flex"
        style={{ borderRadius: 0 }}
      >
        <div className={cn('flex items-center justify-between', collapsed && 'justify-center')}>
          <Logo collapsed={collapsed} />
        </div>
        <button
          onClick={onCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="glass absolute -right-3 top-7 grid size-6 place-items-center rounded-full text-muted transition hover:text-fg"
        >
          <ChevronsLeft className={cn('size-3.5 transition-transform', collapsed && 'rotate-180')} />
        </button>
        <SidebarBody collapsed={collapsed} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface-solid px-4 py-5 lg:hidden"
              style={{ borderRight: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <Logo collapsed={false} />
                <button onClick={onCloseMobile} className="btn-ghost p-2" aria-label="Close menu">
                  <X className="size-4" />
                </button>
              </div>
              <SidebarBody collapsed={false} onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
