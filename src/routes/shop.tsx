import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/catalog";
import { fmtCur } from "@/components/ui-bits";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Food, Beverages & Merch · EventSphereX" }] }),
  component: Shop,
});

const TABS: { id: Product["kind"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "food", label: "🍔 Food" },
  { id: "beverage", label: "🥤 Beverages" },
  { id: "merch", label: "👕 Merchandise" },
];

function Shop() {
  const { add, count, total } = useCart();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const items = tab === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.kind === tab);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="text-xs uppercase tracking-[0.22em] text-primary mb-2 flex items-center gap-2">
          <UtensilsCrossed className="size-3.5" /> Concessions & Retail
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Order from your seat</h1>
        <p className="text-muted-foreground mt-2">Pre-order food, beverages and event merchandise. Pay with UPI, card, net banking or wallet at checkout.</p>
      </motion.header>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              tab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-all"
          >
            <div className="text-5xl mb-3">{p.emoji}</div>
            <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{p.kind}</div>
            <h3 className="font-semibold tracking-tight">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{p.desc}</p>
            <div className="flex items-center justify-between">
              <div className="font-mono font-bold text-primary">{fmtCur(p.price)}</div>
              <button
                onClick={() => add({ id: p.id, kind: p.kind, name: p.name, price: p.price, qty: 1 })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
              >
                <Plus className="size-3" /> Add
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {count > 0 && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 glass border border-primary/40 rounded-full pl-5 pr-2 py-2 flex items-center gap-4 shadow-xl glow-mint"
        >
          <div className="text-sm">
            <span className="text-muted-foreground">{count} items · </span>
            <span className="font-mono font-bold text-primary">{fmtCur(total)}</span>
          </div>
          <Link to="/checkout" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            <ShoppingCart className="size-4" /> Checkout
          </Link>
        </motion.div>
      )}
    </div>
  );
}
