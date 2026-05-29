import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · EventSphereX" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || pw.length < 4) {
      setErr("Enter a valid email and a password of 4+ chars.");
      return;
    }
    login(email, pw, "user", mode === "signup" ? name : undefined);
    navigate({ to: "/book", replace: true });
  };

  return (
    <div className="min-h-screen grid-bg grid place-items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 border border-primary/30"
      >
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-mint">
            <Radio className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold tracking-tight">EventSphereX</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Fan Portal</div>
          </div>
        </Link>

        <div className="text-[11px] uppercase tracking-[0.22em] text-primary mb-1">User Login</div>
        <h1 className="text-2xl font-bold mb-1">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "signin" ? "Sign in to book tickets and order food." : "Just an email — we'll get you booking in seconds."}
        </p>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <Field icon={<User className="size-4" />} value={name} onChange={setName} placeholder="Your name" />
          )}
          <Field icon={<Mail className="size-4" />} type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <Field icon={<Lock className="size-4" />} type="password" value={pw} onChange={setPw} placeholder="Password" />
          {err && <div className="text-xs text-destructive">{err}</div>}
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm">
            {mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-5 text-xs text-muted-foreground text-center">
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary hover:underline">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-border/40 text-center">
          <Link to="/crew/login" className="text-xs text-muted-foreground hover:text-foreground">
            Crew member? <span className="text-accent">Sign in here →</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement> & { onChange: (v: string) => void; value: string }) {
  const { onChange, ...rest } = props;
  return (
    <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-background/40 focus-within:border-primary/60">
      <span className="text-muted-foreground">{icon}</span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}
