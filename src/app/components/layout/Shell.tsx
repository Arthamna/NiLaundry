import { ReactNode } from "react";
import { Avatar, IconButton } from "../ds/primitives";
import {
  LayoutDashboard, Package, Users, Truck, CreditCard, TicketPercent,
  Bell, BarChart3, Settings, Search, ChevronDown, Smartphone, Plus,
} from "lucide-react";

export type RouteKey =
  | "dashboard" | "orders" | "customers" | "couriers"
  | "payments" | "vouchers" | "notifications" | "analytics" | "settings"
  | "customer-portal";

const NAV: { key: RouteKey; label: string; icon: any; badge?: string }[] = [
  { key: "dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { key: "orders",        label: "Orders",        icon: Package, badge: "27" },
  { key: "customers",     label: "Customers",     icon: Users },
  { key: "couriers",      label: "Couriers",      icon: Truck },
  { key: "payments",      label: "Payments",      icon: CreditCard, badge: "6" },
  { key: "vouchers",      label: "Vouchers",      icon: TicketPercent },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "analytics",     label: "Analytics",     icon: BarChart3 },
  { key: "settings",      label: "Settings",      icon: Settings },
];

export function Sidebar({ route, onNavigate }: { route: RouteKey; onNavigate: (r: RouteKey) => void }) {
  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-sm" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          N
        </div>
        <div className="leading-tight">
          <div className="text-slate-900" style={{ fontSize: 14, fontWeight: 700 }}>NiLaundry</div>
          <div className="text-[10px] text-slate-500">Operations Cloud</div>
        </div>
      </div>

      <div className="px-3 pb-2">
        <button className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-white">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded bg-white text-[10px] ring-1 ring-slate-200" style={{ fontWeight: 700 }}>TB</span>
            <div className="text-left leading-tight">
              <div style={{ fontWeight: 600 }}>Cabang Tebet</div>
              <div className="text-[10px] text-slate-500">12 cabang</div>
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pt-1">
        <div className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-wider text-slate-400" style={{ fontWeight: 600 }}>Workspace</div>
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = route === n.key;
          return (
            <button
              key={n.key}
              onClick={() => onNavigate(n.key)}
              className={`mt-0.5 flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition ${
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={16} className={active ? "text-teal-700" : "text-slate-400"} />
              <span className="flex-1 text-left">{n.label}</span>
              {n.badge && (
                <span className={`rounded-full px-1.5 text-[10px] ${active ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-700"}`} style={{ fontWeight: 600 }}>
                  {n.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-2 pb-1 pt-4 text-[10px] uppercase tracking-wider text-slate-400" style={{ fontWeight: 600 }}>Preview</div>
        <button
          onClick={() => onNavigate("customer-portal")}
          className={`mt-0.5 flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition ${
            route === "customer-portal"
              ? "bg-teal-50 text-teal-800"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Smartphone size={16} className={route === "customer-portal" ? "text-teal-700" : "text-slate-400"} />
          <span className="flex-1 text-left">Customer App</span>
        </button>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar name="Andini Pratama" size={32} />
          <div className="flex-1 leading-tight">
            <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Andini P.</div>
            <div className="text-[11px] text-slate-500">Manager · Pusat</div>
          </div>
          <IconButton label="More">⋯</IconButton>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({
  title, breadcrumb, action,
}: { title: string; breadcrumb?: string[]; action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
      <div className="min-w-0 flex-1">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className={i === breadcrumb.length - 1 ? "text-slate-800" : ""}>{b}</span>
                {i < breadcrumb.length - 1 && <span className="text-slate-300">/</span>}
              </span>
            ))}
          </div>
        )}
        <h1 className="truncate text-slate-900" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{title}</h1>
      </div>

      <div className="flex h-9 w-80 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-200">
        <Search size={14} />
        <input className="flex-1 bg-transparent outline-none placeholder:text-slate-400" placeholder="Cari order, pelanggan, voucher…" />
        <span className="rounded bg-white px-1.5 text-[10px] text-slate-400 ring-1 ring-slate-200">⌘K</span>
      </div>

      <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
        <Bell size={16} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>

      {action}

      <div className="h-6 w-px bg-slate-200" />

      <button className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-slate-100">
        <Avatar name="Andini Pratama" size={28} />
        <div className="text-left leading-tight">
          <div className="text-xs text-slate-900" style={{ fontWeight: 600 }}>Andini</div>
          <div className="text-[10px] text-slate-500">Manager</div>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
    </header>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">{children}</div>;
}

export function PrimaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-xs text-white shadow-sm transition hover:bg-teal-700"
      style={{ fontWeight: 600 }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
      style={{ fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

export function NewOrderButton() {
  return (
    <PrimaryButton>
      <Plus size={14} />
      New Order
    </PrimaryButton>
  );
}
