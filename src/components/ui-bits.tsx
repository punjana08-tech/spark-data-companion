import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="text-xs uppercase tracking-[0.22em] text-primary mb-2">{kicker}</div>
      <h1 className="text-4xl font-bold tracking-tight text-gradient">{title}</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>
    </motion.header>
  );
}

export function Stat({ label, value, sub, accent = "primary" }: { label: string; value: string; sub?: string; accent?: "primary" | "accent" | "warning" | "destructive" | "info" }) {
  const ring = {
    primary: "border-primary/30",
    accent: "border-accent/30",
    warning: "border-warning/30",
    destructive: "border-destructive/30",
    info: "border-info/30",
  }[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-5 border ${ring}`}
    >
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-2 font-mono">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}

export function Panel({ title, hint, children, className = "" }: { title: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-xl p-5 ${className}`}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {hint && <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

export const CHART_COLORS = [
  "oklch(0.78 0.18 155)",
  "oklch(0.72 0.19 290)",
  "oklch(0.78 0.17 75)",
  "oklch(0.72 0.16 230)",
  "oklch(0.7 0.22 0)",
  "oklch(0.65 0.15 320)",
];

export const fmtNum = (n: number) => new Intl.NumberFormat("en", { notation: n >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(n);
export const fmtCur = (n: number) => "₹" + fmtNum(n);
export const fmtPct = (n: number) => n.toFixed(1) + "%";
