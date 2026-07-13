"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import { api } from "@/lib/api";

type Variant = "mobile" | "xsMobile" | "tablet" | "desktop" | "xl" | "xxl";

type ContactSocial = {
  id?: number;
  type: string;
  title: string;
  subtitle: string;
  href: string;
  order: number;
  isActive: boolean;
};

type ContactPageData = {
  pageTitle: string;

  backgroundImage: string;
  sketchImageOne?: string;
  sketchImageTwo?: string;

  mapImage: string;
  logoImage: string;
  mapTitle: string;
  mapSubtitle: string;

  cardBgImage: string;
  textureImage: string;

  infoSmallTitle: string;
  infoTitle: string;

  addressTitle: string;
  addressText: string;
  addressLinkText: string;
  addressLink?: string;

  phoneTitle: string;
  phoneText: string;

  emailTitle: string;
  emailText: string;

  socials: ContactSocial[];
};

type ContactSize = {
  pagePt: string;
  pagePx: string;
  title: number;
  panelH: string;
  cardP: string;
  infoSmall: number;
  infoTitle: number;
  infoGap: string;
  itemTitle: number;
  itemText: number;
  iconClass: string;
  iconSize: number;
  socialGrid: string;
  socialCardH: string;
  socialCardW: string;
  socialIconClass: string;
  socialIconSize: number;
  socialTitle: number;
  socialSubtitle: number;
};

const FALLBACK_CONTACT: ContactPageData = {
  pageTitle: "İletişim",

  backgroundImage: "",
  sketchImageOne: "/wo.png",
  sketchImageTwo: "/wo.png",

  mapImage: "/mapBg.png",
  logoImage: "/logo.png",
  mapTitle: "GAZİANTEP",
  mapSubtitle: "Merkez",

  cardBgImage: "/cardDuvar.png",
  textureImage: "/bkrr.png",

  infoSmallTitle: "İletişim Bilgileri",
  infoTitle: "Bize Ulaşın",

  addressTitle: "Adres:",
  addressText: "Merkez Mah. Fıstık Cad.\nNo:123, Şahinbey, Gaziantep",
  addressLinkText: "Konumu Gör",
  addressLink: "",

  phoneTitle: "Telefon:",
  phoneText: "+90 342 123 4567",

  emailTitle: "E-posta:",
  emailText: "iletisim@enfesgurme.com",

  socials: [],
};

const CONTACT_SIZE: Record<Variant, ContactSize> = {
  mobile: {
    pagePt: "pt-[88px]",
    pagePx: "px-4",
    title: 34,
    panelH: "min-h-[250px]",
    cardP: "p-5",
    infoSmall: 18,
    infoTitle: 28,
    infoGap: "space-y-4",
    itemTitle: 16,
    itemText: 14,
    iconClass: "h-[54px] w-[54px]",
    iconSize: 28,
    socialGrid: "grid-cols-1",
    socialCardH: "min-h-[62px]",
    socialCardW: "max-w-[260px]",
    socialIconClass: "h-[50px] w-[50px]",
    socialIconSize: 25,
    socialTitle: 17,
    socialSubtitle: 9,
  },

  xsMobile: {
    pagePt: "pt-[94px]",
    pagePx: "px-5",
    title: 38,
    panelH: "min-h-[280px]",
    cardP: "p-5",
    infoSmall: 19,
    infoTitle: 31,
    infoGap: "space-y-4",
    itemTitle: 17,
    itemText: 14,
    iconClass: "h-[56px] w-[56px]",
    iconSize: 29,
    socialGrid: "grid-cols-1",
    socialCardH: "min-h-[64px]",
    socialCardW: "max-w-[270px]",
    socialIconClass: "h-[52px] w-[52px]",
    socialIconSize: 26,
    socialTitle: 17,
    socialSubtitle: 9,
  },

  tablet: {
    pagePt: "pt-[130px]",
    pagePx: "px-8",
    title: 42,
    panelH: "min-h-[330px]",
    cardP: "p-6",
    infoSmall: 21,
    infoTitle: 34,
    infoGap: "space-y-4",
    itemTitle: 18,
    itemText: 15,
    iconClass: "h-[60px] w-[60px]",
    iconSize: 30,
    socialGrid: "grid-cols-3",
    socialCardH: "min-h-[64px]",
    socialCardW: "max-w-[260px]",
    socialIconClass: "h-[52px] w-[52px]",
    socialIconSize: 26,
    socialTitle: 17,
    socialSubtitle: 9,
  },

  desktop: {
    pagePt: "pt-[140px]",
    pagePx: "px-10",
    title: 44,
    panelH: "min-h-[360px]",
    cardP: "p-6",
    infoSmall: 21,
    infoTitle: 35,
    infoGap: "space-y-4",
    itemTitle: 18,
    itemText: 15,
    iconClass: "h-[62px] w-[62px]",
    iconSize: 30,
    socialGrid: "grid-cols-3",
    socialCardH: "min-h-[64px]",
    socialCardW: "max-w-[270px]",
    socialIconClass: "h-[54px] w-[54px]",
    socialIconSize: 26,
    socialTitle: 17,
    socialSubtitle: 9,
  },

  xl: {
    pagePt: "pt-[150px]",
    pagePx: "px-14",
    title: 48,
    panelH: "min-h-[390px]",
    cardP: "p-7",
    infoSmall: 22,
    infoTitle: 38,
    infoGap: "space-y-5",
    itemTitle: 19,
    itemText: 15,
    iconClass: "h-[66px] w-[66px]",
    iconSize: 31,
    socialGrid: "grid-cols-3",
    socialCardH: "min-h-[66px]",
    socialCardW: "max-w-[280px]",
    socialIconClass: "h-[56px] w-[56px]",
    socialIconSize: 27,
    socialTitle: 18,
    socialSubtitle: 10,
  },

  xxl: {
    pagePt: "pt-[180px]",
    pagePx: "px-20",
    title: 54,
    panelH: "min-h-[430px]",
    cardP: "p-8",
    infoSmall: 24,
    infoTitle: 42,
    infoGap: "space-y-5",
    itemTitle: 20,
    itemText: 16,
    iconClass: "h-[72px] w-[72px]",
    iconSize: 34,
    socialGrid: "grid-cols-3",
    socialCardH: "min-h-[70px]",
    socialCardW: "max-w-[290px]",
    socialIconClass: "h-[60px] w-[60px]",
    socialIconSize: 29,
    socialTitle: 19,
    socialSubtitle: 10,
  },
};

