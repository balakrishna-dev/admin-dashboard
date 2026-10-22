<div align="center">

<img src="public/favicon.svg" width="72" alt="Aurora logo" />

# Aurora Admin

**A modern, animated admin dashboard — glassmorphism, aurora gradients, and buttery-smooth interactions.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-7c5cff?style=for-the-badge&logo=githubpages&logoColor=white)](https://balakrishna-dev.github.io/admin-dashboard/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

<br />

<img src="docs/screenshots/overview-dark.jpg" alt="Aurora Admin — overview, dark theme" width="100%" />

</div>

---

## ✨ Highlights

| | Feature | Details |
|---|---|---|
| 🎨 | **Living design system** | Dark & light themes plus 5 accent palettes (Aurora, Ocean, Emerald, Sunset, Rose). Every chart, button and glow re-themes instantly via CSS custom properties. |
| 🌌 | **Aurora background** | Drifting gradient blobs, a masked grid and film-grain noise — all pure CSS, GPU-friendly. |
| 🔦 | **Spotlight cards** | Glass cards with a gradient border that follows your cursor. |
| ⌨️ | **Command palette** | `Ctrl/⌘ + K` opens a fuzzy-search palette to jump between pages or switch themes — fully keyboard-driven. |
| 📊 | **Rich analytics** | Area, line, bar, donut, radial, radar charts, a 7×24 activity heatmap and a **live realtime** visitors feed. |
| 🧾 | **Data table** | Search, status tabs with counts, multi-column sorting, pagination, bulk selection, **CSV export** and a slide-over order detail drawer. |
| 🗂️ | **Kanban board** | Drag-and-drop tasks across columns with spring-animated layout transitions and inline task creation. |
| 🪪 | **3D customer cards** | Perspective-tilt cards with tier badges, sparklines and grid / list views. |
| 📱 | **Fully responsive** | Collapsible sidebar on desktop, slide-in drawer on mobile. |
| ⚡ | **Fast** | Route-level code splitting, vendor chunking and skeleton loaders. Respects `prefers-reduced-motion`. |

## 🖼️ Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/overview-light.jpg" alt="Overview — light theme" /><p align="center"><b>Overview · Light</b></p></td>
    <td width="50%"><img src="docs/screenshots/analytics.jpg" alt="Analytics" /><p align="center"><b>Analytics</b></p></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/orders.jpg" alt="Orders table" /><p align="center"><b>Orders</b></p></td>
    <td><img src="docs/screenshots/customers.jpg" alt="Customers — Ocean accent" /><p align="center"><b>Customers · Ocean accent</b></p></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/projects.jpg" alt="Kanban board" /><p align="center"><b>Projects (Kanban)</b></p></td>
    <td><img src="docs/screenshots/settings.jpg" alt="Settings — Sunset accent" /><p align="center"><b>Settings · Sunset accent</b></p></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/command-palette.jpg" alt="Command palette" /><p align="center"><b>Command palette</b></p></td>
    <td align="center"><img src="docs/screenshots/mobile.jpg" alt="Mobile view" width="45%" /><p align="center"><b>Mobile</b></p></td>
  </tr>
</table>

## 🧱 Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 7** for lightning-fast dev & builds
- **Tailwind CSS 4** with a token-based theme (`@theme` + CSS variables)
- **Recharts** for data visualisation
- **Framer Motion** for layout animations, springs and gestures
- **React Router 7** (hash routing for zero-config static hosting)
- **Lucide** icons

## 🚀 Getting Started

```bash
git clone https://github.com/balakrishna-dev/admin-dashboard.git
cd admin-dashboard
npm install
npm run dev        # http://localhost:5173
```

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run the TypeScript compiler only |

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl` / `⌘` + `K` | Open command palette |
| `Shift` + `D` | Toggle dark / light theme |
| `[` | Collapse / expand sidebar |
| `↑` `↓` `Enter` `Esc` | Navigate the command palette |

## 📁 Project Structure

```
src/
├── components/      # Layout, Sidebar, Topbar, CommandPalette, StatCard, UI primitives
├── data/            # Deterministic, seeded mock data
├── hooks/           # useTheme (theme + accent context), useCountUp
├── lib/             # Formatting helpers, status → tone mapping
├── pages/           # Overview, Analytics, Orders, Customers, Projects, Settings, 404
├── index.css        # Design tokens, glass / spotlight utilities, aurora background
└── main.tsx         # Router + lazy-loaded routes
```

## 🌐 Deployment

The repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes to **GitHub Pages** on every push to `main`.

1. Go to **Settings → Pages** in the repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` — your dashboard will be live at `https://<username>.github.io/admin-dashboard/`.

## 👤 Author

**Balakrishna Undela**

- GitHub: [@balakrishna-dev](https://github.com/balakrishna-dev)

If you like this project, please consider giving it a ⭐ — it really helps!

## 📄 License

Released under the [MIT License](LICENSE) © 2026 Balakrishna Undela.
