import { Card, FilterChip } from "../components/ds/primitives";
import { PageBody, SecondaryButton, Topbar } from "../components/layout/Shell";
import { Bell, CheckCheck, Search, Settings } from "lucide-react";

const ITEMS = [
  ["📦", "Order ORD-2399 siap diantar", "Customer Andini sudah dapat notifikasi pickup",            "10 menit lalu",  true,  "Order"],
  ["💳", "Pembayaran QRIS Rp145.000 sukses", "INV-2402 dari Rizal Kurniawan",                       "32 menit lalu",  true,  "Payment"],
  ["🎟️", "Voucher CUCI20 telah di-redeem 50× dari 100", "Promo cuci 20% berjalan stabil",          "1 jam lalu",      true,  "Voucher"],
  ["⭐", "Ulasan baru 5★ dari Sari Wulandari", "“Wangi banget, kemasannya rapi banget!”",            "2 jam lalu",      false, "Review"],
  ["🛵", "Kurir Andi Wijaya pickup ORD-2410", "Kemang · estimasi tiba 28 menit",                    "3 jam lalu",      false, "Courier"],
  ["⚠️", "Stok deterjen Cabang BSD < 20%",   "Perlu re-order ke supplier dalam 24 jam",            "Kemarin",         false, "System"],
  ["🎉", "Cabang Tebet capai target harian",  "142 pesanan diselesaikan, +18% vs target",           "Kemarin",         false, "System"],
  ["📉", "Drop rating Cabang Bandung",        "Rating turun ke 4.5 — review terbaru: lipatan kurang rapi", "2 hari lalu", false, "Review"],
];

export function NotificationsPage() {
  return (
    <>
      <Topbar
        title="Notifications Inbox"
        breadcrumb={["NiLaundry", "Notifications"]}
        action={<><SecondaryButton><CheckCheck size={14} /> Mark all read</SecondaryButton><SecondaryButton><Settings size={14} /> Preferences</SecondaryButton></>}
      />
      <PageBody>
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="text-xs text-slate-500">Unread</div>
            <div className="mt-1 text-slate-900" style={{ fontSize: 28, fontWeight: 700 }}>3</div>
            <div className="mt-1 text-xs text-teal-700">2 butuh tindakan</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-slate-500">Sent today</div>
            <div className="mt-1 text-slate-900" style={{ fontSize: 28, fontWeight: 700 }}>248</div>
            <div className="mt-1 text-xs text-slate-500">182 push · 66 email</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-slate-500">Delivery rate</div>
            <div className="mt-1 text-slate-900" style={{ fontSize: 28, fontWeight: 700 }}>98.4%</div>
            <div className="mt-1 text-xs text-emerald-600">+0.6% vs minggu lalu</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-slate-500">Open rate</div>
            <div className="mt-1 text-slate-900" style={{ fontSize: 28, fontWeight: 700 }}>72.1%</div>
            <div className="mt-1 text-xs text-emerald-600">+2.3% vs minggu lalu</div>
          </Card>
        </div>

        <Card className="mt-4">
          <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm">
              <Search size={14} className="text-slate-400" />
              <input className="flex-1 bg-transparent outline-none placeholder:text-slate-400" placeholder="Cari notifikasi…" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 px-5 py-2.5">
            <FilterChip label="All" active count={ITEMS.length} />
            <FilterChip label="Unread" count={3} />
            <FilterChip label="Read" count={5} />
            <span className="mx-2 text-slate-300">·</span>
            <FilterChip label="Order" count={1} />
            <FilterChip label="Payment" count={1} />
            <FilterChip label="Voucher" count={1} />
            <FilterChip label="Review" count={2} />
            <FilterChip label="Courier" count={1} />
            <FilterChip label="System" count={2} />
          </div>
          <ul className="divide-y divide-slate-100">
            {ITEMS.map((n: any, i) => (
              <li key={i} className={`group flex gap-3 px-5 py-3.5 transition hover:bg-slate-50 ${n[4] ? "bg-teal-50/30" : ""}`}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-lg ring-1 ring-slate-200">{n[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900" style={{ fontWeight: n[4] ? 600 : 500 }}>{n[1]}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">{n[5]}</span>
                    {n[4] && <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />}
                  </div>
                  <div className="text-xs text-slate-500">{n[2]}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[11px] text-slate-400">{n[3]}</div>
                  <div className="mt-1 opacity-0 transition group-hover:opacity-100">
                    <button className="text-[11px] text-teal-700" style={{ fontWeight: 600 }}>View →</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </PageBody>
    </>
  );
}
