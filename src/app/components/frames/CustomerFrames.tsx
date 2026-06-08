import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, FrameShell, Kpi, MiniBar, SideNavMock, StatusBadge, TopBar, customerNav } from "../shared";

function CustomerLayout({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="flex h-[760px] bg-slate-50">
      <SideNavMock role="Pelanggan" active={active} items={customerNav} />
      <div className="flex-1 overflow-hidden">
        <TopBar title="Halo, Andini 👋" role="Pelanggan" />
        <div className="h-[calc(100%-49px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function Frame01() {
  return (
    <FrameShell id="Frame 01" title="Customer Home / Dashboard" subtitle="Ringkasan pesanan aktif, notifikasi, voucher">
      <CustomerLayout active="Beranda">
        <div className="grid grid-cols-3 gap-4">
          <Kpi label="Pesanan Aktif" value="2" delta="1 sedang dicuci" icon={<span>📦</span>} />
          <Kpi label="Voucher Tersedia" value="3" delta="Hemat hingga Rp45.000" icon={<span>🎟️</span>} />
          <Kpi label="Poin Loyalty" value="1.240" delta="+120 minggu ini" icon={<span>✨</span>} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-4">
            <div className="flex items-center justify-between">
              <div className="text-slate-900" style={{ fontWeight: 600 }}>Pesanan Aktif</div>
              <Button variant="link" className="text-teal-700 h-auto p-0">Lihat semua →</Button>
            </div>
            {[
              { id: "ORD-2401", svc: "Cuci Setrika Reguler", stage: 60, status: "Diproses", eta: "Selesai besok 14:00" },
              { id: "ORD-2399", svc: "Dry Clean Premium", stage: 90, status: "Siap", eta: "Siap diantar hari ini" },
            ].map((o) => (
              <div key={o.id} className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{o.svc}</div>
                    <div className="text-xs text-slate-500">{o.id} · {o.eta}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={o.stage} className="h-1.5" />
                  <span className="text-xs text-slate-500 w-10 text-right">{o.stage}%</span>
                </div>
                <div className="mt-2 grid grid-cols-4 text-[11px] text-slate-500">
                  <div>Dijemput ✓</div><div>Dicuci ✓</div><div>Disetrika ●</div><div className="text-slate-300">Diantar</div>
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-slate-900" style={{ fontWeight: 600 }}>Notifikasi</div>
              <Badge className="bg-rose-500 hover:bg-rose-500">3 baru</Badge>
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                ["💬", "Pesanan ORD-2399 siap diantar", "10 mnt lalu"],
                ["🎟️", "Voucher CUCI20 dipakai", "1 jam lalu"],
                ["🛵", "Kurir Budi dalam perjalanan", "Kemarin"],
              ].map(([i, t, time], idx) => (
                <li key={idx} className="flex gap-2">
                  <span>{i}</span>
                  <div className="flex-1">
                    <div className="text-slate-800">{t}</div>
                    <div className="text-xs text-slate-400">{time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-slate-900" style={{ fontWeight: 600 }}>Voucher Aktif</div>
              <Button size="sm" variant="ghost" className="text-teal-700">Voucher center</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["CUCI20", "Diskon 20% s/d Rp30k", "Berlaku 12 hari lagi"],
                ["GRATIS-ONGKIR", "Gratis penjemputan", "Berlaku 3 hari lagi"],
              ].map(([code, desc, exp]) => (
                <div key={code} className="rounded-lg border border-dashed border-teal-300 bg-teal-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-teal-800" style={{ fontWeight: 600 }}>{code}</div>
                    <Badge variant="outline" className="border-teal-300 text-teal-700">Aktif</Badge>
                  </div>
                  <div className="text-sm text-slate-700 mt-1">{desc}</div>
                  <div className="text-xs text-slate-500 mt-1">{exp}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-slate-900 mb-2" style={{ fontWeight: 600 }}>Pesanan Lebih Cepat</div>
            <p className="text-sm text-slate-600">Pesan ulang layanan favoritmu dalam satu ketukan.</p>
            <Button className="mt-3 w-full bg-teal-600 hover:bg-teal-700">+ Pesan Sekarang</Button>
          </Card>
        </div>
      </CustomerLayout>
    </FrameShell>
  );
}

export function Frame02() {
  return (
    <FrameShell id="Frame 02" title="Customer Search & Profile" subtitle="Search pelanggan, profil, histori, voucher milik pelanggan">
      <CustomerLayout active="Profil">
        <div className="mb-4 flex items-center gap-3">
          <Input placeholder="Cari pelanggan berdasarkan nama…" className="max-w-md bg-white" />
          <Button variant="outline">Filter cabang</Button>
          <Button variant="outline">Periode</Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name="Andini Pratama" size={56} />
              <div>
                <div className="text-slate-900" style={{ fontWeight: 600 }}>Andini Pratama</div>
                <div className="text-xs text-slate-500">+62 812-3344-7788</div>
                <div className="text-xs text-slate-500">Member Gold · sejak 2023</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 text-center">
              <div><div style={{ fontWeight: 600 }}>42</div><div className="text-[11px] text-slate-500">Pesanan</div></div>
              <div><div style={{ fontWeight: 600 }}>Rp3,2jt</div><div className="text-[11px] text-slate-500">Total</div></div>
              <div><div style={{ fontWeight: 600 }}>4.8★</div><div className="text-[11px] text-slate-500">Rating</div></div>
            </div>
            <Button variant="outline" className="mt-4 w-full">Lihat profil lengkap</Button>
          </Card>

          <Card className="col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-slate-900" style={{ fontWeight: 600 }}>Riwayat Pesanan</div>
              <Badge variant="outline">42 pesanan</Badge>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left">ID</th><th className="text-left">Layanan</th><th className="text-left">Tanggal</th><th className="text-left">Total</th><th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ORD-2401","Cuci Setrika","07 Jun","Rp45.000","Diproses"],
                  ["ORD-2380","Dry Clean","02 Jun","Rp120.000","Selesai"],
                  ["ORD-2355","Cuci Express","28 Mei","Rp65.000","Selesai"],
                  ["ORD-2310","Sepatu","22 Mei","Rp75.000","Selesai"],
                ].map((r) => (
                  <tr key={r[0]} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">{r[0]}</td>
                    <td>{r[1]}</td>
                    <td className="text-slate-500">{r[2]}</td>
                    <td>{r[3]}</td>
                    <td><StatusBadge status={r[4]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <Card className="mt-4 p-4">
          <div className="text-slate-900 mb-2" style={{ fontWeight: 600 }}>Voucher Milik Pelanggan</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              ["CUCI20","20% off","Aktif"],
              ["GRATIS-ONGKIR","Free pickup","Aktif"],
              ["MEMBER50","Diskon Rp50k","Aktif"],
              ["LEBARAN","30% off","Habis"],
            ].map(([c,d,s]) => (
              <div key={c} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div style={{ fontWeight: 600 }}>{c}</div>
                  <StatusBadge status={s} />
                </div>
                <div className="text-xs text-slate-500 mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Card>
      </CustomerLayout>
    </FrameShell>
  );
}

export function Frame03() {
  return (
    <FrameShell id="Frame 03" title="Order Detail" subtitle="Status, item layanan, courier timeline, pembayaran">
      <CustomerLayout active="Pesanan">
        <div className="mb-3 text-xs text-slate-500">Pesanan / ORD-2401</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-900" style={{ fontWeight: 600 }}>ORD-2401 · Cuci Setrika Reguler</div>
                  <div className="text-xs text-slate-500">Dibuat 06 Jun 2026, 09:12 · Cabang Tebet</div>
                </div>
                <StatusBadge status="Diproses" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["Pesanan dibuat","06 Jun 09:12","done"],
                  ["Dijemput kurir Budi","06 Jun 10:35","done"],
                  ["Dicuci","06 Jun 13:00","done"],
                  ["Disetrika","Estimasi 07 Jun 11:00","active"],
                  ["Diantar","Estimasi 07 Jun 14:00","pending"],
                ].map(([t,sub,state], i, arr) => (
                  <div key={t} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${state==="done"?"bg-teal-600":state==="active"?"bg-amber-500 ring-4 ring-amber-100":"bg-slate-300"}`} />
                      {i < arr.length - 1 && <div className={`w-px flex-1 ${state==="done"?"bg-teal-300":"bg-slate-200"}`} />}
                    </div>
                    <div className="pb-3">
                      <div className="text-sm text-slate-800" style={{ fontWeight: state==="active"?600:500 }}>{t}</div>
                      <div className="text-xs text-slate-500">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-900 mb-2" style={{ fontWeight: 600 }}>Item Layanan</div>
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="py-2 text-left">Layanan</th><th className="text-left">Qty</th><th className="text-left">Harga</th><th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {[["Cuci Setrika Reguler","3 kg","Rp10.000/kg","Rp30.000"],["Pewangi Premium","1","Rp5.000","Rp5.000"],["Pickup & Delivery","1","Rp10.000","Rp10.000"]].map((r)=>(
                    <tr key={r[0]} className="border-b border-slate-100"><td className="py-2">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="text-right">{r[3]}</td></tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-slate-900 mb-3" style={{ fontWeight: 600 }}>Pembayaran</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>Rp45.000</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Voucher CUCI20</span><span className="text-teal-700">-Rp9.000</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2" style={{ fontWeight: 600 }}><span>Total</span><span>Rp36.000</span></div>
              </div>
              <div className="mt-3 rounded-md bg-emerald-50 border border-emerald-200 p-2 text-sm text-emerald-800 flex justify-between">
                <span>QRIS</span><StatusBadge status="Lunas" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-slate-900 mb-3" style={{ fontWeight: 600 }}>Kurir</div>
              <div className="flex items-center gap-3">
                <Avatar name="Budi Santoso" size={40} />
                <div className="text-sm">
                  <div style={{ fontWeight: 600 }}>Budi Santoso</div>
                  <div className="text-xs text-slate-500">Motor · B 4421 KZA</div>
                </div>
              </div>
              <Button variant="outline" className="mt-3 w-full">Hubungi kurir</Button>
            </Card>
          </div>
        </div>
      </CustomerLayout>
    </FrameShell>
  );
}

export function Frame04() {
  return (
    <FrameShell id="Frame 04" title="Notifications Inbox" subtitle="Daftar notifikasi pelanggan dengan unread/read state" device="Mobile · 390">
      <div className="mx-auto my-6 w-[390px] h-[760px] rounded-[36px] border-[10px] border-slate-900 bg-white overflow-hidden">
        <div className="bg-teal-600 text-white px-5 py-4">
          <div className="text-xs opacity-80">NiLaundry</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Notifikasi</div>
          <div className="mt-3 flex gap-2">
            {["Semua","Pesanan","Promo","Pembayaran"].map((t,i)=>(
              <span key={t} className={`text-xs rounded-full px-3 py-1 ${i===0?"bg-white text-teal-700":"bg-white/20 text-white"}`}>{t}</span>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            ["📦","Pesanan ORD-2399 siap diantar","Kurir Budi menuju lokasi Anda","10 mnt",true],
            ["💳","Pembayaran berhasil","QRIS Rp36.000 untuk ORD-2401","1 jam",true],
            ["🎟️","Voucher baru CUCI30","Diskon 30% untuk dry clean","3 jam",true],
            ["⭐","Beri ulasan ORD-2380","Bantu kami dengan rating","Kemarin",false],
            ["🛵","Pesanan ORD-2380 sudah diantar","Terima kasih telah memesan","2 hari",false],
            ["🎉","Selamat! Naik tier Gold","Nikmati benefit eksklusif","3 hari",false],
          ].map(([i,t,d,time,unread],idx)=>(
            <div key={idx} className={`flex gap-3 px-5 py-3 ${unread?"bg-teal-50/50":""}`}>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-100 text-teal-700">{i}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm" style={{ fontWeight: unread?600:500 }}>{t}</div>
                  {unread && <span className="h-2 w-2 rounded-full bg-teal-600" />}
                </div>
                <div className="text-xs text-slate-500">{d}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{time} lalu</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FrameShell>
  );
}

export function Frame05() {
  return (
    <FrameShell id="Frame 05" title="Voucher Center" subtitle="Voucher aktif, kuota, tanggal kedaluwarsa">
      <CustomerLayout active="Voucher">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Kpi label="Voucher Aktif" value="5" icon={<span>🎟️</span>} />
          <Kpi label="Total Hemat" value="Rp182k" delta="+Rp24k bulan ini" icon={<span>💸</span>} />
          <Kpi label="Akan Berakhir" value="2" delta="dalam 7 hari" positive={false} icon={<span>⏰</span>} />
        </div>

        <div className="mb-3 flex gap-2">
          {["Semua","Aktif","Akan habis","Terpakai","Habis"].map((t,i)=>(
            <Badge key={t} variant={i===1?"default":"outline"} className={i===1?"bg-teal-600 hover:bg-teal-600":""}>{t}</Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["CUCI20","Diskon 20% Cuci Setrika","Rp30.000","12 hari","58/100","Aktif"],
            ["GRATIS-ONGKIR","Gratis penjemputan & antar","Rp10.000","3 hari","12/50","Aktif"],
            ["DRYCLEAN30","Diskon 30% Dry Clean","Rp45.000","21 hari","8/30","Aktif"],
            ["MEMBER50","Cashback Rp50.000","Rp50.000","30 hari","2/20","Aktif"],
          ].map(([code,desc,max,exp,quota,status])=>(
            <Card key={code} className="overflow-hidden">
              <div className="flex">
                <div className="w-32 bg-teal-600 text-white p-4 flex flex-col justify-center items-center">
                  <div className="text-xs opacity-80">HEMAT</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{max}</div>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <div style={{ fontWeight: 600 }}>{code}</div>
                    <StatusBadge status={status as string} />
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{desc}</div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Kedaluwarsa {exp}</span>
                    <span>Kuota {quota}</span>
                  </div>
                  <Progress value={(parseInt((quota as string).split("/")[0])/parseInt((quota as string).split("/")[1]))*100} className="h-1 mt-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CustomerLayout>
    </FrameShell>
  );
}

export function Frame06() {
  return (
    <FrameShell id="Frame 06" title="Review & Rating" subtitle="Form ulasan dan riwayat rating">
      <CustomerLayout active="Ulasan">
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-4">
            <div className="text-slate-900 mb-3" style={{ fontWeight: 600 }}>Beri Ulasan</div>
            <div className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="text-sm text-slate-500">ORD-2380 · Dry Clean Premium</div>
              <div className="mt-3">
                <div className="text-sm mb-1">Rating Anda</div>
                <div className="flex gap-1 text-2xl">
                  {[1,2,3,4,5].map(s=>(<span key={s} className={s<=4?"text-amber-400":"text-slate-300"}>★</span>))}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm mb-1">Aspek penilaian</div>
                <div className="flex flex-wrap gap-2">
                  {["Wangi","Bersih","Cepat","Ramah","Rapi","Kemasan"].map((t,i)=>(
                    <Badge key={t} variant={i<3?"default":"outline"} className={i<3?"bg-teal-600 hover:bg-teal-600":""}>{t}</Badge>
                  ))}
                </div>
              </div>
              <textarea placeholder="Ceritakan pengalamanmu…" className="mt-3 w-full rounded-md border border-slate-200 p-2 text-sm h-20" />
              <Button className="mt-3 bg-teal-600 hover:bg-teal-700">Kirim Ulasan</Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-slate-900 mb-2" style={{ fontWeight: 600 }}>Ringkasan</div>
            <div className="text-center py-3">
              <div className="text-amber-500" style={{ fontSize: 36, fontWeight: 700 }}>4.8</div>
              <div className="text-amber-500">★★★★★</div>
              <div className="text-xs text-slate-500">dari 28 ulasan</div>
            </div>
            <div className="space-y-1 text-xs">
              {[[5,82],[4,12],[3,4],[2,1],[1,1]].map(([s,p])=>(
                <div key={s} className="flex items-center gap-2">
                  <span className="w-3 text-slate-500">{s}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${p}%` }} />
                  </div>
                  <span className="w-8 text-right text-slate-500">{p}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-4 p-4">
          <div className="text-slate-900 mb-3" style={{ fontWeight: 600 }}>Riwayat Ulasan</div>
          {[
            ["ORD-2355","Cuci Express",5,"Cepat dan wangi, suka banget!","28 Mei"],
            ["ORD-2310","Sepatu",4,"Hasil bersih, packaging rapi.","22 Mei"],
            ["ORD-2298","Cuci Setrika",5,"Selalu konsisten kualitasnya.","17 Mei"],
          ].map(([id,svc,r,txt,date])=>(
            <div key={id as string} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center justify-between">
                <div className="text-sm" style={{ fontWeight: 600 }}>{svc} · <span className="text-slate-500" style={{ fontWeight: 400 }}>{id}</span></div>
                <div className="text-amber-500 text-sm">{"★".repeat(r as number)}<span className="text-slate-300">{"★".repeat(5-(r as number))}</span></div>
              </div>
              <div className="text-sm text-slate-600 mt-1">{txt}</div>
              <div className="text-xs text-slate-400 mt-1">{date}</div>
            </div>
          ))}
        </Card>
      </CustomerLayout>
    </FrameShell>
  );
}
