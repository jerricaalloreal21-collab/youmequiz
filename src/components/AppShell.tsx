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
              <span className="relative grid h-9 w-9 shrink-0 place-items-center" aria-hidden="true">
                <span className="absolute left-0 size-6 rounded-full bg-warm opacity-95" />
                <span className="absolute right-0 size-6 rounded-full bg-accent opacity-70 mix-blend-screen" />
              </span>
              <span className="truncate font-display text-lg font-extrabold tracking-tight">
                YouMe<span className="text-primary">Quiz</span>
              </span>
            </Link>
            <span className="shrink-0 rounded-full border border-border bg-card/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Beta
            </span>
          </header>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
