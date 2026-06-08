import { useState } from "react";
import { AreaChart, Avatar, BarChart, Card, CardHeader, Donut, KpiCard, StatusPill } from "../components/ds/primitives";
import { PageBody, SecondaryButton, Topbar } from "../components/layout/Shell";
import { Download } from "lucide-react";

type Tab = "services" | "branches" | "employees" | "reviews" | "payments";

const TABS: { key: Tab; label: string }[] = [
  { key: "services",  label: "Services" },
  { key: "branches",  label: "Branches" },
  { key: "employees", label: "Employees" },
  { key: "reviews",   label: "Reviews" },
  { key: "payments",  label: "Payments" },
];

export function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("services");
  return (
    <>
      <Topbar
        title="Analytics"
        breadcrumb={["NiLaundry", "Analytics"]}
        action={<SecondaryButton><Download size={14} /> Export PDF</SecondaryButton>}
      />
      <PageBody>
        <div className="mb-4 flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${tab === t.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              style={{ fontWeight: 500 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "services"  && <Services />}
        {tab === "branches"  && <Branches />}
        {tab === "employees" && <Employees />}
        {tab === "reviews"   && <Reviews />}
        {tab === "payments"  && <PaymentsAnalytics />}
      </PageBody>
    </>
  );
}

function Services() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Services" value="14" />
        <KpiCard label="Best Seller" value="Cuci Setrika" delta="38% volume" />
        <KpiCard label="Highest Margin" value="Dry Clean" delta="42% margin" />
        <KpiCard label="New This Month" value="3" delta="2 beta" deltaTone="flat" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader title="Top Services" subtitle="Ranking · 30 hari" />
          <div className="px-3 pb-2 pt-3">
            <BarChart
              labels={["Cuci Setrika","Express","Dry Clean","Sepatu","Bed Cover","Setrika","Boneka"]}
              values={[1224, 642, 482, 312, 224, 186, 144]}
              color="#0f766e"
              height={220}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Category Mix" />
          <div className="px-5 py-5">
            <Donut segments={[
              { label: "Cuci",    value: 58, color: "#0f766e" },
              { label: "Setrika", value: 16, color: "#14b8a6" },
              { label: "Premium", value: 18, color: "#0ea5e9" },
              { label: "Spesial", value: 8,  color: "#a855f7" },
            ]} />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Service Ranking" subtitle="Performance per layanan" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="w-12 px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>#</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Service</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Orders</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Revenue</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Margin</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Share</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {[
              [1,"Cuci Setrika Reguler",1224,"Rp 61,2jt","28%",38,"+12%"],
              [2,"Cuci Express",         642,"Rp 38,5jt","32%",20,"+18%"],
              [3,"Dry Clean Premium",    482,"Rp 42,6jt","42%",15,"+8%"],
              [4,"Sepatu",               312,"Rp 23,4jt","36%",10,"+22%"],
              [5,"Bed Cover",            224,"Rp 16,8jt","30%", 7,"+4%"],
              [6,"Setrika Only",         186,"Rp 9,3jt","24%",  6,"-2%"],
              [7,"Boneka",               144,"Rp 12,1jt","38%", 4,"+30%"],
            ].map((r:any) => (
              <tr key={r[1]} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-500">{r[0]}</td>
                <td className="text-slate-900" style={{ fontWeight: 500 }}>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td className="text-emerald-700">{r[4]}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${r[5] * 2.5}%` }} /></div>
                    <span className="text-xs">{r[5]}%</span>
                  </div>
                </td>
                <td><StatusPill tone={r[6].startsWith("+") ? "success" : "danger"}>{r[6]}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function Branches() {
  return (
    <>
      <div className="grid grid-cols-5 gap-3">
        {[
          ["Tebet",   "Rp 48,2jt", 92, "#0f766e"],
          ["Kemang",  "Rp 41,5jt", 85, "#14b8a6"],
          ["BSD",     "Rp 38,9jt", 78, "#0ea5e9"],
          ["Bekasi",  "Rp 31,1jt", 70, "#6366f1"],
          ["Bandung", "Rp 24,3jt", 62, "#a855f7"],
        ].map((b:any) => (
          <Card key={b[0]} className="p-4">
            <div className="text-xs text-slate-500">{b[0]}</div>
            <div className="text-slate-900" style={{ fontSize: 20, fontWeight: 700 }}>{b[1]}</div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full" style={{ width: `${b[2]}%`, background: b[3] }} />
            </div>
            <div className="mt-1 text-[11px] text-slate-500">{b[2]}% of target</div>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader title="Revenue Trend by Branch" subtitle="6 bulan" />
          <div className="px-4 pt-3">
            <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              {[["Tebet","#0f766e"],["Kemang","#14b8a6"],["BSD","#0ea5e9"],["Bekasi","#6366f1"],["Bandung","#a855f7"]].map(([n,c])=>(
                <span key={n} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{n}</span>
              ))}
            </div>
            <AreaChart
              labels={["Jan","Feb","Mar","Apr","Mei","Jun"]}
              series={[
                { name: "Tebet",   color: "#0f766e", values: [30,34,38,42,46,48] },
                { name: "Kemang",  color: "#14b8a6", values: [26,30,33,36,39,41] },
                { name: "BSD",     color: "#0ea5e9", values: [22,26,29,32,36,38] },
                { name: "Bekasi",  color: "#6366f1", values: [18,21,23,26,29,31] },
                { name: "Bandung", color: "#a855f7", values: [14,17,19,21,23,24] },
              ]}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Branch Ranking" />
          <div className="space-y-3 px-5 py-4">
            {[
              ["Tebet",   "Rp 48,2jt", 92, "#0f766e"],
              ["Kemang",  "Rp 41,5jt", 85, "#14b8a6"],
              ["BSD",     "Rp 38,9jt", 78, "#0ea5e9"],
              ["Bekasi",  "Rp 31,1jt", 70, "#6366f1"],
              ["Bandung", "Rp 24,3jt", 62, "#a855f7"],
            ].map((b:any, i) => (
              <div key={b[0]} className="flex items-center gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-xs" style={{ fontWeight: 700 }}>#{i+1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ fontWeight: 500 }}>{b[0]}</span>
                    <span style={{ fontWeight: 700 }}>{b[1]}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full" style={{ width: `${b[2]}%`, background: b[3] }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Employees() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Employees" value="42" />
        <KpiCard label="Active Shift" value="28" delta="6 cabang" deltaTone="flat" />
        <KpiCard label="Avg Orders/Emp" value="76" delta="+8" />
        <KpiCard label="Overload Risk" value="3" delta="perlu rotasi" deltaTone="down" />
      </div>

      <Card className="mt-4">
        <CardHeader title="Workload Heatmap" subtitle="Pegawai × Jam · hari ini" />
        <div className="px-5 py-4">
          <div className="flex items-center text-[10px] text-slate-500">
            <div className="w-32" />
            {["08","09","10","11","12","13","14","15","16","17","18","19"].map(h => <div key={h} className="flex-1 text-center">{h}</div>)}
          </div>
          {[
            ["Rina Putri",   "Tebet",   [2,4,6,9,7,5,8,10,8,6,4,2]],
            ["Wahyu Hidayat","Tebet",   [3,5,7,8,9,7,6,8, 9,7,5,3]],
            ["Maya Sari",    "Kemang",  [1,3,5,6,8,9,7,5, 6,5,4,2]],
            ["Doni Pratama", "Kemang",  [1,2,4,5,6,7,6,5, 4,4,3,2]],
            ["Eka Nurhayati","BSD",     [4,6,8,9,10,10,9,8,9,7,5,3]],
            ["Aris Munandar","BSD",     [2,4,5,7,8,8,7,6, 7,6,5,3]],
          ].map((row:any) => (
            <div key={row[0]} className="mt-1 flex items-center gap-2">
              <div className="flex w-32 items-center gap-2">
                <Avatar name={row[0]} size={22} />
                <div className="leading-tight">
                  <div className="text-xs" style={{ fontWeight: 500 }}>{row[0]}</div>
                  <div className="text-[10px] text-slate-500">{row[1]}</div>
                </div>
              </div>
              {row[2].map((v:number, i:number) => {
                const opacity = v / 10;
                return <div key={i} className="mx-0.5 h-6 flex-1 rounded" style={{ background: `rgba(15,118,110,${0.08 + opacity * 0.7})` }} title={`${v} orders`} />;
              })}
            </div>
          ))}
          <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-slate-500">
            <span>Low</span>
            {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((o,i) => <div key={i} className="h-3 w-5 rounded" style={{ background: `rgba(15,118,110,${o})` }} />)}
            <span>High</span>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Performance Table" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>Employee</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Branch</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Role</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Active</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Completed</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Hours</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Rina Putri","Tebet","Operator",6,128,182,95],
              ["Wahyu Hidayat","Tebet","Operator",4,112,176,84],
              ["Maya Sari","Kemang","Operator",5,98,168,72],
              ["Doni Pratama","Kemang","Kasir",2,84,160,58],
              ["Eka Nurhayati","BSD","Operator",8,142,184,98],
              ["Aris Munandar","BSD","Operator",6,118,176,86],
            ].map((r:any) => (
              <tr key={r[0]} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2"><Avatar name={r[0]} size={28} /><span style={{ fontWeight: 500 }}>{r[0]}</span></div>
                </td>
                <td className="text-slate-600">{r[1]}</td>
                <td><StatusPill tone="neutral">{r[2]}</StatusPill></td>
                <td>{r[3]}</td>
                <td>{r[4]}</td>
                <td className="text-slate-500">{r[5]}h</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-28 rounded-full bg-slate-100">
                      <div className={`h-1.5 rounded-full ${r[6] >= 90 ? "bg-rose-500" : r[6] >= 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${r[6]}%` }} />
                    </div>
                    <span className={`text-xs ${r[6] >= 90 ? "text-rose-600" : r[6] >= 75 ? "text-amber-600" : "text-emerald-600"}`}>{r[6]}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function Reviews() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-xs text-slate-500">Average rating</div>
          <div className="flex items-baseline gap-2">
            <span className="text-slate-900" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>4.7</span>
            <span className="text-amber-500">★★★★★</span>
          </div>
          <div className="text-xs text-slate-500">dari 1.842 ulasan · +0.1 vs minggu lalu</div>
          <div className="mt-4 space-y-1.5">
            {[[5,68],[4,22],[3,6],[2,3],[1,1]].map(([s,p]:any) => (
              <div key={s} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-slate-500">{s}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-400" style={{ width: `${p}%` }} /></div>
                <span className="w-8 text-right text-slate-600" style={{ fontWeight: 500 }}>{p}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="col-span-2">
          <CardHeader title="Monthly Rating Trend" />
          <div className="px-4 pt-3">
            <AreaChart
              labels={["Jan","Feb","Mar","Apr","Mei","Jun"]}
              series={[{ name: "Rating", color: "#f59e0b", values: [4.4, 4.5, 4.5, 4.6, 4.6, 4.7] }]}
              height={180}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Sentiment Tags" subtitle="Tag terpopuler · 30 hari" />
        <div className="flex flex-wrap gap-2 p-5">
          {[["Wangi",824,"success"],["Bersih",712,"success"],["Cepat",584,"success"],["Ramah",482,"success"],["Rapi",442,"success"],["Tepat waktu",398,"success"],["Harga oke",344,"success"],["Packaging",288,"primary"],["Lama",62,"warning"],["Hilang",18,"danger"]].map(([t,c,tone]:any) => (
            <StatusPill key={t} tone={tone}>{t} <span className="ml-1 opacity-70">· {c}</span></StatusPill>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Latest Reviews" />
        <div className="divide-y divide-slate-100">
          {[
            ["Andini Pratama","Cuci Setrika · Tebet",5,"Wangi banget, kemasannya rapi banget!","2 jam","positive"],
            ["Rizal Kurniawan","Dry Clean · Kemang",4,"Bagus tapi agak lama dari estimasi.","5 jam","neutral"],
            ["Sari Wulandari","Sepatu · BSD",5,"Sepatu putih saya bersih seperti baru!","1 hari","positive"],
            ["Doni Saputra","Express · Tebet",3,"OK tapi lipatan kurang rapi.","2 hari","negative"],
          ].map((r:any) => (
            <div key={r[0]} className="flex gap-3 px-5 py-4">
              <Avatar name={r[0]} size={36} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="leading-tight">
                    <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{r[0]}</div>
                    <div className="text-[11px] text-slate-500">{r[1]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone={r[5] === "positive" ? "success" : r[5] === "neutral" ? "warning" : "danger"}>{r[5]}</StatusPill>
                    <span className="text-amber-500 text-sm">{"★".repeat(r[2])}<span className="text-slate-300">{"★".repeat(5 - r[2])}</span></span>
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-700">{r[3]}</div>
                <div className="text-[11px] text-slate-400">{r[4]} lalu</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function PaymentsAnalytics() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Method Distribution" />
          <div className="px-5 py-5">
            <Donut segments={[
              { label: "QRIS",  value: 56, color: "#0f766e" },
              { label: "Debit", value: 28, color: "#0ea5e9" },
              { label: "Cash",  value: 16, color: "#94a3b8" },
            ]} />
          </div>
        </Card>
        <Card className="col-span-2">
          <CardHeader title="Payment Volume" subtitle="Per metode · 30 hari" />
          <div className="px-4 pt-3">
            <AreaChart
              labels={["W1","W2","W3","W4"]}
              series={[
                { name: "QRIS",  color: "#0f766e", values: [42,48,52,58] },
                { name: "Debit", color: "#0ea5e9", values: [20,22,25,28] },
                { name: "Cash",  color: "#94a3b8", values: [14,15,15,16] },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Method Summary" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>Method</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Transactions</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Volume</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Avg Ticket</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Fee</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Net</th>
              <th className="text-left" style={{ fontWeight: 600 }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["QRIS",  1812, "Rp 103jt", "Rp 57k", "Rp 720k", "Rp 102jt", 56, "#0f766e"],
              ["Debit",  912, "Rp 52jt",  "Rp 57k", "Rp 1,2jt","Rp 50,8jt", 28, "#0ea5e9"],
              ["Cash",   514, "Rp 29jt",  "Rp 56k", "Rp 0",    "Rp 29jt",   16, "#94a3b8"],
            ].map((r:any) => (
              <tr key={r[0]} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: r[7] }} /><span style={{ fontWeight: 600 }}>{r[0]}</span></div>
                </td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td className="text-rose-600">{r[4]}</td>
                <td className="text-emerald-700" style={{ fontWeight: 600 }}>{r[5]}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-slate-100"><div className="h-1.5 rounded-full" style={{ width: `${r[6]}%`, background: r[7] }} /></div>
                    <span className="text-xs">{r[6]}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
