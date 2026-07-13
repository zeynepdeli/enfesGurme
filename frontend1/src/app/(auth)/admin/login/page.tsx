"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";

import { authService } from "@/services/auth.service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response?.role !== "ADMIN") {
        setError("Bu alan sadece admin kullanıcılar içindir");
        await authService.logout();
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_45%,rgba(246,239,221,0.42)_0%,rgba(246,239,221,0.08)_42%,transparent_72%)]" />
        <div className="absolute bottom-[-10%] right-[-6%] h-[40%] w-[52%] rounded-full bg-[#e0ccaa] blur-[40px]" />
        <div className="absolute top-[-8%] left-[-4%] h-[40%] w-[38%] rounded-full bg-[#e8d9b8]/50 blur-[35px]" />
        <div className="absolute top-[-5%] right-[-4%] h-[15%] w-[50%] rounded-full bg-[#e8d4b0] blur-[30px]" />
      </div>

      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className="
            relative w-[min(86vw,clamp(330px,28vw,520px))]
            overflow-hidden rounded-[7px]
            border border-[#d8bf8a]
            bg-cover bg-center
            px-[clamp(28px,3vw,48px)]
            pb-[clamp(30px,3vw,46px)]
            pt-[clamp(26px,3vw,42px)]
            shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]
          "
          style={{
            backgroundImage: "url('/cardDuvar.png')",
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22)_0%,transparent_45%)]" />
          <div className="pointer-events-none absolute inset-[5px] z-[3] rounded-[4px] border border-[#e0c896]/60" />

          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <div
                className="
                  flex h-[clamp(46px,4vw,64px)]
                  w-[clamp(46px,4vw,64px)]
                  items-center justify-center
                  rounded-full
                  border border-[#d8bf8a]
                  bg-cover bg-center
                  text-[#460e07]
                  shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28)]
                "
                style={{
                  backgroundImage: "url('/bkrr.png')",
                }}
              >
                <ShieldCheck className="h-[clamp(22px,2vw,30px)] w-[clamp(22px,2vw,30px)]" />
              </div>
            </div>

            <h1
              className="
                text-center font-serif
                text-[clamp(27px,2.3vw,44px)]
                font-black uppercase tracking-wide
                text-[#460e07]
              "
            >
              Admin Paneli
            </h1>

            <p className="mb-[clamp(18px,2vw,30px)] mt-2 text-center text-[clamp(11px,0.85vw,14px)] text-[#4b2a17]/75">
              Yönetim paneline giriş yapın
            </p>

            {error && (
              <Alert
                variant="destructive"
                className="mb-4 border-red-300 bg-red-50/80 text-red-700"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-[clamp(10px,1vw,16px)]"
            >
              <div className="relative">
                <Mail className="absolute left-[clamp(12px,1vw,18px)] top-1/2 h-[clamp(15px,1vw,20px)] w-[clamp(15px,1vw,20px)] -translate-y-1/2 text-[#8d6b3d]" />

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="
                    h-[clamp(34px,3vw,50px)]
                    rounded-[6px]
                    border-[#cdbb91]
                    bg-[#f5ecd8]/75
                    pl-[clamp(38px,3vw,54px)]
                    text-[clamp(12px,0.9vw,16px)]
                    text-[#3c2515]
                    placeholder:text-[#8e7754]
                    shadow-[inset_0_2px_5px_rgba(95,60,25,0.08)]
                    focus-visible:ring-[#c3a36f]/25
                  "
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-[clamp(12px,1vw,18px)] top-1/2 h-[clamp(15px,1vw,20px)] w-[clamp(15px,1vw,20px)] -translate-y-1/2 text-[#8d6b3d]" />

                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre"
                  required
                  disabled={loading}
                  className="
                    h-[clamp(34px,3vw,50px)]
                    rounded-[6px]
                    border-[#cdbb91]
                    bg-[#f5ecd8]/75
                    pl-[clamp(38px,3vw,54px)]
                    text-[clamp(12px,0.9vw,16px)]
                    text-[#3c2515]
                    placeholder:text-[#8e7754]
                    shadow-[inset_0_2px_5px_rgba(95,60,25,0.08)]
                    focus-visible:ring-[#c3a36f]/25
                  "
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="
                  relative mt-2
                  h-[clamp(38px,3vw,56px)]
                  w-full overflow-hidden rounded-[5px]
                  border border-[#d8bf8a]
                  bg-cover bg-center
                  font-serif
                  text-[clamp(15px,1.2vw,22px)]
                  font-black uppercase tracking-wide
                  text-[#460e07]
                  shadow-[0_10px_18px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.65)]
                  hover:brightness-105
                "
                style={{
                  backgroundImage: "url('/cardDuvar.png')",
                }}
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
