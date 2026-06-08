import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FrameShell } from "../shared";

export function Frame00() {
  return (
    <FrameShell id="Frame 00" title="Login / Role Selection" subtitle="Pintu masuk untuk 3 peran: pelanggan, pegawai, admin">
      <div className="grid grid-cols-2 h-[760px]">
        <div className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white p-10 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-teal-700" style={{ fontWeight: 700 }}>N</div>
              <span style={{ fontSize: 22, fontWeight: 700 }}>NiLaundry</span>
            </div>
            <div className="mt-10 max-w-sm">
              <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
                Operasional laundry, dari pesanan hingga pengiriman.
              </div>
              <p className="mt-4 text-teal-50/90">
                Satu platform untuk pelanggan, pegawai, dan manajer cabang.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[["3.214","Pesanan/bln"],["4.7★","Rating"],["12","Cabang"]].map(([v,l])=>(
              <div key={l} className="rounded-lg bg-white/10 backdrop-blur p-3">
                <div style={{ fontWeight: 700, fontSize: 18 }}>{v}</div>
                <div className="text-xs text-teal-100/90">{l}</div>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-teal-400/20" />
          <div className="absolute top-1/2 -right-10 h-40 w-40 rounded-full bg-white/10" />
        </div>

        <div className="p-10 bg-white flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <div className="text-xs uppercase tracking-widest text-teal-700">Masuk</div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Selamat datang kembali</h2>
            <p className="text-sm text-slate-500 mt-1">Pilih peran Anda untuk melanjutkan.</p>

            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                ["👤","Pelanggan",true],
                ["🧺","Pegawai",false],
                ["📊","Admin",false],
              ].map(([i,t,active]:any)=>(
                <button key={t} className={`rounded-lg border p-3 text-left ${active?"border-teal-500 bg-teal-50":"border-slate-200"}`}>
                  <div className="text-xl">{i}</div>
                  <div className="text-sm mt-1" style={{ fontWeight: 600 }}>{t}</div>
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Email atau nomor HP</div>
                <Input defaultValue="andini@email.com" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Password</span>
                  <a className="text-teal-700">Lupa password?</a>
                </div>
                <Input type="password" defaultValue="••••••••" className="mt-1" />
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Masuk</Button>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex-1 h-px bg-slate-200" /> atau <div className="flex-1 h-px bg-slate-200" />
              </div>
              <Button variant="outline" className="w-full">Masuk dengan Google</Button>
              <div className="text-center text-xs text-slate-500">
                Belum punya akun? <a className="text-teal-700" style={{ fontWeight: 600 }}>Daftar gratis</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FrameShell>
  );
}
