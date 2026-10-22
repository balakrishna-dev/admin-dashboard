import { motion } from 'framer-motion'
import { Clock, Eye, MousePointerClick, Timer, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StatCard } from '../components/StatCard'
import { Badge, Card, CardHeader, ChartTooltip, PageHeader, Segmented } from '../components/ui'
import { deviceSplit, heatmap, radarSkills, trafficSeries } from '../data/mock'
import { useTheme } from '../hooks/useTheme'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const VIEWS = ['Line', 'Bar'] as const

function useRealtime() {
  const [points, setPoints] = useState(() => Array.from({ length: 28 }, (_, i) => ({ t: i, v: 40 + Math.round(Math.sin(i / 2) * 18 + Math.random() * 20) })))
  useEffect(() => {
    const id = setInterval(() => {
      setPoints((p) => {
        const last = p[p.length - 1]
        const v = Math.max(12, Math.min(110, last.v + Math.round((Math.random() - 0.48) * 22)))
        return [...p.slice(1), { t: last.t + 1, v }]
      })
    }, 1600)
    return () => clearInterval(id)
  }, [])
  return points
}

export default function Analytics() {
  const { palette } = useTheme()
  const [view, setView] = useState<(typeof VIEWS)[number]>('Line')
  const realtime = useRealtime()
  const online = realtime[realtime.length - 1].v * 3
  const radial = deviceSplit.map((d, i) => ({ ...d, fill: [palette.accent, palette.accent2, palette.accent3][i] }))

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Understand how visitors find, use and come back to your product."
        actions={<Segmented id="view" options={VIEWS} value={view} onChange={setView} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Page views" value={1284500} format={(n) => `${(n / 1e6).toFixed(2)}M`} change={18.2} icon={Eye} trend={trafficSeries.map((d) => d.visitors)} color={palette.accent} />
        <StatCard label="Unique visitors" value={312400} format={(n) => `${Math.round(n / 1000)}k`} change={9.4} icon={MousePointerClick} trend={trafficSeries.map((d) => d.sessions)} color={palette.accent2} delay={0.06} />
        <StatCard label="Avg. session" value={272} format={(n) => `${Math.floor(n / 60)}m ${String(Math.round(n % 60)).padStart(2, '0')}s`} change={4.1} icon={Timer} trend={[3, 4, 3, 5, 6, 5, 7, 6, 8, 7, 8, 9]} color={palette.accent3} delay={0.12} />
        <StatCard label="Bounce rate" value={32.6} format={(n) => `${n.toFixed(1)}%`} change={-3.8} icon={TrendingUp} trend={[9, 8, 8, 7, 7, 6, 7, 5, 6, 5, 4, 4]} color="#f59e0b" delay={0.18} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card delay={0.2} className="p-5 xl:col-span-2">
          <CardHeader title="Traffic trend" subtitle="Visitors vs. sessions · last 30 days" />
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {view === 'Line' ? (
                <LineChart data={trafficSeries} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} interval={4} dy={8} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: palette.border }} />
                  <Line type="monotone" dataKey="visitors" stroke={palette.accent} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 3, stroke: palette.surface }} />
                  <Line type="monotone" dataKey="sessions" stroke={palette.accent2} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 3, stroke: palette.surface }} />
                </LineChart>
              ) : (
                <BarChart data={trafficSeries} margin={{ top: 10, right: 6, left: -16, bottom: 0 }} barGap={2}>
                  <CartesianGrid vertical={false} strokeDasharray="4 6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} interval={4} dy={8} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-2)' }} />
                  <Bar dataKey="visitors" fill={palette.accent} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sessions" fill={palette.accent2} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={0.25} className="flex flex-col p-5">
          <CardHeader title="Realtime" subtitle="Active users right now" action={<Badge tone="success" dot>Live</Badge>} />
          <motion.p key={online} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-display text-5xl font-semibold tabular-nums tracking-tight">
            {online}
          </motion.p>
          <p className="text-xs text-muted">users online · updates every 1.6s</p>
          <div className="mt-auto h-32 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={realtime} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="v" radius={[3, 3, 0, 0]} fill={palette.accent} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ['/pricing', '38%'],
              ['/docs', '27%'],
              ['/blog', '14%'],
            ].map(([p, v]) => (
              <div key={p} className="rounded-lg bg-surface-2 py-2">
                <p className="font-mono text-muted">{p}</p>
                <p className="font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card delay={0.3} className="p-5">
          <CardHeader title="Devices" subtitle="Sessions by device type" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart data={radial} innerRadius="35%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={14}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'var(--surface-2)' }} />
                <Tooltip content={<ChartTooltip format={(v) => `${v}%`} />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-center">
            {radial.map((d) => (
              <div key={d.name}>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                  <span className="size-2 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </p>
                <p className="font-display text-lg font-semibold">{d.value}%</p>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.35} className="p-5">
          <CardHeader title="Product health" subtitle="Current score vs. target" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarSkills} outerRadius="72%">
                <PolarGrid stroke="var(--border-strong)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <Radar name="Target" dataKey="target" stroke={palette.muted} fill={palette.muted} fillOpacity={0.08} strokeDasharray="4 4" />
                <Radar name="Current" dataKey="current" stroke={palette.accent} fill={palette.accent} fillOpacity={0.3} strokeWidth={2} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={0.4} className="p-5 lg:col-span-2 xl:col-span-1">
          <CardHeader title="Peak hours" subtitle="Activity by weekday & hour" action={<Clock className="size-4 text-subtle" />} />
          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[320px] space-y-1">
              {heatmap.map((row, d) => (
                <div key={d} className="flex items-center gap-1">
                  <span className="w-8 shrink-0 text-[10px] text-subtle">{DAYS[d]}</span>
                  <div className="grid flex-1 gap-[3px]" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                    {row.map((v, h) => (
                      <div
                        key={h}
                        title={`${DAYS[d]} ${h}:00 · ${Math.round(v * 100)}% activity`}
                        className="aspect-square rounded-[3px] transition-transform hover:scale-125"
                        style={{ background: `color-mix(in srgb, var(--accent) ${Math.round(8 + v * 92)}%, var(--surface-2))` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-between pl-9 pt-1 text-[10px] text-subtle">
                <span>00h</span>
                <span>06h</span>
                <span>12h</span>
                <span>18h</span>
                <span>23h</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-subtle">
            Less
            {[10, 30, 55, 80, 100].map((p) => (
              <span key={p} className="size-3 rounded-[3px]" style={{ background: `color-mix(in srgb, var(--accent) ${p}%, var(--surface-2))` }} />
            ))}
            More
          </div>
        </Card>
      </div>
    </>
  )
}
