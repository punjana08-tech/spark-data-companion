import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum } from "@/components/ui-bits";
import { StadiumHeatmap, DensityLegend } from "@/components/StadiumHeatmap";
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/crowd")({
  head: () => ({ meta: [{ title: "Crowd Intelligence · EventSphereX" }, { name: "description", content: "Live crowd density, heatmaps and zone flow" }] }),
  component: Page,
});
const ts = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

function Page() {
  const c = analytics.crowd;
  const peak = [...c.by_zone].sort((a, b) => b.avg_density - a.avg_density)[0];
  const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Phase 3 · Challenge B" title="Crowd Intelligence" subtitle="Zone density, heatmap analytics, congestion alerts and movement flow." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Zones Tracked" value={String(c.by_zone.length)} />
        <Stat label="Peak Zone" value={peak?.name ?? "—"} sub={`density ${peak?.avg_density.toFixed(1)}`} accent="destructive" />
        <Stat label="Critical-density zones" value={String(c.density_buckets.find((b) => b.name === "Critical")?.value ?? 0)} accent="warning" />
        <Stat label="Total movements" value={fmtNum(c.by_zone.reduce((a, b) => a + b.visits, 0))} accent="info" />
      </div>

      <Panel title="Live Crowd Heatmap" hint="All Zones" className="mb-4">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <StadiumHeatmap zones={c.by_zone} />
          <DensityLegend />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          Last Updated: {now}
        </div>
      </Panel>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Hourly Entry Flow" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={c.hourly_flow}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Area type="monotone" dataKey="entries" stroke={CHART_COLORS[1]} fill="url(#gc)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Density Buckets">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={c.density_buckets} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {c.density_buckets.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Avg Density by Zone" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={c.by_zone}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="avg_density" fill={CHART_COLORS[4]} radius={[6, 6, 0, 0]} />
              <Bar dataKey="avg_heat" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
