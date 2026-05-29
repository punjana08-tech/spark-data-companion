import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/crew/login")({
  head: () => ({ meta: [{ title: "Crew Sign in · EventSphereX" }] }),
  component: CrewLogin,
});

function CrewLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || pw.length < 4) {
      setErr("Enter a valid crew email and password.");
      return;
    }
    login(email, pw, "crew");
    navigate({ to: "/crew", replace: true });
  };

  return (
    <div className="min-h-screen grid-bg grid place-items-center p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass rounded-2xl p-8 border border-accent/30">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="size-10 rounded-xl bg-gradient-to-br from-accent to-primary grid place-items-center">
            <Shield className="size-5 text-accent-foreground" />
          </div>
          <div>
            <div className="font-bold tracking-tight">EventSphereX</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-accent">Live Ops · Crew</div>
          </div>
        </Link>

        <div className="text-[11px] uppercase tracking-[0.22em] text-accent mb-1">Crew Access</div>
        <h1 className="text-2xl font-bold mb-1">Operations console</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Authorised crew only. Access ticketing, crowd, payments, gates, food, app and incident dashboards.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-background/40 focus-within:border-accent/60">
            <Mail className="size-4 text-muted-foreground" />
            <input type="email" placeholder="crew@eventsphere.live" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
          </label>
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-background/40 focus-within:border-accent/60">
            <Lock className="size-4 text-muted-foreground" />
            <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
          </label>
          {err && <div className="text-xs text-destructive">{err}</div>}
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm">
            Sign in as crew <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/40 text-center">
          <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">
            Just here to book tickets? <span className="text-primary">User login →</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
