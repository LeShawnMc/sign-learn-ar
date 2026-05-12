import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Always log to console so DevTools shows the real error
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            padding: '2rem',
            textAlign: 'center',
            background: '#0F0F23',
            color: '#F8FAFC',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#F8FAFC' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '1.5rem', maxWidth: 320 }}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              background: '#4169E1',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '1.5rem' }}>
            Open DevTools → Console for full details
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
