// Deterministic mock data so every refresh looks the same (and screenshots stay stable).

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20261022)
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]
const between = (min: number, max: number) => Math.round(min + rand() * (max - min))

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export const revenueSeries = MONTHS.map((month, i) => {
  const base = 42000 + i * 4200 + Math.sin(i / 1.6) * 6000
  return {
    month,
    revenue: Math.round(base + rand() * 5000),
    expenses: Math.round(base * 0.58 + rand() * 4000),
    lastYear: Math.round(base * 0.78 + rand() * 4000),
  }
})

export const trafficSeries = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  visitors: Math.round(2400 + Math.sin(i / 3) * 700 + i * 40 + rand() * 500),
  sessions: Math.round(1600 + Math.cos(i / 4) * 400 + i * 30 + rand() * 300),
}))

export const channelSplit = [
  { name: 'Organic', value: 42 },
  { name: 'Direct', value: 24 },
  { name: 'Social', value: 19 },
  { name: 'Referral', value: 15 },
]

export const deviceSplit = [
  { name: 'Desktop', value: 58 },
  { name: 'Mobile', value: 34 },
  { name: 'Tablet', value: 8 },
]

export const radarSkills = [
  { metric: 'Speed', current: 92, target: 80 },
  { metric: 'SEO', current: 78, target: 85 },
  { metric: 'Retention', current: 86, target: 75 },
  { metric: 'Engagement', current: 71, target: 80 },
  { metric: 'Conversion', current: 64, target: 70 },
  { metric: 'Support', current: 88, target: 82 },
]

export const countries = [
  { name: 'India', code: 'IN', value: 38420, pct: 34 },
  { name: 'United States', code: 'US', value: 27110, pct: 24 },
  { name: 'Germany', code: 'DE', value: 14230, pct: 12.6 },
  { name: 'United Kingdom', code: 'GB', value: 11840, pct: 10.5 },
  { name: 'Japan', code: 'JP', value: 9020, pct: 8 },
  { name: 'Brazil', code: 'BR', value: 6210, pct: 5.5 },
]

/** 7 rows (days) x 24 columns (hours) of activity intensity 0..1 */
export const heatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const work = h >= 9 && h <= 18 ? 0.55 : 0.12
    const weekday = d < 5 ? 1 : 0.55
    return Math.min(1, (work + rand() * 0.45) * weekday)
  }),
)

const FIRST = ['Aarav', 'Diya', 'Liam', 'Sofia', 'Kenji', 'Maya', 'Noah', 'Zara', 'Ethan', 'Isha', 'Lucas', 'Ananya', 'Oliver', 'Mia', 'Arjun', 'Chloe', 'Rohan', 'Emma', 'Kabir', 'Ava']
const LAST = ['Sharma', 'Reddy', 'Müller', 'Tanaka', 'Silva', 'Patel', 'Smith', 'Khan', 'Garcia', 'Iyer', 'Brown', 'Nair', 'Kim', 'Rossi']
const PRODUCTS = ['Aurora Pro License', 'Nimbus Cloud Plan', 'Pixel UI Kit', 'Quantum Analytics', 'Orbit CRM Seat', 'Flux API Credits', 'Nova Design System', 'Vertex Hosting']
export const ORDER_STATUSES = ['Paid', 'Pending', 'Refunded', 'Shipped', 'Failed'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: number
  status: OrderStatus
  date: string
  avatarHue: number
}

const start = new Date('2026-10-22T00:00:00Z').getTime()

