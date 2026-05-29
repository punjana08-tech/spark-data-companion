import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Ticket } from "lucide-react";
import { fmtCur } from "@/components/ui-bits";
import type { CartItem } from "@/lib/cart";

type Order = {
  orderId: string;
  items: CartItem[];
  total: number;
  fees: number;
  grand: number;
  method: string;
  when: string;
};

export const Route = createFileRoute("/checkout/success")({
  head: () => ({ meta: [{ title: "Order Confirmed · EventSphereX" }] }),
  component: Success,
});

function Success() {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("esx.lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-muted-foreground">No recent order found.</p>
        <Link to="/book" className="text-primary text-sm mt-3 inline-block">Browse events →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-8">
        <div className="size-20 rounded-full bg-primary/15 border border-primary/40 grid place-items-center mx-auto mb-4 glow-mint">
          <CheckCircle2 className="size-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gradient">Payment successful</h1>
        <p className="text-muted-foreground text-sm mt-2">A confirmation has been sent to your email.</p>
      </motion.div>

      <div className="glass rounded-2xl p-6 border border-primary/30">
        <div className="flex justify-between items-start mb-5 pb-4 border-b border-border/40">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Order ID</div>
            <div className="font-mono font-bold">{order.orderId}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Paid via</div>
            <div className="font-medium capitalize">{order.method === "upi" ? "UPI" : order.method}</div>
          </div>
        </div>

        <ul className="divide-y divide-border/40 mb-5">
          {order.items.map((it) => (
            <li key={it.id} className="py-3 flex items-start gap-3">
              <Ticket className="size-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{it.name}</div>
                {it.detail && <div className="text-xs text-muted-foreground">{it.detail}</div>}
                <div className="text-[10px] uppercase tracking-widest text-accent mt-1">{it.kind} · ×{it.qty}</div>
              </div>
              <div className="font-mono font-bold text-sm">{fmtCur(it.price * it.qty)}</div>
            </li>
          ))}
        </ul>

        <div className="space-y-1.5 text-sm border-t border-border/40 pt-4">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">{fmtCur(order.total)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Fees</span><span className="font-mono">{fmtCur(order.fees)}</span></div>
          <div className="flex justify-between text-lg font-bold pt-2"><span>Paid</span><span className="font-mono text-primary">{fmtCur(order.grand)}</span></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-secondary/60">
            <Download className="size-4" /> Save receipt
          </button>
          <Link to="/book" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Book another event
          </Link>
        </div>
      </div>
    </div>
  );
}
