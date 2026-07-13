"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, LogOut, User, Search, X, Menu } from "lucide-react";
import { FaShoppingBasket } from "react-icons/fa";

import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

type HeaderNavLink = {
  id: number;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
};

type SiteHeader = {
  logoUrl: string;
  logoAlt: string;
  deliveryTitle: string;
  deliveryText: string;
  searchPlaceholder: string;
  accountText: string;
  loginText: string;
  cartText: string;
  isActive?: boolean;
  navLinks: HeaderNavLink[];
};

const DEFAULT_HEADER: SiteHeader = {
  logoUrl: "/logo.png",
  logoAlt: "Enfes Gurme",
  deliveryTitle: "Teslimat Adresi",
  deliveryText: "Konum Seçin",
  searchPlaceholder: "Ürün ara...",
  accountText: "Hesabım",
  loginText: "Giriş Yap",
  cartText: "Sepetim",
  isActive: true,
  navLinks: [],
};

const TEXTURE_BG = "/cardDuvar.png";
const COPPER_BG = "/bkrr.png";

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const headerStyles = {
  shell: `
    mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-2 px-3
    sm:h-[80px] sm:px-5
    md:h-[92px] md:px-7
    lg:h-[96px] lg:px-10
    xl:h-[100px] xl:px-14
  `,

  copperCircle: `
    relative flex items-center justify-center overflow-visible rounded-full
    bg-[#c2815c] bg-cover bg-center bg-no-repeat
    shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
  `,

  icon: `
    relative z-10 text-black drop-shadow-[0_1px_0_rgba(255,220,185,0.42)]
  `,

  iconButton: `
    rounded-xl p-2 text-[#975e42] transition hover:bg-[#975e42]/10 md:hidden
  `,

  navLink: `
    group relative font-[family-name:var(--font-inter)]
    text-[11px] font-bold uppercase tracking-[0.13em] text-black
    transition-colors hover:text-[#975e42]
    lg:text-[12px]
    xl:text-[13px]
  `,

  texturePanel: `
    bg-[#f8efe3] bg-cover bg-center bg-no-repeat
    shadow-[0_10px_30px_rgba(90,45,15,0.16),inset_0_1px_0_rgba(255,255,255,0.45)]
  `,
};

export function ShopHeader() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();

  const [headerData, setHeaderData] = useState<SiteHeader>(DEFAULT_HEADER);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    async function loadHeader() {
      try {
        const res = await api.get<SiteHeader>("/api/site-header");

        setHeaderData({
          ...DEFAULT_HEADER,
          ...res.data,
          navLinks: res.data?.navLinks || [],
        });
      } catch (error) {
        console.error("Header fetch error:", error);
      }
    }

    loadHeader();
  }, []);

  const navLinks = useMemo(() => {
    return (headerData.navLinks || [])
      .filter((link) => link.isActive)
      .sort((a, b) => a.order - b.order);
  }, [headerData.navLinks]);

  if (headerData.isActive === false) return null;

  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="w-full">
        <div className={headerStyles.shell}>
          <HeaderLeft
            headerData={headerData}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMenu={() => setMobileMenuOpen((v) => !v)}
          />

          <HeaderLogo headerData={headerData} />

          <HeaderActions
            user={user}
            logout={logout}
            itemCount={itemCount}
            headerData={headerData}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            onToggleSearch={() => setMobileSearchOpen((v) => !v)}
          />
        </div>
      </div>

      {mobileSearchOpen && <MobileSearch headerData={headerData} />}

      {navLinks.length > 0 && (
        <DesktopNav navLinks={navLinks} pathname={pathname} />
      )}

      {mobileMenuOpen && navLinks.length > 0 && (
        <MobileNav
          navLinks={navLinks}
          pathname={pathname}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}

      <style>{`
        @keyframes mobileMenuIn {
          0% {
            opacity: 0;
            transform: translateY(-8px) scaleY(0.94);
            filter: blur(6px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
            filter: blur(0);
          }
        }
      `}</style>
    </header>
  );
}

