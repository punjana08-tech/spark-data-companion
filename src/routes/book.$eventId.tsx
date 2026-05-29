import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Calendar, MapPin } from "lucide-react";
import { EVENTS } from "@/lib/catalog";
import { fmtCur } from "@/components/ui-bits";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/book/$eventId")({
  head: () => ({ meta: [{ title: "Choose Seats · EventSphereX" }] }),
  component: ChooseSeats,
});

function ChooseSeats() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { session } = useAuth();
  const event = EVENTS.find((e) => e.id === eventId);
  const [zone, setZone] = useState(event?.zones[0].name ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const zoneData = useMemo(() => event?.zones.find((z) => z.name === zone), [event, zone]);

  if (!event) return <div className="p-10 text-center text-muted-foreground">Event not found. <Link to="/book" className="text-primary">Back</Link></div>;

  // Build a 8 x 10 seat grid; mark some as taken pseudo-randomly per zone
  const rows = 8;
  const cols = 10;
  const seats = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const id = `${String.fromCharCode(65 + r)}${c + 1}`;
      const hash = (r * 31 + c * 7 + zone.length * 13) % 11;
      const taken = hash === 0 || hash === 3;
      return { id, taken };
    }),
  );

  const toggle = (id: string, taken: boolean) => {
    if (taken) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const total = (zoneData?.price ?? 0) * selected.size;

  const addToCart = () => {
    if (!session) { navigate({ to: "/login" }); return; }
    if (!zoneData || selected.size === 0) return;
    add({
      id: `${event.id}-${zone}-${[...selected].sort().join(",")}`,
      kind: "ticket",
      name: event.name,
      detail: `${zone} · Seats ${[...selected].sort().join(", ")}`,
      price: zoneData.price,
      qty: selected.size,
    });
    navigate({ to: "/checkout" });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Link to="/book" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-3" /> All events
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-5 flex gap-4 items-start border border-border/60">
            <div className="size-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center text-3xl">{event.poster}</div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{event.category}</div>
              <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
              <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-3">
                <span className="flex items-center gap-1"><Calendar className="size-3" /> {event.date}</span>
                <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.venue}</span>
              </div>
            </div>
          </motion.div>

          <div className="glass rounded-2xl p-6 border border-border/60">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Choose a zone</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {event.zones.map((z) => (
                <button
                  key={z.name}
                  onClick={() => { setZone(z.name); setSelected(new Set()); }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    zone === z.name ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-xs font-medium">{z.name}</div>
                  <div className="text-sm font-mono font-bold text-primary mt-1">{fmtCur(z.price)}</div>
                  <div className="text-[10px] text-muted-foreground">{z.available} left</div>
                </button>
              ))}
            </div>

            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Select seats — {zone}</div>
            <div className="bg-secondary/40 rounded-xl p-5">
              <div className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 py-1.5 bg-background/40 rounded">STAGE</div>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {seats.flat().map((s) => {
                  const sel = selected.has(s.id);
                  return (
                    <button
                      key={s.id}
                      disabled={s.taken}
                      onClick={() => toggle(s.id, s.taken)}
                      title={s.id}
                      className={`aspect-square rounded text-[9px] font-mono transition-all ${
                        s.taken
                          ? "bg-muted/40 text-muted-foreground cursor-not-allowed"
                          : sel
                          ? "bg-primary text-primary-foreground scale-110 glow-mint"
                          : "bg-background/60 hover:bg-primary/30 border border-border"
                      }`}
                    >
                      {s.id}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4 justify-center mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-background/60 border border-border" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-primary" /> Selected</span>
                <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-muted/40" /> Taken</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="glass rounded-2xl p-6 border border-primary/30 h-fit sticky top-20">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Your selection</div>
          <div className="text-lg font-bold mb-1">{zone}</div>
          <div className="text-xs text-muted-foreground mb-4">{fmtCur(zoneData?.price ?? 0)} per seat</div>
          {selected.size > 0 ? (
            <div className="text-xs font-mono bg-background/40 rounded p-3 mb-4 break-words">
              {[...selected].sort().join(", ")}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground mb-4">Pick one or more seats on the chart.</div>
          )}
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Seats</span><span className="font-mono">{selected.size}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span><span className="font-mono text-primary">{fmtCur(total)}</span>
          </div>
          <button
            disabled={selected.size === 0}
            onClick={addToCart}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="size-4" /> Add & Checkout
          </button>
          <Link to="/shop" className="block text-center mt-3 text-xs text-muted-foreground hover:text-foreground">
            Or add food & merch first →
          </Link>
        </aside>
      </div>
    </div>
  );
}
