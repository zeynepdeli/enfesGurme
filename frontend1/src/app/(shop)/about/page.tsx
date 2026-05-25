"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#efe3cc] pt-[86px]">
      <Image src="/heroB.png" alt="" fill priority className="object-cover" />

      <div className="absolute inset-0 bg-[#f4ead5]/20" />

      <section className="relative z-10 mx-auto min-h-[calc(100vh-86px)] w-full max-w-[1720px] px-4 pb-10 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
        {/* DESKTOP */}
        <div className="relative hidden min-h-[820px] w-full lg:block">
          {/* SOL ÜST BÜYÜK GÖRSEL */}
          <div className="absolute left-0 top-0 h-[310px] w-[32%] overflow-hidden rounded-b-[36px]">
            <Image
              src="/vizyon.png"
              alt="Vizyon"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(246,239,221,0.25))]" />
          </div>

          {/* VİZYON TEXT */}
          <div className="absolute left-[30%] top-[48px] w-[25%]">
            <h1 className="font-serif text-[clamp(30px,2.4vw,46px)] font-black leading-[0.98] tracking-[-0.035em] text-[#351509]">
              VİZYONUMUZ:
              <br />
              Anadolu’nun
              <br />
              Enfes Geleceği.
            </h1>

            <p className="mt-3 max-w-[360px] text-[clamp(11px,0.85vw,14px)] font-medium leading-[1.35] text-[#2d2117]">
              Anadolu’nun bereketli topraklarından süzülen geleneksel
              lezzetleri, en saf haliyle ve yenilikçi bir bakış açısıyla global
              bir markaya dönüştürerek, sağlıklı yaşamın vazgeçilmez bir parçası
              olmak.
            </p>

            <div className="relative mt-2 h-[120px] w-[320px]">
              <Image
                src="/bakirTencere.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* ÇİZİM */}
          <img
            src="/wo.png"
            alt=""
            className="absolute left-[43%] top-[62px] w-[16%] opacity-[0.18] mix-blend-multiply"
          />

          {/* SAĞ ÜST BAŞLIK */}
          <h2 className="absolute right-[9%] top-[28px] font-serif text-[clamp(24px,1.9vw,36px)] font-black text-[#351509]">
            Doğallığın İzinde
          </h2>

          {/* MİSYON KART */}
          <div className="absolute right-[20%] top-[100px] h-[320px] w-[27%]">
            <ImageCard src="/mission.png" alt="Misyon" />
          </div>

          {/* MİSYON TEXT */}
          <div className="absolute right-0 top-[132px] w-[18%]">
            <h2 className="font-serif text-[clamp(28px,2.2vw,42px)] font-black leading-[0.96] tracking-[-0.03em] text-[#351509]">
              MİSYONUMUZ:
              <br />
              Doğadan
              <br />
              Sofranıza
              <br />
              Sağlık.
            </h2>

            <p className="mt-3 text-[clamp(11px,0.85vw,14px)] font-medium leading-[1.35] text-[#2d2117]">
              Müşterilerimize en doğal, katkısız ve sürdürülebilir yöntemlerle
              üretilmiş Anadolu lezzetlerini ulaştırırken, yerel üreticileri
              destekleyerek kültürel mirasımızı korumak.
            </p>

            <img
              src="/wo.png"
              alt=""
              className="mt-2 w-full opacity-[0.22] mix-blend-multiply"
            />
          </div>

          {/* ORTA BAŞLIK */}
          <h2 className="absolute left-[10%] top-[360px] font-serif text-[clamp(24px,2vw,38px)] font-black text-[#351509]">
            Bir Tutku ve Geleneğin Hikayesi
          </h2>

          {/* SOL ALT KÜÇÜK ÜRÜNLER */}
          <div className="absolute left-0 top-[430px] flex flex-col gap-24">
            <MiniProduct src="/urun1.png" />
            <MiniProduct src="/urun2.png" />
          </div>

          {/* HİKAYE KART */}
          <div className="absolute left-[7%] top-[420px] h-[300px] w-[18%]">
            <ImageCard src="/story.png" alt="Hikaye" />
          </div>

          {/* HİKAYE TEXT */}
          <div className="absolute left-[28%] top-[455px] w-[22%]">
            <h3 className="font-serif text-[clamp(26px,2vw,40px)] font-black leading-[0.98] tracking-[-0.03em] text-[#351509]">
              Nesilden Nesile
              <br />
              Aktarılan Bilgi
            </h3>

            <p className="mt-3 max-w-[360px] text-[clamp(11px,0.85vw,14px)] font-medium leading-[1.35] text-[#2d2117]">
              Aile reçetelerini, kadın emeğini ve Anadolu’nun sofra kültürünü
              yaşatıyor; geçmişten bugüne taşınan bilgiyi modern sofralarla
              buluşturuyoruz.
            </p>
          </div>

          <img
            src="/wo.png"
            alt=""
            className="absolute left-[37%] top-[380px] w-[22%] opacity-[0.14] mix-blend-multiply"
          />

          {/* DEĞERLER BAŞLIK */}
          <h2 className="absolute right-[22%] top-[420px] font-serif text-[clamp(24px,1.9vw,36px)] font-black text-[#351509]">
            Lezzetin Coğrafyası ve Toplum
          </h2>

          {/* DEĞERLER GÖRSEL */}
          <div className="absolute right-[19%] top-[470px] h-[270px] w-[25%]">
            <Image
              src="/degerler.png"
              alt="Değerler"
              fill
              className="object-contain"
            />
          </div>

          {/* DEĞERLER TEXT */}
          <div className="absolute right-0 top-[520px] w-[20%]">
            <h3 className="font-serif text-[clamp(27px,2vw,40px)] font-black leading-[0.98] tracking-[-0.03em] text-[#351509]">
              DEĞERLERİMİZ:
              <br />
              İmzâmız Kalite.
            </h3>

            <p className="mt-3 text-[clamp(11px,0.85vw,14px)] font-medium leading-[1.35] text-[#2d2117]">
              Dürüstlük, kalite, sürdürülebilirlik, yerel üretim ve kültürel
              miras.
            </p>

            <img
              src="/wo.png"
              alt=""
              className="mt-4 w-full opacity-[0.16] mix-blend-multiply"
            />
          </div>
        </div>

        {/* TABLET / MOBILE */}
        <div className="grid gap-8 lg:hidden">
          <MobileBlock
            image="/vizyon.png"
            eyebrow="Vizyonumuz"
            title="Anadolu’nun Enfes Geleceği."
            text="Anadolu’nun bereketli topraklarından süzülen geleneksel lezzetleri modern sofralara taşıyoruz."
          />

          <MobileBlock
            image="/mission.png"
            eyebrow="Misyonumuz"
            title="Doğadan Sofranıza Sağlık."
            text="Katkısız, güvenilir ve yöresel üretimi destekleyen ürünleri müşterilerimize ulaştırıyoruz."
          />

          <h2 className="text-center font-serif text-[clamp(24px,6vw,36px)] font-black text-[#351509]">
            Bir Tutku ve Geleneğin Hikayesi
          </h2>

          <MobileBlock
            image="/story.png"
            eyebrow="Hikayemiz"
            title="Nesilden Nesile Aktarılan Bilgi"
            text="Aile reçetelerini, kadın emeğini ve Anadolu’nun sofra kültürünü yaşatıyoruz."
          />

          <MobileBlock
            image="/degerler.png"
            eyebrow="Değerlerimiz"
            title="İmzâmız Kalite."
            text="Dürüstlük, kalite, sürdürülebilirlik, yerel üretim ve kültürel miras."
            contain
          />
        </div>
      </section>
    </main>
  );
}

function ImageCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[18px] border border-[#d8bf8a] bg-cover bg-center p-4 shadow-[0_16px_36px_rgba(80,55,28,0.14)]"
      style={{ backgroundImage: "url('/cardDuvar.png')" }}
    >
      <div className="absolute inset-0 bg-[url('/bkrr.png')] bg-cover bg-center opacity-[0.14] mix-blend-multiply" />
      <div className="absolute inset-[6px] z-[2] rounded-[14px] border border-[#d6c49a]/70" />

      <Image src={src} alt={alt} fill className="object-cover p-5" />
    </div>
  );
}

function MiniProduct({ src }: { src: string }) {
  return (
    <div
      className="relative h-[62px] w-[72px] overflow-hidden rounded-[10px] border border-[#d8bf8a] bg-cover bg-center p-2"
      style={{ backgroundImage: "url('/cardDuvar.png')" }}
    >
      <Image src={src} alt="" fill className="object-contain p-2" />
    </div>
  );
}

function MobileBlock({
  image,
  eyebrow,
  title,
  text,
  contain = false,
}: {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  contain?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[0.9fr_1fr] sm:items-center">
      <div className="relative h-[220px] overflow-hidden rounded-[18px] border border-[#d8bf8a]">
        <Image
          src={image}
          alt={title}
          fill
          className={contain ? "object-contain p-4" : "object-cover"}
        />
      </div>

      <div>
        <p className="text-[clamp(8px,1.25vw,12px)] font-medium uppercase tracking-[0.2em] text-[#b48a54]">
          {eyebrow}
        </p>

        <h2 className="mt-1 font-serif text-[clamp(28px,7vw,42px)] font-black leading-[0.96] tracking-[-0.04em] text-[#431208]">
          {title}
        </h2>

        <p className="mt-2 text-[clamp(11px,2.4vw,14px)] leading-[1.45] text-[#4d3827]">
          {text}
        </p>
      </div>
    </div>
  );
}
