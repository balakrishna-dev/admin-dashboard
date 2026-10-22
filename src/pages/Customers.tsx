import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { LayoutGrid, List, Mail, MapPin, Search, Star, UserPlus } from 'lucide-react'
import { useMemo, useState, type MouseEvent } from 'react'
import { Avatar, Badge, Card, PageHeader, Segmented, Sparkline } from '../components/ui'
import { customers, type Customer } from '../data/mock'
import { cn, formatCurrency } from '../lib/utils'

const TIERS = ['All', 'Platinum', 'Gold', 'Silver'] as const
const TIER_STYLE: Record<Customer['tier'], string> = {
  Platinum: 'from-slate-200 via-white to-slate-300 text-slate-800',
  Gold: 'from-amber-300 via-yellow-200 to-amber-400 text-amber-900',
  Silver: 'from-zinc-300 via-zinc-200 to-zinc-400 text-zinc-800',
}

function TiltCard({ c }: { c: Customer }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 18 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div layout initial={false} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ perspective: 900 }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} onMouseMove={onMove} onMouseLeave={reset}>
        <Card className="overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-20 opacity-60" style={{ background: `linear-gradient(135deg, hsl(${c.hue} 80% 60% / .35), transparent 70%)` }} />
          <div className="relative flex items-start justify-between" style={{ transform: 'translateZ(30px)' }}>
            <Avatar name={c.name} hue={c.hue} size={52} />
            <span className={cn('chip bg-gradient-to-r font-semibold', TIER_STYLE[c.tier])}>{c.tier}</span>
          </div>
          <div className="relative mt-4" style={{ transform: 'translateZ(20px)' }}>
            <p className="font-display text-base font-semibold">{c.name}</p>
            <p className="text-xs text-muted">
              {c.role} · {c.company}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs text-subtle">
              <MapPin className="size-3" /> {c.location}
            </p>
          </div>
          <div className="relative mt-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-subtle">Lifetime value</p>
              <p className="font-display text-xl font-semibold">{formatCurrency(c.spent, true)}</p>
            </div>
            <Sparkline data={c.trend} color={`hsl(${c.hue} 80% 60%)`} width={90} height={34} />
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2 pt-4 text-center text-xs" style={{ borderTop: '1px solid var(--border)' }}>
            <div>
              <p className="font-semibold">{c.orders}</p>
              <p className="text-subtle">Orders</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-0.5 font-semibold">
                <Star className="size-3 fill-warning text-warning" /> {c.rating}
              </p>
              <p className="text-subtle">Rating</p>
            </div>
            <div>
              <button className="mx-auto grid size-7 place-items-center rounded-lg bg-accent/12 text-accent transition hover:bg-accent hover:text-white" aria-label={`Email ${c.name}`}>
                <Mail className="size-3.5" />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default function Customers() {
  const [tier, setTier] = useState<(typeof TIERS)[number]>('All')
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  const list = useMemo(
    () =>
      customers.filter(
        (c) => (tier === 'All' || c.tier === tier) && `${c.name} ${c.company} ${c.location}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [tier, query],
  )

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        description="Your most valuable relationships, ranked by lifetime value."
        actions={
          <button className="btn-primary">
            <UserPlus className="size-4" /> Add customer
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <Segmented id="tier" options={TIERS} value={tier} onChange={setTier} />
        <div className="relative md:ml-auto md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, company, city…" className="input pl-9" />
        </div>
        <div className="flex gap-1">
          {(
            [
              ['grid', LayoutGrid],
              ['list', List],
            ] as const
          ).map(([k, Icon]) => (
            <button key={k} onClick={() => setLayout(k)} className={cn('btn-ghost p-2', layout === k && 'bg-surface-2 text-fg')} aria-label={`${k} view`}>
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      {layout === 'grid' ? (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <TiltCard key={c.id} c={c} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="divide-y divide-line overflow-hidden">
          {list.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4 transition hover:bg-surface-2">
              <Avatar name={c.name} hue={c.hue} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted">
                  {c.role} · {c.company} · {c.location}
                </p>
              </div>
              <div className="hidden sm:block">
                <Sparkline data={c.trend} color={`hsl(${c.hue} 80% 60%)`} width={100} height={30} />
              </div>
              <Badge tone={c.tier === 'Platinum' ? 'accent' : c.tier === 'Gold' ? 'warning' : 'neutral'}>{c.tier}</Badge>
              <p className="w-20 text-right font-mono text-sm font-medium">{formatCurrency(c.spent, true)}</p>
            </div>
          ))}
        </Card>
      )}

      {list.length === 0 && <p className="py-20 text-center text-sm text-muted">No customers found.</p>}
    </>
  )
}
