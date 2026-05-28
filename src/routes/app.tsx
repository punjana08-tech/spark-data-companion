import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum, fmtPct } from "@/components/ui-bits";
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Fan App · EventSphereX" }, { name: "description", content: "App engagement, screen activity and crash analytics" }] }),
  component: Page,
});
const ts = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

function Page() {
  const a = analytics.app;
  const total = a.by_screen.reduce((s, x) => s + x.sessions, 0);
  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Phase 3 · Challenge D" title="Fan Experience" subtitle="Engagement trends, active screens, session depth and crash analytics." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Sessions" value={fmtNum(total)} />
        <Stat label="Top Screen" value={a.by_screen[0]?.name ?? "—"} accent="accent" />
        <Stat label="Avg Session" value={(a.by_screen.reduce((s, x) => s + x.avg_dur, 0) / a.by_screen.length).toFixed(0) + "s"} accent="info" />
        <Stat label="Worst Crash %" value={fmtPct(a.crash_by_screen[0]?.crash_rate ?? 0)} sub={a.crash_by_screen[0]?.name} accent="destructive" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Hourly Activity" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={a.hourly_activity}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[3]} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={CHART_COLORS[3]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Area type="monotone" dataKey="sessions" stroke={CHART_COLORS[3]} fill="url(#ga)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Engagement Depth">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={a.engagement_buckets} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {a.engagement_buckets.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Sessions by Screen" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={a.by_screen}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="sessions" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Crash Rate by Screen">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={a.crash_by_screen} layout="vertical">
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.6 0.03 250)" fontSize={11} unit="%" />
              <YAxis type="category" dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} width={70} />
              <Tooltip contentStyle={ts} formatter={(v: any) => v.toFixed(2) + "%"} />
              <Bar dataKey="crash_rate" fill={CHART_COLORS[4]} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
