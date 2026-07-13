"use client";

import Image from "next/image";
import { ReactNode } from "react";

export type AuthPageSetting = {
  logoImage: string;
  cardBgImage: string;
  leftDecorImage: string;
  rightDecorImage: string;
  loginTitle: string;
  registerTitle: string;
  loginButtonText: string;
  registerButtonText: string;
  forgotText: string;
  registerLinkText: string;
  loginLinkText: string;
  haveAccountText: string;
};

export const DEFAULT_AUTH_SETTING: AuthPageSetting = {
  logoImage: "/logo.png",
  cardBgImage: "/cardDuvar.png",
  leftDecorImage: "/fistik.png",
  rightDecorImage: "/fistik.png",
  loginTitle: "Üye Girişi",
  registerTitle: "Kayıt Ol",
  loginButtonText: "Giriş Yap",
  registerButtonText: "Kayıt Ol",
  forgotText: "Şifremi Unuttum?",
  registerLinkText: "Kayıt Ol",
  loginLinkText: "Giriş Yap",
  haveAccountText: "Zaten hesabınız var mı?",
};

export function AuthCard({
  title,
  settings,
  children,
}: {
  title: string;
  settings: AuthPageSetting;
  children: ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      <div
        className="
          relative w-[min(88vw,420px)] overflow-visible rounded-[7px]
          border border-[#d8bf8a] bg-cover bg-center
          px-7 pb-8 pt-6
          shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]
          sm:w-[420px] sm:px-9 sm:pb-9 sm:pt-7
          lg:w-[440px]
        "
        style={{
          backgroundImage: `url('${settings.cardBgImage || "/cardDuvar.png"}')`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] rounded-[7px] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
        <div className="pointer-events-none absolute inset-0 z-[2] rounded-[7px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22)_0%,transparent_45%)]" />
        <div className="pointer-events-none absolute inset-[5px] z-[3] rounded-[4px] border border-[#e0c896]/60" />

        {settings.leftDecorImage && (
          <Image
            src={settings.leftDecorImage}
            alt=""
            width={120}
            height={90}
            className="pointer-events-none absolute -bottom-8 -left-10 z-20 w-[86px] object-contain sm:w-[100px]"
          />
        )}

        {settings.rightDecorImage && (
          <Image
            src={settings.rightDecorImage}
            alt=""
            width={120}
            height={90}
            className="pointer-events-none absolute -bottom-8 -right-10 z-20 w-[86px] object-contain sm:w-[100px]"
          />
        )}

        <div className="relative z-10">
          {settings.logoImage && (
            <div className="mb-2 flex justify-center">
              <Image
                src={settings.logoImage}
                alt="Logo"
                width={100}
                height={60}
                className="h-auto w-[82px] object-contain sm:w-[92px]"
                priority
              />
            </div>
          )}

          <h1 className="mb-5 text-center font-[family-name:var(--font-merienda)] text-[28px] font-black uppercase tracking-wide text-[#460e07] sm:text-[32px]">
            {title}
          </h1>

          {children}
        </div>
      </div>
    </div>
  );
}

export const authInputClassName = `
  h-10 rounded-[6px] border-[#cdbb91] bg-[#f5ecd8]/75
  pl-10 text-[13px] text-[#3c2515]
  placeholder:text-[#8e7754]
  shadow-[inset_0_2px_5px_rgba(95,60,25,0.08)]
  focus-visible:ring-[#c3a36f]/25
  sm:h-11 sm:text-[14px]
`;

export const authButtonClassName = `
  relative mt-2 h-11 w-full overflow-hidden rounded-[5px]
  border border-[#d8bf8a] bg-cover bg-center
  font-serif text-[16px] font-black uppercase tracking-wide text-[#460e07]
  shadow-[0_10px_18px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.65)]
  hover:brightness-105
  sm:h-12 sm:text-[18px]
`;
