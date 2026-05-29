import { Link, useRouterState } from "@tanstack/react-router";
import { Radio, Ticket, UtensilsCrossed, ShoppingCart, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

export function PortalNav() {
  const { session, logout } = useAuth();
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const link = (to: string, label: string, Icon: any) => {
    const active = pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
          active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
        }`}
      >
        <Icon className="size-4" />
        {label}
      </Link>
    );
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-mint">
            <Radio className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">EventSphereX</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Fan Portal</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {link("/book", "Book Tickets", Ticket)}
          {link("/shop", "Food & Retail", UtensilsCrossed)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/checkout"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-secondary/60 hover:bg-secondary"
          >
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 size-5 grid place-items-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          {session ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-secondary/40">
                <User className="size-4" />
                <span className="hidden sm:inline">{session.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
