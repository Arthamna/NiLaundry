import { Avatar, AreaChart, Card, CardHeader, Donut, FilterChip, KpiCard, StatusPill } from "../components/ds/primitives";
import { PageBody, PrimaryButton, SecondaryButton, Topbar } from "../components/layout/Shell";
import { AlertCircle, CheckCircle2, CreditCard, Download, Filter, Search, XCircle } from "lucide-react";

export function PaymentsPage() {
  return (
    <>
      <Topbar
        title="Payments"
        breadcrumb={["NiLaundry", "Finance", "Payments"]}
        action={<><SecondaryButton><Download size={14} /> Export</SecondaryButton><PrimaryButton>Reconcile</PrimaryButton></>}
      />
      <PageBody>
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Paid Orders"     value="1.812" delta="+12.4%" hint="bulan ini" icon={<CheckCircle2 size={16} />} />
          <KpiCard label="Unpaid Orders"   value="6"     delta="Rp 420k" deltaTone="down" icon={<AlertCircle size={16} />} />
          <KpiCard label="Failed Payments" value="3"     delta="2 retry" deltaTone="down" icon={<XCircle size={16} />} />
          <KpiCard label="Net Revenue"     value="Rp 182jt" delta="+18.2%" icon={<CreditCard size={16} />} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card>
            <CardHeader title="Payment Method Mix" subtitle="30 hari" />
            <div className="px-5 py-5">
              <Donut segments={[
                { label: "QRIS",  value: 56, color: "#0f766e" },
                { label: "Debit", value: 28, color: "#0ea5e9" },
                { label: "Cash",  value: 16, color: "#94a3b8" },
              ]} />
            </div>
          </Card>
          <Card className="col-span-2">
            <CardHeader title="Payment Volume Trend" subtitle="Per metode · 14 hari" action={<>
              <button className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">7H</button>
              <button className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white">14H</button>
              <button className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">30H</button>
            </>} />
            <div className="px-4 pt-3">
              <div className="mb-2 flex items-center gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-600" /> QRIS</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" /> Debit</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" /> Cash</span>
              </div>
              <AreaChart
                labels={["25","26","27","28","29","30","31","1","2","3","4","5","6","7"]}
                series={[
                  { name: "QRIS",  color: "#0f766e", values: [4.8,5.2,5.0,5.6,5.9,6.1,6.4,6.0,6.3,6.6,6.9,7.1,7.4,7.1] },
                  { name: "Debit", color: "#0ea5e9", values: [2.4,2.6,2.5,2.8,2.9,3.0,3.2,3.0,3.1,3.2,3.3,3.4,3.5,3.2] },
                  { name: "Cash",  color: "#94a3b8", values: [1.8,1.7,1.7,1.8,1.9,1.8,2.0,1.9,2.0,2.0,2.1,2.1,2.2,2.1] },
                ]}
              />
            </div>
          </Card>
        </div>

        <Card className="mt-4">
          <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm">
              <Search size={14} className="text-slate-400" />
              <input className="flex-1 bg-transparent outline-none placeholder:text-slate-400" placeholder="Cari invoice / customer…" />
            </div>
            <SecondaryButton><Filter size={14} /> Method</SecondaryButton>
            <SecondaryButton>Status</SecondaryButton>
            <SecondaryButton>Branch</SecondaryButton>
          </div>
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 px-5 py-2.5">
            <FilterChip label="All" active count={1821} />
            <FilterChip label="QRIS" count={1018} />
            <FilterChip label="Debit" count={512} />
            <FilterChip label="Cash" count={291} />
            <span className="mx-2 text-slate-300">·</span>
            <FilterChip label="Paid" count={1812} />
            <FilterChip label="Unpaid" count={6} />
            <FilterChip label="Failed" count={3} />
            <FilterChip label="Refunded" count={2} />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>Invoice</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Customer</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Method</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Date</th>
                <th className="text-left" style={{ fontWeight: 600 }}>Status</th>
                <th className="px-5 text-right" style={{ fontWeight: 600 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["INV-2401","Andini Pratama","QRIS",  "07 Jun 09:12", "success", "Rp 36.000"],
                ["INV-2402","Rizal Kurniawan","Debit","07 Jun 10:31", "success", "Rp 145.000"],
                ["INV-2403","Sari Wulandari","Cash",  "07 Jun 11:02", "unpaid",  "Rp 62.000"],
                ["INV-2404","Doni Saputra","QRIS",   "07 Jun 11:55", "pending", "Rp 40.000"],
                ["INV-2405","Lia Anggraini","Debit", "07 Jun 12:30", "success", "Rp 220.000"],
                ["INV-2406","Andre Wibowo","Cash",   "07 Jun 13:00", "unpaid",  "Rp 48.000"],
                ["INV-2407","Bayu Triyanto","QRIS",  "07 Jun 13:24", "success", "Rp 75.000"],
                ["INV-2408","Putri Maharani","QRIS", "07 Jun 13:42", "failed",  "Rp 85.000"],
              ].map((r:any) => (
                <tr key={r[0]} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-900" style={{ fontWeight: 600 }}>#{r[0]}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={r[1]} size={26} />
                      <span>{r[1]}</span>
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-1.5 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200">
                      <span className={`h-1.5 w-1.5 rounded-full ${r[2]==="QRIS"?"bg-teal-500":r[2]==="Debit"?"bg-sky-500":"bg-slate-400"}`} />
                      {r[2]}
                    </span>
                  </td>
                  <td className="text-slate-500">{r[3]}</td>
                  <td>
                    {r[4] === "success" && <StatusPill tone="success">Paid</StatusPill>}
                    {r[4] === "unpaid"  && <StatusPill tone="danger">Unpaid</StatusPill>}
                    {r[4] === "pending" && <StatusPill tone="warning">Pending</StatusPill>}
                    {r[4] === "failed"  && <StatusPill tone="danger">Failed</StatusPill>}
                  </td>
                  <td className="px-5 text-right text-slate-900" style={{ fontWeight: 600 }}>{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </PageBody>
    </>
  );
}
