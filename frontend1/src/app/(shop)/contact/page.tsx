"use client";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
} from "lucide-react";

const SOCIALS = [
  {
    icon: Instagram,
    title: "Instagram",
    subtitle: "Bizi Takip Edin",
    href: "https://instagram.com",
  },
  {
    icon: Facebook,
    title: "Facebook",
    subtitle: "Bizi Takip Edin",
    href: "https://facebook.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    subtitle: "Bizi Takip Edin",
    href: "https://wa.me/905551234567",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efdd] pt-28 sm:pt-32 md:pt-36 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/heroB.png"
          alt=""
          className="h-full w-full object-cover opacity-35 mix-blend-multiply"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,248,230,0.88)_0%,rgba(246,239,221,0.62)_45%,rgba(225,205,165,0.28)_100%)]" />

        <img
          src="/wo.png"
          alt=""
          className="absolute left-[-18%] top-[8%] w-[78%] opacity-[0.09] mix-blend-multiply sm:left-[-12%] sm:w-[55%] md:w-[44%] lg:left-[2%] lg:top-[8%] lg:w-[28%]"
        />

        <img
          src="/wo.png"
          alt=""
          className="absolute left-[-10%] top-[55%] w-[70%] rotate-[10deg] opacity-[0.08] mix-blend-multiply sm:left-[0%] sm:w-[48%] md:w-[36%] lg:left-[10%] lg:top-[58%] lg:w-[24%]"
        />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-[1720px] px-4 pb-12 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
        <div className="mb-8 text-center md:mb-10 lg:mb-8">
          <h1 className="font-serif text-[38px] font-black text-[#3a1f12] sm:text-[48px] md:text-[58px] lg:text-[64px]">
            İletişim
          </h1>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.7fr_1fr] lg:gap-8 xl:gap-10">
          <div className="relative min-h-[340px] overflow-hidden rounded-[18px] border border-[#9b7047]/55 bg-[#efe3cf] shadow-[0_18px_45px_rgba(80,55,28,0.16)] sm:min-h-[430px] md:min-h-[500px] lg:min-h-[540px] xl:min-h-[560px]">
            <div className="absolute inset-0 bg-[url('/mapBg.png')] bg-cover bg-center opacity-90" />

            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,248,232,0.22),rgba(190,174,130,0.22))]" />

            <div className="absolute inset-[8px] rounded-[14px] border border-[#d8bf8a]/60" />

            <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div className="relative">
                <div className="flex h-[104px] w-[78px] rotate-45 items-center justify-center rounded-bl-full rounded-br-full rounded-t-full bg-[#9a5b34] shadow-[0_12px_30px_rgba(70,40,20,0.35)] sm:h-[120px] sm:w-[88px]">
                  <div className="-rotate-45 flex h-16 w-16 items-center justify-center rounded-full border border-[#d8bf8a]/60 bg-[#efe3cf] shadow-inner sm:h-20 sm:w-20">
                    <img
                      src="/logo.png"
                      alt="Enfes"
                      className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center font-serif text-[20px] font-black leading-tight text-[#3a1f12] sm:text-[24px]">
                GAZİANTEP
                <br />
                Merkez
              </div>
            </div>
          </div>

          <div
            className="
              relative overflow-hidden rounded-[18px]
              border border-[#d8bf8a]
              bg-cover bg-center
              p-6
              shadow-[0_18px_45px_rgba(80,55,28,0.16),inset_0_1px_2px_rgba(255,255,255,0.55)]
              sm:p-8
              lg:min-h-[540px]
              xl:min-h-[560px]
              xl:p-10
            "
            style={{
              backgroundImage: "url('/cardDuvar.png')",
            }}
          >
            <div className="absolute inset-0 bg-[url('/bkrr.png')] bg-cover bg-center opacity-[0.14] mix-blend-soft-light" />

            <CardBg />

            <div className="relative z-10">
              <p className="font-serif text-[22px] text-[#7a3b1e] sm:text-[26px]">
                İletişim Bilgileri
              </p>

              <h2 className="mt-1 font-serif text-[34px] font-black leading-none text-[#2c1a0e] sm:text-[42px] lg:text-[44px] xl:text-[52px]">
                Bize Ulaşın
              </h2>

              <div className="mt-8 space-y-7 sm:mt-10 xl:space-y-9">
                <InfoItem
                  icon={MapPin}
                  title="Adres:"
                  text={
                    <>
                      Merkez Mah. Fıstık Cad.
                      <br />
                      No:123, Şahinbey, Gaziantep
                      <br />
                      <span className="mt-1 inline-block underline">
                        Konumu Gör
                      </span>
                    </>
                  }
                />

                <InfoItem
                  icon={Phone}
                  title="Telefon:"
                  text="+90 342 123 4567"
                />

                <InfoItem
                  icon={Mail}
                  title="E-posta:"
                  text="iletisim@enfesgurme.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-3 md:mt-12 lg:mt-14">
          {SOCIALS.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                className="group relative flex items-center justify-center"
              >
                <div
                  className="
                    relative flex min-h-[74px] w-full max-w-[280px]
                    items-center gap-4 rounded-full
                    border border-[#d8bf8a]
                    bg-cover bg-center
                    py-3 pl-4 pr-6
                    shadow-[0_10px_25px_rgba(80,55,28,0.14)]
                    transition
                    group-hover:-translate-y-1
                  "
                  style={{
                    backgroundImage: "url('/cardDuvar.png')",
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-[url('/bkrr.png')] bg-cover bg-center opacity-[0.12] mix-blend-soft-light" />

                  <CardBg rounded />

                  <CopperIconCircle>
                    <Icon size={30} className="relative z-10 text-[#2f1a0e]" />
                  </CopperIconCircle>

                  <div className="relative z-10 min-w-0">
                    <h3 className="font-serif text-[20px] text-[#2c1a0e]">
                      {item.title}
                    </h3>

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#3d3020]/70">
                      {item.subtitle}
                    </p>

                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#7a3b1e]">
                      İncele <Send size={10} />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function InfoItem({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 sm:gap-5">
      <CopperIconCircle large>
        <Icon
          size={34}
          strokeWidth={1.8}
          className="relative z-10 text-[#2f1a0e]"
        />
      </CopperIconCircle>

      <div className="pt-2">
        <h3 className="text-[18px] font-black text-[#2c1a0e] sm:text-[22px]">
          {title}
        </h3>

        <div className="mt-1 text-[15px] leading-relaxed text-[#2c1a0e] sm:text-[17px]">
          {text}
        </div>
      </div>
    </div>
  );
}

function CopperIconCircle({
  children,
  large = false,
}: {
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`
        relative z-10 flex shrink-0
        items-center justify-center rounded-full
        border border-[#d8bf8a]
        text-[#2f1a0e]
        shadow-[0_10px_26px_rgba(80,55,28,0.32)]
        ${large ? "h-[72px] w-[72px] sm:h-[84px] sm:w-[84px]" : "h-16 w-16"}
      `}
      style={{
        background: `
          radial-gradient(circle at 30% 28%,
            rgba(255,240,215,0.95) 0%,
            rgba(255,214,160,0.72) 18%,
            rgba(201,136,58,0.95) 42%,
            rgba(122,63,24,1) 72%,
            rgba(82,45,18,1) 100%
          )
        `,
      }}
    >
      <div className="absolute inset-[2px] rounded-full border border-[#f1d3a1]/45" />

      <div
        className="absolute inset-0 rounded-full opacity-[0.10] mix-blend-soft-light"
        style={{
          backgroundImage: "url('/cardDuvar.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 rounded-full bg-[url('/bkrr.png')] bg-cover bg-center opacity-[0.18] mix-blend-overlay" />

      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,250,240,0.55),transparent_60%)]" />

      {children}
    </div>
  );
}

function CardBg({ rounded = false }: { rounded?: boolean }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.94)_0%,_rgba(250,243,228,0.82)_42%,_rgba(246,236,214,0.66)_68%,_rgba(228,212,176,0.24)_100%)]" />

      <div
        className={`
          pointer-events-none absolute inset-[6px] z-[2]
          border border-[#d6c49a]/70
          ${rounded ? "rounded-full" : "rounded-[14px]"}
        `}
      />
    </>
  );
}