export const orders: Order[] = Array.from({ length: 64 }, (_, i) => {
  const first = pick(FIRST)
  const last = pick(LAST)
  const statusRoll = rand()
  const status: OrderStatus =
    statusRoll < 0.46 ? 'Paid' : statusRoll < 0.66 ? 'Shipped' : statusRoll < 0.84 ? 'Pending' : statusRoll < 0.93 ? 'Refunded' : 'Failed'
  return {
    id: `#AU-${(48210 - i).toString()}`,
    customer: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace('ü', 'u')}@mail.com`,
    product: pick(PRODUCTS),
    amount: between(19, 2400) + between(0, 99) / 100,
    status,
    date: new Date(start - i * 1000 * 60 * 60 * between(3, 14)).toISOString(),
    avatarHue: between(0, 360),
  }
})

export interface Customer {
  id: number
  name: string
  role: string
  company: string
  location: string
  spent: number
  orders: number
  rating: number
  hue: number
  tier: 'Platinum' | 'Gold' | 'Silver'
  trend: number[]
}

const ROLES = ['Product Lead', 'CTO', 'Designer', 'Founder', 'Engineering Manager', 'Growth Lead', 'Data Scientist', 'Marketing Head']
const COMPANIES = ['Lumen Labs', 'Stratus', 'Kairo', 'Helix AI', 'Northwind', 'Polaris', 'Vanta Studio', 'Mosaic', 'Trellis', 'Cobalt']
const CITIES = ['Hyderabad', 'Bengaluru', 'Berlin', 'Tokyo', 'São Paulo', 'London', 'Austin', 'Toronto', 'Singapore', 'Chennai']

export const customers: Customer[] = Array.from({ length: 12 }, (_, i) => {
  const spent = between(2400, 48000)
  return {
    id: i + 1,
    name: `${pick(FIRST)} ${pick(LAST)}`,
    role: pick(ROLES),
    company: pick(COMPANIES),
    location: pick(CITIES),
    spent,
    orders: between(4, 120),
    rating: Math.round((3.8 + rand() * 1.2) * 10) / 10,
    hue: between(0, 360),
    tier: spent > 30000 ? 'Platinum' : spent > 14000 ? 'Gold' : 'Silver',
    trend: Array.from({ length: 12 }, () => between(10, 100)),
  }
})

export interface Product {
  name: string
  category: string
  sales: number
  revenue: number
  stock: number
  growth: number
}

export const topProducts: Product[] = PRODUCTS.slice(0, 6).map((name) => ({
  name,
  category: pick(['SaaS', 'Design', 'Infra', 'Data']),
  sales: between(320, 4200),
  revenue: between(12000, 186000),
  stock: between(8, 100),
  growth: Math.round((rand() * 40 - 8) * 10) / 10,
}))

export interface Activity {
  id: number
  who: string
  action: string
  target: string
  time: string
  kind: 'order' | 'user' | 'deploy' | 'alert' | 'comment'
}

export const activity: Activity[] = [
  { id: 1, who: 'Diya Reddy', action: 'placed an order for', target: 'Aurora Pro License', time: '2m ago', kind: 'order' },
  { id: 2, who: 'System', action: 'deployed', target: 'v2.8.0 to production', time: '18m ago', kind: 'deploy' },
  { id: 3, who: 'Kenji Tanaka', action: 'joined the workspace', target: 'Helix AI', time: '42m ago', kind: 'user' },
  { id: 4, who: 'Monitor', action: 'flagged latency spike on', target: 'api-eu-west', time: '1h ago', kind: 'alert' },
  { id: 5, who: 'Sofia Silva', action: 'commented on', target: 'Q4 roadmap', time: '2h ago', kind: 'comment' },
  { id: 6, who: 'Arjun Iyer', action: 'upgraded to', target: 'Nimbus Cloud Plan', time: '3h ago', kind: 'order' },
]

export interface Notification {
  id: number
  title: string
  body: string
  time: string
  unread: boolean
  tone: 'accent' | 'success' | 'warning' | 'danger'
}

export const notifications: Notification[] = [
  { id: 1, title: 'Revenue milestone', body: 'You crossed $1.2M in quarterly revenue 🎉', time: 'Just now', unread: true, tone: 'success' },
  { id: 2, title: 'New team member', body: 'Kenji Tanaka accepted your invite.', time: '12m', unread: true, tone: 'accent' },
  { id: 3, title: 'High latency', body: 'p95 latency on api-eu-west is 820ms.', time: '1h', unread: true, tone: 'warning' },
  { id: 4, title: 'Payment failed', body: 'Order #AU-48197 could not be charged.', time: '3h', unread: false, tone: 'danger' },
]

export type KanbanColumnId = 'backlog' | 'progress' | 'review' | 'done'
export interface Task {
  id: string
  title: string
  tag: string
  priority: 'Low' | 'Medium' | 'High'
  assignees: number[]
  comments: number
  progress: number
}

export const kanbanColumns: { id: KanbanColumnId; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'progress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' },
]

export const initialTasks: Record<KanbanColumnId, Task[]> = {
  backlog: [
    { id: 't1', title: 'Design onboarding checklist', tag: 'Design', priority: 'Medium', assignees: [12, 210], comments: 4, progress: 0 },
    { id: 't2', title: 'Add CSV export to orders', tag: 'Feature', priority: 'Low', assignees: [140], comments: 1, progress: 0 },
    { id: 't3', title: 'Audit color contrast (WCAG AA)', tag: 'A11y', priority: 'High', assignees: [300, 60], comments: 7, progress: 0 },
  ],
  progress: [
    { id: 't4', title: 'Realtime notifications via WebSocket', tag: 'Backend', priority: 'High', assignees: [190, 12, 260], comments: 12, progress: 62 },
    { id: 't5', title: 'Command palette fuzzy search', tag: 'Feature', priority: 'Medium', assignees: [60], comments: 3, progress: 40 },
  ],
  review: [
    { id: 't6', title: 'Refactor chart theme tokens', tag: 'Refactor', priority: 'Low', assignees: [210], comments: 5, progress: 90 },
    { id: 't7', title: 'Role-based access control', tag: 'Security', priority: 'High', assignees: [300, 140], comments: 9, progress: 85 },
  ],
  done: [
    { id: 't8', title: 'Dark / light theme switcher', tag: 'Design', priority: 'Medium', assignees: [12], comments: 6, progress: 100 },
    { id: 't9', title: 'Responsive sidebar navigation', tag: 'Feature', priority: 'Medium', assignees: [60, 190], comments: 2, progress: 100 },
  ],
}
