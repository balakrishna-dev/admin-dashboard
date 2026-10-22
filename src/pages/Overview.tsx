import { motion } from 'framer-motion'
import { Activity as ActivityIcon, AlertTriangle, ArrowUpRight, CalendarDays, DollarSign, Download, MessageSquare, Rocket, ShoppingCart, Target, UserPlus, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatCard } from '../components/StatCard'
import { Avatar, Badge, Card, CardHeader, ChartTooltip, PageHeader, Ring, Segmented } from '../components/ui'
import { activity, channelSplit, countries, orders, revenueSeries, topProducts, type Activity } from '../data/mock'
import { useTheme } from '../hooks/useTheme'
import { STATUS_TONE } from '../lib/status'
import { formatCurrency, formatNumber, greeting } from '../lib/utils'

const RANGES = ['3M', '6M', '12M'] as const
type Range = (typeof RANGES)[number]

const ACTIVITY_ICON: Record<Activity['kind'], { icon: typeof Rocket; color: string }> = {
  order: { icon: ShoppingCart, color: 'var(--accent)' },
  deploy: { icon: Rocket, color: 'var(--accent-2)' },
  user: { icon: UserPlus, color: 'var(--success)' },
  alert: { icon: AlertTriangle, color: 'var(--warning)' },
  comment: { icon: MessageSquare, color: 'var(--accent-3)' },
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="font-mono tabular-nums">
      {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

export default function Overview() {
  const { palette } = useTheme()
  const [range, setRange] = useState<Range>('12M')
  const data = useMemo(() => revenueSeries.slice(-Number(range.replace('M', ''))), [range])
  const pieColors = [palette.accent, palette.accent2, palette.accent3, palette.muted]
  const totalRevenue = revenueSeries.reduce((s, r) => s + r.revenue, 0)

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        title={
          <>
            {greeting()}, <span className="text-gradient">Balakrishna</span> 👋
          </>
        }
        description="Here's what's happening across your business today. Everything is trending up — nice work."
        actions={
          <>
            <span className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted">
              <span className="live-dot size-2 rounded-full bg-success" /> Live · <LiveClock />
            </span>
            <button className="btn-ghost">
              <CalendarDays className="size-4" /> Oct 2026
            </button>
            <button className="btn-primary">
              <Download className="size-4" /> Export
            </button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={totalRevenue} format={(n) => formatCurrency(n, true)} change={12.4} icon={DollarSign} trend={revenueSeries.map((r) => r.revenue)} color={palette.accent} delay={0} />
        <StatCard label="Orders" value={18432} format={(n) => formatNumber(Math.round(n))} change={8.1} icon={ShoppingCart} trend={[30, 42, 38, 51, 47, 60, 58, 66, 72, 70, 81, 88]} color={palette.accent2} delay={0.06} />
        <StatCard label="Active Customers" value={9284} format={(n) => formatNumber(Math.round(n))} change={5.7} icon={Users} trend={[20, 24, 23, 30, 34, 33, 40, 44, 41, 48, 52, 55]} color={palette.accent3} delay={0.12} />
        <StatCard label="Conversion Rate" value={3.68} format={(n) => `${n.toFixed(2)}%`} change={-1.2} icon={Target} trend={[50, 46, 52, 48, 44, 47, 42, 45, 40, 43, 39, 41]} color="#f59e0b" delay={0.18} />
      </div>

      {/* Revenue + goal */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card delay={0.2} className="p-5 xl:col-span-2">
          <CardHeader
            title="Revenue overview"
            subtitle="Revenue vs. expenses vs. last year"
            action={<Segmented id="rev" options={RANGES} value={range} onChange={setRange} />}
          />
          <div className="mt-4 flex flex-wrap gap-5 text-xs">
            {[
              ['Revenue', palette.accent],
              ['Expenses', palette.accent2],
              ['Last year', palette.muted],
            ].map(([l, c]) => (
              <span key={l} className="flex items-center gap-2 text-muted">
                <span className="h-2 w-4 rounded-full" style={{ background: c }} /> {l}
              </span>
            ))}
          </div>
          <div className="mt-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 4, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.accent} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={palette.accent} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.accent2} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={palette.accent2} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={8} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<ChartTooltip format={(v) => formatCurrency(v)} />} cursor={{ stroke: palette.border, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="lastYear" name="Last year" stroke={palette.muted} strokeDasharray="5 5" strokeWidth={1.5} fill="none" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke={palette.accent2} strokeWidth={2} fill="url(#gExp)" />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={palette.accent} strokeWidth={2.5} fill="url(#gRev)" activeDot={{ r: 5, strokeWidth: 3, stroke: palette.surface }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={0.25} className="flex flex-col p-5">
          <CardHeader title="Quarterly goal" subtitle="Q4 · $640k target" action={<Badge tone="success" dot>On track</Badge>} />
          <div className="flex flex-1 items-center justify-center py-6">
            <Ring value={78} size={170} stroke={14} sub="of target reached" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['$499k', 'Achieved'],
              ['$141k', 'Remaining'],
              ['39d', 'Left'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-surface-2 py-2.5">
                <p className="font-display text-sm font-semibold">{v}</p>
                <p className="text-[10px] text-subtle">{l}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Channels / countries / activity */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card delay={0.3} className="p-5">
          <CardHeader title="Traffic channels" subtitle="Share of sessions this month" />
          <div className="relative mx-auto mt-2 h-52 w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelSplit} dataKey="value" nameKey="name" innerRadius={66} outerRadius={92} paddingAngle={4} cornerRadius={8} stroke="none">
                  {channelSplit.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip format={(v) => `${v}%`} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-2xl font-semibold">84.2k</p>
                <p className="text-[11px] text-subtle">sessions</p>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {channelSplit.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-xs">
                <span className="flex items-center gap-2 text-muted">
                  <span className="size-2 rounded-full" style={{ background: pieColors[i] }} />
                  {c.name}
                </span>
                <span className="font-mono font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.35} className="p-5">
          <CardHeader title="Top countries" subtitle="Revenue by region" action={<Link to="/analytics" className="text-xs text-accent hover:underline">Details</Link>} />
          <ul className="mt-5 space-y-4">
            {countries.map((c, i) => (
              <li key={c.code}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="grid h-5 w-7 place-items-center rounded bg-surface-2 font-mono text-[10px] font-medium text-muted">{c.code}</span>
                    {c.name}
                  </span>
                  <span className="font-mono text-xs text-muted">{formatCurrency(c.value, true)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.pct / countries[0].pct) * 100}%` }}
                    transition={{ duration: 1.1, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card delay={0.4} className="p-5 lg:col-span-2 xl:col-span-1">
          <CardHeader title="Recent activity" subtitle="Across your workspace" action={<ActivityIcon className="size-4 text-subtle" />} />
          <ol className="relative mt-5 space-y-5 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-line">
            {activity.map((a, i) => {
              const { icon: Icon, color } = ACTIVITY_ICON[a.kind]
              return (
                <motion.li key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.06 }} className="relative flex gap-3">
                  <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-surface-solid" style={{ border: '1px solid var(--border)', color }}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="leading-snug">
                      <span className="font-medium">{a.who}</span> <span className="text-muted">{a.action}</span> <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-subtle">{a.time}</p>
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </Card>
      </div>

      {/* Recent orders + top products */}
      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <Card delay={0.45} className="overflow-hidden xl:col-span-3">
          <div className="p-5 pb-3">
            <CardHeader
              title="Recent orders"
              subtitle="Latest transactions"
              action={
                <Link to="/orders" className="btn-ghost py-1.5 text-xs">
                  View all <ArrowUpRight className="size-3.5" />
                </Link>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-subtle">
                  <th className="px-5 py-2 font-medium">Customer</th>
                  <th className="px-5 py-2 font-medium">Product</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-surface-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={o.customer} hue={o.avatarHue} size={30} />
                        <div className="leading-tight">
                          <p className="font-medium">{o.customer}</p>
                          <p className="font-mono text-[11px] text-subtle">{o.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted">{o.product}</td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS_TONE[o.status]} dot>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-medium">{formatCurrency(o.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card delay={0.5} className="p-5 xl:col-span-2">
          <CardHeader title="Top products" subtitle="By revenue this quarter" />
          <ul className="mt-4 space-y-1">
            {topProducts.slice(0, 5).map((p, i) => (
              <li key={p.name} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-surface-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl font-display text-sm font-semibold text-white" style={{ background: `linear-gradient(135deg, hsl(${250 + i * 28} 80% 60%), hsl(${190 + i * 28} 80% 50%))` }}>
                  {p.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-[11px] text-subtle">
                    {p.category} · {formatNumber(p.sales)} sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium">{formatCurrency(p.revenue, true)}</p>
                  <p className={p.growth >= 0 ? 'text-[11px] text-success' : 'text-[11px] text-danger'}>
                    {p.growth >= 0 ? '+' : ''}
                    {p.growth}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
