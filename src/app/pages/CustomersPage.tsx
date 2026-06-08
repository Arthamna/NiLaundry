import { useState } from "react";
import { Avatar, Card, CardHeader, FilterChip, KpiCard, OrderStatusBadge, StatusPill } from "../components/ds/primitives";
import { PageBody, PrimaryButton, SecondaryButton, Topbar } from "../components/layout/Shell";
import { Mail, MapPin, Phone, Search, Star, UserPlus, Users } from "lucide-react";

const CUSTOMERS = [
  { name: "Andini Pratama", phone: "0812-3344-7788", email: "andini@email.com", tier: "Gold",   orders: 42, total: "Rp 3.240.000", last: "07 Jun", rating: 4.8 },
  { name: "Rizal Kurniawan", phone: "0813-9988-1122", email: "rizal@email.com", tier: "Silver", orders: 18, total: "Rp 1.480.000", last: "07 Jun", rating: 4.6 },
  { name: "Sari Wulandari",  phone: "0857-2200-1144", email: "sari@email.com",  tier: "Gold",   orders: 36, total: "Rp 2.910.000", last: "06 Jun", rating: 4.9 },
  { name: "Doni Saputra",    phone: "0821-7766-5544", email: "doni@email.com",  tier: "Bronze", orders: 8,  total: "Rp 640.000",   last: "05 Jun", rating: 4.5 },
  { name: "Lia Anggraini",   phone: "0811-2233-4455", email: "lia@email.com",   tier: "Silver", orders: 24, total: "Rp 1.860.000", last: "05 Jun", rating: 4.7 },
  { name: "Bayu Triyanto",   phone: "0858-9911-3344", email: "bayu@email.com",  tier: "Gold",   orders: 52, total: "Rp 4.120.000", last: "04 Jun", rating: 4.9 },
];