export default function ContactPage() {
  const [contact, setContact] = useState<ContactPageData | null>(null);

  useEffect(() => {
    async function loadContact() {
      try {
        const res = await api.get<ContactPageData>("/api/contact-page");

        setContact({
          ...FALLBACK_CONTACT,
          ...(res.data || {}),
          socials: res.data?.socials || [],
        });
      } catch (error) {
        console.error("Contact page fetch error:", error);
        setContact(FALLBACK_CONTACT);
      }
    }

    loadContact();
  }, []);

  const socials = useMemo(() => {
    return (
      contact?.socials
        ?.filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order) || []
    );
  }, [contact?.socials]);

  if (!contact) return null;

  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <ContactBackground contact={contact} />

      <ResponsiveContact contact={contact} socials={socials} />
    </main>
  );
}

function ResponsiveContact({
  contact,
  socials,
}: {
  contact: ContactPageData;
  socials: ContactSocial[];
}) {
  return (
    <>
      <div className="block min-[445px]:hidden">
        <ContactLayout contact={contact} socials={socials} variant="mobile" />
      </div>

      <div className="hidden min-[445px]:block md:hidden">
        <ContactLayout contact={contact} socials={socials} variant="xsMobile" />
      </div>

      <div className="hidden md:block lg:hidden">
        <ContactLayout contact={contact} socials={socials} variant="tablet" />
      </div>

      <div className="hidden lg:block xl:hidden">
        <ContactLayout contact={contact} socials={socials} variant="desktop" />
      </div>

      <div className="hidden xl:block 2xl:hidden">
        <ContactLayout contact={contact} socials={socials} variant="xl" />
      </div>

      <div className="hidden 2xl:block">
        <ContactLayout contact={contact} socials={socials} variant="xxl" />
      </div>
    </>
  );
}

function ContactLayout({
  contact,
  socials,
  variant,
}: {
  contact: ContactPageData;
  socials: ContactSocial[];
  variant: Variant;
}) {
  const size = CONTACT_SIZE[variant];
  const isDesktop = ["desktop", "xl", "xxl"].includes(variant);

  return (
    <section
      className={`
        relative z-10 mx-auto flex min-h-[100svh] w-full
        max-w-[1720px] flex-col pb-6
        ${size.pagePt}
        ${size.pagePx}
      `}
    >
      <PageTitle title={contact.pageTitle} size={size} />

      <div
        className={`
          grid items-stretch gap-4
          ${isDesktop ? "grid-cols-[1.65fr_1fr] xl:gap-5" : "grid-cols-1"}
        `}
      >
        <MapPanel contact={contact} size={size} />

        <InfoPanel contact={contact} size={size} />
      </div>

      {socials.length > 0 && (
        <SocialLinks contact={contact} socials={socials} size={size} />
      )}
    </section>
  );
}

