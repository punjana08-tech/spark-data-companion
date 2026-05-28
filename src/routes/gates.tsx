import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum, fmtPct } from "@/components/ui-bits";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ComposedChart, Line } from "recharts";

export const Route = createFileRoute("/gates")({
  head: () => ({ meta: [{ title: "Gates & Queues · EventSphereX" }, { name: "description", content: "Entry gate validation, queue analytics and security flags" }] }),
  component: Page,
});
const ts = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

function Page() {
  const g = analytics.gates;
  const total = g.by_status.reduce((a, b) => a + b.value, 0);
  const valid = g.by_status.find((s) => s.name === "Valid")?.value ?? 0;
  const flagged = g.security_flags.find((s) => s.name === "true")?.value ?? 0;
  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Operations" title="Gate & Queue Management" subtitle="Validation outcomes, queue bottlenecks, gate efficiency and security flags." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Scans" value={fmtNum(total)} />
        <Stat label="Valid Entries" value={fmtPct((valid / total) * 100)} accent="accent" />
        <Stat label="Security Flags" value={fmtNum(flagged)} accent="destructive" />
        <Stat label="Gates Active" value={String(g.by_gate.length)} accent="info" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Hourly Scans & Queue Time" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={g.hourly_scans}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis yAxisId="l" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis yAxisId="r" orientation="right" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar yAxisId="l" dataKey="scans" fill={CHART_COLORS[3]} radius={[6, 6, 0, 0]} />
              <Line yAxisId="r" type="monotone" dataKey="avg_queue" stroke={CHART_COLORS[4]} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Validation Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={g.by_status} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                {g.by_status.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top 15 Busiest Gates" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={g.by_gate}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={10} angle={-30} textAnchor="end" height={60} />
              <YAxis yAxisId="l" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis yAxisId="r" orientation="right" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar yAxisId="l" dataKey="scans" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
              <Line yAxisId="r" type="monotone" dataKey="avg_queue" stroke={CHART_COLORS[2]} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
