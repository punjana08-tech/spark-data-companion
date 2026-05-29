import { useMemo } from "react";

type Zone = { name: string; avg_density: number };

// Heat blobs distributed around an oval stadium seating bowl.
// Each zone is mapped to one or more (cx, cy) anchor points around the field.
const ZONE_ANCHORS: Record<string, { x: number; y: number }[]> = {
  North: [{ x: 250, y: 70 }, { x: 200, y: 75 }, { x: 300, y: 75 }],
  South: [{ x: 250, y: 280 }, { x: 200, y: 275 }, { x: 300, y: 275 }],
  East: [{ x: 430, y: 175 }, { x: 420, y: 130 }, { x: 420, y: 220 }],
  West: [{ x: 70, y: 175 }, { x: 80, y: 130 }, { x: 80, y: 220 }],
  VIP: [{ x: 250, y: 50 }],
  General: [{ x: 130, y: 90 }, { x: 370, y: 90 }, { x: 130, y: 260 }, { x: 370, y: 260 }],
};

function densityColor(d: number) {
  // d expected ~ 0..100; map to green→yellow→orange→red
  const t = Math.max(0, Math.min(1, d / 80));
  if (t < 0.33) return `rgba(34,197,94,${0.55 + t})`;
  if (t < 0.66) return `rgba(250,204,21,${0.55 + t * 0.4})`;
  if (t < 0.85) return `rgba(249,115,22,${0.75})`;
  return `rgba(239,68,68,0.9)`;
}

export function StadiumHeatmap({ zones }: { zones: Zone[] }) {
  const blobs = useMemo(() => {
    const out: { x: number; y: number; r: number; color: string; zone: string; d: number }[] = [];
    zones.forEach((z) => {
      const anchors = ZONE_ANCHORS[z.name] ?? [{ x: 250, y: 175 }];
      anchors.forEach((a, i) => {
        const jitter = (i * 13) % 11;
        out.push({
          x: a.x + (jitter - 5),
          y: a.y + ((jitter * 2) % 9) - 4,
          r: 38 + (z.avg_density / 100) * 28,
          color: densityColor(z.avg_density + jitter),
          zone: z.name,
          d: z.avg_density,
        });
      });
    });
    return out;
  }, [zones]);

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 500 350" className="w-full h-auto">
        <defs>
          <radialGradient id="bowl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.25 0.04 265)" />
            <stop offset="100%" stopColor="oklch(0.16 0.03 265)" />
          </radialGradient>
          <pattern id="seatGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="oklch(0.35 0.03 265 / 0.35)" strokeWidth="0.4" />
          </pattern>
          {blobs.map((b, i) => (
            <radialGradient key={i} id={`blob-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={b.color} stopOpacity="0.95" />
              <stop offset="50%" stopColor={b.color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={b.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* outer bowl */}
        <ellipse cx="250" cy="175" rx="230" ry="155" fill="url(#bowl)" stroke="oklch(0.4 0.05 230)" strokeWidth="1.5" />
        <ellipse cx="250" cy="175" rx="230" ry="155" fill="url(#seatGrid)" />
        {/* concentric seating rings */}
        <ellipse cx="250" cy="175" rx="200" ry="130" fill="none" stroke="oklch(0.4 0.05 230 / 0.4)" />
        <ellipse cx="250" cy="175" rx="170" ry="108" fill="none" stroke="oklch(0.4 0.05 230 / 0.4)" />

        {/* field */}
        <rect x="155" y="115" width="190" height="120" rx="4" fill="oklch(0.32 0.08 150)" stroke="oklch(0.6 0.08 150)" strokeWidth="1" />
        <line x1="250" y1="115" x2="250" y2="235" stroke="oklch(0.85 0.05 150 / 0.6)" />
        <circle cx="250" cy="175" r="18" fill="none" stroke="oklch(0.85 0.05 150 / 0.6)" />
        <rect x="155" y="148" width="22" height="54" fill="none" stroke="oklch(0.85 0.05 150 / 0.5)" />
        <rect x="323" y="148" width="22" height="54" fill="none" stroke="oklch(0.85 0.05 150 / 0.5)" />

        {/* STAGE/label */}
        <g>
          <rect x="20" y="160" width="46" height="30" rx="3" fill="oklch(0.22 0.03 265)" stroke="oklch(0.5 0.05 230)" />
          <text x="43" y="179" textAnchor="middle" fontSize="9" fill="oklch(0.75 0.04 230)" fontFamily="ui-monospace, monospace">STAGE</text>
        </g>

        {/* heat blobs */}
        {blobs.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={`url(#blob-${i})`}>
            <title>{`${b.zone} · density ${b.d.toFixed(1)}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

export function DensityLegend() {
  const items = [
    { label: "Very High", color: "rgb(239,68,68)" },
    { label: "High", color: "rgb(249,115,22)" },
    { label: "Medium", color: "rgb(250,204,21)" },
    { label: "Low", color: "rgb(34,197,94)" },
    { label: "Very Low", color: "rgb(59,130,246)" },
  ];
  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Density Level</div>
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2 text-xs">
          <span className="size-3 rounded-sm" style={{ background: it.color }} />
          <span className="text-foreground/80">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
