import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum } from "@/components/ui-bits";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [{ title: "Incidents · EventSphereX" }, { name: "description", content: "Emergency incident logs and response analytics" }] }),
  component: Page,
});
const ts = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

const sevColor: Record<string, string> = { Critical: "text-destructive", High: "text-warning", Medium: "text-info", Low: "text-muted-foreground" };

function Page() {
  const i = analytics.incidents;
  const total = i.by_severity.reduce((a, b) => a + b.value, 0);
  const open = i.by_status.find((s) => s.name !== "Resolved")?.value ?? 0;
  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Operations" title="Emergency & Incident Response" subtitle="Severity mix, zone risk distribution, response times and live incident stream." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Incidents" value={fmtNum(total)} />
        <Stat label="Critical" value={String(i.by_severity.find((s) => s.name === "Critical")?.value ?? 0)} accent="destructive" />
        <Stat label="Open / Pending" value={fmtNum(open)} accent="warning" />
        <Stat label="Avg Response" value={(i.by_zone.reduce((s, z) => s + z.avg_response, 0) / i.by_zone.length).toFixed(0) + "s"} accent="info" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="By Type">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={i.by_type} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {i.by_type.map((_, k) => <Cell key={k} fill={CHART_COLORS[k % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="By Severity">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={i.by_severity} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {i.by_severity.map((_, k) => <Cell key={k} fill={CHART_COLORS[k]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="By Zone">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={i.by_zone}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="incidents" fill={CHART_COLORS[4]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Live Incident Stream (latest 50)" className="lg:col-span-3">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <thead className="text-left text-muted-foreground uppercase tracking-wider border-b border-border/60 sticky top-0 bg-card">
                <tr>
                  <th className="py-2 pr-3">ID</th><th>Zone</th><th>Type</th><th>Severity</th><th>Response</th><th>Status</th><th>Time</th>
                </tr>
              </thead>
              <tbody>
                {i.recent.map((r) => (
                  <tr key={r.Incident_ID} className="border-b border-border/20">
                    <td className="py-1.5 pr-3 text-muted-foreground">{r.Incident_ID}</td>
                    <td>{r.Zone_ID}</td>
                    <td>{r.Incident_Type}</td>
                    <td className={sevColor[r.Severity_Level] ?? ""}>{r.Severity_Level}</td>
                    <td>{r.Response_Time}s</td>
                    <td>{r.Resolution_Status}</td>
                    <td className="text-muted-foreground">{r.Timestamp}</td>
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
