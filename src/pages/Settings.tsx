import { motion } from 'framer-motion'
import { Bell, Check, Globe, Lock, Monitor, Moon, Palette, Sun, User } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Card, CardHeader, GithubIcon, PageHeader } from '../components/ui'
import { ACCENTS, useTheme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-accent' : 'bg-surface-2')}
      style={{ border: '1px solid var(--border)' }}
    >
      <motion.span layout transition={{ type: 'spring', bounce: 0.3, duration: 0.35 }} className={cn('absolute top-0.5 size-[18px] rounded-full bg-white shadow', checked ? 'right-0.5' : 'left-0.5')} />
    </button>
  )
}

const TABS = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
] as const
type TabId = (typeof TABS)[number]['id']

export default function Settings() {
  const { theme, toggleTheme, accent, setAccent } = useTheme()
  const [tab, setTab] = useState<TabId>('appearance')
  const [prefs, setPrefs] = useState({ email: true, push: true, weekly: false, mentions: true, twoFactor: true, sessions: false })
  const [saved, setSaved] = useState(false)
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }))

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Personalise your workspace. Theme choices are saved in your browser."
        actions={
          <button className="btn-primary min-w-28" onClick={save}>
            {saved ? (
              <>
                <Check className="size-4" /> Saved
              </>
            ) : (
              'Save changes'
            )}
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit p-2">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={cn('relative flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition', tab === t.id ? 'text-fg' : 'text-muted hover:text-fg')}>
                {tab === t.id && <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-xl bg-accent/12" />}
                <t.icon className={cn('relative size-4', tab === t.id && 'text-accent')} />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
          {tab === 'appearance' && (
            <>
              <Card className="p-5">
                <CardHeader title="Theme" subtitle="Choose how Aurora looks to you" />
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      ['dark', 'Dark', Moon],
                      ['light', 'Light', Sun],
                    ] as const
                  ).map(([id, label, Icon]) => (
                    <button
                      key={id}
                      onClick={() => theme !== id && toggleTheme()}
                      className={cn('overflow-hidden rounded-2xl text-left transition', theme === id ? 'ring-2 ring-accent' : 'hover:ring-1 hover:ring-line-strong')}
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <div className={cn('flex h-24 gap-2 p-3', id === 'dark' ? 'bg-[#0c0c16]' : 'bg-[#eef0f7]')}>
                        <div className={cn('w-1/4 rounded-lg', id === 'dark' ? 'bg-white/5' : 'bg-white')} />
                        <div className="flex flex-1 flex-col gap-2">
                          <div className={cn('h-3 w-2/3 rounded', id === 'dark' ? 'bg-white/10' : 'bg-white')} />
                          <div className="flex-1 rounded-lg bg-gradient-to-br from-accent/60 to-accent-2/40" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium">
                        <Icon className="size-4" /> {label}
                        {theme === id && <Check className="ml-auto size-4 text-accent" />}
                      </div>
                    </button>
                  ))}
                  <div className="grid place-items-center rounded-2xl p-4 text-center text-xs text-muted" style={{ border: '1px dashed var(--border-strong)' }}>
                    <div>
                      <Monitor className="mx-auto mb-2 size-5" />
                      Tip: press <span className="kbd">⇧ D</span> anywhere to toggle
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <CardHeader title="Accent color" subtitle="Applied to charts, buttons and highlights in real time" />
                <div className="mt-5 flex flex-wrap gap-3">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAccent(a.id)}
                      className={cn('group flex items-center gap-3 rounded-2xl py-2 pl-2 pr-4 text-sm font-medium transition', accent === a.id ? 'bg-surface-2 ring-2 ring-accent' : 'hover:bg-surface-2')}
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <span className="relative grid size-8 place-items-center rounded-xl" style={{ background: `linear-gradient(135deg, ${a.colors[0]}, ${a.colors[1]})` }}>
                        {accent === a.id && <Check className="size-4 text-white" />}
                      </span>
                      {a.label}
                    </button>
                  ))}
                </div>
              </Card>
            </>
          )}

          {tab === 'profile' && (
            <Card className="p-5">
              <CardHeader title="Profile" subtitle="This is how others see you" />
              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar name="Balakrishna Undela" hue={258} size={72} />
                <div>
                  <p className="font-display text-lg font-semibold">Balakrishna Undela</p>
                  <p className="text-sm text-muted">Full-Stack Developer · Super Admin</p>
                  <a href="https://github.com/balakrishna-dev" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent hover:underline">
                    <GithubIcon className="size-3.5" /> github.com/balakrishna-dev
                  </a>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ['Full name', 'Balakrishna Undela'],
                  ['Username', 'balakrishna-dev'],
                  ['Role', 'Super Admin'],
                  ['Location', 'Hyderabad, India'],
                ].map(([label, value]) => (
                  <label key={label} className="block">
                    <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
                    <input defaultValue={value} className="input" />
                  </label>
                ))}
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-muted">Bio</span>
                  <textarea rows={3} defaultValue="Building delightful, data-rich interfaces with React & TypeScript." className="input resize-none" />
                </label>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card className="divide-y divide-line">
              {(
                [
                  ['email', 'Email notifications', 'Receive order and account updates by email'],
                  ['push', 'Push notifications', 'Get realtime alerts in your browser'],
                  ['weekly', 'Weekly digest', 'A summary of key metrics every Monday'],
                  ['mentions', 'Mentions', 'Notify me when someone @mentions me'],
                ] as const
              ).map(([k, title, desc]) => (
                <div key={k} className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                  <Toggle checked={prefs[k]} onChange={set(k)} label={title} />
                </div>
              ))}
            </Card>
          )}

          {tab === 'security' && (
            <>
              <Card className="divide-y divide-line">
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted">Add an extra layer of security to your account</p>
                  </div>
                  <Toggle checked={prefs.twoFactor} onChange={set('twoFactor')} label="Two-factor authentication" />
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-medium">Sign out other sessions</p>
                    <p className="text-xs text-muted">Automatically end sessions inactive for 30 days</p>
                  </div>
                  <Toggle checked={prefs.sessions} onChange={set('sessions')} label="Sign out other sessions" />
                </div>
              </Card>
              <Card className="p-5">
                <CardHeader title="Active sessions" subtitle="Devices currently signed in" />
                <ul className="mt-4 space-y-2">
                  {[
                    ['MacBook Pro · Chrome', 'Hyderabad, IN', 'Current'],
                    ['iPhone 16 · Safari', 'Hyderabad, IN', '2h ago'],
                    ['Windows · Edge', 'Bengaluru, IN', '3d ago'],
                  ].map(([d, l, t]) => (
                    <li key={d} className="flex items-center gap-3 rounded-xl bg-surface-2 p-3 text-sm">
                      <Globe className="size-4 text-subtle" />
                      <div className="flex-1">
                        <p className="font-medium">{d}</p>
                        <p className="text-xs text-subtle">{l}</p>
                      </div>
                      <span className={cn('text-xs', t === 'Current' ? 'text-success' : 'text-subtle')}>{t}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}
