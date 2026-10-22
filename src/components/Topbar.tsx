import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCheck, Menu, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { notifications as seed } from '../data/mock'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/utils'
import { FLAT_NAV } from './nav'
import { GithubIcon } from './ui'

const TONE_DOT = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const

export function Topbar({ onOpenPalette, onOpenMobile }: { onOpenPalette: () => void; onOpenMobile: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(seed)
  const panelRef = useRef<HTMLDivElement>(null)
  const unread = items.filter((n) => n.unread).length
  const current = FLAT_NAV.find((n) => n.to === pathname) ?? FLAT_NAV[0]
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 md:px-8">
      <div className="glass flex h-14 items-center gap-3 rounded-2xl px-3 md:px-4">
        <button onClick={onOpenMobile} className="btn-ghost p-2 lg:hidden" aria-label="Open menu">
          <Menu className="size-4" />
        </button>

        <div className="hidden items-center gap-2 text-sm sm:flex">
          <span className="text-subtle">Aurora</span>
          <span className="text-subtle">/</span>
          <span className="font-medium">{current.label}</span>
        </div>

        <button
          onClick={onOpenPalette}
          className="ml-auto flex h-9 w-full max-w-72 items-center gap-2 rounded-xl bg-surface-2 px-3 text-sm text-subtle transition hover:text-muted"
          style={{ border: '1px solid var(--border)' }}
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search…</span>
          <span className="kbd">{isMac ? '⌘' : 'Ctrl'} K</span>
        </button>

        <div className="flex items-center gap-1.5">
          <a href="https://github.com/balakrishna-dev/admin-dashboard" target="_blank" rel="noreferrer" className="btn-ghost hidden p-2 sm:inline-flex" aria-label="View source on GitHub">
            <GithubIcon className="size-4" />
          </a>

          <button onClick={toggleTheme} className="btn-ghost relative overflow-hidden p-2" aria-label="Toggle theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ y: -18, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 18, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25 }}
                className="block"
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </button>

          <div className="relative" ref={panelRef}>
            <button onClick={() => setOpen((o) => !o)} className="btn-ghost relative p-2" aria-label="Notifications" aria-expanded={open}>
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white ring-2 ring-bg">{unread}</span>
              )}
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-surface-solid shadow-2xl"
                  style={{ border: '1px solid var(--border-strong)' }}
                >
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="font-display text-sm font-semibold">Notifications</p>
                    <button onClick={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))} className="flex items-center gap-1 text-xs text-accent hover:underline">
                      <CheckCheck className="size-3.5" /> Mark all read
                    </button>
                  </div>
                  <ul className="max-h-80 overflow-y-auto p-1.5">
                    {items.map((n) => (
                      <li key={n.id} className={cn('flex gap-3 rounded-xl p-2.5 transition hover:bg-surface-2', n.unread && 'bg-accent/[0.05]')}>
                        <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', TONE_DOT[n.tone])} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium">{n.title}</p>
                            <span className="shrink-0 text-[10px] text-subtle">{n.time}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
