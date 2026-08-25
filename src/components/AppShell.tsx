import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AppShell({
  children,
  showNav = true,
}: {
  children: ReactNode;
  showNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-dream">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-14 pt-5 sm:max-w-lg">
        {showNav && (
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-4">
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-warm text-base"
                aria-hidden="true"
              >
                💛
              </span>
              <span className="truncate font-display text-lg font-bold">The Us Game</span>
            </Link>
            <span className="shrink-0 rounded-full border border-border bg-card/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Prototype
            </span>
          </header>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
