import { Avatar, Card, CardHeader, StatusPill } from "../components/ds/primitives";
import { PageBody, PrimaryButton, SecondaryButton, Topbar } from "../components/layout/Shell";
import { Bell, Building2, Lock, Plug, UserCircle2, Users } from "lucide-react";

const SECTIONS = [
  { icon: UserCircle2, label: "Profile",       desc: "Nama, foto, kontak" },
  { icon: Lock,        label: "Security",      desc: "Password, 2FA, sesi" },
  { icon: Building2,   label: "Branches",      desc: "Lokasi & operasional" },
  { icon: Users,       label: "Team",          desc: "Anggota & role" },
  { icon: Bell,        label: "Notifications", desc: "Preferensi kanal" },
  { icon: Plug,        label: "Integrations",  desc: "Payment gateway, WA" },
];

export function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" breadcrumb={["NiLaundry", "Settings"]} />
      <PageBody>
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-3 p-2">
            <div className="space-y-0.5">
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                const active = i === 0;
                return (
                  <button key={s.label} className={`flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm ${active ? "bg-teal-50 text-teal-800" : "text-slate-700 hover:bg-slate-50"}`}>
                    <Icon size={16} className={`mt-0.5 ${active ? "text-teal-700" : "text-slate-400"}`} />
                    <div className="leading-tight">
                      <div style={{ fontWeight: 600 }}>{s.label}</div>
                      <div className="text-[11px] text-slate-500">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="col-span-9 space-y-4">
            <Card>
              <CardHeader title="Profile" subtitle="Informasi akun Anda" action={<PrimaryButton>Save</PrimaryButton>} />
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <Avatar name="Andini Pratama" size={64} />
                  <div>
                    <SecondaryButton>Upload photo</SecondaryButton>
                    <div className="mt-1 text-[11px] text-slate-500">PNG/JPG, max 2MB</div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {[
                    ["Full name", "Andini Pratama"],
                    ["Email", "andini@nilaundry.id"],
                    ["Phone", "0812-3344-7788"],
                    ["Role", "Manager"],
                  ].map(([l,v]) => (
                    <label key={l} className="block">
                      <div className="text-xs text-slate-500">{l}</div>
                      <input className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" defaultValue={v} />
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Branches" subtitle="12 cabang aktif" action={<PrimaryButton>+ Add branch</PrimaryButton>} />
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-2.5 text-left" style={{ fontWeight: 600 }}>Branch</th>
                    <th className="text-left" style={{ fontWeight: 600 }}>Manager</th>
                    <th className="text-left" style={{ fontWeight: 600 }}>Staff</th>
                    <th className="text-left" style={{ fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Tebet","Andini Pratama",8,"Active"],
                    ["Kemang","Rizal Kurniawan",6,"Active"],
                    ["BSD","Sari Wulandari",7,"Active"],
                    ["Bekasi","Lia Anggraini",5,"Active"],
                    ["Bandung","Hendra Pradana",4,"Pilot"],
                  ].map((r:any) => (
                    <tr key={r[0]} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-3" style={{ fontWeight: 600 }}>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td><StatusPill tone={r[3] === "Active" ? "success" : "info"}>{r[3]}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  );
}
