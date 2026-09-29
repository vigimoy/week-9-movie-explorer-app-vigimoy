import { Component, type ReactNode } from 'react';
import { Button } from './ui/button';
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="error-state"><h1>Something went wrong</h1><p>Please reload the page to try again.</p><Button onClick={() => window.location.reload()}>Reload page</Button></div>;
    return this.props.children;
  }
}

