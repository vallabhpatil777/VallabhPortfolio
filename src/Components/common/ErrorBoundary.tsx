import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Rendered instead of the children when the subtree throws. */
  fallback?: ReactNode
  /** Label used in the console entry, to identify which subtree failed. */
  label?: string
}

type State = { hasError: boolean }

/**
 * Keeps one failing widget (the 3D avatar, the chat client) from blanking the
 * whole portfolio — the rest of the page renders normally.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label ?? 'ErrorBoundary'}]`, error, info.componentStack)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
