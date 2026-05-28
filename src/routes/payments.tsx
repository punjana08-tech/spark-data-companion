import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum, fmtCur, fmtPct } from "@/components/ui-bits";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ComposedChart } from "recharts";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments · EventSphereX" }, { name: "description", content: "Payment gateway performance, failures and throughput" }] }),
  component: Page,
});
const ts = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

function Page() {
  const p = analytics.payments;
  const total = p.by_status.reduce((a, b) => a + b.value, 0);
  const success = p.by_status.find((s) => s.name === "Success")?.value ?? 0;
  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Phase 3 · Challenge C" title="Payment Operations" subtitle="Gateway latency, failure spikes, throughput and refund signals." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Transactions" value={fmtNum(total)} />
        <Stat label="Success Rate" value={fmtPct((success / total) * 100)} accent="accent" />
        <Stat label="Top Failure" value={p.failures_by_code[0]?.name ?? "—"} sub={`${fmtNum(p.failures_by_code[0]?.value ?? 0)} cases`} accent="destructive" />
        <Stat label="Settled Volume" value={fmtCur(p.amount_stats.find((s) => s.status === "Success")?.total ?? 0)} accent="info" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Hourly Throughput & Latency" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={p.hourly_volume}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis yAxisId="l" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis yAxisId="r" orientation="right" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar yAxisId="l" dataKey="txns" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
              <Line yAxisId="r" type="monotone" dataKey="avg_latency" stroke={CHART_COLORS[4]} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Status Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={p.by_status} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                {p.by_status.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Failure Codes (Top 10)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={p.failures_by_code} layout="vertical">
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} width={50} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="value" fill={CHART_COLORS[4]} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Gateway Latency Buckets">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={p.latency_buckets}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Average Amount by Status">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={p.amount_stats}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="status" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} formatter={(v: number) => fmtCur(v)} />
              <Bar dataKey="avg_amt" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
