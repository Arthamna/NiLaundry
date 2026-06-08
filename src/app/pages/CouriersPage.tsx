import { Avatar, BarChart, Card, CardHeader, KpiCard, StatusPill } from "../components/ds/primitives";
import { PageBody, SecondaryButton, Topbar } from "../components/layout/Shell";
import { Bike, MapPin, Package, Timer, Truck } from "lucide-react";

const COURIERS = [
  { name: "Budi Santoso",   branch: "Tebet",   vehicle: "B 4421 KZA · Motor", pickups: 84, deliveries: 184, success: 99.4, rating: 4.9, status: "Mengantar",  task: "NL-2399" },
  { name: "Eka Nurhayati",  branch: "Tebet",   vehicle: "B 9091 KZA · Motor", pickups: 72, deliveries: 162, success: 98.8, rating: 4.8, status: "Mengantar",  task: "NL-2400" },
  { name: "Andi Wijaya",    branch: "Kemang",  vehicle: "B 7782 LMA · Motor", pickups: 66, deliveries: 149, success: 97.2, rating: 4.8, status: "Menjemput",  task: "NL-2410" },
  { name: "Tono Saputra",   branch: "BSD",     vehicle: "B 6512 OPA · Motor", pickups: 58, deliveries: 128, success: 98.1, rating: 4.7, status: "Idle",       task: "—" },
  { name: "Rio Aditya",     branch: "Bekasi",  vehicle: "B 3321 MMA · Motor", pickups: 49, deliveries: 110, success: 96.4, rating: 4.7, status: "Mengantar",  task: "NL-2405" },
  { name: "Hendra Pradana", branch: "Bandung", vehicle: "D 8812 KLA · Mobil", pickups: 41, deliveries: 98,  success: 95.1, rating: 4.6, status: "Off-duty",   task: "—" },
];

export function CouriersPage() {
  return (
    <>
      <Topbar
        title="Couriers & Delivery"
        breadcrumb={["NiLaundry", "Operations", "Couriers"]}
        action={<><SecondaryButton>Routes</SecondaryButton><SecondaryButton>Add Courier</SecondaryButton></>}
      />
      <PageBody>
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Active Couriers"  value="8 / 10" delta="2 off-duty" deltaTone="flat" icon={<Bike size={16} />} />
          <KpiCard label="Deliveries Today" value="42"     delta="+8"  icon={<Truck size={16} />} />
          <KpiCard label="Pickup Tasks"     value="14"     delta="+3"  icon={<Package size={16} />} />
          <KpiCard label="Avg Delivery"     value="38 min" delta="-4 min" deltaTone="up" icon={<Timer size={16} />} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader title="Live Courier Map" subtitle="Jakarta · Realtime" action={<SecondaryButton><MapPin size={14} /> Center map</SecondaryButton>} />
            <div className="relative m-4 h-64 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-slate-100">
              <svg className="absolute inset-0 h-full w-full opacity-60">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M 50 200 Q 200 80 400 160 T 720 100" fill="none" stroke="#14b8a6" strokeWidth="3" strokeDasharray="6 4" />
                <path d="M 100 50 Q 250 180 450 220 T 700 240" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" />
              </svg>
              {[
                ["Budi", "20%", "32%", "bg-teal-600"],
                ["Eka",  "62%", "48%", "bg-teal-600"],
                ["Andi", "40%", "70%", "bg-indigo-600"],
                ["Rio",  "78%", "30%", "bg-teal-600"],
              ].map(([n,l,t,c]: any) => (
                <div key={n} className="absolute" style={{ left: l, top: t }}>
                  <div className={`grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${c} text-[10px] text-white shadow-lg ring-2 ring-white`} style={{ fontWeight: 700 }}>
                    {n[0]}
                  </div>
                </div>
              ))}
              <div className="absolute bottom-3 right-3 rounded-md border border-slate-200 bg-white/90 px-2 py-1 text-[10px] text-slate-600 backdrop-blur">DKI Jakarta</div>
              <div className="absolute bottom-3 left-3 flex gap-1.5 rounded-md border border-slate-200 bg-white/90 px-2 py-1 text-[10px] text-slate-600 backdrop-blur">
                <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-teal-600" /> Delivery</span>
                <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Pickup</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Delivery Volume" subtitle="7 hari terakhir" />
            <div className="px-3 pb-3 pt-3">
              <BarChart values={[28,34,30,38,42,46,42]} labels={["S","M","T","W","T","F","S"]} height={180} />
            </div>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader title="Couriers" subtitle="Top performers · 30 hari" action={<SecondaryButton>Export</SecondaryButton>} />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>Courier</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Branch</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Vehicle</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Pickups</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Deliveries</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Success</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Rating</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Status</th>
                <th className="px-5 text-right" style={{ fontWeight: 600 }}>Active Task</th>
              </tr>
            </thead>
            <tbody>
              {COURIERS.map((c) => (
                <tr key={c.name} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} size={32} />
                      <div className="text-slate-900" style={{ fontWeight: 500 }}>{c.name}</div>
                    </div>
                  </td>
                  <td className="text-slate-600">{c.branch}</td>
                  <td className="text-slate-500">{c.vehicle}</td>
                  <td>{c.pickups}</td>
                  <td className="text-slate-900" style={{ fontWeight: 600 }}>{c.deliveries}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-slate-100">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${c.success}%` }} />
                      </div>
                      <span className="text-xs">{c.success}%</span>
                    </div>
                  </td>
                  <td className="text-amber-600">★ {c.rating}</td>
                  <td>
                    <StatusPill tone={c.status === "Idle" ? "neutral" : c.status === "Off-duty" ? "neutral" : c.status === "Menjemput" ? "info" : "primary"}>{c.status}</StatusPill>
                  </td>
                  <td className="px-5 text-right text-slate-700">{c.task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </PageBody>
    </>
  );
}
