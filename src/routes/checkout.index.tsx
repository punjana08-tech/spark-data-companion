import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Lock, ShoppingCart, ArrowRight, Minus, Plus, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { fmtCur } from "@/components/ui-bits";
import { PAYMENT_METHODS } from "@/lib/catalog";

export const Route = createFileRoute("/checkout/")({
  head: () => ({ meta: [{ title: "Checkout · EventSphereX" }] }),
  component: Checkout,
});

const ICONS: Record<string, any> = { upi: Smartphone, card: CreditCard, netbanking: Building2, wallet: Wallet };

const UPI_APPS = ["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"];
const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Yes Bank", "Punjab National Bank", "IDFC First"];
const WALLETS = ["Paytm Wallet", "Amazon Pay", "Mobikwik", "Freecharge", "JioMoney"];

function Checkout() {
  const { items, total, count, remove, setQty, clear } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<string>("upi");
  const [processing, setProcessing] = useState(false);

  // Per-method form state
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState(UPI_APPS[0]);
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [bank, setBank] = useState(BANKS[0]);
  const [wallet, setWallet] = useState(WALLETS[0]);

  const fees = Math.round(total * 0.02);
  const grand = total + fees;

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { navigate({ to: "/login" }); return; }
    setProcessing(true);
    setTimeout(() => {
      const orderId = "ESX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const summary = { orderId, items, total, fees, grand, method, when: new Date().toISOString() };
      sessionStorage.setItem("esx.lastOrder", JSON.stringify(summary));
      clear();
      navigate({ to: "/checkout/success" });
    }, 1500);
  };

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <ShoppingCart className="size-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6 text-sm">Add tickets or items from the shop to continue.</p>
        <div className="flex gap-2 justify-center">
          <Link to="/book" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Browse events</Link>
          <Link to="/shop" className="px-4 py-2 rounded-lg border border-border text-sm">Browse shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="text-xs uppercase tracking-[0.22em] text-primary mb-2">Secure Checkout</div>
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Review & Pay</h1>
      </motion.header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* Cart items */}
          <section className="glass rounded-2xl p-6 border border-border/60">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><ShoppingCart className="size-4" /> Your order ({count})</h2>
            <ul className="divide-y divide-border/40">
              {items.map((it) => (
                <li key={it.id} className="py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-accent">{it.kind}</div>
                    <div className="font-medium text-sm">{it.name}</div>
                    {it.detail && <div className="text-xs text-muted-foreground mt-0.5">{it.detail}</div>}
                  </div>
                  {it.kind !== "ticket" ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => setQty(it.id, it.qty - 1)} className="size-7 rounded grid place-items-center bg-secondary/60 hover:bg-secondary"><Minus className="size-3" /></button>
                      <span className="w-6 text-center text-sm font-mono">{it.qty}</span>
                      <button onClick={() => setQty(it.id, it.qty + 1)} className="size-7 rounded grid place-items-center bg-secondary/60 hover:bg-secondary"><Plus className="size-3" /></button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">×{it.qty}</span>
                  )}
                  <div className="font-mono font-bold text-sm w-20 text-right">{fmtCur(it.price * it.qty)}</div>
                  <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="size-3.5" /></button>
                </li>
              ))}
            </ul>
          </section>

          {/* Payment method */}
          <section className="glass rounded-2xl p-6 border border-border/60">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Lock className="size-4" /> Payment method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {PAYMENT_METHODS.map((m) => {
                const Icon = ICONS[m.id];
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
                  >
                    <Icon className={`size-5 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-xs font-medium">{m.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{m.sub}</div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={pay} className="space-y-3">
              {method === "upi" && (
                <>
                  <Row label="Choose UPI app">
                    <div className="flex flex-wrap gap-2">
                      {UPI_APPS.map((a) => (
                        <button type="button" key={a} onClick={() => setUpiApp(a)} className={`px-3 py-1.5 rounded-full text-xs ${upiApp === a ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"}`}>{a}</button>
                      ))}
                    </div>
                  </Row>
                  <Row label="Or enter UPI ID">
                    <Input value={upiId} onChange={setUpiId} placeholder="yourname@okhdfcbank" />
                  </Row>
                </>
              )}
              {method === "card" && (
                <>
                  <Row label="Card number">
                    <Input value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="4242 4242 4242 4242" maxLength={19} />
                  </Row>
                  <Row label="Cardholder name">
                    <Input value={card.name} onChange={(v) => setCard({ ...card, name: v })} placeholder="As on card" />
                  </Row>
                  <div className="grid grid-cols-2 gap-3">
                    <Row label="Expiry">
                      <Input value={card.exp} onChange={(v) => setCard({ ...card, exp: v })} placeholder="MM/YY" />
                    </Row>
                    <Row label="CVV">
                      <Input value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v })} placeholder="•••" type="password" maxLength={4} />
                    </Row>
                  </div>
                </>
              )}
              {method === "netbanking" && (
                <Row label="Select your bank">
                  <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background/40 text-sm">
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Row>
              )}
              {method === "wallet" && (
                <Row label="Choose wallet">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {WALLETS.map((w) => (
                      <button type="button" key={w} onClick={() => setWallet(w)} className={`px-3 py-2 rounded-lg text-xs border ${wallet === w ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{w}</button>
                    ))}
                  </div>
                </Row>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50"
              >
                {processing ? "Processing payment…" : <>Pay {fmtCur(grand)} <ArrowRight className="size-4" /></>}
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                <Lock className="inline size-3 mr-1" /> 256-bit secure · This is a demo gateway — no real money is charged.
              </p>
            </form>
          </section>
        </div>

        <aside className="glass rounded-2xl p-6 border border-primary/30 h-fit sticky top-20">
          <h2 className="font-semibold mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <Line label="Subtotal" value={fmtCur(total)} />
            <Line label="Convenience fee (2%)" value={fmtCur(fees)} />
            <div className="border-t border-border/40 pt-3 mt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="font-mono text-primary">{fmtCur(grand)}</span>
              </div>
            </div>
          </div>
          {!session && (
            <div className="mt-4 text-xs text-warning bg-warning/10 border border-warning/30 rounded p-3">
              Please <Link to="/login" className="underline">sign in</Link> to complete your purchase.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}
function Input({ value, onChange, ...rest }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number }) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background/40 text-sm outline-none focus:border-primary/60"
    />
  );
}
function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}
