"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { usePathname } from "next/navigation";

export function ShopHeader() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <header
      className={`absolute left-0 w-full z-50 ${isHome ? "top-16" : "top-2"}`}
    >
      <div className="max-w-7xl mx-auto px-8 py-5 grid grid-cols-3 items-center">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Antep Peynirim"
              width={140}
              height={60}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center gap-8">
          {[
            { href: "/", label: "Ana Sayfa" },
            { href: "/products", label: "Ürünler" },
            { href: "/about", label: "Hakkımızda" },

            { href: "/contact", label: "İletişim" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-amber-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex justify-end items-center gap-3">
          {/* Cart */}
          <div className="relative">
            <Link href="/cart">
              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-200">
                <ShoppingCart className="h-4 w-4 text-white/80" />
              </button>
            </Link>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-amber-950">
                {itemCount}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/20" />

          {/* User */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-200 text-sm text-white/80 hover:text-white">
                  <User className="h-3.5 w-3.5" />
                  <span className="font-medium">{user.name}</span>
                </button>
              </Link>

              <button
                onClick={logout}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-rose-500/40 hover:border-rose-500/70 hover:bg-rose-500/10 transition-all duration-200 group"
                title="Çıkış Yap"
              >
                <LogOut className="h-4 w-4 text-rose-400 group-hover:text-rose-300" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                Giriş Yap
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
