import { ReactNode } from "react";

// Order status — colors per brief
export type OrderStatus =
  | "MENUNGGU_PICKUP" | "PICKUP" | "DIPROSES" | "DICUCI" | "DISETRIKA"
  | "QC" | "SIAP_DIKIRIM" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";

const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  MENUNGGU_PICKUP: { label: "Menunggu Pickup", cls: "bg-slate-100 text-slate-700 ring-slate-200", dot: "bg-slate-400" },
  PICKUP:          { label: "Pickup",           cls: "bg-blue-50 text-blue-700 ring-blue-200",     dot: "bg-blue-500" },
  DIPROSES:        { label: "Diproses",         cls: "bg-amber-50 text-amber-700 ring-amber-200",  dot: "bg-amber-500" },
  DICUCI:          { label: "Dicuci",           cls: "bg-cyan-50 text-cyan-700 ring-cyan-200",     dot: "bg-cyan-500" },
  DISETRIKA:       { label: "Disetrika",        cls: "bg-purple-50 text-purple-700 ring-purple-200", dot: "bg-purple-500" },
  QC:              { label: "QC",               cls: "bg-indigo-50 text-indigo-700 ring-indigo-200", dot: "bg-indigo-500" },
  SIAP_DIKIRIM:    { label: "Siap Dikirim",     cls: "bg-orange-50 text-orange-700 ring-orange-200", dot: "bg-orange-500" },
  DIKIRIM:         { label: "Dikirim",          cls: "bg-teal-50 text-teal-700 ring-teal-200",     dot: "bg-teal-500" },
  SELESAI:         { label: "Selesai",          cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  DIBATALKAN:      { label: "Dibatalkan",       cls: "bg-rose-50 text-rose-700 ring-rose-200",     dot: "bg-rose-500" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export const ORDER_STATUS_KEYS = Object.keys(ORDER_STATUS) as OrderStatus[];
export const ORDER_STATUS_LABEL = (k: OrderStatus) => ORDER_STATUS[k].label;

export function StatusPill({
  tone = "neutral",
  children,
}: {
  tone?: "success" | "warning" | "danger" | "info" | "neutral" | "primary";
  children: ReactNode;
}) {
  const map = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger:  "bg-rose-50 text-rose-700 ring-rose-200",
    info:    "bg-blue-50 text-blue-700 ring-blue-200",
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    primary: "bg-teal-50 text-teal-700 ring-teal-200",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${map[tone]}`}>
      {children}
    </span>
  );
}

export function KpiCard({
  label, value, delta, deltaTone = "up", icon, hint,
}: {
  label: string; value: string; delta?: string; deltaTone?: "up" | "down" | "flat"; icon?: ReactNode; hint?: string;
}) {
  const tone = deltaTone === "up" ? "text-emerald-600" : deltaTone === "down" ? "text-rose-600" : "text-slate-500";
  const arrow = deltaTone === "up" ? "▲" : deltaTone === "down" ? "▼" : "—";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div className="text-xs text-slate-500" style={{ fontWeight: 500 }}>{label}</div>
        {icon && <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-teal-700">{icon}</div>}
      </div>
      <div className="mt-2 text-slate-900" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta && <span className={tone} style={{ fontWeight: 600 }}>{arrow} {delta}</span>}
        {hint && <span className="text-slate-500">{hint}</span>}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  title, action, subtitle,
}: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
      <div>
        <h3 className="text-slate-900" style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function Avatar({ name, size = 32, src }: { name: string; size?: number; src?: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  if (src) {
    return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white"
      style={{ width: size, height: size, fontSize: size * 0.38, fontWeight: 600 }}
    >
      {initials}
    </div>
  );
}

export function Sparkline({ values, color = "#0f766e", filled = true, height = 36 }: { values: number[]; color?: string; filled?: boolean; height?: number }) {
  const w = 120, h = height;
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {filled && <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity={0.1} />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AreaChart({
  series, labels, height = 220,
}: { series: { name: string; values: number[]; color: string }[]; labels: string[]; height?: number }) {
  const w = 800;
  const h = height;
  const pad = { l: 36, r: 12, t: 12, b: 24 };
  const all = series.flatMap((s) => s.values);
  const max = Math.max(...all) * 1.1;
  const min = 0;
  const xs = (i: number) => pad.l + (i / (labels.length - 1)) * (w - pad.l - pad.r);
  const ys = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);
  const grid = 4;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {Array.from({ length: grid + 1 }).map((_, i) => {
        const y = pad.t + (i / grid) * (h - pad.t - pad.b);
        const v = Math.round(max - (i / grid) * (max - min));
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
          </g>
        );
      })}
      {series.map((s, si) => {
        const pts = s.values.map((v, i) => `${xs(i)},${ys(v)}`).join(" ");
        return (
          <g key={si}>
            <polyline points={`${pad.l},${h - pad.b} ${pts} ${w - pad.r},${h - pad.b}`} fill={s.color} opacity={0.08} />
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {s.values.map((v, i) => (
              <circle key={i} cx={xs(i)} cy={ys(v)} r={3} fill="white" stroke={s.color} strokeWidth={2} />
            ))}
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={i} x={xs(i)} y={h - 6} textAnchor="middle" fontSize="10" fill="#64748b">{l}</text>
      ))}
    </svg>
  );
}

export function BarChart({
  values, labels, color = "#14b8a6", height = 200,
}: { values: number[]; labels: string[]; color?: string; height?: number }) {
  const w = 800, h = height;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const max = Math.max(...values) * 1.15;
  const bw = (w - pad.l - pad.r) / values.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = pad.t + p * (h - pad.t - pad.b);
        return <line key={i} x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />;
      })}
      {values.map((v, i) => {
        const bh = ((v / max) * (h - pad.t - pad.b)) || 0;
        const x = pad.l + i * bw + 6;
        const y = h - pad.b - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw - 12} height={bh} rx={4} fill={color} opacity={0.85} />
            <text x={x + (bw - 12) / 2} y={h - 10} textAnchor="middle" fontSize="10" fill="#64748b">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Donut({
  segments, size = 140,
}: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  const r = 50, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 120 120" style={{ width: size, height: size }}>
        <g transform="translate(60,60) rotate(-90)">
          <circle r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
          {segments.map((s, i) => {
            const frac = s.value / total;
            const dash = `${frac * c} ${c - frac * c}`;
            const off = -acc * c;
            acc += frac;
            return <circle key={i} r={r} fill="none" stroke={s.color} strokeWidth="14" strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="butt" />;
          })}
        </g>
        <text x="60" y="58" textAnchor="middle" fontSize="11" fill="#64748b">Total</text>
        <text x="60" y="74" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0f172a">{total}</text>
      </svg>
      <div className="space-y-2 text-xs">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="w-24 text-slate-600">{s.label}</span>
            <span className="text-slate-900" style={{ fontWeight: 600 }}>{Math.round((s.value / total) * 100)}%</span>
            <span className="text-slate-400">· {s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FilterChip({ label, active, onClick, count }: { label: string; active?: boolean; onClick?: () => void; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${
        active ? "bg-teal-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`rounded-full px-1.5 ${active ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{count}</span>
      )}
    </button>
  );
}

export function IconButton({ children, onClick, label }: { children: ReactNode; onClick?: () => void; label?: string }) {
  return (
    <button onClick={onClick} aria-label={label} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900">
      {children}
    </button>
  );
}
