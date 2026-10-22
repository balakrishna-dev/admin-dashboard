import { AlertTriangle, RotateCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  error: Error | null
}

/** Shows a friendly recovery card instead of unmounting the whole app on a render error. */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Aurora render error:', error, info.componentStack)
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    // Navigating to another page clears the error.
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div className="card mx-auto mt-10 max-w-lg p-6 text-center">
        <AlertTriangle className="mx-auto size-8 text-warning" />
        <h2 className="mt-3 font-display text-lg font-semibold">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted">This page failed to render. Reloading usually fixes it.</p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-surface-2 p-3 text-left font-mono text-[11px] text-subtle">{error.message}</pre>
        <button className="btn-primary mt-5" onClick={() => window.location.reload()}>
          <RotateCw className="size-4" /> Reload
        </button>
      </div>
    )
  }
}
