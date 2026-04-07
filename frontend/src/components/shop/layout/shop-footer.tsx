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
  { icon: Mail, text: "info@zeugmagusto.com" },
  { icon: MapPin, text: "Gaziantep, Türkiye" },
];

const SOCIALS = [
  { href: "https://facebook.com", Icon: FacebookIcon, label: "Facebook" },
  { href: "https://instagram.com", Icon: InstagramIcon, label: "Instagram" },
  { href: "https://twitter.com", Icon: TwitterIcon, label: "Twitter/X" },
];

export function ShopFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#c8a44a]/40 to-transparent pointer-events-none" />

      {/* Faint mosaic pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 39px, rgba(255,255,255,0.8) 39px, rgba(255,255,255,0.8) 40px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 39px, rgba(255,255,255,0.8) 39px, rgba(255,255,255,0.8) 40px
          )`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-8">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <h3
                className="text-2xl font-bold text-[#f0ead8] leading-none mb-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Zeugma
                <span className="text-[#c8a44a]"> Gusto</span>
              </h3>
              <div className="h-px w-12 bg-[#c8a44a]/50 mt-2" />
            </div>
            <p className="text-[#7da882] text-sm leading-relaxed max-w-[220px]">
              Gaziantep'in binlerce yıllık mutfak mirasından ilham alarak, en
              seçkin lezzetleri modern sofralara taşıyoruz.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mt-6">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-[#7da882] hover:border-[#c8a44a] hover:text-[#c8a44a] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8a44a] mb-5">
              Keşfet
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[#7da882] text-sm hover:text-[#f0ead8] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-[#c8a44a]/0 group-hover:bg-[#c8a44a]/60 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8a44a] mb-5">
              İletişim
            </h4>
            <ul className="space-y-3">
              {CONTACT.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 text-sm text-[#7da882]"
                >
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4a6e50]" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8a44a] mb-5">
              Bülten
            </h4>
            <p className="text-[#7da882] text-sm mb-4 leading-relaxed">
              Yeni ürünler ve kampanyalardan haberdar ol.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="E-posta adresin"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#dce8dd] placeholder:text-[#4a6e50] outline-none focus:border-[#c8a44a]/50 transition-colors"
              />
              <button className="w-full bg-[#2b5530] hover:bg-[#3d7544] border border-white/10 hover:border-[#5fa866] rounded-lg px-3 py-2.5 text-sm text-[#dce8dd] font-medium transition-all duration-200">
                Abone Ol
              </button>
            </div>
          </div>
        </div>

        {/* ── Divider with ornament ── */}
        <div className="flex items-center gap-4 mb-6 opacity-40">
          <div className="flex-1 h-px bg-white/15" />
          <div className="flex gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#c8a44a]" />
            <div className="w-1 h-1 rounded-full bg-[#c8a44a]" />
            <div className="w-1 h-1 rounded-full bg-[#c8a44a]" />
          </div>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#4a6e50]">
          <p>© 2025 Zeugma Gusto. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-[#7da882] transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#7da882] transition-colors"
            >
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