function PageTitle({ title, size }: { title: string; size: ContactSize }) {
  return (
    <div className="mb-4 text-center md:mb-5 xl:mb-4">
      <h1
        className="
          font-[family-name:var(--font-merienda)]
          font-bold leading-none text-[#460d07]
        "
        style={{
          fontSize: size.title,
        }}
      >
        {title}
      </h1>
    </div>
  );
}

function ContactBackground({ contact }: { contact: ContactPageData }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {contact.backgroundImage && (
        <div
          className="
            absolute inset-0 bg-cover bg-center
            opacity-35 mix-blend-multiply
          "
          style={{
            backgroundImage: `url("${contact.backgroundImage}")`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,248,230,0.88)_0%,rgba(246,239,221,0.62)_45%,rgba(225,205,165,0.28)_100%)]" />

      {contact.sketchImageOne && (
        <img
          src={contact.sketchImageOne}
          alt=""
          className="
            absolute left-[-18%] top-[8%] w-[78%]
            opacity-[0.09] mix-blend-multiply
            sm:left-[-12%] sm:w-[55%]
            md:w-[44%]
            lg:left-[2%] lg:top-[8%] lg:w-[28%]
          "
        />
      )}

      {contact.sketchImageTwo && (
        <img
          src={contact.sketchImageTwo}
          alt=""
          className="
            absolute left-[-10%] top-[55%] w-[70%]
            rotate-[10deg] opacity-[0.08] mix-blend-multiply
            sm:left-[0%] sm:w-[48%]
            md:w-[36%]
            lg:left-[10%] lg:top-[58%] lg:w-[24%]
          "
        />
      )}
    </div>
  );
}

function MapPanel({
  contact,
  size,
}: {
  contact: ContactPageData;
  size: ContactSize;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[18px]
        border border-[#9b7047]/55 bg-[#efe3cf]
        shadow-[0_18px_45px_rgba(80,55,28,0.16)]
        ${size.panelH}
      `}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url("${contact.mapImage || "/mapBg.png"}")`,
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,248,232,0.22),rgba(190,174,130,0.22))]" />

      <div className="absolute inset-[8px] rounded-[14px] border border-[#d8bf8a]/60" />

      <div
        className="
          absolute left-1/2 top-1/2 z-20
          flex -translate-x-1/2 -translate-y-1/2
          flex-col items-center text-center
        "
      >
        <div
          className="mt-4 font-serif font-black leading-tight text-[#3a1f12]"
          style={{
            fontSize: Math.max(20, size.title * 0.4),
          }}
        >
          {contact.mapTitle}

          <br />

          {contact.mapSubtitle}
        </div>
      </div>
    </div>
  );
}

