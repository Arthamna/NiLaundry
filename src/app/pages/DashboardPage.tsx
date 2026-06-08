import { AreaChart, BarChart, Card, CardHeader, KpiCard, OrderStatusBadge, Sparkline } from "../components/ds/primitives";
import { NewOrderButton, PageBody, SecondaryButton, Topbar } from "../components/layout/Shell";
import { ArrowUpRight, Calendar, Download, DollarSign, Package, Star, TrendingUp, Users } from "lucide-react";

export function DashboardPage() {
  return (
    <>
      <Topbar
        title="Management Overview"
        breadcrumb={["NiLaundry", "Dashboard"]}
        action={
          <>
            <SecondaryButton><Calendar size={14} /> Jun 1 – Jun 7, 2026</SecondaryButton>
            <SecondaryButton><Download size={14} /> Export</SecondaryButton>
            <NewOrderButton />
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-5 gap-4">
          <KpiCard label="Revenue Today"     value="Rp12,4jt" delta="+18.2%" deltaTone="up"   hint="vs kemarin"  icon={<DollarSign size={16} />} />
          <KpiCard label="Revenue This Month" value="Rp184jt"  delta="+12.6%" deltaTone="up"   hint="vs Mei"      icon={<TrendingUp size={16} />} />
          <KpiCard label="Orders Today"      value="142"      delta="+8"     deltaTone="up"   hint="vs kemarin"  icon={<Package size={16} />} />
          <KpiCard label="Average Rating"    value="4.7"      delta="+0.1"   deltaTone="up"   hint="1.842 ulasan" icon={<Star size={16} />} />
          <KpiCard label="Active Customers"  value="1.108"    delta="+96"    deltaTone="up"   hint="bulan ini"   icon={<Users size={16} />} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader
              title="Revenue & Orders Trend"
              subtitle="14 hari terakhir · pendapatan vs jumlah order"
              action={
                <>
                  <button className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">7H</button>
                  <button className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white">14H</button>
                  <button className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">30H</button>
                  <button className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">90H</button>
                </>
              }
            />
            <div className="px-4 pt-3">
              <div className="mb-2 flex items-center gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-600" /> Revenue (jt)</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Orders</span>
              </div>
              <AreaChart
                labels={["25","26","27","28","29","30","31","1","2","3","4","5","6","7"]}
                series={[
                  { name: "Revenue", color: "#0f766e", values: [8.2, 9.1, 8.8, 10.4, 11.2, 9.6, 12.1, 11.8, 10.9, 12.4, 13.1, 12.8, 13.6, 12.4] },
                  { name: "Orders",  color: "#6366f1", values: [98, 112, 104, 124, 132, 118, 142, 138, 128, 142, 154, 148, 162, 142] },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Service Mix" subtitle="Distribusi 30 hari" action={<button className="text-xs text-teal-700">Detail</button>} />
            <div className="space-y-3 px-5 py-4">
              {[
                ["Cuci Setrika Reguler", 38, "#0f766e"],
                ["Cuci Express",        20, "#14b8a6"],
                ["Dry Clean",           15, "#0ea5e9"],
                ["Sepatu",              10, "#6366f1"],
                ["Bed Cover",            7, "#a855f7"],
                ["Lainnya",             10, "#94a3b8"],
              ].map(([name, pct, color]: any) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{name}</span>
                    <span className="text-slate-900" style={{ fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full" style={{ width: `${pct * 2.5}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader title="Live Orders" subtitle="Pesanan dengan status aktif" action={<button className="text-xs text-teal-700">View all →</button>} />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>Order</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Customer</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Branch</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Status</th>
                  <th className="text-left" style={{ fontWeight: 600 }}>Deadline</th>
                  <th className="px-5 text-right" style={{ fontWeight: 600 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["#NL-2401", "Andini P.",   "Tebet",   "DISETRIKA",    "Hari ini · 14:00", "Rp 45.000"],
                  ["#NL-2402", "Rizal K.",    "Kemang",  "DICUCI",       "Besok · 10:00",     "Rp 145.000"],
                  ["#NL-2403", "Sari W.",     "BSD",     "DIPROSES",     "Besok · 16:00",     "Rp 62.000"],
                  ["#NL-2404", "Doni S.",     "Tebet",   "QC",           "Hari ini · 18:00",  "Rp 40.000"],
                  ["#NL-2405", "Lia A.",      "Bekasi",  "PICKUP",       "Lusa · 12:00",      "Rp 220.000"],
                  ["#NL-2406", "Bayu T.",     "BSD",     "SIAP_DIKIRIM", "Hari ini · 17:30",  "Rp 75.000"],
                  ["#NL-2407", "Mira S.",     "Kemang",  "DIKIRIM",      "Hari ini · 15:00",  "Rp 48.000"],
                ].map((r: any) => (
                  <tr key={r[0]} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-900" style={{ fontWeight: 500 }}>{r[0]}</td>
                    <td className="text-slate-700">{r[1]}</td>
                    <td className="text-slate-500">{r[2]}</td>
                    <td><OrderStatusBadge status={r[3]} /></td>
                    <td className="text-slate-500">{r[4]}</td>
                    <td className="px-5 text-right text-slate-900" style={{ fontWeight: 600 }}>{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Top Branches" subtitle="Pendapatan minggu ini" />
              <div className="space-y-3 px-5 py-4">
                {[
                  ["Tebet",   "Rp48,2jt", 92, [3,5,4,6,7,8,9]],
                  ["Kemang",  "Rp41,5jt", 85, [4,4,5,5,6,7,8]],
                  ["BSD",     "Rp38,9jt", 78, [5,6,6,7,7,8,9]],
                  ["Bekasi",  "Rp31,1jt", 70, [3,4,4,5,6,6,7]],
                ].map((b: any) => (
                  <div key={b[0]} className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-teal-50 text-xs text-teal-700" style={{ fontWeight: 700 }}>
                      {b[0].slice(0,2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-900" style={{ fontWeight: 500 }}>{b[0]}</span>
                        <span className="text-slate-900" style={{ fontWeight: 600 }}>{b[1]}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                        <ArrowUpRight size={10} className="text-emerald-600" />
                        {b[2]}% of target
                      </div>
                    </div>
                    <div className="w-20"><Sparkline values={b[3]} height={28} /></div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Activity Feed" />
              <div className="space-y-3 px-5 py-4 text-xs">
                {[
                  ["💳", "Pembayaran QRIS Rp145.000",            "ORD-2402 · 2 min lalu"],
                  ["📦", "Order ORD-2401 masuk QC",              "Tebet · 8 min lalu"],
                  ["🛵", "Kurir Budi pickup ORD-2405",           "Bekasi · 12 min lalu"],
                  ["⭐", "Ulasan baru 5★ dari Sari W.",           "BSD · 22 min lalu"],
                  ["🎟️", "Voucher CUCI20 digunakan 8×",          "All branches · 1 jam lalu"],
                ].map((e: any, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100">{e[0]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-800">{e[1]}</div>
                      <div className="text-slate-500">{e[2]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card>
            <CardHeader title="Orders Per Hour" subtitle="Hari ini" />
            <div className="px-3 pb-2 pt-3">
              <BarChart
                values={[2,4,6,9,12,15,18,22,16,12,8,5]}
                labels={["8","9","10","11","12","13","14","15","16","17","18","19"]}
                color="#14b8a6"
                height={160}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Processing Capacity" subtitle="Beban tiap stasiun" />
            <div className="space-y-3 px-5 py-4">
              {[["Cuci", 86, "bg-cyan-500"],["Setrika", 72, "bg-purple-500"],["QC", 54, "bg-indigo-500"],["Packing", 38, "bg-orange-500"]].map(([n,p,c]:any)=>(
                <div key={n}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-700">{n}</span>
                    <span style={{ fontWeight: 600 }}>{p}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${c}`} style={{ width: `${p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Payment Mix Today" subtitle="QRIS · Debit · Cash" />
            <div className="grid grid-cols-3 gap-3 px-5 py-4">
              {[["QRIS","Rp7,1jt","57%","bg-teal-500"],["Debit","Rp3,2jt","26%","bg-blue-500"],["Cash","Rp2,1jt","17%","bg-slate-400"]].map(([n,v,p,c]:any)=>(
                <div key={n} className="rounded-lg border border-slate-200 p-3">
                  <div className={`mb-2 inline-flex h-1.5 w-8 rounded-full ${c}`} />
                  <div className="text-xs text-slate-500">{n}</div>
                  <div className="text-slate-900" style={{ fontWeight: 700 }}>{v}</div>
                  <div className="text-[10px] text-slate-500">{p} share</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
