import { Component, type ReactNode } from "react";
export class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-md px-6 py-20 text-center">
        <img
          src="/re-logo.svg"
          alt="R&E Urban Style"
          width="120"
          height="60"
          className="mx-auto mb-8"
        />
        <h1 className="text-2xl font-medium">Volvamos a intentarlo.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          No pudimos abrir esta página. Recargala para continuar.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 min-h-12 rounded-full bg-black px-7 text-sm text-white"
        >
          Reintentar
        </button>
        <a href="/" className="mt-5 block text-sm underline">
          Volver a la tienda
        </a>
      </div>
    );
  }
}