function InfoPanel({
  contact,
  size,
}: {
  contact: ContactPageData;
  size: ContactSize;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[18px]
        border border-[#d8bf8a]
        bg-cover bg-center
        shadow-[0_18px_45px_rgba(80,55,28,0.16),inset_0_1px_2px_rgba(255,255,255,0.55)]
        ${size.panelH}
        ${size.cardP}
      `}
      style={{
        backgroundImage: `url("${contact.cardBgImage || "/cardDuvar.png"}")`,
      }}
    >
      <TextureLayer textureImage={contact.textureImage} />

      <CardBg />

      <div className="relative z-10">
        <p
          className="font-serif text-[#7a3b1e]"
          style={{
            fontSize: size.infoSmall,
          }}
        >
          {contact.infoSmallTitle}
        </p>

        <h2
          className="
            mt-1 font-serif font-black
            leading-none text-[#2c1a0e]
          "
          style={{
            fontSize: size.infoTitle,
          }}
        >
          {contact.infoTitle}
        </h2>

        <div className={`mt-5 ${size.infoGap}`}>
          <InfoItem
            icon={MapPin}
            title={contact.addressTitle}
            size={size}
            textureImage={contact.textureImage}
            text={
              <>
                {contact.addressText.split("\n").map((line, index, lines) => (
                  <span key={`${line}-${index}`}>
                    {line}

                    {index < lines.length - 1 && <br />}
                  </span>
                ))}

                {contact.addressLink && (
                  <a
                    href={contact.addressLink}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-2 inline-block font-bold
                      text-[#7a3b1e] underline underline-offset-4
                    "
                  >
                    {contact.addressLinkText || "Konumu Gör"}
                  </a>
                )}
              </>
            }
          />

          <InfoItem
            icon={Phone}
            title={contact.phoneTitle}
            text={contact.phoneText}
            size={size}
            textureImage={contact.textureImage}
          />

          <InfoItem
            icon={Mail}
            title={contact.emailTitle}
            text={contact.emailText}
            size={size}
            textureImage={contact.textureImage}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  title,
  text,
  size,
  textureImage,
}: {
  icon: React.ElementType;
  title: string;
  text: React.ReactNode;
  size: ContactSize;
  textureImage?: string;
}) {
  return (
    <div className="flex items-start gap-3 xl:gap-4">
      <CopperIconCircle className={size.iconClass} textureImage={textureImage}>
        <Icon
          strokeWidth={1.8}
          className="
            relative z-10
            text-black
            drop-shadow-[0_1px_0_rgba(255,220,185,0.42)]
          "
          style={{
            width: size.iconSize,
            height: size.iconSize,
          }}
        />
      </CopperIconCircle>

      <div className="pt-1">
        <h3
          className="font-black text-[#2c1a0e]"
          style={{
            fontSize: size.itemTitle,
          }}
        >
          {title}
        </h3>

        <div
          className="mt-0.5 leading-relaxed text-[#2c1a0e]"
          style={{
            fontSize: size.itemText,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function SocialLinks({
  contact,
  socials,
  size,
}: {
  contact: ContactPageData;
  socials: ContactSocial[];
  size: ContactSize;
}) {
  return (
    <div
      className={`
        mx-auto mt-5 grid w-full max-w-[1000px]
        gap-3 md:mt-6
        ${size.socialGrid}
      `}
    >
      {socials.map((item) => (
        <SocialCard
          key={item.id || item.href}
          item={item}
          contact={contact}
          size={size}
        />
      ))}
    </div>
  );
}

function SocialCard({
  item,
  contact,
  size,
}: {
  item: ContactSocial;
  contact: ContactPageData;
  size: ContactSize;
}) {
  const Icon = getSocialIcon(item.type);

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex items-center justify-center"
    >
      <div
        className={`
          relative flex w-full items-center gap-3
          rounded-full border border-[#d8bf8a]
          bg-cover bg-center py-2 pl-3 pr-5
          shadow-[0_10px_25px_rgba(80,55,28,0.14)]
          transition duration-300
          group-hover:-translate-y-1
          ${size.socialCardH}
          ${size.socialCardW}
        `}
        style={{
          backgroundImage: `url("${contact.cardBgImage || "/cardDuvar.png"}")`,
        }}
      >
        <TextureLayer textureImage={contact.textureImage} rounded />

        <CardBg rounded />

        <CopperIconCircle
          className={size.socialIconClass}
          textureImage={contact.textureImage}
        >
          <Icon
            className="
              relative z-10
              text-black
              drop-shadow-[0_1px_0_rgba(255,220,185,0.42)]
            "
            style={{
              width: size.socialIconSize,
              height: size.socialIconSize,
            }}
          />
        </CopperIconCircle>

        <div className="relative z-10 min-w-0">
          <h3
            className="font-serif leading-tight text-[#2c1a0e]"
            style={{
              fontSize: size.socialTitle,
            }}
          >
            {item.title}
          </h3>

          <p
            className="
              font-bold uppercase tracking-[0.12em]
              text-[#3d3020]/70
            "
            style={{
              fontSize: size.socialSubtitle,
            }}
          >
            {item.subtitle}
          </p>

          <span
            className="
              mt-0.5 inline-flex items-center gap-1
              font-black uppercase tracking-[0.18em]
              text-[#7a3b1e]
            "
            style={{
              fontSize: size.socialSubtitle,
            }}
          >
            İncele
            <Send size={10} />
          </span>
        </div>
      </div>
    </a>
  );
}

function getSocialIcon(type: string) {
  switch (type.toLowerCase()) {
    case "instagram":
      return Instagram;

    case "facebook":
      return Facebook;

    case "whatsapp":
      return MessageCircle;

    case "mail":
    case "email":
      return Mail;

    default:
      return Send;
  }
}

function CopperIconCircle({
  children,
  className = "",
  textureImage,
}: {
  children: React.ReactNode;
  className?: string;
  textureImage?: string;
}) {
  return (
    <div
      className={`
        relative z-10 flex shrink-0
        items-center justify-center
        overflow-visible rounded-full
        bg-[#c2815c]
        bg-cover bg-center bg-no-repeat
        text-black
        shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
        ${className}
      `}
      style={{
        backgroundImage: textureImage
          ? `url("${textureImage}")`
          : `url("/bkrr.png")`,
      }}
    >
      <div className="pointer-events-none absolute inset-[2px] rounded-full border border-white/10" />

      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function TextureLayer({
  textureImage,
  rounded = false,
}: {
  textureImage?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={`
        pointer-events-none absolute inset-0
        bg-cover bg-center
        opacity-[0.12] mix-blend-soft-light
        ${rounded ? "rounded-full" : ""}
      `}
      style={{
        backgroundImage: textureImage
          ? `url("${textureImage}")`
          : `url("/bkrr.png")`,
      }}
    />
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
