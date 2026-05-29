import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Activity, Ticket, Users, CreditCard, DoorOpen, UtensilsCrossed, Smartphone, AlertTriangle, Radio, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/crew", label: "Command", icon: Activity },
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
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session || session.role !== "crew") {
      navigate({ to: "/crew/login", search: { redirect: pathname } as any, replace: true });
    }
  }, [session, navigate, pathname]);

  if (!session || session.role !== "crew") {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Redirecting to crew login…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-border/60 glass p-5 flex flex-col gap-1 sticky top-0 h-screen">
        <Link to="/crew" className="flex items-center gap-2 mb-8 px-2">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-mint">
            <Radio className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">EventSphereX</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Live Ops · Crew</div>
          </div>
        </Link>
        {nav.map((n) => {
          const active = pathname === n.to;
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <Icon className="size-4" />
              {n.label}
            </Link>
          );
        })}
        <div className="mt-auto pt-4 border-t border-border/40 space-y-2">
          <div className="flex items-center gap-2 px-2 text-xs">
            <Shield className="size-3.5 text-primary" />
            <div>
              <div className="font-medium text-foreground">{session.name}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Crew · {session.email}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate({ to: "/crew/login", replace: true }); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
