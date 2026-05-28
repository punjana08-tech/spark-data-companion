import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum, fmtCur } from "@/components/ui-bits";
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/food")({
  head: () => ({ meta: [{ title: "Food & Retail · EventSphereX" }, { name: "description", content: "Concession revenue, stall wait time and product trends" }] }),
  component: Page,
});
const ts = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

function Page() {
  const f = analytics.food;
  const totalRev = f.by_category.reduce((a, b) => a + b.revenue, 0);
  const topStall = f.top_stalls[0];
  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Phase 3 · Challenge E" title="Food & Merchandise" subtitle="Peak stall demand, wait-time analysis, revenue hotspots and product trends." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Revenue" value={fmtCur(totalRev)} />
        <Stat label="Top Category" value={f.by_category[0]?.name ?? "—"} accent="accent" />
        <Stat label="Top Stall" value={topStall?.name ?? "—"} sub={fmtCur(topStall?.revenue ?? 0)} accent="info" />
        <Stat label="Long Waits (40m+)" value={fmtNum(f.wait_buckets.find((w) => w.name === "40m+")?.value ?? 0)} accent="destructive" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Hourly Sales" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={f.hourly_sales}>
              <defs>
                <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} formatter={(v: number, n) => n === "revenue" ? fmtCur(v) : v} />
              <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS[2]} fill="url(#gf)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Wait Time Buckets">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={f.wait_buckets} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {f.wait_buckets.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Revenue by Category" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={f.by_category}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} formatter={(v: number) => fmtCur(v)} />
              <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top 10 Stalls">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead className="text-left text-muted-foreground uppercase tracking-wider border-b border-border/60">
                <tr><th className="py-2">Stall</th><th>Revenue</th><th>Wait</th></tr>
              </thead>
              <tbody>
                {f.top_stalls.map((s) => (
                  <tr key={s.name} className="border-b border-border/30">
                    <td className="py-1.5">{s.name}</td>
                    <td className="text-primary">{fmtCur(s.revenue)}</td>
                    <td className="text-muted-foreground">{s.avg_wait.toFixed(0)}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
