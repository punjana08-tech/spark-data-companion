import { createFileRoute } from "@tanstack/react-router";
import { analytics } from "@/lib/analytics";
import { PageHeader, Stat, Panel, CHART_COLORS, fmtNum, fmtCur, fmtPct } from "@/components/ui-bits";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "EventSphereX · Command Center" }, { name: "description", content: "Real-time event operations & crowd intelligence" }] }),
  component: Page,
});

const tooltipStyle = { background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.32 0.03 265)", borderRadius: 8, fontSize: 12 };

function Page() {
  const o = analytics.overview;
  return (
    <div className="p-8 grid-bg min-h-screen">
      <PageHeader kicker="Event Command Center" title="Operating the live event in real time" subtitle="Unified visibility across ticketing, payments, crowd flow, gates, food, app engagement and incident response." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Bookings" value={fmtNum(o.total_bookings)} sub="Tickets sold across all events" />
        <Stat label="Gross Revenue" value={fmtCur(o.total_revenue)} sub="Confirmed bookings" accent="accent" />
        <Stat label="Live Attendees" value={fmtNum(o.total_attendees)} sub="Tracked via crowd zones" accent="info" />
        <Stat label="Critical Incidents" value={String(o.critical_incidents)} sub={`of ${fmtNum(o.total_incidents)} total`} accent="destructive" />
        <Stat label="Payment Success" value={fmtPct(o.payment_success_rate)} sub={`${fmtNum(o.total_transactions)} txns`} />
        <Stat label="Gate Scan Success" value={fmtPct(o.scan_success_rate)} sub={`${fmtNum(o.total_scans)} scans`} accent="info" />
        <Stat label="Food & Retail" value={fmtCur(o.total_food_revenue)} sub="Concession revenue" accent="accent" />
        <Stat label="App Crash Rate" value={fmtPct(o.crash_rate)} sub={`${fmtNum(o.app_sessions)} sessions`} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Hourly Booking Pulse" hint="24h" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analytics.ticketing.hourly_bookings}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="bookings" stroke={CHART_COLORS[0]} fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Booking Status Mix">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={analytics.ticketing.by_status} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {analytics.ticketing.by_status.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Crowd Density by Zone" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.crowd.by_zone}>
              <CartesianGrid stroke="oklch(0.3 0.03 265 / 0.4)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toFixed(1)} />
              <Bar dataKey="avg_density" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Incident Severity">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={analytics.incidents.by_severity} dataKey="value" nameKey="name" outerRadius={90}>
                {analytics.incidents.by_severity.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