function HeaderLeft({
  headerData,
  mobileMenuOpen,
  onToggleMenu,
}: {
  headerData: SiteHeader;
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-shrink-0 items-center gap-2 md:w-[250px] lg:w-[315px] xl:w-[350px]">
      <button
        className={headerStyles.iconButton}
        onClick={onToggleMenu}
        aria-label="Menüyü aç"
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div
        className="
          hidden cursor-pointer items-center gap-2 rounded-[18px]
          bg-cover bg-center bg-no-repeat
          shadow-[inset_0_2px_4px_rgba(255,255,255,0.65),inset_0_12px_12px_rgba(120,70,35,0.22)]
          md:flex md:h-[50px] md:w-[205px] md:px-3
          lg:h-[58px] lg:w-[242px] lg:px-4
        "
        style={{ backgroundImage: `url('${TEXTURE_BG}')` }}
      >
        <CopperIcon className="h-8 w-8 lg:h-10 lg:w-10">
          <MapPin className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.4} />
        </CopperIcon>

        <div className="flex min-w-0 flex-col leading-none">
          <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-black/60 lg:text-[11px]">
            {headerData.deliveryTitle}
          </span>

          <span className="mt-1.5 truncate text-[13px] font-extrabold text-black lg:text-[16px]">
            {headerData.deliveryText}
          </span>
        </div>
      </div>
    </div>
  );
}

function HeaderLogo({ headerData }: { headerData: SiteHeader }) {
  return (
    <Link href="/" className="absolute left-1/2 flex-shrink-0 -translate-x-1/2">
      <Image
        src={headerData.logoUrl || "/logo.png"}
        alt={headerData.logoAlt || "Logo"}
        width={160}
        height={64}
        className="h-[46px] w-auto object-contain sm:h-[54px] md:h-[62px] lg:h-[68px] xl:h-[72px]"
        priority
      />
    </Link>
  );
}

function HeaderActions({
  user,
  logout,
  itemCount,
  headerData,
  userMenuOpen,
  setUserMenuOpen,
  onToggleSearch,
}: {
  user: any;
  logout: () => void;
  itemCount: number;
  headerData: SiteHeader;
  userMenuOpen: boolean;
  setUserMenuOpen: (value: boolean) => void;
  onToggleSearch: () => void;
}) {
  return (
    <div className="flex flex-shrink-0 items-center justify-end -gap-1 md:w-[250px] lg:w-[315px]  xl:w-[350px] ">
      <DesktopSearch headerData={headerData} />

      <button
        className={headerStyles.iconButton}
        onClick={onToggleSearch}
        aria-label="Arama"
      >
        <Search size={21} strokeWidth={2.2} />
      </button>

      <div
        className="relative"
        onMouseEnter={() => setUserMenuOpen(true)}
        onMouseLeave={() => setUserMenuOpen(false)}
      >
        <Link
          href={user ? "/profile" : "/login"}
          className="flex flex-col items-center gap-1 rounded-xl px-1 py-1 transition hover:bg-[#975e42]/5 md:px-1.5"
        >
          <CopperIcon className="h-10 w-10 sm:h-11 sm:w-11 lg:h-[42px] lg:w-[42px]">
            <User
              className="h-[21px] w-[21px] lg:h-[25px] lg:w-[25px]"
              strokeWidth={2.35}
            />
          </CopperIcon>

          <span className="hidden whitespace-nowrap text-[8px] font-extrabold uppercase tracking-[0.08em] text-black md:block lg:text-[10px]">
            {user ? headerData.accountText : headerData.loginText}
          </span>
        </Link>

        {user && userMenuOpen && <UserDropdown logout={logout} />}
      </div>

      <CartButton itemCount={itemCount} cartText={headerData.cartText} />
    </div>
  );
}

function CopperIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(headerStyles.copperCircle, className)}
      style={{ backgroundImage: `url('${COPPER_BG}')` }}
    >
      <div className={headerStyles.icon}>{children}</div>
    </div>
  );
}

