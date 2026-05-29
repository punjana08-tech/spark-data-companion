import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Ticket, UtensilsCrossed, Shield, Radio, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventSphereX · Live Event Intelligence" },
      { name: "description", content: "Book tickets, order food and merch, or sign in as crew for live ops dashboards." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs uppercase tracking-widest text-primary mb-6">
            <Sparkles className="size-3" /> MastersCampus Hackathon 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gradient leading-tight">
            EventSphereX
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            One platform for fans to book seats, order food and merch — and for crew to run the entire show in real time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 border border-primary/30 relative overflow-hidden group"
          >
            <div className="absolute -top-12 -right-12 size-40 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />
            <div className="size-12 rounded-xl bg-primary/15 grid place-items-center mb-5">
              <Ticket className="size-6 text-primary" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary mb-2">Fan Portal</div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">Book Tickets & Order</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Browse upcoming events, pick your seats, and pre-order food, beverages or merch. Pay with UPI, card, net banking or wallet.
            </p>
            <div className="flex flex-wrap gap-2 mb-6 text-[11px]">
              {["UPI", "Cards", "Net Banking", "Wallets"].map((p) => (
                <span key={p} className="px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground">{p}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/login" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm">
                Sign in <ArrowRight className="size-4" />
              </Link>
              <Link to="/book" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-secondary/60">
                Browse events
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-8 border border-accent/30 relative overflow-hidden group"
          >
            <div className="absolute -top-12 -right-12 size-40 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/20 transition-all" />
            <div className="size-12 rounded-xl bg-accent/15 grid place-items-center mb-5">
              <Shield className="size-6 text-accent" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent mb-2">Crew Login</div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">Live Operations Console</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Real-time dashboards for ticketing, crowd density, payments, gate flow, food, app health and incident response.
            </p>
            <div className="flex flex-wrap gap-2 mb-6 text-[11px]">
              {["8 Dashboards", "Live Heatmap", "Incident Stream"].map((p) => (
                <span key={p} className="px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground">{p}</span>
              ))}
            </div>
            <Link to="/crew/login" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm">
              <Radio className="size-4" /> Crew Sign in
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
