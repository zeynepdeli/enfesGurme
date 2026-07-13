"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
} from "lucide-react";
import { api } from "@/lib/api";

type FooterNavLink = {
  id: number;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
};

type FooterContactItem = {
  id: number;
  type: string;
  text: string;
  order: number;
  isActive: boolean;
};

type FooterSocial = {
  id: number;
  type: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
};

type FooterBottomLink = {
  id: number;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
};

type SiteFooter = {
  backgroundImage: string;
  overlayColor: string;

  brandTitle: string;
  brandHighlight: string;
  brandDescription: string;

  corporateTitle: string;
  contactTitle: string;
  newsletterTitle: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;

  cardBgImage: string;
  textureImage: string;

  copyrightText: string;

  navLinks: FooterNavLink[];
  contactItems: FooterContactItem[];
  socials: FooterSocial[];
  bottomLinks: FooterBottomLink[];
};

const getSocialIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "facebook":
      return FacebookIcon;
    case "instagram":
      return InstagramIcon;
    case "twitter":
    case "x":
      return TwitterIcon;
    default:
      return InstagramIcon;
  }
};

const getContactIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "phone":
    case "telefon":
      return Phone;
    case "mail":
    case "email":
    case "e-posta":
      return Mail;
    case "address":
    case "adres":
      return MapPin;
    default:
      return Phone;
  }
};

export function ShopFooter() {
  const [footer, setFooter] = useState<SiteFooter | null>(null);

  useEffect(() => {
    async function loadFooter() {
      try {
        const res = await api.get<SiteFooter>("/api/site-footer");
        setFooter(res.data || null);
      } catch (error) {
        console.error("Footer fetch error:", error);
      }
    }

    loadFooter();
  }, []);

  if (!footer) return null;

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* BG IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: footer.backgroundImage
            ? `url('${footer.backgroundImage}')`
            : "none",
        }}
      />

      {/* Ana bej katman */}
      <div className="absolute inset-0 bg-[#f3ead7]/55" />

      {/* Reviews ile aynı sıcak ışık */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(246,239,221,0)_0%,rgba(243,234,215,0.45)_40%,rgba(230,218,190,0.25)_70%,rgba(210,195,160,0.12)_100%)]" />

      {/* Üstten yumuşak geçiş */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#e5d6bc] via-[#f6efdd]/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-14">
        {/* GRID */}
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
          {/* BRAND */}
          <div>
            <h3 className="mb-2 text-2xl font-[family-name:var(--font-merienda)] font-bold   text-[#460e07]">
              {footer.brandTitle}{" "}
              {footer.brandHighlight && (
                <span className="text-[#975e42]">{footer.brandHighlight}</span>
              )}
            </h3>

            <div className="mb-4 h-px w-12 bg-[#975e42]/60" />

            <p className="max-w-[240px] text-sm leading-relaxed text-black/70">
              {footer.brandDescription}
            </p>

            {/* SOCIAL */}
            {footer.socials?.length > 0 && (
              <div className="mt-6 flex gap-2">
                {footer.socials.map((social) => {
                  const Icon = getSocialIcon(social.type);

                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="
                        flex h-9 w-9 items-center justify-center
                        overflow-hidden rounded-full
                        bg-[#c2815c] bg-cover bg-center bg-no-repeat
                        text-black
                        shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
                        transition hover:scale-105
                      "
                      style={{
                        backgroundImage: footer.textureImage
                          ? `url('${footer.textureImage}')`
                          : "none",
                      }}
                    >
                      <Icon className="h-4 w-4 drop-shadow-[0_1px_0_rgba(255,220,185,0.42)]" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* LINKS */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1f1f]">
              {footer.corporateTitle}
            </h4>

            {footer.navLinks?.length > 0 && (
              <ul className="space-y-3">
                {footer.navLinks.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#1f1f1f] transition hover:text-[#975e42]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1f1f]">
              {footer.contactTitle}
            </h4>

            {footer.contactItems?.length > 0 && (
              <ul className="space-y-3">
                {footer.contactItems.map((item) => {
                  const Icon = getContactIcon(item.type);

                  return (
                    <li
                      key={item.id}
                      className="flex gap-3 text-sm text-[#1f1f1f]"
                    >
                      <Icon className="mt-0.5 h-4 w-4 text-[#975e42]" />
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1f1f]">
              {footer.newsletterTitle}
            </h4>

            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={footer.newsletterPlaceholder}
                className="
                  w-full rounded-md border border-[#975e42]/40
                  bg-transparent px-3 py-2 text-sm text-[#1f1f1f]
                  outline-none placeholder:text-black/40
                  focus:border-[#975e42]
                "
              />

              <button
                type="button"
                className="
                  group relative inline-flex h-[48px] w-full items-center justify-center
                  overflow-hidden rounded-[8px]
                  border border-[#d8bf8a]
                  bg-cover bg-center
                  px-6
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  transition-all duration-300
                  hover:-translate-y-[1px]
                  hover:brightness-105
                "
                style={{
                  backgroundImage: footer.cardBgImage
                    ? `url('${footer.cardBgImage}')`
                    : "none",
                  boxShadow:
                    "0 10px 18px rgba(120,92,58,0.16),0 3px 0 rgba(190,166,118,0.35),inset 0 1px 2px rgba(255,255,255,0.65),inset 0 -3px 8px rgba(160,126,78,0.12)",
                }}
              >
                {/* LIGHT OVERLAY */}
                <div
                  className="
                    pointer-events-none absolute inset-0 z-[1]
                    bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]
                  "
                />

                {/* TOP LIGHT */}
                <div
                  className="
                    pointer-events-none absolute inset-0 z-[2]
                    bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.22)_0%,transparent_45%)]
                  "
                />

                {/* INNER BORDER */}
                <div
                  className="
                    pointer-events-none absolute inset-[4px] z-[3]
                    rounded-[4px]
                    border border-[#e0c896]/60
                  "
                />

                <span
                  className="
                    relative z-10
                    flex w-full items-center justify-center
                    text-center
                    font-bold
                    text-[#460e07]
                  "
                >
                  {footer.newsletterButtonText}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mb-6 flex items-center gap-4 opacity-50">
          <div className="h-px flex-1 bg-[#975e42]/40" />

          <div className="flex gap-1">
            <div className="h-1 w-1 rounded-full bg-[#975e42]" />
            <div className="h-1 w-1 rounded-full bg-[#975e42]" />
            <div className="h-1 w-1 rounded-full bg-[#975e42]" />
          </div>

          <div className="h-px flex-1 bg-[#975e42]/40" />
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col items-center justify-between gap-3 text-[11px] text-black/60 sm:flex-row">
          <p>{footer.copyrightText}</p>

          {footer.bottomLinks?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {footer.bottomLinks.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="hover:text-[#975e42]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
