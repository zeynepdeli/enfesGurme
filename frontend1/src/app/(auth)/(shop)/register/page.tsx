"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/hooks/use-auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/error-message";

import { User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({ name, email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#efe3cb]">
      {/* HERO BG */}
      <Image src="/heroB.png" alt="" fill priority className="object-cover" />

      {/* HERO OVERLAYS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_45%,rgba(246,239,221,0.2)_0%,transparent_55%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(246,239,221,0.0)_0%,rgba(246,239,221,0.8)_38%,rgba(246,239,221,0.3)_78%,rgba(246,239,221,0.08)_100%)]" />

        <div
          className="
            absolute bottom-[-8%] right-[0%]
            h-[30%] w-[30%]
            bg-[radial-gradient(circle,rgba(235,222,198,0.92)_100%,rgba(235,222,198,0.46)_38%,rgba(235,222,198,0.16)_68%,transparent_100%)]
            blur-[18px]
          "
        />
      </div>

      {/* FORM */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className="
            relative overflow-hidden rounded-[7px]
            border border-[#d8bf8a]
            bg-cover bg-center
            px-[clamp(28px,3vw,48px)]
            pb-[clamp(30px,3vw,46px)]
            pt-[clamp(26px,3vw,42px)]
            shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]
            w-[min(86vw,clamp(330px,28vw,520px))]
          "
          style={{
            backgroundImage: "url('/cardDuvar.png')",
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22)_0%,transparent_45%)]" />
          <div className="pointer-events-none absolute inset-[5px] z-[3] rounded-[4px] border border-[#e0c896]/60" />

          <div className="relative z-10">
            <h1
              className="
                mb-[clamp(18px,2vw,30px)]
                text-center font-serif
                text-[clamp(27px,2.3vw,44px)]
                font-black uppercase tracking-wide
                text-[#460e07]
              "
            >
              Kayıt Ol
            </h1>

            <form
              onSubmit={handleSubmit}
              className="space-y-[clamp(10px,1vw,16px)]"
            >
              <div className="relative">
                <User className="absolute left-[clamp(12px,1vw,18px)] top-1/2 h-[clamp(15px,1vw,20px)] w-[clamp(15px,1vw,20px)] -translate-y-1/2 text-[#8d6b3d]" />

                <Input
                  type="text"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
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
                <Mail className="absolute left-[clamp(12px,1vw,18px)] top-1/2 h-[clamp(15px,1vw,20px)] w-[clamp(15px,1vw,20px)] -translate-y-1/2 text-[#8d6b3d]" />

                <Input
                  type="email"
                  placeholder="E-posta"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
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

              <p className="text-right text-[clamp(11px,0.8vw,14px)] text-[#4b2a17]/75">
                Zaten hesabınız var mı?{" "}
                <Link href="/login" className="underline underline-offset-2">
                  Giriş Yap
                </Link>
              </p>

              {error && <ErrorMessage message={error} />}

              <Button
                type="submit"
                disabled={isLoading}
                className="
                  relative mt-2 h-[clamp(38px,3vw,56px)]
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
                {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
