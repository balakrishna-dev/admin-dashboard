import { AnimatePresence, motion } from 'framer-motion'
import { GripVertical, MessageSquare, Plus } from 'lucide-react'
import { useState, type DragEvent } from 'react'
import { AvatarStack, Badge, PageHeader, type Tone } from '../components/ui'
import { initialTasks, kanbanColumns, type KanbanColumnId, type Task } from '../data/mock'
import { cn } from '../lib/utils'

const PRIORITY_TONE: Record<Task['priority'], Tone> = { High: 'danger', Medium: 'warning', Low: 'neutral' }
const COLUMN_COLOR: Record<KanbanColumnId, string> = {
  backlog: 'var(--subtle)',
  progress: 'var(--accent)',
  review: 'var(--warning)',
  done: 'var(--success)',
}

export default function Projects() {
  const [tasks, setTasks] = useState(initialTasks)
  const [dragging, setDragging] = useState<{ id: string; from: KanbanColumnId } | null>(null)
  const [over, setOver] = useState<KanbanColumnId | null>(null)
  const [draft, setDraft] = useState<{ col: KanbanColumnId; text: string } | null>(null)

  const total = Object.values(tasks).flat().length
  const done = tasks.done.length

  const onDrop = (e: DragEvent, to: KanbanColumnId) => {
    e.preventDefault()
    setOver(null)
    if (!dragging || dragging.from === to) return setDragging(null)
    setTasks((t) => {
      const task = t[dragging.from].find((x) => x.id === dragging.id)
      if (!task) return t
      return {
        ...t,
        [dragging.from]: t[dragging.from].filter((x) => x.id !== dragging.id),
        [to]: [{ ...task, progress: to === 'done' ? 100 : task.progress }, ...t[to]],
      }
    })
    setDragging(null)
  }

  const addTask = () => {
    if (!draft?.text.trim()) return setDraft(null)
    const task: Task = { id: `t${Date.now()}`, title: draft.text.trim(), tag: 'New', priority: 'Medium', assignees: [258], comments: 0, progress: 0 }
    setTasks((t) => ({ ...t, [draft.col]: [task, ...t[draft.col]] }))
    setDraft(null)
  }

  return (
    <>
      <PageHeader
        eyebrow="Sprint 24 · Oct 14 – Oct 28"
        title="Projects"
        description="Drag cards between columns to update their status."
        actions={
          <div className="glass flex items-center gap-3 rounded-xl px-4 py-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-2">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-accent to-success" animate={{ width: `${(done / total) * 100}%` }} transition={{ type: 'spring', bounce: 0.2 }} />
            </div>
            <span className="text-xs text-muted">
              <span className="font-semibold text-fg">{done}</span>/{total} done
            </span>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kanbanColumns.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault()
              setOver(col.id)
            }}
            onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
            onDrop={(e) => onDrop(e, col.id)}
            className={cn('glass flex min-h-[420px] flex-col rounded-2xl p-3 transition-all', over === col.id && 'ring-2 ring-accent/60')}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: COLUMN_COLOR[col.id], boxShadow: `0 0 10px ${COLUMN_COLOR[col.id]}` }} />
                <h3 className="font-display text-sm font-semibold">{col.title}</h3>
                <span className="rounded-md bg-surface-2 px-1.5 text-[11px] text-muted">{tasks[col.id].length}</span>
              </div>
              <button onClick={() => setDraft({ col: col.id, text: '' })} className="rounded-lg p-1 text-subtle transition hover:bg-surface-2 hover:text-fg" aria-label={`Add task to ${col.title}`}>
                <Plus className="size-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2.5">
              {draft?.col === col.id && (
                <input
                  autoFocus
                  value={draft.text}
                  onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addTask()
                    if (e.key === 'Escape') setDraft(null)
                  }}
                  onBlur={addTask}
                  placeholder="Task title, then Enter"
                  className="input"
                />
              )}
              <AnimatePresence initial={false}>
                {tasks[col.id].map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    layoutId={t.id}
                    initial={false}
                    animate={{ opacity: dragging?.id === t.id ? 0.4 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  >
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move'
                        setDragging({ id: t.id, from: col.id })
                      }}
                      onDragEnd={() => {
                        setDragging(null)
                        setOver(null)
                      }}
                      className="group cursor-grab rounded-xl bg-surface-solid p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge tone="accent">{t.tag}</Badge>
                          <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge>
                        </div>
                        <GripVertical className="size-4 text-subtle opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <p className="mt-2.5 text-sm font-medium leading-snug">{t.title}</p>
                      {t.progress > 0 && (
                        <div className="mt-3">
                          <div className="mb-1 flex justify-between text-[10px] text-subtle">
                            <span>Progress</span>
                            <span>{t.progress}%</span>
                          </div>
                          <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2" style={{ width: `${t.progress}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <AvatarStack hues={t.assignees} size={22} />
                        <span className="flex items-center gap-1 text-[11px] text-subtle">
                          <MessageSquare className="size-3" /> {t.comments}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks[col.id].length === 0 && (
                <div className="grid flex-1 place-items-center rounded-xl text-xs text-subtle" style={{ border: '1px dashed var(--border-strong)' }}>
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
