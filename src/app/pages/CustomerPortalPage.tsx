import { useState } from "react";
import { Avatar, Card, OrderStatusBadge, StatusPill } from "../components/ds/primitives";
import { PageBody, Topbar } from "../components/layout/Shell";
import { Bell, ChevronRight, Home, Receipt, Search, Star, TicketPercent, User } from "lucide-react";

type View = "home" | "orders" | "vouchers" | "notifications" | "profile" | "review";

export function CustomerPortalPage() {
  const [view, setView] = useState<View>("home");
  return (
    <>
      <Topbar
        title="Customer App Preview"
        breadcrumb={["NiLaundry", "Preview", "Customer App"]}
      />
      <PageBody>
        <div className="mb-4 rounded-xl border border-teal-200 bg-teal-50/60 px-5 py-3 text-sm text-teal-900">
          <span style={{ fontWeight: 600 }}>Customer-facing experience.</span> Mobile-first dengan bottom navigation —
          mockup 390px untuk pratinjau di desktop.
        </div>

        <div className="grid grid-cols-3 gap-6">
          {(["home","orders","vouchers"] as View[]).map((v) => (
            <Phone key={v} title={titleFor(v)} active={v === view} onClick={() => setView(v)}>
              {renderView(v)}
            </Phone>
          ))}
          {(["notifications","profile","review"] as View[]).map((v) => (
            <Phone key={v} title={titleFor(v)} active={v === view} onClick={() => setView(v)}>
              {renderView(v)}
            </Phone>
          ))}
        </div>
      </PageBody>
    </>
  );
}

function titleFor(v: View) {
  return ({
    home: "Home",
    orders: "Order Detail",
    vouchers: "Voucher Center",
    notifications: "Notifications",
    profile: "Profile",
    review: "Review & Rating",
  } as Record<View, string>)[v];
}

