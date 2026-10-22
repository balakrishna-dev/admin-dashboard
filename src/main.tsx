import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ThemeProvider } from './hooks/useTheme'
import Analytics from './pages/Analytics'
import Customers from './pages/Customers'
import NotFound from './pages/NotFound'
import Orders from './pages/Orders'
import Overview from './pages/Overview'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import './index.css'

// Pages are bundled eagerly: lazy chunks are fetched on navigation, and on a static host a
// redeploy deletes the old chunk files, which blanked the app until a reload.

// HashRouter keeps deep links working on static hosts like GitHub Pages.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="projects" element={<Projects />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
