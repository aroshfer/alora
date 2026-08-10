import { Suspense } from "react";
import type { ReactNode } from "react";

function PageFallback() {
  return (
    <div className="route-loader">
      <div className="route-loader-spinner" />
      <span>Loading…</span>
    </div>
  );
}

export function RouteLoader({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}
