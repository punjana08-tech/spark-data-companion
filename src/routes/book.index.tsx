import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Ticket } from "lucide-react";
import { EVENTS } from "@/lib/catalog";
import { fmtCur } from "@/components/ui-bits";

export const Route = createFileRoute("/book/")({
  head: () => ({ meta: [{ title: "Book Tickets · EventSphereX" }] }),
  component: BrowseEvents,
});

function BrowseEvents() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="text-xs uppercase tracking-[0.22em] text-primary mb-2 flex items-center gap-2">
          <Ticket className="size-3.5" /> Fan Portal
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Upcoming Events</h1>
        <p className="text-muted-foreground mt-2">Pick an event to choose your seats and zone.</p>
      </motion.header>

      <div className="grid md:grid-cols-2 gap-5">
        {EVENTS.map((e, i) => {
          const minPrice = Math.min(...e.zones.map((z) => z.price));
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-all flex gap-4"
            >
              <div className="size-20 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center text-4xl shrink-0">
                {e.poster}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{e.category}</div>
                <h2 className="font-bold tracking-tight text-lg leading-tight">{e.name}</h2>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div className="flex items-center gap-1.5"><Calendar className="size-3" /> {e.date}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="size-3" /> {e.venue}</div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground text-xs">from </span>
                    <span className="font-mono font-bold text-primary">{fmtCur(minPrice)}</span>
                  </div>
                  <Link
                    to="/book/$eventId"
                    params={{ eventId: e.id }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
                  >
                    Book seats <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
