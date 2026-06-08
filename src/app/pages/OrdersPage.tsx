import { useState } from "react";
import { Card, CardHeader, FilterChip, KpiCard, OrderStatusBadge, ORDER_STATUS_KEYS, ORDER_STATUS_LABEL, OrderStatus, Avatar } from "../components/ds/primitives";
import { NewOrderButton, PageBody, PrimaryButton, SecondaryButton, Topbar } from "../components/layout/Shell";
import { Activity, AlertCircle, Calendar, CheckCircle2, ChevronDown, Filter, Inbox, Package, Search, X } from "lucide-react";

const ORDERS: { id: string; cust: string; phone: string; svc: string; items: number; branch: string; status: OrderStatus; eta: string; total: string; method: string; paid: boolean; priority: "Low" | "Normal" | "High" | "Urgent" }[] = [
  { id: "NL-2401", cust: "Andini Pratama", phone: "0812-3344-7788", svc: "Cuci Setrika Reguler",  items: 3, branch: "Tebet",   status: "DISETRIKA",      eta: "Hari ini · 14:00", total: "Rp 45.000", method: "QRIS",  paid: true,  priority: "High" },
  { id: "NL-2402", cust: "Rizal Kurniawan", phone: "0813-9988-1122", svc: "Dry Clean Jas",         items: 2, branch: "Kemang",  status: "DICUCI",         eta: "Besok · 10:00",     total: "Rp 145.000", method: "Debit", paid: true,  priority: "Normal" },
  { id: "NL-2403", cust: "Sari Wulandari",  phone: "0857-2200-1144", svc: "Sepatu Premium",         items: 1, branch: "BSD",     status: "DIPROSES",       eta: "Besok · 16:00",     total: "Rp 62.000", method: "Cash",  paid: false, priority: "Normal" },
  { id: "NL-2404", cust: "Doni Saputra",    phone: "0821-7766-5544", svc: "Cuci Express 1kg",       items: 1, branch: "Tebet",   status: "QC",             eta: "Hari ini · 18:00",  total: "Rp 40.000", method: "QRIS",  paid: true,  priority: "Urgent" },
  { id: "NL-2405", cust: "Lia Anggraini",   phone: "0811-2233-4455", svc: "Bed Cover King",         items: 1, branch: "Bekasi",  status: "PICKUP",         eta: "Lusa · 12:00",      total: "Rp 220.000", method: "Debit", paid: true,  priority: "Normal" },
  { id: "NL-2406", cust: "Bayu Triyanto",   phone: "0858-9911-3344", svc: "Cuci Setrika 4kg",       items: 4, branch: "BSD",     status: "SIAP_DIKIRIM",   eta: "Hari ini · 17:30",  total: "Rp 75.000", method: "QRIS",  paid: true,  priority: "High" },
  { id: "NL-2407", cust: "Mira Setyowati",  phone: "0812-0099-8877", svc: "Cuci Setrika Reguler",   items: 2, branch: "Kemang",  status: "DIKIRIM",        eta: "Hari ini · 15:00",  total: "Rp 48.000", method: "Cash",  paid: false, priority: "Normal" },
  { id: "NL-2408", cust: "Andre Wibowo",    phone: "0852-1122-9988", svc: "Dry Clean Kemeja",       items: 3, branch: "Tebet",   status: "MENUNGGU_PICKUP",eta: "Hari ini · 11:30",  total: "Rp 96.000", method: "QRIS",  paid: false, priority: "Urgent" },
  { id: "NL-2409", cust: "Putri Maharani",  phone: "0813-3344-2200", svc: "Boneka Besar",            items: 1, branch: "Bandung", status: "SELESAI",        eta: "Selesai · 11:42",   total: "Rp 85.000", method: "QRIS",  paid: true,  priority: "Low" },
  { id: "NL-2410", cust: "Hendra Pradana",  phone: "0857-1100-3322", svc: "Karpet Besar",            items: 1, branch: "Bandung", status: "DIBATALKAN",     eta: "—",                  total: "Rp 180.000", method: "—",     paid: false, priority: "Low" },
];