function Phone({ children, title, active, onClick }: { children: React.ReactNode; title: string; active?: boolean; onClick?: () => void }) {
  return (
    <div className="mx-auto">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-slate-500" style={{ fontWeight: 600 }}>{title}</div>
        <button onClick={onClick} className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-teal-600 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>
          {active ? "Active" : "Preview"}
        </button>
      </div>
      <div className="mx-auto h-[760px] w-[380px] overflow-hidden rounded-[40px] border-[10px] border-slate-900 bg-slate-50 shadow-2xl">
        <div className="relative h-full">
          <div className="absolute left-1/2 top-2 z-30 h-5 w-32 -translate-x-1/2 rounded-full bg-slate-900" />
          <div className="flex h-full flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}

function renderView(v: View) {
  switch (v) {
    case "home": return <HomeView />;
    case "orders": return <OrderDetailView />;
    case "vouchers": return <VoucherView />;
    case "notifications": return <NotifView />;
    case "profile": return <ProfileView />;
    case "review": return <ReviewView />;
  }
}

function MobileHeader({ title }: { title: string }) {
  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-5 pb-5 pt-10 text-white">
      <div className="flex items-center justify-between text-[11px] opacity-80">
        <span>9:41</span>
        <span>NiLaundry</span>
      </div>
      <h2 className="mt-2" style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const items = [
    ["Home", Home, "home"],
    ["Orders", Receipt, "orders"],
    ["Voucher", TicketPercent, "vouchers"],
    ["Inbox", Bell, "notifications"],
    ["Profile", User, "profile"],
  ] as const;
  return (
    <div className="border-t border-slate-200 bg-white px-2 py-1.5">
      <div className="flex items-center justify-around">
        {items.map(([l, Icon, k]) => {
          const isActive = active === k;
          return (
            <div key={l} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${isActive ? "text-teal-700" : "text-slate-400"}`}>
              <Icon size={18} />
              <span className="text-[10px]" style={{ fontWeight: isActive ? 600 : 500 }}>{l}</span>
              {isActive && <div className="h-0.5 w-5 rounded-full bg-teal-600" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HomeView() {
  return (
    <>
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-5 pb-12 pt-10 text-white">
        <div className="flex items-center justify-between text-[11px] opacity-80">
          <span>9:41</span>
          <span>● NiLaundry</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Avatar name="Andini Pratama" size={44} />
          <div>
            <div className="text-xs opacity-80">Halo,</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Andini 👋</div>
          </div>
          <div className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-1 text-[11px]">
            <Star size={10} /> Gold Member
          </div>
        </div>
        <div className="mt-4 flex h-9 items-center gap-2 rounded-xl bg-white/15 px-3 text-sm text-white/90 backdrop-blur">
          <Search size={14} /> Cari layanan atau order…
        </div>
      </div>

      <div className="-mt-8 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 pb-2 pt-1">
        <div className="grid grid-cols-3 gap-2">
          {[["Active","2","📦"],["Vouchers","3","🎟️"],["Saved","Rp 45k","💰"]].map(([l,v,i]) => (
            <div key={l} className="rounded-xl bg-white p-3 shadow-sm">
              <div className="text-lg">{i}</div>
              <div className="mt-1 text-[10px] text-slate-500">{l}</div>
              <div className="text-slate-900" style={{ fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm" style={{ fontWeight: 700 }}>Active Order</div>
            <span className="text-[11px] text-teal-700">Lihat semua</span>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">#NL-2401</div>
                <div className="text-sm" style={{ fontWeight: 600 }}>Cuci Setrika Reguler</div>
              </div>
              <OrderStatusBadge status="DISETRIKA" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5 text-[9px]">
              {["Pickup","Cuci","Setrika","Antar"].map((s,i) => (
                <div key={s}>
                  <div className={`h-1 rounded-full ${i <= 2 ? "bg-teal-500" : "bg-slate-200"}`} />
                  <div className={`mt-1 ${i <= 2 ? "text-slate-700" : "text-slate-400"}`}>{s}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">ETA hari ini · 14:00 WIB</div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-2 text-sm" style={{ fontWeight: 700 }}>Recent Notifications</div>
          {[
            ["📦","Pesanan ORD-2399 siap diantar","10 mnt"],
            ["💳","Pembayaran berhasil","1 jam"],
          ].map((n:any) => (
            <div key={n[1]} className="flex items-center gap-2 border-t border-slate-100 py-2 text-xs first:border-0 first:pt-0">
              <span>{n[0]}</span>
              <span className="flex-1 text-slate-700">{n[1]}</span>
              <span className="text-[10px] text-slate-400">{n[2]}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-dashed border-teal-300 bg-teal-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm" style={{ fontWeight: 700 }}>Active Voucher</div>
              <div className="text-[11px] text-slate-600">CUCI20 · 20% off s/d Rp 30k</div>
            </div>
            <StatusPill tone="success">Active</StatusPill>
          </div>
        </div>
      </div>

      <button className="absolute bottom-20 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-3 text-sm text-white shadow-lg" style={{ fontWeight: 600 }}>
        + New Order
      </button>

      <BottomNav active="home" />
    </>
  );
}

function OrderDetailView() {
  const tl = [
    ["Pickup Assigned","06 Jun 09:12","done"],
    ["Pickup Completed","06 Jun 10:35","done"],
    ["Processing","06 Jun 11:00","done"],
    ["Washing","06 Jun 13:00","done"],
    ["Ironing","Est. 07 Jun 11:00","active"],
    ["QC","—","pending"],
    ["Delivery","Est. 07 Jun 14:00","pending"],
  ];
  return (
    <>
      <MobileHeader title="Order Detail" />
      <div className="-mt-3 flex-1 overflow-y-auto bg-slate-50 px-4 pb-2 pt-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500">#NL-2401</div>
              <div className="text-sm" style={{ fontWeight: 700 }}>Cuci Setrika Reguler</div>
            </div>
            <OrderStatusBadge status="DISETRIKA" />
          </div>
          <div className="mt-3">
            {tl.map((t:any, i) => (
              <div key={t[0]} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${t[2]==="done"?"bg-teal-600":t[2]==="active"?"bg-amber-500 ring-4 ring-amber-100":"bg-slate-300"}`} />
                  {i < tl.length - 1 && <div className={`w-px flex-1 ${t[2]==="done"?"bg-teal-300":"bg-slate-200"}`} />}
                </div>
                <div className="pb-2 text-xs">
                  <div className={`${t[2]==="active"?"text-slate-900":"text-slate-700"}`} style={{ fontWeight: t[2]==="active"?600:500 }}>{t[0]}</div>
                  <div className="text-[10px] text-slate-500">{t[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-3 p-3">
          <div className="text-xs" style={{ fontWeight: 700 }}>Services</div>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between"><span>Cuci Setrika 3kg</span><span>Rp 30.000</span></div>
            <div className="flex justify-between"><span>Pewangi Premium</span><span>Rp 5.000</span></div>
            <div className="flex justify-between"><span>Pickup & Delivery</span><span>Rp 10.000</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-1 text-teal-700"><span>Voucher CUCI20</span><span>-Rp 9.000</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-1 text-slate-900" style={{ fontWeight: 700 }}><span>Total</span><span>Rp 36.000</span></div>
          </div>
        </Card>

        <Card className="mt-3 flex items-center gap-3 p-3">
          <Avatar name="Budi Santoso" size={36} />
          <div className="flex-1 text-xs">
            <div style={{ fontWeight: 700 }}>Budi Santoso</div>
            <div className="text-slate-500">Motor · B 4421 KZA</div>
          </div>
          <button className="rounded-full bg-teal-600 px-3 py-1.5 text-[11px] text-white" style={{ fontWeight: 600 }}>Chat</button>
        </Card>
      </div>
      <BottomNav active="orders" />
    </>
  );
}

function VoucherView() {
  return (
    <>
      <MobileHeader title="Vouchers" />
      <div className="-mt-3 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 pb-2 pt-3">
        <div className="flex gap-1.5">
          {["Active","Used","Expired"].map((t,i) => (
            <span key={t} className={`rounded-full px-3 py-1 text-[11px] ${i===0 ? "bg-teal-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{t}</span>
          ))}
        </div>
        {[
          ["CUCI20","Diskon 20% · Cuci Setrika","Rp 30.000","12 hari lagi"],
          ["GRATIS-ONGKIR","Gratis pickup & antar","Rp 10.000","3 hari lagi"],
          ["DRYCLEAN30","Dry Clean 30% off","Rp 45.000","21 hari lagi"],
        ].map((v:any) => (
          <div key={v[0]} className="relative overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex">
              <div className="flex w-24 flex-col items-center justify-center bg-gradient-to-b from-teal-600 to-teal-700 px-2 py-3 text-white">
                <div className="text-[9px] opacity-80">HEMAT</div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{v[2]}</div>
              </div>
              <div className="flex-1 p-3">
                <div className="text-sm" style={{ fontWeight: 800 }}>{v[0]}</div>
                <div className="text-[11px] text-slate-600">{v[1]}</div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{v[3]}</span>
                  <button className="rounded-full bg-teal-50 px-2 py-0.5 text-teal-700" style={{ fontWeight: 700 }}>Apply</button>
                </div>
              </div>
            </div>
            <div className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-slate-50" />
            <div className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-slate-50" />
          </div>
        ))}
      </div>
      <BottomNav active="vouchers" />
    </>
  );
}

function NotifView() {
  return (
    <>
      <MobileHeader title="Notifications" />
      <div className="-mt-3 flex-1 overflow-y-auto bg-white">
        <div className="flex gap-1.5 px-4 pb-3 pt-3">
          {["All","Order","Promo","Payment"].map((t,i) => (
            <span key={t} className={`rounded-full px-3 py-1 text-[11px] ${i===0 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{t}</span>
          ))}
        </div>
        <ul className="divide-y divide-slate-100">
          {[
            ["📦","Pesanan ORD-2399 siap diantar","Kurir Budi menuju lokasi Anda","10 mnt", true],
            ["💳","Pembayaran berhasil","QRIS Rp 36.000 untuk ORD-2401","1 jam", true],
            ["🎟️","Voucher baru CUCI30","Diskon 30% untuk dry clean","3 jam", true],
            ["⭐","Beri ulasan ORD-2380","Bantu kami dengan rating","Kemarin", false],
            ["🛵","Pesanan ORD-2380 sudah diantar","Terima kasih telah memesan","2 hari", false],
          ].map((n:any,i) => (
            <li key={i} className={`flex gap-3 px-4 py-3 ${n[4] ? "bg-teal-50/30" : ""}`}>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-teal-700">{n[0]}</div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span style={{ fontWeight: n[4]?700:500 }}>{n[1]}</span>
                  {n[4] && <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />}
                </div>
                <div className="text-slate-500">{n[2]}</div>
                <div className="text-[10px] text-slate-400">{n[3]} lalu</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav active="notifications" />
    </>
  );
}

function ProfileView() {
  return (
    <>
      <MobileHeader title="Profile" />
      <div className="-mt-3 flex-1 overflow-y-auto bg-slate-50 px-4 pb-2 pt-3">
        <Card className="p-4 text-center">
          <Avatar name="Andini Pratama" size={64} />
          <div className="mt-2 text-sm" style={{ fontWeight: 700 }}>Andini Pratama</div>
          <div className="text-[11px] text-slate-500">+62 812-3344-7788</div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700 ring-1 ring-amber-200">
            <Star size={10} /> Gold Member · 1.240 points
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div><div style={{ fontWeight: 700 }}>42</div><div className="text-[10px] text-slate-500">Orders</div></div>
            <div><div style={{ fontWeight: 700 }}>Rp 3,2jt</div><div className="text-[10px] text-slate-500">Lifetime</div></div>
            <div><div style={{ fontWeight: 700 }}>4.8★</div><div className="text-[10px] text-slate-500">Rating</div></div>
          </div>
        </Card>

        <Card className="mt-3">
          {[
            ["Addresses","3 alamat tersimpan"],
            ["Payment Methods","QRIS · BCA Debit"],
            ["Vouchers","3 aktif"],
            ["Help Center","FAQ & kontak"],
            ["Sign out",""],
          ].map(([t,d]:any,i,a) => (
            <button key={t} className={`flex w-full items-center gap-3 px-4 py-3 text-left ${i<a.length-1 ? "border-b border-slate-100" : ""}`}>
              <div className="flex-1">
                <div className="text-sm" style={{ fontWeight: 600 }}>{t}</div>
                {d && <div className="text-[11px] text-slate-500">{d}</div>}
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          ))}
        </Card>
      </div>
      <BottomNav active="profile" />
    </>
  );
}

function ReviewView() {
  return (
    <>
      <MobileHeader title="Beri Ulasan" />
      <div className="-mt-3 flex-1 overflow-y-auto bg-slate-50 px-4 pb-2 pt-3">
        <Card className="p-4 text-center">
          <div className="text-[11px] text-slate-500">#NL-2380 · Dry Clean Premium</div>
          <div className="mt-3 flex justify-center gap-1 text-3xl">
            {[1,2,3,4,5].map(s => (<span key={s} className={s<=4?"text-amber-400":"text-slate-300"}>★</span>))}
          </div>
          <div className="text-xs text-slate-500">Sangat bagus!</div>
        </Card>
        <Card className="mt-3 p-4">
          <div className="text-xs" style={{ fontWeight: 700 }}>Apa yang Anda suka?</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Wangi","Bersih","Cepat","Ramah","Rapi","Kemasan"].map((t,i) => (
              <span key={t} className={`rounded-full px-2.5 py-1 text-[11px] ${i<3 ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"}`}>{t}</span>
            ))}
          </div>
          <textarea className="mt-3 h-20 w-full rounded-md border border-slate-200 bg-white p-2 text-xs" placeholder="Ceritakan pengalamanmu…" />
          <button className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-dashed border-slate-300 py-2 text-xs text-slate-500">
            + Tambah foto
          </button>
          <button className="mt-3 w-full rounded-md bg-teal-600 py-2.5 text-sm text-white" style={{ fontWeight: 700 }}>
            Kirim Ulasan
          </button>
        </Card>
      </div>
      <BottomNav active="profile" />
    </>
  );
}
