import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Download, Filter, MoreHorizontal, Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar, Badge, Card, PageHeader } from '../components/ui'
import { ORDER_STATUSES, orders, type Order, type OrderStatus } from '../data/mock'
import { STATUS_TONE } from '../lib/status'
import { cn, formatCurrency } from '../lib/utils'

type SortKey = 'id' | 'customer' | 'amount' | 'date' | 'status'
const PAGE_SIZE = 10

function exportCsv(rows: Order[]) {
  const header = ['Order', 'Customer', 'Email', 'Product', 'Amount', 'Status', 'Date']
  const body = rows.map((o) => [o.id, o.customer, o.email, o.product, o.amount.toFixed(2), o.status, o.date].map((v) => `"${v}"`).join(','))
  const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'aurora-orders.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Orders() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<OrderStatus | 'All'>('All')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [detail, setDetail] = useState<Order | null>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length }
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1
    return c
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = orders.filter(
      (o) => (status === 'All' || o.status === status) && (!q || [o.id, o.customer, o.email, o.product].some((f) => f.toLowerCase().includes(q))),
    )
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      return (typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))) * dir
    })
  }, [query, status, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r.id))

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }))
  const toggleRow = (id: string) =>
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const togglePage = () =>
    setSelected((s) => {
      const n = new Set(s)
      rows.forEach((r) => (allOnPage ? n.delete(r.id) : n.add(r.id)))
      return n
    })

  const SortHead = ({ k, label, right }: { k: SortKey; label: string; right?: boolean }) => (
    <th className={cn('px-4 py-3 font-medium', right && 'text-right')}>
      <button onClick={() => toggleSort(k)} className={cn('inline-flex items-center gap-1 uppercase tracking-wider transition hover:text-fg', sort.key === k && 'text-fg')}>
        {label}
        {sort.key === k ? sort.dir === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-50" />}
      </button>
    </th>
  )

  return (
    <>
      <PageHeader
        eyebrow="Commerce"
        title="Orders"
        description="Search, filter, sort and export every transaction in one place."
        actions={
          <>
            <button className="btn-ghost" onClick={() => exportCsv(selected.size ? filtered.filter((o) => selected.has(o.id)) : filtered)}>
              <Download className="size-4" /> Export CSV
            </button>
            <button className="btn-primary">
              <Plus className="size-4" /> New order
            </button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex gap-1 overflow-x-auto">
            {(['All', ...ORDER_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s)
                  setPage(1)
                }}
                className={cn('relative shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition', status === s ? 'text-fg' : 'text-muted hover:text-fg')}
              >
                {status === s && <motion.span layoutId="status-tab" className="absolute inset-0 rounded-lg bg-surface-2" style={{ border: '1px solid var(--border)' }} />}
                <span className="relative">
                  {s} <span className="ml-1 text-subtle">{counts[s] ?? 0}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Search orders, customers…"
                className="input pl-9"
              />
            </div>
            <button className="btn-ghost px-3" aria-label="Filters">
              <Filter className="size-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex items-center gap-3 bg-accent/10 px-4 py-2.5 text-sm">
                <span className="font-medium text-accent">{selected.size} selected</span>
                <button className="text-xs text-muted hover:text-fg" onClick={() => setSelected(new Set())}>
                  Clear
                </button>
                <button className="btn-ghost ml-auto py-1 text-xs">Mark as shipped</button>
                <button className="btn-ghost py-1 text-xs text-danger">Refund</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="text-left text-[11px] text-subtle">
                <th className="w-10 py-3 pl-4">
                  <input type="checkbox" checked={allOnPage} onChange={togglePage} className="size-4 accent-[var(--accent)]" aria-label="Select page" />
                </th>
                <SortHead k="id" label="Order" />
                <SortHead k="customer" label="Customer" />
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Product</th>
                <SortHead k="date" label="Date" />
                <SortHead k="status" label="Status" />
                <SortHead k="amount" label="Amount" right />
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setDetail(o)}
                  className={cn('cursor-pointer transition-colors hover:bg-surface-2', selected.has(o.id) && 'bg-accent/[0.06]')}
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <td className="py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleRow(o.id)} className="size-4 accent-[var(--accent)]" aria-label={`Select ${o.id}`} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={o.customer} hue={o.avatarHue} size={30} />
                      <div className="leading-tight">
                        <p className="font-medium">{o.customer}</p>
                        <p className="text-[11px] text-subtle">{o.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{o.product}</td>
                  <td className="px-4 py-3 text-muted">{new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[o.status]} dot>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">{formatCurrency(o.amount)}</td>
                  <td className="pr-4">
                    <MoreHorizontal className="size-4 text-subtle" />
                  </td>
                </motion.tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm text-muted">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 text-xs text-muted sm:flex-row" style={{ borderTop: '1px solid var(--border)' }}>
          <p>
            Showing <span className="font-medium text-fg">{filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0}</span>–
            <span className="font-medium text-fg">{Math.min(current * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium text-fg">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button className="btn-ghost p-1.5" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={cn('size-8 rounded-lg text-xs font-medium transition', p === current ? 'bg-accent text-white' : 'hover:bg-surface-2')}>
                {p}
              </button>
            ))}
            <button className="btn-ghost p-1.5" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next page">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Detail drawer */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface-solid"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p className="font-mono text-xs text-subtle">{detail.id}</p>
                  <h2 className="font-display text-lg font-semibold">Order details</h2>
                </div>
                <button onClick={() => setDetail(null)} className="btn-ghost p-2" aria-label="Close">
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                <div className="flex items-center gap-4">
                  <Avatar name={detail.customer} hue={detail.avatarHue} size={52} />
                  <div>
                    <p className="font-medium">{detail.customer}</p>
                    <p className="text-sm text-muted">{detail.email}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge tone={STATUS_TONE[detail.status]} dot>
                      {detail.status}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-2xl bg-surface-2 p-4" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{detail.product}</span>
                    <span className="font-mono">{formatCurrency(detail.amount)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted">Tax (8%)</span>
                    <span className="font-mono">{formatCurrency(detail.amount * 0.08)}</span>
                  </div>
                  <div className="mt-3 flex justify-between pt-3 font-medium" style={{ borderTop: '1px dashed var(--border-strong)' }}>
                    <span>Total</span>
                    <span className="font-mono text-gradient">{formatCurrency(detail.amount * 1.08)}</span>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">Timeline</p>
                  <ol className="space-y-4">
                    {['Order placed', 'Payment confirmed', 'Processing', 'Shipped'].map((step, i) => {
                      const done = i < (detail.status === 'Pending' ? 1 : detail.status === 'Shipped' ? 4 : 2)
                      return (
                        <li key={step} className="flex items-center gap-3 text-sm">
                          <span className={cn('grid size-6 place-items-center rounded-full text-[10px] font-bold', done ? 'bg-accent text-white' : 'bg-surface-2 text-subtle')}>{i + 1}</span>
                          <span className={done ? '' : 'text-subtle'}>{step}</span>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </div>
              <div className="flex gap-2 p-5" style={{ borderTop: '1px solid var(--border)' }}>
                <button className="btn-ghost flex-1">Download invoice</button>
                <button className="btn-primary flex-1">Contact customer</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
