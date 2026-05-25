"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/products", label: "Ürünler" },
  { href: "/categories", label: "Kategoriler" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
];

const CONTACT = [
  { icon: Phone, text: "+90 555 123 45 67" },
  { icon: Mail, text: "info@enfesgurme.com" },
  { icon: MapPin, text: "Gaziantep, Türkiye" },
];

const SOCIALS = [
  { href: "https://facebook.com", Icon: FacebookIcon, label: "Facebook" },
  { href: "https://instagram.com", Icon: InstagramIcon, label: "Instagram" },
  { href: "https://twitter.com", Icon: TwitterIcon, label: "Twitter/X" },
];

export function ShopFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* BG IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/footer1.png')" }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[rgba(246,239,221,0.75)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-14">
        {/* GRID */}
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
          {/* BRAND */}
          <div>
            <h3 className="mb-2 text-2xl font-bold text-[#1f1f1f]">
              Enfes <span className="text-[#975e42]">Gurme</span>
            </h3>

            <div className="mb-4 h-px w-12 bg-[#975e42]/60" />

            <p className="max-w-[240px] text-sm leading-relaxed text-black/70">
              Gaziantep&apos;in binlerce yıllık mutfak mirasından ilham alarak,
              en seçkin lezzetleri modern sofralara taşıyoruz.
            </p>

            {/* SOCIAL */}
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    flex h-9 w-9 items-center justify-center
                    overflow-hidden rounded-full
                    bg-[#c2815c] bg-cover bg-center bg-no-repeat
                    text-black
                    shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
                    transition hover:scale-105
                  "
                  style={{
                    backgroundImage: "url('/bkrr.png')",
                  }}
                >
                  <Icon className="h-4 w-4 drop-shadow-[0_1px_0_rgba(255,220,185,0.42)]" />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1f1f]">
              Kurumsal
            </h4>

            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#1f1f1f] transition hover:text-[#975e42]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1f1f]">
              İletişim
            </h4>

            <ul className="space-y-3">
              {CONTACT.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm text-[#1f1f1f]">
                  <Icon className="mt-0.5 h-4 w-4 text-[#975e42]" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f1f1f]">
              Bülten Aboneliği
            </h4>

            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="E-posta adresin"
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
                  backgroundImage: "url('/cardDuvar.png')",
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
                  Abone Ol
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
          <p>© 2025 Enfes Gurme. Tüm hakları saklıdır.</p>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#975e42]">
              Gizlilik Politikası
            </Link>

            <Link href="/terms" className="hover:text-[#975e42]">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
