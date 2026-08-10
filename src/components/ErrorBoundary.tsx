import { Component, ReactNode, ErrorInfo } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null; info: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: "" };

  static getDerivedStateFromError(error: Error) {
    return { error, info: "" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info.componentStack);
    this.setState({ info: info.componentStack ?? "" });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", background: "#08111f", color: "#e2e8f5",
          fontFamily: "monospace", padding: 24, whiteSpace: "pre-wrap",
        }}>
          <h2 style={{ color: "#ef4444", marginBottom: 12 }}>Render error</h2>
          <div style={{ color: "#f87171", marginBottom: 16, fontWeight: 700 }}>
            {this.state.error.name}: {this.state.error.message}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
            {this.state.error.stack}
          </div>
          <div style={{ fontSize: 11, color: "#475569" }}>
            {this.state.info}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}