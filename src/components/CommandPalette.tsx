import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CornerDownLeft, Moon, Palette, Search, Sun, type LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACCENTS, useTheme } from '../hooks/useTheme'
import { cn } from '../lib/utils'
import { FLAT_NAV } from './nav'

interface Command {
  id: string
  label: string
  group: string
  icon: LucideIcon
  hint?: string
  run: () => void
  keywords?: string
}

/** Lightweight fuzzy match: every query char must appear in order. Returns a score or -1. */
function fuzzy(query: string, text: string) {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (!q) return 0
  if (t.includes(q)) return 100 - t.indexOf(q)
  let ti = 0
  let score = 0
  for (const ch of q) {
    const idx = t.indexOf(ch, ti)
    if (idx === -1) return -1
    score += idx === ti ? 3 : 1
    ti = idx + 1
  }
  return score
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { theme, toggleTheme, setAccent } = useTheme()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(
    () => [
      ...FLAT_NAV.map((n) => ({
        id: `nav-${n.to}`,
        label: `Go to ${n.label}`,
        group: 'Navigation',
        icon: n.icon,
        keywords: n.keywords,
        run: () => navigate(n.to),
      })),
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        group: 'Preferences',
        icon: theme === 'dark' ? Sun : Moon,
        hint: '⇧ D',
        keywords: 'theme appearance',
        run: toggleTheme,
      },
      ...ACCENTS.map((a) => ({
        id: `accent-${a.id}`,
        label: `Accent: ${a.label}`,
        group: 'Preferences',
        icon: Palette,
        keywords: 'color theme accent',
        run: () => setAccent(a.id),
      })),
    ],
    [navigate, theme, toggleTheme, setAccent],
  )

  const results = useMemo(() => {
    return commands
      .map((c) => ({ c, s: Math.max(fuzzy(query, c.label), fuzzy(query, c.keywords ?? '') - 10) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c)
  }, [commands, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  const exec = (c: Command | undefined) => {
    if (!c) return
    c.run()
    onClose()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      exec(results[active])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-surface-solid shadow-2xl"
            style={{ border: '1px solid var(--border-strong)' }}
            onKeyDown={onKey}
          >
            <div className="flex items-center gap-3 px-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <Search className="size-4 text-subtle" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, actions, themes…"
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-subtle"
              />
              <span className="kbd">ESC</span>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && <p className="px-3 py-10 text-center text-sm text-muted">No results for “{query}”</p>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null
                lastGroup = c.group
                return (
                  <div key={c.id}>
                    {header && <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">{header}</p>}
                    <button
                      onMouseMove={() => setActive(i)}
                      onClick={() => exec(c)}
                      className={cn('relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors', i === active ? 'text-fg' : 'text-muted')}
                    >
                      {i === active && <motion.span layoutId="cmd-active" className="absolute inset-0 rounded-xl bg-accent/12" transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }} />}
                      <c.icon className={cn('relative size-4', i === active && 'text-accent')} />
                      <span className="relative flex-1">{c.label}</span>
                      {c.hint && <span className="kbd relative">{c.hint}</span>}
                      {i === active && <ArrowRight className="relative size-4 text-accent" />}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 px-4 py-2.5 text-[11px] text-subtle" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="flex items-center gap-1.5">
                <span className="kbd">↑</span>
                <span className="kbd">↓</span> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="kbd">
                  <CornerDownLeft className="inline size-2.5" />
                </span>
                select
              </span>
              <span className="ml-auto">Aurora Command</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
