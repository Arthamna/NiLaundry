import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Avatar, FrameShell, Kpi, MiniBar, SideNavMock, StatusBadge, TopBar, adminNav } from "../shared";

function AdminLayout({ active, children, title="Manajemen Pusat" }: { active: string; children: React.ReactNode; title?: string }) {
  return (
    <div className="flex h-[760px] bg-slate-50">
      <SideNavMock role="Admin" active={active} items={adminNav} />
      <div className="flex-1 overflow-hidden">
        <TopBar title={title} role="Admin" />
        <div className="h-[calc(100%-49px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

function SimpleLine({ values, color="stroke-teal-500" }: { values: number[]; color?: string }) {
  const max = Math.max(...values), min = Math.min(...values);
  const w = 320, h = 100;
  const pts = values.map((v,i)=>{
    const x = (i/(values.length-1))*w;
    const y = h - ((v-min)/(max-min||1))*h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <polyline points={pts} fill="none" className={color} strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="currentColor" className="text-teal-500/10" />
    </svg>
  );
}

function Donut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((a,b)=>a+b.value,0);
  let acc = 0;
  const r = 40, c = 2*Math.PI*r;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
        {segments.map((s,i)=>{
          const frac = s.value/total;
          const dash = `${frac*c} ${c-frac*c}`;
          const off = -acc*c;
          acc += frac;
          return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.color} strokeWidth="14" strokeDasharray={dash} strokeDashoffset={off} />;
        })}
      </svg>
      <div className="space-y-1">
        {segments.map(s=>(
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span className="text-slate-600 w-20">{s.label}</span>
            <span style={{ fontWeight: 600 }}>{Math.round(s.value/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Frame12() {
  return (
    <FrameShell id="Frame 12" title="Management Overview" subtitle="Pendapatan per cabang, rating rata-rata, KPI">
      <AdminLayout active="Overview">
        <div className="grid grid-cols-4 gap-4">
          <Kpi label="Pendapatan Bulan Ini" value="Rp184jt" delta="+18% MoM" icon={<span>💰</span>} />
          <Kpi label="Pesanan Selesai" value="3.214" delta="+12%" icon={<span>📦</span>} />
          <Kpi label="Rating Rata-Rata" value="4.7★" delta="dari 1.842 ulasan" icon={<span>⭐</span>} />
          <Kpi label="Pelanggan Aktif" value="1.108" delta="+96" icon={<span>👥</span>} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card className="col-span-2 p-4">
            <div className="flex items-center justify-between mb-2">
              <div style={{ fontWeight: 600 }}>Tren Pendapatan</div>
              <div className="flex gap-2">{["7H","30H","90H","1T"].map((t,i)=>(<Badge key={t} variant={i===1?"default":"outline"} className={i===1?"bg-teal-600 hover:bg-teal-600":""}>{t}</Badge>))}</div>
            </div>
            <SimpleLine values={[42,55,48,62,58,71,69,82,75,88,94,102,98,110,118,124]} />
          </Card>
          <Card className="p-4">
            <div style={{ fontWeight: 600 }} className="mb-3">Distribusi Pembayaran</div>
            <Donut segments={[
              { label: "QRIS", value: 56, color: "#0d9488" },
              { label: "Debit", value: 28, color: "#0ea5e9" },
              { label: "Cash", value: 16, color: "#94a3b8" },
            ]} />
          </Card>
        </div>

        <Card className="p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div style={{ fontWeight: 600 }}>Pendapatan per Cabang</div>
            <Button variant="outline" size="sm">Lihat semua</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 text-left">Cabang</th><th className="text-left">Pesanan</th><th className="text-left">Pendapatan</th><th className="text-left">Rating</th><th className="text-left">Tren</th><th className="text-left">vs Target</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Tebet","842","Rp48,2jt","4.8★",[3,5,4,6,7,8,9],92],
                ["Kemang","712","Rp41,5jt","4.7★",[4,4,5,5,6,7,8],85],
                ["BSD","656","Rp38,9jt","4.6★",[5,6,6,7,7,8,9],78],
                ["Bekasi","542","Rp31,1jt","4.7★",[3,4,4,5,6,6,7],70],
                ["Bandung","462","Rp24,3jt","4.5★",[2,3,3,4,5,5,6],62],
              ].map((r:any)=>(
                <tr key={r[0]} className="border-b border-slate-100">
                  <td className="py-2" style={{ fontWeight: 600 }}>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td className="text-amber-600">{r[3]}</td>
                  <td><MiniBar values={r[4]} /></td>
                  <td><div className="flex items-center gap-2"><Progress value={r[5]} className="h-1.5 w-24" /><span className="text-xs">{r[5]}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </AdminLayout>
    </FrameShell>
  );
}

export function Frame13() {
  return (
    <FrameShell id="Frame 13" title="Services Analytics" subtitle="Layanan terlaris & top services">
      <AdminLayout active="Layanan">
        <div className="grid grid-cols-3 gap-4">
          <Kpi label="Total Layanan" value="14" icon={<span>🧼</span>} />
          <Kpi label="Layanan Terlaris" value="Cuci Setrika" delta="38% dari pesanan" icon={<span>🏆</span>} />
          <Kpi label="Margin Tertinggi" value="Dry Clean" delta="42% margin" icon={<span>💎</span>} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card className="col-span-2 p-4">
            <div style={{ fontWeight: 600 }} className="mb-3">Top Services (30 hari)</div>
            {[
              ["Cuci Setrika Reguler",1224,"Rp61,2jt",38],
              ["Cuci Express",642,"Rp38,5jt",20],
              ["Dry Clean",482,"Rp42,6jt",15],
              ["Sepatu",312,"Rp23,4jt",10],
              ["Bed Cover",224,"Rp16,8jt",7],
              ["Setrika Only",186,"Rp9,3jt",6],
              ["Boneka",144,"Rp12,1jt",4],
            ].map((r:any)=>(
              <div key={r[0]} className="py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ fontWeight: 500 }}>{r[0]}</span>
                  <span className="text-slate-500">{r[1]} pesanan · <span className="text-slate-900" style={{ fontWeight: 600 }}>{r[2]}</span></span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={r[3]*2.5} className="h-1.5" />
                  <span className="text-xs text-slate-500 w-10 text-right">{r[3]}%</span>
                </div>
              </div>
            ))}
          </Card>

          <div className="space-y-4">
            <Card className="p-4">
              <div style={{ fontWeight: 600 }} className="mb-3">Distribusi Kategori</div>
              <Donut segments={[
                { label: "Cuci", value: 58, color: "#0d9488" },
                { label: "Setrika", value: 16, color: "#14b8a6" },
                { label: "Premium", value: 18, color: "#0ea5e9" },
                { label: "Spesial", value: 8, color: "#a78bfa" },
              ]} />
            </Card>
            <Card className="p-4">
              <div style={{ fontWeight: 600 }} className="mb-3">Layanan Baru Diuji</div>
              {["Tas Branded","Karpet Besar","Jaket Kulit"].map(s=>(
                <div key={s} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                  <span>{s}</span>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">Beta</Badge>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </AdminLayout>
    </FrameShell>
  );
}

export function Frame14() {
  return (
    <FrameShell id="Frame 14" title="Employee Workload" subtitle="Rekap beban kerja pegawai per cabang">
      <AdminLayout active="Pegawai">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Kpi label="Total Pegawai" value="42" icon={<span>👥</span>} />
          <Kpi label="Aktif Shift Ini" value="28" icon={<span>🟢</span>} />
          <Kpi label="Avg Pesanan/Pegawai" value="76" delta="+8" icon={<span>📊</span>} />
          <Kpi label="Beban Berlebih" value="3" delta="perlu rotasi" positive={false} icon={<span>⚠️</span>} />
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div style={{ fontWeight: 600 }}>Rekap Beban Kerja</div>
            <div className="flex gap-2">
              <Input placeholder="Cari pegawai" className="h-8 w-48" />
              <Button variant="outline" size="sm">Cabang ▾</Button>
              <Button variant="outline" size="sm">Periode ▾</Button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 text-left">Pegawai</th><th className="text-left">Cabang</th><th className="text-left">Role</th><th className="text-left">Pesanan</th><th className="text-left">Jam Kerja</th><th className="text-left">Beban</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Rina Putri","Tebet","Operator",128,182,95],
                ["Wahyu Hidayat","Tebet","Operator",112,176,84],
                ["Maya Sari","Kemang","Operator",98,168,72],
                ["Doni Pratama","Kemang","Kasir",84,160,58],
                ["Eka Nur","BSD","Operator",142,184,98],
                ["Aris Munandar","BSD","Operator",118,176,86],
                ["Sinta Lestari","Bekasi","Operator",92,168,70],
              ].map((r:any)=>(
                <tr key={r[0]} className="border-b border-slate-100">
                  <td className="py-2 flex items-center gap-2"><Avatar name={r[0]} size={28} /><span style={{ fontWeight: 500 }}>{r[0]}</span></td>
                  <td className="text-slate-600">{r[1]}</td>
                  <td><Badge variant="outline">{r[2]}</Badge></td>
                  <td>{r[3]}</td>
                  <td className="text-slate-500">{r[4]} jam</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Progress value={r[5]} className={`h-1.5 w-32`} />
                      <span className={`text-xs ${r[5]>=90?"text-rose-600":r[5]>=75?"text-amber-600":"text-emerald-600"}`}>{r[5]}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </AdminLayout>
    </FrameShell>
  );
}

export function Frame15() {
  return (
    <FrameShell id="Frame 15" title="Review Analytics" subtitle="Semua ulasan pelanggan dan distribusi rating">
      <AdminLayout active="Ulasan">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-xs text-slate-500">Rating Rata-Rata</div>
            <div className="flex items-baseline gap-2 mt-1">
              <div style={{ fontSize: 38, fontWeight: 700 }} className="text-amber-500">4.7</div>
              <div className="text-amber-500">★★★★★</div>
            </div>
            <div className="text-xs text-slate-500 mt-1">dari 1.842 ulasan</div>
            <div className="space-y-1 mt-3">
              {[[5,68],[4,22],[3,6],[2,3],[1,1]].map(([s,p])=>(
                <div key={s} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{s}★</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${p}%` }} /></div>
                  <span className="w-8 text-right text-slate-500">{p}%</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="col-span-2 p-4">
            <div style={{ fontWeight: 600 }} className="mb-3">Tag Ulasan Terpopuler</div>
            <div className="flex flex-wrap gap-2">
              {[["Wangi",824],["Bersih",712],["Cepat",584],["Ramah",482],["Rapi",442],["Tepat waktu",398],["Harga oke",344],["Packaging",288],["Lama",62],["Hilang",18]].map(([t,c]:any)=>(
                <Badge key={t} variant="outline" className="text-sm py-1 px-3">
                  {t} <span className="ml-2 text-slate-500">{c}</span>
                </Badge>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-500">Trend sentimen: <span className="text-emerald-600">+12% positif minggu ini</span></div>
          </Card>
        </div>

        <Card className="p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div style={{ fontWeight: 600 }}>Semua Ulasan</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Rating ▾</Button>
              <Button variant="outline" size="sm">Cabang ▾</Button>
              <Button variant="outline" size="sm">Periode ▾</Button>
            </div>
          </div>
          {[
            ["Andini Pratama","Cuci Setrika · Tebet",5,"Wangi banget, kemasannya rapi banget!","2 jam"],
            ["Rizal Kurniawan","Dry Clean · Kemang",4,"Bagus tapi agak lama dari estimasi.","5 jam"],
            ["Sari Wulandari","Sepatu · BSD",5,"Sepatu putih saya bersih seperti baru!","1 hari"],
            ["Doni Saputra","Express · Tebet",3,"OK tapi lipatan kurang rapi.","2 hari"],
          ].map((r:any)=>(
            <div key={r[0]} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-start gap-3">
                <Avatar name={r[0]} size={36} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{r[0]}</div>
                      <div className="text-xs text-slate-500">{r[1]}</div>
                    </div>
                    <div className="text-amber-500 text-sm">{"★".repeat(r[2])}<span className="text-slate-300">{"★".repeat(5-r[2])}</span></div>
                  </div>
                  <div className="text-sm text-slate-700 mt-1">{r[3]}</div>
                  <div className="text-xs text-slate-400 mt-1">{r[4]} lalu</div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </AdminLayout>
    </FrameShell>
  );
}

export function Frame16() {
  return (
    <FrameShell id="Frame 16" title="Branch Performance" subtitle="Performa cabang per periode">
      <AdminLayout active="Cabang">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {["Pendapatan","Pesanan","Rating","Waktu Selesai"].map((t,i)=>(
              <Badge key={t} variant={i===0?"default":"outline"} className={i===0?"bg-teal-600 hover:bg-teal-600":""}>{t}</Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Juni 2026 ▾</Button>
            <Button variant="outline" size="sm">Compare</Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Export PDF</Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            ["Tebet","Rp48,2jt",92,"#0d9488"],
            ["Kemang","Rp41,5jt",85,"#14b8a6"],
            ["BSD","Rp38,9jt",78,"#0ea5e9"],
            ["Bekasi","Rp31,1jt",70,"#a78bfa"],
            ["Bandung","Rp24,3jt",62,"#f59e0b"],
          ].map((c:any)=>(
            <Card key={c[0]} className="p-3">
              <div className="text-xs text-slate-500">{c[0]}</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{c[1]}</div>
              <Progress value={c[2]} className="h-1.5 mt-2" />
              <div className="text-xs text-slate-500 mt-1">{c[2]}% target</div>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div style={{ fontWeight: 600 }} className="mb-3">Perbandingan Cabang (6 bulan)</div>
          <div className="h-60 relative">
            <div className="absolute inset-0 flex items-end gap-2 px-4">
              {["Jan","Feb","Mar","Apr","Mei","Jun"].map((m,i)=>(
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-1 h-52 w-full justify-center">
                    {[
                      ["#0d9488",30+i*8],["#14b8a6",26+i*7],["#0ea5e9",22+i*6],["#a78bfa",18+i*5],["#f59e0b",14+i*4],
                    ].map(([col,h]:any,j)=>(
                      <div key={j} className="w-3 rounded-t" style={{ background: col, height: `${h*1.5}px` }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-3 text-xs">
            {[["Tebet","#0d9488"],["Kemang","#14b8a6"],["BSD","#0ea5e9"],["Bekasi","#a78bfa"],["Bandung","#f59e0b"]].map(([n,c])=>(
              <div key={n} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{n}</div>
            ))}
          </div>
        </Card>
      </AdminLayout>
    </FrameShell>
  );
}

export function Frame17() {
  return (
    <FrameShell id="Frame 17" title="Payment Method Report" subtitle="Pesanan berdasarkan metode pembayaran">
      <AdminLayout active="Pembayaran">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card className="p-4">
            <div style={{ fontWeight: 600 }} className="mb-3">Distribusi Metode</div>
            <Donut segments={[
              { label: "QRIS", value: 56, color: "#0d9488" },
              { label: "Debit", value: 28, color: "#0ea5e9" },
              { label: "Cash", value: 16, color: "#94a3b8" },
            ]} />
          </Card>
          <Card className="p-4 col-span-2">
            <div style={{ fontWeight: 600 }} className="mb-3">Tren Metode Pembayaran</div>
            <SimpleLine values={[44,52,48,58,62,68,72,78,82,88,94,102]} />
            <div className="flex gap-3 mt-2 text-xs text-slate-500">
              <span>📱 QRIS dominan sejak Mar 2026</span>
              <span>· Cash menurun 6%</span>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div style={{ fontWeight: 600 }}>Pesanan per Metode</div>
            <div className="flex gap-2">
              {["Semua","QRIS","Debit","Cash"].map((m,i)=>(
                <Badge key={m} variant={i===0?"default":"outline"} className={i===0?"bg-teal-600 hover:bg-teal-600":""}>{m}</Badge>
              ))}
              <Button variant="outline" size="sm">Cabang ▾</Button>
              <Button variant="outline" size="sm">Periode ▾</Button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 text-left">Metode</th><th className="text-left">Transaksi</th><th className="text-left">Volume</th><th className="text-left">Avg</th><th className="text-left">Fee</th><th className="text-left">Net</th><th className="text-left">Share</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["📱 QRIS",1812,"Rp103jt","Rp57k","Rp720k","Rp102jt",56],
                ["💳 Debit Card",912,"Rp52jt","Rp57k","Rp1,2jt","Rp50,8jt",28],
                ["💵 Cash",514,"Rp29jt","Rp56k","Rp0","Rp29jt",16],
              ].map((r:any)=>(
                <tr key={r[0]} className="border-b border-slate-100">
                  <td className="py-2" style={{ fontWeight: 600 }}>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td className="text-rose-600">{r[4]}</td>
                  <td className="text-emerald-700" style={{ fontWeight: 600 }}>{r[5]}</td>
                  <td><div className="flex items-center gap-2"><Progress value={r[6]} className="h-1.5 w-24" /><span className="text-xs">{r[6]}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </AdminLayout>
    </FrameShell>
  );
}

export function Frame18() {
  return (
    <FrameShell id="Frame 18" title="Branch / Courier Monitoring" subtitle="Performa kurir dan kendaraan">
      <AdminLayout active="Kurir">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Kpi label="Total Kurir" value="32" icon={<span>🛵</span>} />
          <Kpi label="Pengiriman Bulan Ini" value="2.184" delta="+14%" icon={<span>📦</span>} />
          <Kpi label="Avg Rating Kurir" value="4.8★" icon={<span>⭐</span>} />
          <Kpi label="Kendaraan Service" value="3" delta="butuh perawatan" positive={false} icon={<span>🔧</span>} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontWeight: 600 }}>Kurir dengan Pengiriman Terbanyak</div>
              <Button variant="outline" size="sm">30 hari ▾</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left">#</th><th className="text-left">Kurir</th><th className="text-left">Cabang</th><th className="text-left">Kendaraan</th><th className="text-left">Pengiriman</th><th className="text-left">Rating</th><th className="text-left">Insiden</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [1,"Budi Santoso","Tebet","B 4421 KZA",184,4.9,0],
                  [2,"Eka Nur","Tebet","B 9091 KZA",162,4.8,0],
                  [3,"Andi Wijaya","Kemang","B 7782 LMA",149,4.8,1],
                  [4,"Tono Saputra","BSD","B 6512 OPA",128,4.7,0],
                  [5,"Rio Adit","Bekasi","B 3321 MMA",110,4.7,0],
                  [6,"Hendra P.","Bandung","D 8812 KLA",98,4.6,2],
                ].map((r:any)=>(
                  <tr key={r[0]} className="border-b border-slate-100">
                    <td className="py-2 text-slate-500">#{r[0]}</td>
                    <td className="flex items-center gap-2 py-2"><Avatar name={r[1]} size={26} /><span style={{ fontWeight: 500 }}>{r[1]}</span></td>
                    <td className="text-slate-600">{r[2]}</td>
                    <td className="text-slate-500">{r[3]}</td>
                    <td style={{ fontWeight: 600 }}>{r[4]}</td>
                    <td className="text-amber-600">{r[5]}★</td>
                    <td>{r[6]===0 ? <span className="text-emerald-600 text-xs">✓ aman</span> : <Badge className="bg-rose-500 hover:bg-rose-500">{r[6]}</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-4">
            <div style={{ fontWeight: 600 }} className="mb-3">Status Kendaraan</div>
            {[
              ["Motor B 4421 KZA","Operasional","bg-emerald-50 text-emerald-700 border-emerald-200"],
              ["Motor B 9091 KZA","Operasional","bg-emerald-50 text-emerald-700 border-emerald-200"],
              ["Motor B 7782 LMA","Service","bg-amber-50 text-amber-700 border-amber-200"],
              ["Motor B 6512 OPA","Operasional","bg-emerald-50 text-emerald-700 border-emerald-200"],
              ["Mobil B 1102 RZA","Service","bg-amber-50 text-amber-700 border-amber-200"],
              ["Motor D 8812 KLA","Off-duty","bg-slate-100 text-slate-600 border-slate-200"],
            ].map(([n,s,c]:any)=>(
              <div key={n} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                <span>{n}</span>
                <span className={`text-xs rounded-full px-2 py-0.5 border ${c}`}>{s}</span>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3">+ Tambah Kendaraan</Button>
          </Card>
        </div>
      </AdminLayout>
    </FrameShell>
  );
}