function DesktopSearch({ headerData }: { headerData: SiteHeader }) {
  return (
    <div
      className="
        hidden h-[40px] items-center gap-2 rounded-full
        border-[1.5px] border-[#bc7b56]
        bg-[#fff5ea]/92 px-3
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.55),0_1px_3px_rgba(90,45,15,0.10)]
        transition-all duration-200 focus-within:border-[#a95f38]
        md:flex md:w-[130px]
        lg:h-[42px] lg:w-[175px] lg:px-4
        xl:w-[220px]
      "
    >
      <Search
        className="h-4 w-4 flex-shrink-0 text-[#7b4a35]"
        strokeWidth={2.2}
      />

      <input
        type="text"
        placeholder={headerData.searchPlaceholder}
        className="min-w-0 flex-1 bg-transparent text-[11px] font-medium text-black outline-none placeholder:text-[#7a5a46]/55 lg:text-[13px]"
      />
    </div>
  );
}

function MobileSearch({ headerData }: { headerData: SiteHeader }) {
  return (
    <div className="w-full px-4 pb-3 md:hidden">
      <div
        className={cn(
          headerStyles.texturePanel,
          "flex h-[44px] items-center gap-2 rounded-full border-[1.5px] border-[#bc7b56] px-4",
        )}
        style={{ backgroundImage: `url('${TEXTURE_BG}')` }}
      >
        <Search
          className="h-[17px] w-[17px] flex-shrink-0 text-[#7b4a35]"
          strokeWidth={2.2}
        />

        <input
          autoFocus
          type="text"
          placeholder={headerData.searchPlaceholder}
          className="flex-1 bg-transparent text-[13px] font-medium text-black outline-none placeholder:text-[#7a5a46]/55"
        />
      </div>
    </div>
  );
}

function UserDropdown({ logout }: { logout: () => void }) {
  return (
    <div
      className={cn(
        headerStyles.texturePanel,
        "absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-2xl border border-[#975e42]/15",
      )}
      style={{ backgroundImage: `url('${TEXTURE_BG}')` }}
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
        className="flex w-full items-center gap-2 px-4 py-3 text-[12px] font-bold text-rose-600 transition hover:bg-rose-50/70"
      >
        <LogOut size={14} />
        Çıkış Yap
      </button>
    </div>
  );
}

function CartButton({
  itemCount,
  cartText,
}: {
  itemCount: number;
  cartText: string;
}) {
  return (
    <Link
      href="/cart"
      className="flex flex-col items-center gap-1 rounded-xl px-1 py-1 transition hover:bg-[#975e42]/5 md:px-1.5"
    >
      <CopperIcon className="h-10 w-10 sm:h-11 sm:w-11 lg:h-[42px] lg:w-[42px]">
        <FaShoppingBasket className="text-[21px] lg:text-[25px]" />

        {itemCount > 0 && (
          <span className="absolute -right-1 -top-2 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-[#7c3b16] text-[9px] font-bold leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.22)] lg:-right-1.5 lg:-top-2.5 lg:h-[18px] lg:w-[18px] lg:text-[10px]">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </CopperIcon>

      <span className="hidden whitespace-nowrap text-[8px] font-extrabold uppercase tracking-[0.08em] text-black md:block lg:text-[10px]">
        {cartText}
      </span>
    </Link>
  );
}

function DesktopNav({
  navLinks,
  pathname,
}: {
  navLinks: HeaderNavLink[];
  pathname: string;
}) {
  return (
    <div className="hidden w-full md:block">
      <div className="mx-auto max-w-[1440px] px-8 lg:px-12 xl:px-14">
        <nav className="flex h-9 items-center justify-center gap-6 lg:h-10 lg:gap-9 xl:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={headerStyles.navLink}
            >
              {link.label}

              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-[1.5px] bg-[#975e42] transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function MobileNav({
  navLinks,
  pathname,
  onClose,
}: {
  navLinks: HeaderNavLink[];
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="px-4 md:hidden">
      <div
        className={cn(
          headerStyles.texturePanel,
          "origin-top overflow-hidden rounded-2xl border border-[#975e42]/15 animate-[mobileMenuIn_260ms_ease-out_both]",
        )}
        style={{ backgroundImage: `url('${TEXTURE_BG}')` }}
      >
        <nav className="flex flex-col divide-y divide-[#975e42]/10">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={onClose}
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
    </div>
  );
}
