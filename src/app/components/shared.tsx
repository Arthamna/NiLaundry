import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export const teal = {
  bg: "bg-teal-600",
  bgSoft: "bg-teal-50",
  text: "text-teal-700",
  border: "border-teal-200",
  ring: "ring-teal-500",
};

export function FrameShell({
  id,
  title,
  subtitle,
  device = "Desktop · 1440",
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  device?: string;
  children: ReactNode;
}) {
  const slug = id.toLowerCase().replace(/\s+/g, "-");
  return (
    <section id={slug} className="mb-12">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-teal-700">{id}</div>
          <h2 className="text-slate-900" style={{ fontSize: 18, fontWeight: 600 }}>
            {title}
          </h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <Badge variant="outline" className="border-slate-300 text-slate-500">
          {device}
        </Badge>
      </div>
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="bg-gradient-to-br from-slate-50 to-white">{children}</div>
      </Card>
    </section>
  );
}

export function Kpi({
  label,
  value,
  delta,
  positive = true,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-4 border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="mt-1 text-slate-900" style={{ fontSize: 22, fontWeight: 600 }}>
            {value}
          </div>
          {delta && (
            <div className={`mt-1 text-xs ${positive ? "text-emerald-600" : "text-rose-600"}`}>
              {delta}
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-teal-50 p-2 text-teal-700">{icon}</div>
        )}
      </div>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Baru": "bg-blue-50 text-blue-700 border-blue-200",
    "Diproses": "bg-amber-50 text-amber-700 border-amber-200",
    "Dicuci": "bg-amber-50 text-amber-700 border-amber-200",
    "Disetrika": "bg-orange-50 text-orange-700 border-orange-200",
    "Siap": "bg-teal-50 text-teal-700 border-teal-200",
    "Selesai": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Diantar": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Dijemput": "bg-violet-50 text-violet-700 border-violet-200",
    "Lunas": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Belum Bayar": "bg-rose-50 text-rose-700 border-rose-200",
    "Pending": "bg-slate-100 text-slate-700 border-slate-200",
    "Aktif": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Habis": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function MiniBar({ values, color = "bg-teal-500" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-12 items-end gap-1">
      {values.map((v, i) => (
        <div
          key={i}
          className={`w-2 rounded-sm ${color}`}
          style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (v / max) * 0.6 }}
        />
      ))}
    </div>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-teal-100 text-teal-800"
      style={{ width: size, height: size, fontSize: size * 0.4, fontWeight: 600 }}
    >
      {initials}
    </div>
  );
}

export function TopBar({ title, role = "Pelanggan" }: { title: string; role?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-teal-500" />
        <span className="text-sm text-slate-700" style={{ fontWeight: 600 }}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
          <span>🔍</span>
          <span>Cari pelanggan, pesanan, voucher…</span>
          <span className="ml-6 rounded bg-white px-1.5 text-[10px] text-slate-400 border border-slate-200">⌘K</span>
        </div>
        <div className="relative">
          <span className="text-slate-500">🔔</span>
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500" />
        </div>
        <Avatar name={role} size={28} />
      </div>
    </div>
  );
}

export function SideNavMock({
  role,
  active,
  items,
}: {
  role: string;
  active: string;
  items: { label: string; icon: string }[];
}) {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-white" style={{ fontWeight: 700 }}>N</div>
        <div>
          <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>NiLaundry</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{role}</div>
        </div>
      </div>
      <nav className="px-2">
        {items.map((it) => (
          <div
            key={it.label}
            className={`mb-0.5 flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              it.label === active
                ? "bg-teal-50 text-teal-800"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>{it.icon}</span>
            <span>{it.label}</span>
            {it.label === active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-600" />}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export const customerNav = [
  { label: "Beranda", icon: "🏠" },
  { label: "Pesanan", icon: "📦" },
  { label: "Notifikasi", icon: "🔔" },
  { label: "Voucher", icon: "🎟️" },
  { label: "Ulasan", icon: "⭐" },
  { label: "Profil", icon: "👤" },
];

export const staffNav = [
  { label: "Dashboard", icon: "📊" },
  { label: "Antrian", icon: "📋" },
  { label: "Pesanan", icon: "🧺" },
  { label: "Pembayaran", icon: "💳" },
  { label: "Kurir", icon: "🛵" },
];

export const adminNav = [
  { label: "Overview", icon: "📈" },
  { label: "Cabang", icon: "🏬" },
  { label: "Layanan", icon: "🧼" },
  { label: "Pegawai", icon: "👥" },
  { label: "Ulasan", icon: "⭐" },
  { label: "Pembayaran", icon: "💳" },
  { label: "Kurir", icon: "🛵" },
];
