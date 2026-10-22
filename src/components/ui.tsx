import { motion, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent } from 'react'
import { cn, initials } from '../lib/utils'

/* ------------------------------------------------------------------ */
/*  Card — glass surface with a cursor-following gradient border        */
/* ------------------------------------------------------------------ */
interface CardProps extends HTMLMotionProps<'div'> {
  delay?: number
}

export function Card({ className, children, delay = 0, onMouseMove, ...props }: CardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (el) {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    onMouseMove?.(e)
  }
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      className={cn('card spotlight', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="font-display text-[15px] font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Avatar — generated gradient avatar with initials                    */
/* ------------------------------------------------------------------ */
export function Avatar({ name, hue = 260, size = 36, ring = false }: { name: string; hue?: number; size?: number; ring?: boolean }) {
  return (
    <div
      className={cn('grid shrink-0 place-items-center rounded-full font-semibold text-white', ring && 'ring-2 ring-bg')}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${hue} 85% 62%), hsl(${(hue + 50) % 360} 80% 48%))`,
      }}
      aria-hidden
    >
      {initials(name)}
    </div>
  )
}

export function AvatarStack({ hues, size = 26 }: { hues: number[]; size?: number }) {
  const names = ['Ava Kim', 'Raj Iyer', 'Leo Nair', 'Mia Rossi', 'Sam Khan']
  return (
    <div className="flex -space-x-2">
      {hues.map((h, i) => (
        <Avatar key={i} name={names[i % names.length]} hue={h} size={size} ring />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Badge                                                               */
/* ------------------------------------------------------------------ */
const TONES = {
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/12 text-warning',
  danger: 'bg-danger/12 text-danger',
  accent: 'bg-accent/12 text-accent',
  info: 'bg-accent-2/12 text-accent-2',
  neutral: 'bg-surface-2 text-muted',
} as const

export type Tone = keyof typeof TONES

export function Badge({ tone = 'neutral', children, dot = false }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={cn('chip', TONES[tone])}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Sparkline — tiny inline SVG trend line                              */
/* ------------------------------------------------------------------ */
export function Sparkline({ data, color = 'var(--accent)', width = 96, height = 32, fill = true }: { data: number[]; color?: string; width?: number; height?: number; fill?: boolean }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - ((v - min) / (max - min || 1)) * (height - 4) - 2])
  // Smooth the path with simple cubic segments
  const d = pts.reduce((acc, [x, y], i, arr) => {
    if (i === 0) return `M${x},${y}`
    const [px, py] = arr[i - 1]
    const cx = (px + x) / 2
    return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`
  }, '')
  const id = `sl-${Math.abs(data.reduce((a, b) => a * 31 + b, 7)) % 100000}`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Progress ring                                                       */
/* ------------------------------------------------------------------ */
export function Ring({ value, size = 120, stroke = 10, label, sub }: { value: number; size?: number; stroke?: number; label?: ReactNode; sub?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-semibold">{label ?? `${value}%`}</div>
        {sub && <div className="text-[11px] text-muted">{sub}</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page header                                                         */
/* ------------------------------------------------------------------ */
export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: ReactNode; description?: string; actions?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        {eyebrow && <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-[32px] md:leading-tight">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Chart tooltip — themed for Recharts                                 */
/* ------------------------------------------------------------------ */
interface TooltipEntry {
  name?: string | number
  value?: number | string | readonly (number | string)[]
  color?: string
  dataKey?: unknown
}
export function ChartTooltip({
  active,
  payload,
  label,
  format = (v: number) => v.toLocaleString(),
}: {
  active?: boolean
  payload?: readonly TooltipEntry[]
  label?: string | number
  format?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass min-w-36 rounded-xl px-3 py-2.5 text-xs">
      {label !== undefined && <div className="mb-1.5 font-medium text-fg">{label}</div>}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 capitalize text-muted">
              <span className="size-2 rounded-full" style={{ background: p.color }} />
              {String(p.name)}
            </span>
            <span className="font-mono font-medium text-fg">{format(Number(p.value))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Segmented control                                                   */
/* ------------------------------------------------------------------ */
export function Segmented<T extends string>({ options, value, onChange, id }: { options: readonly T[]; value: T; onChange: (v: T) => void; id: string }) {
  return (
    <div className="inline-flex rounded-xl bg-surface-2 p-1" role="tablist" style={{ border: '1px solid var(--border)' }}>
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={value === o}
          onClick={() => onChange(o)}
          className={cn('relative rounded-lg px-3 py-1 text-xs font-medium transition-colors', value === o ? 'text-fg' : 'text-muted hover:text-fg')}
        >
          {value === o && (
            <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-lg bg-surface-solid shadow-sm" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
          )}
          <span className="relative">{o}</span>
        </button>
      ))}
    </div>
  )
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}
