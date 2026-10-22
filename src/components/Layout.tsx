import { motion } from 'framer-motion'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { CommandPalette } from './CommandPalette'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="shimmer h-10 w-64 rounded-xl bg-surface-2" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="shimmer h-36 rounded-2xl bg-surface-2" />
        ))}
      </div>
      <div className="shimmer h-80 rounded-2xl bg-surface-2" />
    </div>
  )
}

export function Layout() {
  const location = useLocation()
  const { toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (!typing && e.shiftKey && e.key.toLowerCase() === 'd') {
        toggleTheme()
      } else if (!typing && e.key === '[') {
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleTheme])

  useEffect(() => window.scrollTo({ top: 0 }), [location.pathname])

  return (
    <>
      <div className="aurora" aria-hidden>
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="grid-overlay" />
      </div>
      <div className="noise" aria-hidden />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((c) => !c)} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 pb-10 pt-6 md:px-8">
            {/* Keyed enter-only transition: an exit animation would re-render the new <Outlet /> inside the leaving page. */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Suspense fallback={<PageSkeleton />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </main>
          <footer className="flex flex-col items-center justify-between gap-2 px-4 pb-6 text-xs text-subtle sm:flex-row md:px-8">
            <p>
              © {new Date().getFullYear()} Aurora Admin · Designed & built by{' '}
              <a href="https://github.com/balakrishna-dev" target="_blank" rel="noreferrer" className="font-medium text-muted hover:text-accent">
                Balakrishna Undela
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="kbd">Ctrl K</span> command · <span className="kbd">⇧ D</span> theme · <span className="kbd">[</span> sidebar
            </p>
          </footer>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
