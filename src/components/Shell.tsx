import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Activity, Ticket, Users, CreditCard, DoorOpen, UtensilsCrossed, Smartphone, AlertTriangle, Radio } from "lucide-react";

const nav = [
  { to: "/", label: "Command", icon: Activity },
  { to: "/ticketing", label: "Ticketing", icon: Ticket },
  { to: "/crowd", label: "Crowd", icon: Users },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/gates", label: "Gates", icon: DoorOpen },
  { to: "/food", label: "Food & Retail", icon: UtensilsCrossed },
  { to: "/app", label: "Fan App", icon: Smartphone },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle },
] as const;

export function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-border/60 glass p-5 flex flex-col gap-1 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-mint">
            <Radio className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">EventSphereX</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Live Ops · v1</div>
          </div>
        </div>
        {nav.map((n) => {
          const active = pathname === n.to;
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <Icon className="size-4" />
              {n.label}
            </Link>
          );
        })}
        <div className="mt-auto text-[10px] text-muted-foreground px-2 leading-relaxed">
          MastersCampus Hackathon 2026 · Real-time event intelligence
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
