import { BarChart3, KanbanSquare, LayoutDashboard, Settings, ShoppingBag, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  badge?: string
  keywords?: string
}

export const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Workspace',
    items: [
      { to: '/', label: 'Overview', icon: LayoutDashboard, keywords: 'home dashboard kpi' },
      { to: '/analytics', label: 'Analytics', icon: BarChart3, keywords: 'traffic charts reports' },
      { to: '/orders', label: 'Orders', icon: ShoppingBag, badge: '12', keywords: 'sales transactions table' },
      { to: '/customers', label: 'Customers', icon: Users, keywords: 'clients people crm' },
    ],
  },
  {
    section: 'Manage',
    items: [
      { to: '/projects', label: 'Projects', icon: KanbanSquare, keywords: 'kanban tasks board' },
      { to: '/settings', label: 'Settings', icon: Settings, keywords: 'theme preferences profile' },
    ],
  },
]

export const FLAT_NAV = NAV.flatMap((s) => s.items)