export function OrdersPage({ onOpenOrder }: { onOpenOrder: (id: string) => void }) {
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const filtered = tab === "all" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  return (
    <>
      <Topbar
        title="Orders"
        breadcrumb={["NiLaundry", "Orders"]}
        action={<>
          <SecondaryButton><Calendar size={14} /> Last 7 days</SecondaryButton>
          <NewOrderButton />
        </>}
      />
      <PageBody>
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Incoming Orders"   value="14" delta="+3"  hint="vs kemarin" icon={<Inbox size={16} />} />
          <KpiCard label="In Processing"     value="27" delta="8 hampir selesai" deltaTone="flat" icon={<Activity size={16} />} />
          <KpiCard label="Completed Today"   value="19" delta="+22%" icon={<CheckCircle2 size={16} />} />
          <KpiCard label="Urgent / Overdue"  value="3"  delta="butuh perhatian" deltaTone="down" icon={<AlertCircle size={16} />} />
        </div>

        <Card className="mt-4">
          <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm">
              <Search size={14} className="text-slate-400" />
              <input className="flex-1 bg-transparent text-slate-700 outline-none placeholder:text-slate-400" placeholder="Cari order ID, customer, atau service…" />
            </div>
            <SecondaryButton><Filter size={14} /> Branch <ChevronDown size={12} /></SecondaryButton>
            <SecondaryButton>Priority <ChevronDown size={12} /></SecondaryButton>
            <SecondaryButton>Payment <ChevronDown size={12} /></SecondaryButton>
            <SecondaryButton><Calendar size={14} /> Date</SecondaryButton>
            <PrimaryButton>Apply</PrimaryButton>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 px-5 py-2.5">
            <FilterChip label="All" active={tab === "all"} onClick={() => setTab("all")} count={ORDERS.length} />
            {ORDER_STATUS_KEYS.map((k) => (
              <FilterChip
                key={k}
                label={ORDER_STATUS_LABEL(k)}
                active={tab === k}
                onClick={() => setTab(k)}
                count={ORDERS.filter((o) => o.status === k).length}
              />
            ))}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="w-8 px-5 py-2.5"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="text-left" style={{ fontWeight: 600 }}>Order</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Customer</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Service</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Branch</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Priority</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Status</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Deadline</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Payment</th>
                <th className="px-5 text-right" style={{ fontWeight: 600 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50" onClick={() => onOpenOrder(o.id)}>
                  <td className="px-5 py-3"><input type="checkbox" className="rounded border-slate-300" onClick={(e) => e.stopPropagation()} /></td>
                  <td className="text-slate-900" style={{ fontWeight: 600 }}>#{o.id}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={o.cust} size={28} />
                      <div className="leading-tight">
                        <div className="text-slate-900" style={{ fontWeight: 500 }}>{o.cust}</div>
                        <div className="text-[11px] text-slate-500">{o.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="leading-tight">
                      <div className="text-slate-800">{o.svc}</div>
                      <div className="text-[11px] text-slate-500">{o.items} item</div>
                    </div>
                  </td>
                  <td className="text-slate-600">{o.branch}</td>
                  <td>
                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] ring-1 ring-inset ${
                      o.priority === "Urgent" ? "bg-rose-50 text-rose-700 ring-rose-200" :
                      o.priority === "High"   ? "bg-amber-50 text-amber-700 ring-amber-200" :
                      o.priority === "Normal" ? "bg-slate-100 text-slate-700 ring-slate-200" :
                                                "bg-slate-50 text-slate-500 ring-slate-200"
                    }`}>{o.priority}</span>
                  </td>
                  <td><OrderStatusBadge status={o.status} /></td>
                  <td className="text-slate-600">{o.eta}</td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-700">{o.method}</span>
                      {o.paid ? (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700 ring-1 ring-emerald-200">Paid</span>
                      ) : (
                        <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] text-rose-700 ring-1 ring-rose-200">Unpaid</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 text-right text-slate-900" style={{ fontWeight: 600 }}>{o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
            <span>Menampilkan {filtered.length} dari {ORDERS.length} order</span>
            <div className="flex items-center gap-1">
              <button className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">‹</button>
              <button className="rounded bg-teal-600 px-2 py-1 text-white">1</button>
              <button className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">2</button>
              <button className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">3</button>
              <button className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">›</button>
            </div>
          </div>
        </Card>
      </PageBody>
    </>
  );
}

// Order detail drawer (Frame 03 + Frame 09)
export function OrderDetailDrawer({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const o = ORDERS.find((x) => x.id === orderId) ?? ORDERS[0];
  const timeline = [
    { label: "Pickup Assigned",   ts: "06 Jun 09:12", state: "done" },
    { label: "Pickup Completed",  ts: "06 Jun 10:35", state: "done" },
    { label: "Processing",        ts: "06 Jun 11:00", state: "done" },
    { label: "Washing",           ts: "06 Jun 13:00", state: "done" },
    { label: "Ironing",           ts: "Est. 07 Jun 11:00", state: "active" },
    { label: "QC",                ts: "—", state: "pending" },
    { label: "Delivery",          ts: "Est. 07 Jun 14:00", state: "pending" },
    { label: "Completed",         ts: "—", state: "pending" },
  ];
  return (
    <div className="fixed inset-0 z-30 flex">
      <div className="flex-1 bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose} />
      <aside className="flex w-[640px] flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="text-[11px] text-slate-500">Order Detail</div>
            <div className="flex items-center gap-2">
              <h2 className="text-slate-900" style={{ fontSize: 18, fontWeight: 700 }}>#{o.id}</h2>
              <OrderStatusBadge status={o.status} />
            </div>
            <div className="mt-1 text-xs text-slate-500">Dibuat 06 Jun 2026 · Cabang {o.branch}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <Avatar name={o.cust} size={40} />
              <div className="flex-1">
                <div className="text-slate-900" style={{ fontWeight: 600 }}>{o.cust}</div>
                <div className="text-xs text-slate-500">{o.phone} · Member Gold</div>
              </div>
              <SecondaryButton>Lihat profil</SecondaryButton>
            </div>
          </div>

          <h4 className="mt-5 mb-2 text-xs uppercase tracking-wider text-slate-500" style={{ fontWeight: 600 }}>Timeline</h4>
          <div className="rounded-xl border border-slate-200 p-4">
            {timeline.map((t, i) => (
              <div key={t.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${
                    t.state === "done" ? "bg-teal-600" :
                    t.state === "active" ? "bg-amber-500 ring-4 ring-amber-100" :
                    "bg-slate-300"
                  }`} />
                  {i < timeline.length - 1 && <div className={`w-px flex-1 ${t.state === "done" ? "bg-teal-300" : "bg-slate-200"}`} />}
                </div>
                <div className="pb-3">
                  <div className={`text-sm ${t.state === "active" ? "text-slate-900" : "text-slate-700"}`} style={{ fontWeight: t.state === "active" ? 600 : 500 }}>{t.label}</div>
                  <div className="text-xs text-slate-500">{t.ts}</div>
                </div>
              </div>
            ))}
          </div>

          <h4 className="mt-5 mb-2 text-xs uppercase tracking-wider text-slate-500" style={{ fontWeight: 600 }}>Laundry Services</h4>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr><th className="px-4 py-2 text-left" style={{ fontWeight: 600 }}>Service</th><th className="text-left" style={{ fontWeight: 600 }}>Qty</th><th className="text-left" style={{ fontWeight: 600 }}>Unit</th><th className="px-4 text-right" style={{ fontWeight: 600 }}>Subtotal</th></tr>
              </thead>
              <tbody>
                {[
                  ["Cuci Setrika Reguler", "3", "kg", "Rp 30.000"],
                  ["Pewangi Premium",     "1", "pcs", "Rp 5.000"],
                  ["Pickup & Delivery",   "1", "trip", "Rp 10.000"],
                ].map((r) => (
                  <tr key={r[0]} className="border-t border-slate-100">
                    <td className="px-4 py-2.5">{r[0]}</td><td>{r[1]}</td><td className="text-slate-500">{r[2]}</td><td className="px-4 text-right">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 text-xs uppercase tracking-wider text-slate-500" style={{ fontWeight: 600 }}>Payment</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>Rp 45.000</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Voucher CUCI20</span><span className="text-teal-700">-Rp 9.000</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2" style={{ fontWeight: 700 }}><span>Total</span><span>Rp 36.000</span></div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-emerald-200">
                <span>{o.method}</span>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] text-white">PAID</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 text-xs uppercase tracking-wider text-slate-500" style={{ fontWeight: 600 }}>Courier</div>
              <div className="flex items-center gap-3">
                <Avatar name="Budi Santoso" size={36} />
                <div className="text-sm">
                  <div style={{ fontWeight: 600 }}>Budi Santoso</div>
                  <div className="text-[11px] text-slate-500">Motor · B 4421 KZA</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between"><span>ETA</span><span style={{ fontWeight: 600 }}>14:00 WIB</span></div>
                <div className="flex justify-between"><span>Distance</span><span>2.4 km</span></div>
              </div>
              <SecondaryButton>Hubungi kurir</SecondaryButton>
            </div>
          </div>

          {/* Frame 09 — Inline Update Status */}
          <h4 className="mt-5 mb-2 text-xs uppercase tracking-wider text-slate-500" style={{ fontWeight: 600 }}>Update Status</h4>
          <div className="rounded-xl border border-teal-500 bg-teal-50/30 p-4 ring-4 ring-teal-100">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-xs text-slate-500">New status</label>
                <select className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm">
                  {ORDER_STATUS_KEYS.map((k) => (
                    <option key={k} value={k} selected={k === "QC"}>{ORDER_STATUS_LABEL(k)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Estimated completion</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm" defaultValue="07 Jun 2026, 14:00" />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs text-slate-500">Catatan operasional (opsional)</label>
              <textarea className="mt-1 h-16 w-full rounded-md border border-slate-200 bg-white p-2 text-sm" placeholder="Misal: noda membandel, treatment ulang…" />
            </div>
            <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" defaultChecked className="rounded border-slate-300" /> Kirim notifikasi ke pelanggan
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <SecondaryButton>Print Invoice</SecondaryButton>
          <div className="flex gap-2">
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </div>
        </div>
      </aside>
    </div>
  );
}
