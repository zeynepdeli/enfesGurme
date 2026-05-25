"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { usePathname } from "next/navigation";
import { MapPin, LogOut, User, Search, X, Menu } from "lucide-react";
import { FaShoppingBasket } from "react-icons/fa";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Anasayfa", href: "/" },
  { label: "Ürünlerimiz", href: "/products" },
  { label: "Hikayemiz", href: "/about" },
  { label: "Kampanyalar", href: "/offers" },
  { label: "İletişim", href: "/contact" },
];

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const copperIconCircle =
  "relative flex items-center justify-center overflow-hidden rounded-full bg-[#c2815c] bg-cover bg-center bg-no-repeat shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]";

const engravedIcon =
  "relative z-10 text-black drop-shadow-[0_1px_0_rgba(255,220,185,0.42)]";

export function ShopHeader() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="w-full">
        <div
          className="
            mx-auto flex h-[72px] max-w-[1440px] items-center justify-between
            gap-2 px-3
            sm:h-[80px] sm:px-5
            md:h-[92px] md:px-7
            lg:h-[96px] lg:px-10
            xl:h-[100px] xl:px-14
          "
        >
          {/* LEFT */}
          <div className="flex min-w-0 flex-shrink-0 items-center gap-2 md:w-[250px] lg:w-[315px] xl:w-[350px]">
            <button
              className="rounded-xl p-2 text-[#975e42] transition hover:bg-[#975e42]/10 md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div
              className="
                hidden cursor-pointer items-center gap-2
                rounded-[18px]
                shadow-[inset_0_2px_4px_rgba(255,255,255,0.65),inset_0_12px_12px_rgba(120,70,35,0.22)]
                md:flex md:h-[50px] md:w-[205px] md:px-3
                lg:h-[58px] lg:w-[242px] lg:px-4
              "
            >
              <div
                className={cn(
                  copperIconCircle,
                  "h-8 w-8 shrink-0 lg:h-10 lg:w-10",
                )}
                style={{ backgroundImage: "url('/bkrr.png')" }}
              >
                <MapPin
                  className={cn(engravedIcon, "h-5 w-5 lg:h-6 lg:w-6")}
                  strokeWidth={2.4}
                />
              </div>

              <div className="flex min-w-0 flex-col leading-none">
                <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-black/60 lg:text-[11px]">
                  Teslimat Adresi
                </span>

                <span className="mt-1.5 truncate text-[13px] font-extrabold text-black lg:text-[16px]">
                  Konum Seçin
                </span>
              </div>
            </div>
          </div>

          {/* LOGO */}
          <Link
            href="/"
            className="absolute left-1/2 flex-shrink-0 -translate-x-1/2"
          >
            <Image
              src="/logo.png"
              alt="Anatolia Harvest"
              width={160}
              height={64}
              className="
                h-[46px] w-auto object-contain
                sm:h-[54px]
                md:h-[62px]
                lg:h-[68px]
                xl:h-[72px]
              "
              priority
            />
          </Link>

          {/* RIGHT */}
          <div
            className="
              flex flex-shrink-0 items-center justify-end gap-1
              md:w-[250px] md:gap-1.5
              lg:w-[315px] lg:gap-2.5
              xl:w-[350px] xl:gap-3
            "
          >
            <div
              className="
                hidden h-[40px] items-center gap-2 rounded-full
                border-[1.5px] border-[#bc7b56]
                bg-[#fff5ea]/92
                px-3
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.55),0_1px_3px_rgba(90,45,15,0.10)]
                transition-all duration-200
                focus-within:border-[#a95f38]
                md:flex md:w-[130px]
                lg:h-[42px] lg:w-[175px] lg:px-4
                xl:w-[220px]
              "
            >
              <Search
                className="h-[16px] w-[16px] flex-shrink-0 text-[#7b4a35]"
                strokeWidth={2.2}
              />

              <input
                type="text"
                placeholder="Ürün ara..."
                className="
                  min-w-0 flex-1 bg-transparent
                  text-[11px] font-medium text-black
                  outline-none placeholder:text-[#7a5a46]/55
                  lg:text-[13px]
                "
              />
            </div>

            <button
              className="rounded-xl p-2 text-[#975e42] transition hover:bg-[#975e42]/10 md:hidden"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Arama"
            >
              <Search size={21} strokeWidth={2.2} />
            </button>

            {/* USER */}
            <div
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <Link
                href={user ? "/profile" : "/login"}
                className="
                  flex flex-col items-center gap-1 rounded-xl px-1 py-1
                  transition hover:bg-[#975e42]/5
                  md:px-1.5
                "
              >
                <div
                  className={cn(
                    copperIconCircle,
                    "h-10 w-10 sm:h-11 sm:w-11 lg:h-[42px] lg:w-[42px]",
                  )}
                  style={{ backgroundImage: "url('/bkrr.png')" }}
                >
                  <User
                    className={cn(
                      engravedIcon,
                      "h-[21px] w-[21px] lg:h-[25px] lg:w-[25px]",
                    )}
                    strokeWidth={2.35}
                  />
                </div>

                <span className="hidden text-[8px] font-extrabold uppercase tracking-[0.1em] text-black md:block lg:text-[10px]">
                  {user ? "Hesabım" : "Giriş Yap"}
                </span>
              </Link>

              {user && userMenuOpen && (
                <div
                  className="
                    absolute right-0 top-full z-50 mt-1
                    w-44 overflow-hidden rounded-2xl
                    border border-[#975e42]/15
                    bg-[#f8efe3]
                  "
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-[12px] font-bold text-black transition hover:bg-[#975e42]/10"
                  >
                    <User size={14} className="text-[#975e42]" />
                    Profilim
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-3 text-[12px] font-bold text-black transition hover:bg-[#975e42]/10"
                  >
                    <span className="text-xs text-[#975e42]">📦</span>
                    Siparişlerim
                  </Link>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-[12px] font-bold text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={14} />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>

            {/* CART */}
            <Link
              href="/cart"
              className="
                flex flex-col items-center gap-1 rounded-xl px-1 py-1
                transition hover:bg-[#975e42]/5
                md:px-1.5
              "
            >
              <div
                className={cn(
                  copperIconCircle,
                  "h-10 w-10 sm:h-11 sm:w-11 lg:h-[42px] lg:w-[42px]",
                )}
                style={{ backgroundImage: "url('/bkrr.png')" }}
              >
                <FaShoppingBasket
                  className={cn(engravedIcon, "text-[21px] lg:text-[25px]")}
                />

                {itemCount > 0 && (
                  <span
                    className="
                      absolute right-[1px] top-[1px] z-20
                      flex h-[16px] w-[16px] items-center justify-center
                      rounded-full bg-[#7c3b16]
                      text-[9px] font-bold leading-none text-white
                      shadow-[0_1px_2px_rgba(0,0,0,0.22)]
                      lg:h-[18px] lg:w-[18px] lg:text-[10px]
                    "
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>

              <span className="hidden text-[8px] font-extrabold uppercase tracking-[0.1em] text-black md:block lg:text-[10px]">
                Sepetim
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {mobileSearchOpen && (
        <div className="w-full px-4 pb-3 md:hidden">
          <div
            className="
              flex h-[42px] items-center gap-2 rounded-full
              border-[1.5px] border-[#bc7b56]
              bg-[#fff5ea]/92 px-4
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.55),0_1px_3px_rgba(90,45,15,0.10)]
            "
          >
            <Search
              className="h-[17px] w-[17px] flex-shrink-0 text-[#7b4a35]"
              strokeWidth={2.2}
            />

            <input
              autoFocus
              type="text"
              placeholder="Ürün ara..."
              className="flex-1 bg-transparent text-[13px] font-medium text-black outline-none placeholder:text-[#7a5a46]/55"
            />
          </div>
        </div>
      )}

      {/* DESKTOP NAV */}
      <div className="hidden w-full md:block">
        <div className="mx-auto max-w-[1440px] px-8 lg:px-12 xl:px-14">
          <nav
            className="
              flex h-9 items-center justify-center
              gap-[clamp(18px,3vw,52px)]
              lg:h-10
            "
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  group relative text-[10px] font-extrabold uppercase
                  tracking-[0.11em] text-black transition-colors hover:text-[#975e42]
                  lg:text-[12px] lg:tracking-[0.13em]
                "
              >
                {link.label}

                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[1.5px] bg-[#975e42] transition-all duration-300",
                    pathname === link.href
                      ? "w-full"
                      : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="w-full bg-[#f8efe3]/98 md:hidden">
          <nav className="flex flex-col divide-y divide-[#975e42]/10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] transition-colors",
                  pathname === link.href
                    ? "bg-[#975e42]/10 text-[#975e42]"
                    : "text-black hover:bg-[#975e42]/5 hover:text-[#975e42]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