export function CustomersPage() {
  const [selected, setSelected] = useState(CUSTOMERS[0]);
  const [tab, setTab] = useState<"orders" | "vouchers" | "reviews">("orders");
  return (
    <>
      <Topbar
        title="Customers"
        breadcrumb={["NiLaundry", "Customers"]}
        action={<><SecondaryButton>Import CSV</SecondaryButton><PrimaryButton><UserPlus size={14} /> Add Customer</PrimaryButton></>}
      />
      <PageBody>
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Total Customers" value="1.108" delta="+96" hint="bulan ini" icon={<Users size={16} />} />
          <KpiCard label="Active (30d)"    value="724"   delta="+12%" />
          <KpiCard label="Gold Tier"       value="184"   delta="+8" />
          <KpiCard label="Avg Spend / Cust" value="Rp 285k" delta="+4.2%" />
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <Card className="col-span-7">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
              <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm">
                <Search size={14} className="text-slate-400" />
                <input className="flex-1 bg-transparent outline-none placeholder:text-slate-400" placeholder="Cari berdasarkan nama atau nomor HP…" />
              </div>
              <SecondaryButton>Tier ▾</SecondaryButton>
              <SecondaryButton>Branch ▾</SecondaryButton>
            </div>
            <div className="flex gap-1.5 border-b border-slate-200 px-5 py-2.5">
              <FilterChip label="All" active count={CUSTOMERS.length} />
              <FilterChip label="Gold" count={2} />
              <FilterChip label="Silver" count={2} />
              <FilterChip label="Bronze" count={1} />
              <FilterChip label="Churn risk" count={3} />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>Customer</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Tier</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Orders</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Total Spend</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Last</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMERS.map((c) => (
                  <tr key={c.phone} onClick={() => setSelected(c)} className={`cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 ${selected.phone === c.phone ? "bg-teal-50/40" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={c.name} size={32} />
                        <div className="leading-tight">
                          <div className="text-slate-900" style={{ fontWeight: 600 }}>{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusPill tone={c.tier === "Gold" ? "warning" : c.tier === "Silver" ? "neutral" : "info"}>{c.tier}</StatusPill>
                    </td>
                    <td className="text-slate-700">{c.orders}</td>
                    <td className="text-slate-900" style={{ fontWeight: 600 }}>{c.total}</td>
                    <td className="text-slate-500">{c.last}</td>
                    <td className="text-amber-600">★ {c.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="col-span-5">
            <div className="border-b border-slate-200 bg-gradient-to-br from-teal-600 to-teal-800 p-5 text-white">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} size={56} />
                <div className="flex-1">
                  <div className="text-xs text-teal-100">Customer profile</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</h3>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[11px]">
                    <Star size={10} /> {selected.tier} Member · sejak 2023
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-white/10 p-2"><div style={{ fontWeight: 700, fontSize: 18 }}>{selected.orders}</div><div className="text-[10px] text-teal-100">Orders</div></div>
                <div className="rounded-lg bg-white/10 p-2"><div style={{ fontWeight: 700, fontSize: 16 }}>{selected.total.replace("Rp ", "")}</div><div className="text-[10px] text-teal-100">Lifetime</div></div>
                <div className="rounded-lg bg-white/10 p-2"><div style={{ fontWeight: 700, fontSize: 18 }}>{selected.rating}★</div><div className="text-[10px] text-teal-100">Avg rating</div></div>
              </div>
            </div>

            <div className="space-y-2 px-5 py-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Phone size={14} className="text-slate-400" /> {selected.phone}</div>
              <div className="flex items-center gap-2 text-slate-600"><Mail size={14} className="text-slate-400" /> {selected.email}</div>
              <div className="flex items-center gap-2 text-slate-600"><MapPin size={14} className="text-slate-400" /> Jl. Kemang Raya No. 21, Jakarta Selatan</div>
            </div>

            <div className="flex gap-1.5 border-y border-slate-200 px-5 py-2">
              {(["orders","vouchers","reviews"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-2.5 py-1 text-xs capitalize ${tab === t ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                  style={{ fontWeight: 500 }}
                >
                  {t === "orders" ? "Order History" : t === "vouchers" ? "Vouchers" : "Reviews"}
                </button>
              ))}
            </div>

            <div className="max-h-80 overflow-y-auto px-5 py-3">
              {tab === "orders" && (
                <table className="w-full text-xs">
                  <thead className="text-[10px] uppercase text-slate-500">
                    <tr className="border-b border-slate-200"><th className="py-1.5 text-left">Order</th><th className="text-left">Date</th><th className="text-left">Status</th><th className="text-right">Total</th></tr>
                  </thead>
                  <tbody>
                    {[
                      ["NL-2401","07 Jun","DISETRIKA","Rp 45.000"],
                      ["NL-2380","02 Jun","SELESAI",  "Rp 120.000"],
                      ["NL-2355","28 Mei","SELESAI",  "Rp 65.000"],
                      ["NL-2310","22 Mei","SELESAI",  "Rp 75.000"],
                      ["NL-2298","17 Mei","SELESAI",  "Rp 38.000"],
                    ].map((r:any) => (
                      <tr key={r[0]} className="border-b border-slate-100">
                        <td className="py-2 text-slate-900" style={{ fontWeight: 500 }}>#{r[0]}</td>
                        <td className="text-slate-500">{r[1]}</td>
                        <td><OrderStatusBadge status={r[2]} /></td>
                        <td className="text-right">{r[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === "vouchers" && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["CUCI20","20% off · 12 hari","Active"],
                    ["GRATIS-ONGKIR","Free pickup · 3 hari","Active"],
                    ["MEMBER50","Rp50k off · 30 hari","Active"],
                    ["LEBARAN","30% off","Expired"],
                  ].map((v:any) => (
                    <div key={v[0]} className="rounded-md border border-dashed border-slate-300 p-2.5">
                      <div className="flex items-center justify-between">
                        <div className="text-xs" style={{ fontWeight: 700 }}>{v[0]}</div>
                        <StatusPill tone={v[2] === "Active" ? "success" : "neutral"}>{v[2]}</StatusPill>
                      </div>
                      <div className="text-[11px] text-slate-500">{v[1]}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "reviews" && (
                <div className="space-y-3">
                  {[
                    ["NL-2380", 5, "Wangi banget, kemasannya rapi banget!", "02 Jun"],
                    ["NL-2355", 5, "Cepat dan konsisten.", "28 Mei"],
                    ["NL-2310", 4, "Hasil bersih, packaging rapi.", "22 Mei"],
                  ].map((r:any) => (
                    <div key={r[0]} className="rounded-md border border-slate-200 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ fontWeight: 600 }}>#{r[0]}</span>
                        <span className="text-amber-500">{"★".repeat(r[1])}<span className="text-slate-300">{"★".repeat(5 - r[1])}</span></span>
                      </div>
                      <div className="mt-1 text-sm text-slate-700">{r[2]}</div>
                      <div className="text-[10px] text-slate-400">{r[3]}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
