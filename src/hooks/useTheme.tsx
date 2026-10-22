import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { cssVar } from '../lib/utils'

export type Theme = 'dark' | 'light'
export type Accent = 'aurora' | 'ocean' | 'emerald' | 'sunset' | 'rose'

export const ACCENTS: { id: Accent; label: string; colors: [string, string] }[] = [
  { id: 'aurora', label: 'Aurora', colors: ['#7c5cff', '#22d3ee'] },
  { id: 'ocean', label: 'Ocean', colors: ['#3b82f6', '#22d3ee'] },
  { id: 'emerald', label: 'Emerald', colors: ['#10b981', '#a3e635'] },
  { id: 'sunset', label: 'Sunset', colors: ['#f97316', '#f43f5e'] },
  { id: 'rose', label: 'Rose', colors: ['#ec4899', '#a855f7'] },
]

export interface Palette {
  accent: string
  accent2: string
  accent3: string
  muted: string
  surface: string
  border: string
  text: string
}

interface ThemeCtx {
  theme: Theme
  accent: Accent
  palette: Palette
  toggleTheme: () => void
  setAccent: (a: Accent) => void
}

const Ctx = createContext<ThemeCtx | null>(null)

const read = <T extends string>(key: string, fallback: T): T => {
  try {
    return (localStorage.getItem(key) as T) || fallback
  } catch {
    return fallback
  }
}
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable — ignore */
  }
}

const readPalette = (): Palette => ({
  accent: cssVar('--accent'),
  accent2: cssVar('--accent-2'),
  accent3: cssVar('--accent-3'),
  muted: cssVar('--subtle'),
  surface: cssVar('--surface-solid'),
  border: cssVar('--border-strong'),
  text: cssVar('--text'),
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => read<Theme>('aurora-theme', 'dark'))
  const [accent, setAccentState] = useState<Accent>(() => read<Accent>('aurora-accent', 'aurora'))
  const [palette, setPalette] = useState<Palette>(readPalette)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    if (accent === 'aurora') delete root.dataset.accent
    else root.dataset.accent = accent
    write('aurora-theme', theme)
    write('aurora-accent', accent)
    setPalette(readPalette())
  }, [theme, accent])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  const setAccent = useCallback((a: Accent) => setAccentState(a), [])

  const value = useMemo(() => ({ theme, accent, palette, toggleTheme, setAccent }), [theme, accent, palette, toggleTheme, setAccent])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
