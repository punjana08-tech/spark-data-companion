import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum, fmtCur } from "@/components/ui-bits";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/ticketing")({
  head: () => ({ meta: [{ title: "Ticketing · EventSphereX" }, { name: "description", content: "Ticketing analytics, revenue and seat zone trends" }] }),
  component: Page,
});
const ts = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

function Page() {
  const t = analytics.ticketing;
  const confirmed = t.by_status.find((s) => s.name === "Confirmed")?.value ?? 0;
  const total = t.by_status.reduce((a, b) => a + b.value, 0);
  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Phase 3 · Challenge A" title="Ticketing Analytics" subtitle="Booking velocity, seat-zone preference, dynamic pricing and revenue distribution." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Bookings" value={fmtNum(total)} />
        <Stat label="Confirmation Rate" value={((confirmed / total) * 100).toFixed(1) + "%"} accent="accent" />
        <Stat label="Avg Ticket" value={fmtCur(analytics.overview.total_revenue / Math.max(confirmed, 1))} accent="info" />
        <Stat label="Top Zone" value={t.by_zone[0]?.name ?? "—"} sub={fmtNum(t.by_zone[0]?.bookings ?? 0) + " bookings"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Daily Revenue Trend" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={t.daily_revenue}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="date" stroke="oklch(0.6 0.03 250)" fontSize={10} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} formatter={(v: number) => fmtCur(v)} />
              <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Bookings by Seat Zone">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={t.by_zone}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="bookings" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Ticket Type Mix">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={t.by_type} dataKey="bookings" nameKey="name" innerRadius={50} outerRadius={90}>
                {t.by_type.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Payment Mode">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={t.by_payment_mode} dataKey="value" nameKey="name" outerRadius={90}>
                {t.by_payment_mode.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top 10 Events by Revenue" className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <tr><th className="py-2">Event</th><th>Bookings</th><th>Revenue</th></tr>
              </thead>
              <tbody className="font-mono">
                {t.top_events.map((e) => (
                  <tr key={e.name} className="border-b border-border/30">
                    <td className="py-2">{e.name}</td>
                    <td>{fmtNum(e.bookings)}</td>
                    <td className="text-primary">{fmtCur(e.revenue)}</td>
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
