import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { useCountUp } from '../hooks/useCountUp'
import { cn } from '../lib/utils'
import { Card, Sparkline } from './ui'

interface Props {
  label: string
  value: number
  format: (n: number) => string
  change: number
  icon: LucideIcon
  trend: number[]
  color: string
  delay?: number
}

export function StatCard({ label, value, format, change, icon: Icon, trend, color, delay }: Props) {
  const animated = useCountUp(value)
  const up = change >= 0
  return (
    <Card delay={delay} className="group overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: color }}
      />
      <div className="relative flex items-start justify-between">
        <div className="grid size-10 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}>
          <Icon className="size-5" />
        </div>
        <span className={cn('chip', up ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger')}>
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="relative mt-5 text-xs font-medium text-muted">{label}</p>
      <div className="relative mt-1 flex items-end justify-between gap-2">
        <p className="font-display text-[26px] font-semibold tabular-nums tracking-tight">{format(animated)}</p>
        <Sparkline data={trend} color={color} width={84} height={34} />
      </div>
      <p className="relative mt-2 text-[11px] text-subtle">vs. last month</p>
    </Card>
  )
}
