import { Card, CardHeader, FilterChip, KpiCard, StatusPill } from "../components/ds/primitives";
import { NewOrderButton, PageBody, PrimaryButton, SecondaryButton, Topbar } from "../components/layout/Shell";
import { Calendar, Plus, TicketPercent, TrendingUp, Users } from "lucide-react";

const VOUCHERS = [
  { code: "CUCI20",         label: "Diskon 20% Cuci Setrika", value: "20%",       max: "Rp 30.000", used: 58,  quota: 100, expires: "30 Jun 2026", status: "Active" },
  { code: "GRATIS-ONGKIR",  label: "Gratis penjemputan & antar", value: "Free Ship", max: "Rp 10.000", used: 12,  quota: 50,  expires: "10 Jun 2026", status: "Active" },
  { code: "DRYCLEAN30",     label: "Diskon 30% Dry Clean",    value: "30%",       max: "Rp 45.000", used: 8,   quota: 30,  expires: "28 Jun 2026", status: "Active" },
  { code: "MEMBER50",       label: "Cashback Member Gold",    value: "Rp 50k",    max: "Rp 50.000", used: 2,   quota: 20,  expires: "07 Jul 2026", status: "Active" },
  { code: "WEEKEND15",      label: "Weekend Special",         value: "15%",       max: "Rp 20.000", used: 92,  quota: 100, expires: "08 Jun 2026", status: "Active" },
  { code: "LEBARAN",        label: "Hari Raya 30%",           value: "30%",       max: "Rp 60.000", used: 200, quota: 200, expires: "20 Apr 2026", status: "Expired" },
];

export function VouchersPage() {
  return (
    <>
      <Topbar
        title="Voucher Center"
        breadcrumb={["NiLaundry", "Marketing", "Vouchers"]}
        action={<><SecondaryButton><Calendar size={14} /> All time</SecondaryButton><PrimaryButton><Plus size={14} /> Create Voucher</PrimaryButton></>}
      />
      <PageBody>
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Active Vouchers"   value="5"        delta="+1 minggu ini" icon={<TicketPercent size={16} />} />
          <KpiCard label="Total Redeemed"    value="372"      delta="+18%" />
          <KpiCard label="Customer Savings"  value="Rp 14,8jt" delta="+12.4%" icon={<TrendingUp size={16} />} />
          <KpiCard label="Unique Users"      value="218"      delta="+24"  icon={<Users size={16} />} />
        </div>

        <Card className="mt-4">
          <div className="flex items-center gap-1.5 border-b border-slate-200 px-5 py-3">
            <FilterChip label="All"     active count={VOUCHERS.length} />
            <FilterChip label="Active"  count={5} />
            <FilterChip label="Expiring soon" count={2} />
            <FilterChip label="Used"    count={1} />
            <FilterChip label="Expired" count={1} />
            <div className="ml-auto flex items-center gap-2">
              <SecondaryButton>Branch ▾</SecondaryButton>
              <SecondaryButton>Type ▾</SecondaryButton>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-5">
            {VOUCHERS.map((v) => {
              const pct = Math.round((v.used / v.quota) * 100);
              const active = v.status === "Active";
              return (
                <div key={v.code} className={`relative overflow-hidden rounded-xl border ${active ? "border-slate-200" : "border-slate-200 opacity-60"} bg-white shadow-sm`}>
                  <div className={`flex items-center justify-between px-4 py-2.5 ${active ? "bg-gradient-to-r from-teal-600 to-teal-700" : "bg-slate-500"} text-white`}>
                    <div className="flex items-center gap-2">
                      <TicketPercent size={14} />
                      <span className="text-[11px] uppercase tracking-wider opacity-90">Voucher</span>
                    </div>
                    <StatusPill tone={active ? "success" : "neutral"}>{v.status}</StatusPill>
                  </div>
                  <div className="border-b border-dashed border-slate-200 px-4 py-4">
                    <div className="text-slate-900" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.04em" }}>{v.code}</div>
                    <div className="mt-1 text-sm text-slate-600">{v.label}</div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-teal-700" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>{v.value}</span>
                      <span className="text-xs text-slate-500">max {v.max}</span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Quota</span>
                      <span><span className="text-slate-900" style={{ fontWeight: 600 }}>{v.used}</span> / {v.quota}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                      <div className={`h-1.5 rounded-full ${pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-teal-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Expires {v.expires}</span>
                      <button className="text-teal-700" style={{ fontWeight: 600 }}>Details →</button>
                    </div>
                  </div>
                  <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-slate-50" />
                  <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-slate-50" />
                </div>
              );
            })}
          </div>
        </Card>
      </PageBody>
    </>
  );
}
