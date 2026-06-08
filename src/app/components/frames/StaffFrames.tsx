import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, FrameShell, Kpi, MiniBar, SideNavMock, StatusBadge, TopBar, staffNav } from "../shared";

function StaffLayout({ active, children, title="Operasional - Cabang Tebet" }: { active: string; children: React.ReactNode; title?: string }) {
  return (
    <div className="flex h-[760px] bg-slate-50">
      <SideNavMock role="Pegawai" active={active} items={staffNav} />
      <div className="flex-1 overflow-hidden">
        <TopBar title={title} role="Staff" />
        <div className="h-[calc(100%-49px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function Frame07() {
  return (
    <FrameShell id="Frame 07" title="Operational Dashboard" subtitle="Pesanan diproses, masuk, selesai hari ini">
      <StaffLayout active="Dashboard">
        <div className="grid grid-cols-4 gap-4">
          <Kpi label="Pesanan Masuk" value="14" delta="+3 vs kemarin" icon={<span>📥</span>} />
          <Kpi label="Sedang Diproses" value="27" delta="8 hampir selesai" icon={<span>🧺</span>} />
          <Kpi label="Selesai Hari Ini" value="19" delta="+22%" icon={<span>✅</span>} />
          <Kpi label="Belum Dibayar" value="6" delta="Rp420k" positive={false} icon={<span>💳</span>} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontWeight: 600 }}>Pesanan Diproses</div>
              <div className="flex gap-2">
                <Input placeholder="Cari ID/pelanggan" className="h-8 w-48" />
                <Button size="sm" variant="outline">Filter</Button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left">ID</th><th className="text-left">Pelanggan</th><th className="text-left">Layanan</th><th className="text-left">ETA</th><th className="text-left">Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ORD-2401","Andini","Cuci Setrika 3kg","07 Jun 14:00","Disetrika"],
                  ["ORD-2402","Rizal","Dry Clean Jas","08 Jun 10:00","Dicuci"],
                  ["ORD-2403","Sari","Sepatu","08 Jun 16:00","Diproses"],
                  ["ORD-2404","Doni","Express 1kg","07 Jun 18:00","Dicuci"],
                  ["ORD-2405","Lia","Bed Cover","09 Jun 12:00","Diproses"],
                ].map((r)=>(
                  <tr key={r[0]} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td className="text-slate-500">{r[3]}</td>
                    <td><StatusBadge status={r[4]} /></td>
                    <td className="text-right"><Button size="sm" variant="outline">Update</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div style={{ fontWeight: 600 }}>Selesai Hari Ini</div>
                <Badge className="bg-emerald-600 hover:bg-emerald-600">19</Badge>
              </div>
              <div className="flex items-end justify-between">
                <MiniBar values={[3,5,2,6,4,7,8,9,11,14,17,19]} color="bg-emerald-500" />
                <div className="text-right">
                  <div className="text-xs text-slate-500">Target</div>
                  <div style={{ fontWeight: 600 }}>25</div>
                </div>
              </div>
              <Progress value={76} className="h-1.5 mt-3" />
              <div className="text-xs text-slate-500 mt-1">76% dari target harian</div>
            </Card>
            <Card className="p-4">
              <div style={{ fontWeight: 600 }} className="mb-2">Pesanan Masuk Baru</div>
              {["ORD-2406","ORD-2407","ORD-2408"].map(id=>(
                <div key={id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>{id}</div>
                    <div className="text-xs text-slate-500">Cuci Setrika · 5 mnt lalu</div>
                  </div>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Proses</Button>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </StaffLayout>
    </FrameShell>
  );
}

export function Frame08() {
  return (
    <FrameShell id="Frame 08" title="Order Queue" subtitle="Antrean pesanan belum diproses · sort prioritas & deadline">
      <StaffLayout active="Antrian">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Badge variant="outline">Semua (38)</Badge>
            <Badge className="bg-rose-500 hover:bg-rose-500">Urgent (6)</Badge>
            <Badge variant="outline">Express (12)</Badge>
            <Badge variant="outline">Reguler (20)</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Sort: Deadline ↑</Button>
            <Button variant="outline" size="sm">Cabang: Tebet</Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">+ Pesanan Walk-in</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {col:"Belum Diproses",count:6,color:"bg-rose-50 border-rose-200",badge:"Urgent",items:[
              ["ORD-2410","Pak Roni","Express 2kg","2 jam","🚨"],
              ["ORD-2411","Bu Wati","Cuci Setrika 4kg","3 jam","⚡"],
              ["ORD-2412","Andre","Dry Clean Kemeja","Hari ini","⚡"],
            ]},
            {col:"Dijemput / Masuk",count:9,color:"bg-amber-50 border-amber-200",badge:"Baru",items:[
              ["ORD-2406","Lia","Bed Cover","Besok","📥"],
              ["ORD-2407","Bayu","Sepatu","Besok","📥"],
              ["ORD-2408","Mira","Cuci Reguler","2 hari","📥"],
            ]},
            {col:"Siap Diproses",count:5,color:"bg-teal-50 border-teal-200",badge:"Siap",items:[
              ["ORD-2399","Andini","Cuci Setrika","Hari ini","✅"],
              ["ORD-2400","Putri","Dry Clean","Besok","✅"],
            ]},
          ].map(col=>(
            <div key={col.col} className={`rounded-lg border ${col.color} p-3`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm" style={{ fontWeight: 600 }}>{col.col}</div>
                <Badge variant="outline">{col.count}</Badge>
              </div>
              <div className="space-y-2">
                {col.items.map((it)=>(
                  <Card key={it[0]} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{it[0]}</div>
                        <div className="text-xs text-slate-500">{it[1]} · {it[2]}</div>
                      </div>
                      <span>{it[4]}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Deadline: {it[3]}</span>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-teal-700">Mulai →</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StaffLayout>
    </FrameShell>
  );
}

export function Frame09() {
  return (
    <FrameShell id="Frame 09" title="Update Order Status Modal / Drawer" subtitle="Ubah status pesanan dan estimasi selesai">
      <StaffLayout active="Pesanan">
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-4 opacity-60">
            <div style={{ fontWeight: 600 }} className="mb-3">Daftar Pesanan (background)</div>
            {[1,2,3,4,5].map(i=>(
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded bg-slate-100" />
                  <div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>ORD-240{i}</div>
                    <div className="text-xs text-slate-500">Pelanggan · Layanan</div>
                  </div>
                </div>
                <StatusBadge status={["Diproses","Dicuci","Disetrika","Siap","Diantar"][i-1]} />
              </div>
            ))}
          </Card>

          <Card className="p-0 border-teal-500 ring-4 ring-teal-100 shadow-xl">
            <div className="border-b border-slate-200 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Update Status</div>
                <div style={{ fontWeight: 600 }}>ORD-2401</div>
              </div>
              <button className="text-slate-400">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-sm mb-2">Status saat ini</div>
                <StatusBadge status="Disetrika" />
              </div>
              <div>
                <div className="text-sm mb-2">Ubah ke</div>
                <div className="grid grid-cols-2 gap-2">
                  {["Dicuci","Disetrika","Siap","Diantar"].map((s,i)=>(
                    <button key={s} className={`rounded-md border px-3 py-2 text-sm text-left ${i===2?"border-teal-500 bg-teal-50 text-teal-800":"border-slate-200"}`}>
                      <div className="flex items-center justify-between"><span>{s}</span>{i===2 && <span className="text-teal-600">✓</span>}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm mb-2">Estimasi selesai</div>
                <Input defaultValue="07 Juni 2026, 14:00" />
              </div>
              <div>
                <div className="text-sm mb-2">Catatan (opsional)</div>
                <textarea className="w-full rounded-md border border-slate-200 p-2 text-sm h-16" placeholder="Misal: noda membandel, perlu treatment ulang" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" defaultChecked /> Kirim notifikasi ke pelanggan
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button variant="outline" className="flex-1">Batal</Button>
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700">Simpan</Button>
              </div>
            </div>
          </Card>
        </div>
      </StaffLayout>
    </FrameShell>
  );
}

export function Frame10() {
  return (
    <FrameShell id="Frame 10" title="Payment Detail & Audit" subtitle="Metode pembayaran, lunas/belum dibayar, filter metode">
      <StaffLayout active="Pembayaran">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Kpi label="Pendapatan Hari Ini" value="Rp3,4jt" delta="+12%" icon={<span>💰</span>} />
          <Kpi label="Belum Dibayar" value="Rp420k" delta="6 pesanan" positive={false} icon={<span>⏳</span>} />
          <Kpi label="QRIS" value="Rp1,9jt" delta="56%" icon={<span>📱</span>} />
          <Kpi label="Cash" value="Rp780k" delta="23%" icon={<span>💵</span>} />
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div style={{ fontWeight: 600 }}>Audit Pembayaran</div>
            <div className="flex gap-2">
              <Input placeholder="Cari ID" className="h-8 w-40" />
              <Button variant="outline" size="sm">Metode ▾</Button>
              <Button variant="outline" size="sm">Status ▾</Button>
              <Button variant="outline" size="sm">Periode ▾</Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Export</Button>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            {["Semua","QRIS","Debit","Cash"].map((m,i)=>(
              <Badge key={m} variant={i===0?"default":"outline"} className={i===0?"bg-teal-600 hover:bg-teal-600":""}>{m}</Badge>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 text-left">ID</th><th className="text-left">Pelanggan</th><th className="text-left">Total</th><th className="text-left">Metode</th><th className="text-left">Tanggal</th><th className="text-left">Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ORD-2401","Andini","Rp36.000","QRIS","07 Jun 09:12","Lunas"],
                ["ORD-2402","Rizal","Rp145.000","Debit","07 Jun 10:31","Lunas"],
                ["ORD-2403","Sari","Rp62.000","Cash","07 Jun 11:02","Belum Bayar"],
                ["ORD-2404","Doni","Rp40.000","QRIS","07 Jun 11:55","Pending"],
                ["ORD-2405","Lia","Rp220.000","Debit","07 Jun 12:30","Lunas"],
                ["ORD-2406","Andre","Rp48.000","Cash","07 Jun 13:00","Belum Bayar"],
                ["ORD-2407","Bayu","Rp75.000","QRIS","07 Jun 13:24","Lunas"],
              ].map(r=>(
                <tr key={r[0]} className="border-b border-slate-100">
                  <td className="py-2 text-slate-600">{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td><Badge variant="outline">{r[3]}</Badge></td>
                  <td className="text-slate-500">{r[4]}</td>
                  <td><StatusBadge status={r[5]} /></td>
                  <td className="text-right"><Button size="sm" variant="ghost" className="text-teal-700">Detail</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </StaffLayout>
    </FrameShell>
  );
}

export function Frame11() {
  return (
    <FrameShell id="Frame 11" title="Courier & Delivery Monitor" subtitle="Daftar kurir, kendaraan, aktivitas pengiriman">
      <StaffLayout active="Kurir">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Kpi label="Kurir Aktif" value="8/10" icon={<span>🛵</span>} />
          <Kpi label="Pengiriman Hari Ini" value="42" delta="+8" icon={<span>📦</span>} />
          <Kpi label="Avg Waktu Antar" value="38 mnt" icon={<span>⏱️</span>} />
          <Kpi label="Insiden" value="0" delta="aman" icon={<span>🛡️</span>} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontWeight: 600 }}>Aktivitas Pengiriman</div>
              <Button variant="outline" size="sm">Live ●</Button>
            </div>
            <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-teal-50 to-slate-50 h-48 mb-3 relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-5">
                {Array.from({length:40}).map((_,i)=>(<div key={i} className="border border-slate-200/40" />))}
              </div>
              {[["Budi","30%","40%"],["Andi","65%","55%"],["Tono","80%","25%"],["Eka","20%","70%"]].map(([n,l,t])=>(
                <div key={n} className="absolute" style={{ left:l, top:t }}>
                  <div className="h-6 w-6 rounded-full bg-teal-600 text-white text-[10px] grid place-items-center shadow ring-2 ring-white">{n[0]}</div>
                </div>
              ))}
              <div className="absolute bottom-2 right-2 bg-white border border-slate-200 rounded px-2 py-1 text-[10px]">Jakarta Selatan</div>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left">Kurir</th><th className="text-left">Kendaraan</th><th className="text-left">Aktivitas</th><th className="text-left">Order</th><th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Budi Santoso","B 4421 KZA","Mengantar","ORD-2399","Diantar"],
                  ["Andi Wijaya","B 7782 LMA","Menjemput","ORD-2410","Dijemput"],
                  ["Tono Saputra","B 6512 OPA","Idle","-","Pending"],
                  ["Eka Nur","B 9091 KZA","Mengantar","ORD-2400","Diantar"],
                ].map(r=>(
                  <tr key={r[0]} className="border-b border-slate-100">
                    <td className="py-2 flex items-center gap-2"><Avatar name={r[0]} size={24} />{r[0]}</td>
                    <td className="text-slate-500">{r[1]}</td>
                    <td>{r[2]}</td>
                    <td className="text-slate-600">{r[3]}</td>
                    <td><StatusBadge status={r[4]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-4">
            <div style={{ fontWeight: 600 }} className="mb-3">Top Kurir Bulan Ini</div>
            {[["Budi Santoso",184],["Eka Nur",162],["Andi Wijaya",149],["Tono Saputra",128],["Rio Adit",110]].map(([n,c],i)=>(
              <div key={n as string} className="py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="text-xs text-slate-500 w-4">#{i+1}</span><Avatar name={n as string} size={24} /><span className="text-sm">{n}</span></div>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{c}</span>
                </div>
                <Progress value={(c as number)/184*100} className="h-1 mt-1" />
              </div>
            ))}
          </Card>
        </div>
      </StaffLayout>
    </FrameShell>
  );
}
