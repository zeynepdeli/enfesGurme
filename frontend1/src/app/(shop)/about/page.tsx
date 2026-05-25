"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#efe3cc] pt-[90px] sm:pt-[96px] md:pt-[88px] lg:pt-[82px]">
      {/* BG IMAGE */}
      <Image
        src="/heroB.png"
        alt=""
        fill
        priority
        className="object-cover opacity-55 mix-blend-multiply"
      />

      {/* BG OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[#f4ead5]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,248,230,0.62)_0%,rgba(246,239,221,0.32)_44%,rgba(225,205,165,0.14)_100%)]" />

        <img
          src="/wo.png"
          alt=""
          className="absolute left-[-22%] top-[7%] w-[70%] opacity-[0.08] mix-blend-multiply sm:left-[-14%] sm:w-[48%] md:w-[34%] lg:left-[2%] lg:w-[18%]"
        />

        <img
          src="/wo.png"
          alt=""
          className="absolute right-[-22%] bottom-[4%] w-[68%] rotate-[10deg] opacity-[0.07] mix-blend-multiply sm:right-[-12%] sm:w-[44%] md:w-[30%] lg:right-[4%] lg:w-[18%]"
        />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-[1500px] px-[clamp(14px,3vw,36px)] pb-[clamp(20px,3vw,36px)] xl:px-[clamp(48px,4vw,80px)] 2xl:px-[clamp(70px,4vw,110px)]">
        {/* TOP */}
        <div className="grid items-center gap-[clamp(16px,2.5vw,32px)] lg:grid-cols-[1.05fr_1fr]">
          <Block
            image="/vizyon.png"
            eyebrow="Vizyonumuz"
            title={
              <>
                Anadolu’nun
                <br />
                Enfes Geleceği
              </>
            }
            text="Anadolu’nun bereketli topraklarından gelen geleneksel lezzetleri, doğal ve yenilikçi bir bakışla modern sofralara taşımak."
          />

          <Block
            image="/mission.png"
            eyebrow="Misyonumuz"
            smallTitle="Doğallığın İzinde"
            title={
              <>
                Doğadan
                <br />
                Sofranıza Sağlık
              </>
            }
            text="Katkısız, güvenilir ve yöresel üretimi destekleyen ürünleri müşterilerimize ulaştırırken kültürel mirasımızı korumak."
            reverse
          />
        </div>

        <div className="mt-[clamp(18px,3vw,34px)] text-center">
          <h2 className="font-serif text-[clamp(21px,2.2vw,32px)] leading-none text-[#351509]">
            Bir Tutku ve Geleneğin Hikayesi
          </h2>
        </div>

        {/* BOTTOM */}
        <div className="mt-[clamp(14px,2.4vw,28px)] grid items-center gap-[clamp(16px,2.5vw,32px)] lg:grid-cols-[1fr_1fr]">
          <Block
            image="/story.png"
            eyebrow="Hikayemiz"
            title={
              <>
                Nesilden Nesile
                <br />
                Aktarılan Bilgi
              </>
            }
            text="Aile reçetelerini, kadın emeğini ve Anadolu’nun sofra kültürünü yaşatıyor; geçmişten bugüne taşınan bilgiyi modern sofralarla buluşturuyoruz."
          />

          <Block
            image="/degerler.png"
            eyebrow="Değerlerimiz"
            smallTitle="Lezzetin Coğrafyası"
            title={
              <>
                İmzâmız
                <br />
                Kalite
              </>
            }
            text="Dürüstlük, kalite, sürdürülebilirlik, yerel üretim ve kültürel miras bizim en temel değerlerimizdir."
            reverse
            contain
          />
        </div>
      </section>
    </main>
  );
}

function Block({
  image,
  eyebrow,
  smallTitle,
  title,
  text,
  reverse = false,
  contain = false,
}: {
  image: string;
  eyebrow: string;
  smallTitle?: string;
  title: React.ReactNode;
  text: string;
  reverse?: boolean;
  contain?: boolean;
}) {
  return (
    <div
      className={`
        grid items-center gap-[clamp(12px,1.8vw,22px)]
        md:grid-cols-[0.9fr_1fr]
        ${reverse ? "md:grid-cols-[1fr_0.9fr]" : ""}
      `}
    >
      <ImageCard
        src={image}
        alt={eyebrow}
        contain={contain}
        className={reverse ? "md:order-2" : ""}
      />

      <div className={reverse ? "md:order-1" : ""}>
        {smallTitle && <SmallSerif>{smallTitle}</SmallSerif>}

        <Eyebrow>{eyebrow}</Eyebrow>

        <Title>{title}</Title>

        <Text>{text}</Text>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[clamp(7px,0.85vw,10px)] font-medium uppercase tracking-[clamp(0.1em,0.25vw,0.2em)] text-[#b48a54]">
      {children}
    </p>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mt-[clamp(4px,0.7vw,8px)] font-serif text-[clamp(23px,3vw,38px)] leading-[0.96] tracking-[-0.035em] text-[#431208]">
      {children}
    </h1>
  );
}

function SmallSerif({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-[clamp(3px,0.6vw,8px)] font-serif text-[clamp(15px,1.5vw,22px)] leading-none text-[#2c1a0e]">
      {children}
    </p>
  );
}

function Text({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-[clamp(6px,0.9vw,10px)] max-w-[min(86vw,360px)] text-[clamp(10px,0.85vw,13px)] leading-[1.45] text-[#4d3827]">
      {children}
    </p>
  );
}

function ImageCard({
  src,
  alt,
  className = "",
  contain = false,
}: {
  src: string;
  alt: string;
  className?: string;
  contain?: boolean;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[16px]
        border border-[#d8bf8a]
        bg-cover bg-center
        shadow-[0_10px_24px_rgba(80,55,28,0.11),inset_0_1px_2px_rgba(255,255,255,0.55)]

        h-[clamp(150px,42vw,220px)]
        sm:h-[clamp(165px,32vw,235px)]
        md:h-[clamp(170px,20vw,250px)]
        xl:h-[clamp(190px,17vw,280px)]

        ${className}
      `}
      style={{ backgroundImage: "url('/cardDuvar.png')" }}
    >
      <div className="absolute inset-0 bg-[url('/bkrr.png')] bg-cover bg-center opacity-[0.14] mix-blend-multiply" />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.72)_0%,_rgba(250,243,228,0.50)_42%,_rgba(246,236,214,0.28)_68%,_rgba(228,212,176,0.10)_100%)]" />

      <div className="pointer-events-none absolute inset-[5px] z-[2] rounded-[12px] border border-[#d6c49a]/65" />

      <Image
        src={src}
        alt={alt}
        fill
        className={`
          relative z-10 p-[clamp(8px,1vw,14px)]
          ${contain ? "object-contain" : "object-cover"}
        `}
      />
    </div>
  );
}
