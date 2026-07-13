"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
  X,
  Loader2,
  Menu,
} from "lucide-react";

type HeaderNavLink = {
  id?: number;
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
  isActive: boolean;
  navLinks: HeaderNavLink[];
};

const emptyHeader: SiteHeader = {
  logoUrl: "/logo.png",
  logoAlt: "Anatolia Harvest",
  deliveryTitle: "Teslimat Adresi",
  deliveryText: "Konum Seçin",
  searchPlaceholder: "Ürün ara...",
  accountText: "Hesabım",
  loginText: "Giriş Yap",
  cartText: "Sepetim",
  isActive: true,
  navLinks: [],
};

const emptyLink: HeaderNavLink = {
  label: "",
  href: "",
  order: 0,
  isActive: true,
};

export default function SiteHeaderAdminPage() {
  const [header, setHeader] = useState<SiteHeader>(emptyHeader);
  const [linkForm, setLinkForm] = useState<HeaderNavLink>(emptyLink);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savingLink, setSavingLink] = useState(false);

  const loadHeader = async () => {
    try {
      setLoading(true);
      const res = await api.get<SiteHeader>("/api/site-header/admin");
      setHeader(res.data || emptyHeader);
    } catch (error) {
      console.error("Header load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeader();
  }, []);

  const handleHeaderSave = async () => {
    try {
      setSavingHeader(true);

      await api.put("/api/site-header/admin", {
        logoUrl: header.logoUrl,
        logoAlt: header.logoAlt,
        deliveryTitle: header.deliveryTitle,
        deliveryText: header.deliveryText,
        searchPlaceholder: header.searchPlaceholder,
        accountText: header.accountText,
        loginText: header.loginText,
        cartText: header.cartText,
        isActive: header.isActive,
      });

      await loadHeader();
    } catch (error) {
      console.error("Header save error:", error);
    } finally {
      setSavingHeader(false);
    }
  };

  const handleLinkSave = async () => {
    if (!linkForm.label || !linkForm.href) return;

    try {
      setSavingLink(true);

      if (editingLinkId) {
        await api.put(
          `/api/site-header/admin/nav-links/${editingLinkId}`,
          linkForm,
        );
      } else {
        await api.post("/api/site-header/admin/nav-links", linkForm);
      }

      setLinkForm(emptyLink);
      setEditingLinkId(null);
      await loadHeader();
    } catch (error) {
      console.error("Nav link save error:", error);
    } finally {
      setSavingLink(false);
    }
  };

  const handleEditLink = (link: HeaderNavLink) => {
    setLinkForm({
      label: link.label,
      href: link.href,
      order: link.order,
      isActive: link.isActive,
    });

    setEditingLinkId(link.id || null);
  };

  const handleDeleteLink = async (id?: number) => {
    if (!id) return;
    if (!confirm("Menü linki silinsin mi?")) return;

    await api.delete(`/api/site-header/admin/nav-links/${id}`);
    await loadHeader();
  };

  const handleCancelLink = () => {
    setLinkForm(emptyLink);
    setEditingLinkId(null);
  };

  const inputClassName =
    "h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

  const labelClassName =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7a3b1e]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
          Yönetim Paneli
        </span>

        <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e]">
          Header Yönetimi
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Logo, arama alanı, teslimat metni, hesap/sepet yazıları ve menü
          linklerini buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
          Genel Header Ayarları
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName}>Logo URL</label>
            <input
              className={inputClassName}
              value={header.logoUrl}
              onChange={(e) =>
                setHeader((h) => ({ ...h, logoUrl: e.target.value }))
              }
              placeholder="/logo.png"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Logo Alt Metni</label>
            <input
              className={inputClassName}
              value={header.logoAlt}
              onChange={(e) =>
                setHeader((h) => ({ ...h, logoAlt: e.target.value }))
              }
              placeholder="Anatolia Harvest"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Teslimat Başlığı</label>
            <input
              className={inputClassName}
              value={header.deliveryTitle}
              onChange={(e) =>
                setHeader((h) => ({ ...h, deliveryTitle: e.target.value }))
              }
              placeholder="Teslimat Adresi"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Teslimat Metni</label>
            <input
              className={inputClassName}
              value={header.deliveryText}
              onChange={(e) =>
                setHeader((h) => ({ ...h, deliveryText: e.target.value }))
              }
              placeholder="Konum Seçin"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Arama Placeholder</label>
            <input
              className={inputClassName}
              value={header.searchPlaceholder}
              onChange={(e) =>
                setHeader((h) => ({
                  ...h,
                  searchPlaceholder: e.target.value,
                }))
              }
              placeholder="Ürün ara..."
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Hesabım Yazısı</label>
            <input
              className={inputClassName}
              value={header.accountText}
              onChange={(e) =>
                setHeader((h) => ({ ...h, accountText: e.target.value }))
              }
              placeholder="Hesabım"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Giriş Yazısı</label>
            <input
              className={inputClassName}
              value={header.loginText}
              onChange={(e) =>
                setHeader((h) => ({ ...h, loginText: e.target.value }))
              }
              placeholder="Giriş Yap"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Sepet Yazısı</label>
            <input
              className={inputClassName}
              value={header.cartText}
              onChange={(e) =>
                setHeader((h) => ({ ...h, cartText: e.target.value }))
              }
              placeholder="Sepetim"
            />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center justify-between rounded-[16px] border border-[#d0bc90] bg-[#efe3cf]/60 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-[#2c1a0e]">Header aktif</p>
            <p className="mt-1 text-xs text-[#5e4734]/60">
              Pasif yapılırsa shop tarafında header gösterilmeyebilir.
            </p>
          </div>

          <input
            type="checkbox"
            checked={header.isActive}
            onChange={(e) =>
              setHeader((h) => ({ ...h, isActive: e.target.checked }))
            }
            className="h-5 w-5 accent-[#7a3b1e]"
          />
        </label>

        <button
          onClick={handleHeaderSave}
          disabled={savingHeader}
          className="mt-6 rounded-full bg-[#524528] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
        >
          {savingHeader ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Kaydediliyor
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Header Kaydet
            </span>
          )}
        </button>
      </div>

      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c2815c] text-[#2c1a0e]">
            <Menu size={20} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c3d]">
              Menü Linkleri
            </span>
            <h2 className="font-serif text-2xl font-black italic text-[#2c1a0e]">
              {editingLinkId ? "Menü Linki Düzenle" : "Yeni Menü Linki"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_120px_120px]">
          <div className="space-y-2">
            <label className={labelClassName}>Başlık</label>
            <input
              className={inputClassName}
              value={linkForm.label}
              onChange={(e) =>
                setLinkForm((f) => ({ ...f, label: e.target.value }))
              }
              placeholder="Ürünlerimiz"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Link</label>
            <input
              className={inputClassName}
              value={linkForm.href}
              onChange={(e) =>
                setLinkForm((f) => ({ ...f, href: e.target.value }))
              }
              placeholder="/products"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Sıra</label>
            <input
              type="number"
              className={inputClassName}
              value={linkForm.order}
              onChange={(e) =>
                setLinkForm((f) => ({
                  ...f,
                  order: Number(e.target.value),
                }))
              }
            />
          </div>

          <label className="flex items-end gap-2 pb-3 text-sm font-bold text-[#2c1a0e]">
            <input
              type="checkbox"
              checked={linkForm.isActive}
              onChange={(e) =>
                setLinkForm((f) => ({
                  ...f,
                  isActive: e.target.checked,
                }))
              }
              className="h-5 w-5 accent-[#7a3b1e]"
            />
            Aktif
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleLinkSave}
            disabled={savingLink || !linkForm.label || !linkForm.href}
            className="rounded-full bg-[#524528] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
          >
            {savingLink ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Kaydediliyor
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {editingLinkId ? "Güncelle" : "Link Ekle"}
              </span>
            )}
          </button>

          {editingLinkId && (
            <button
              onClick={handleCancelLink}
              className="rounded-full border border-[#bc7b56] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#6b3f18]"
            >
              <span className="flex items-center gap-2">
                <X className="h-4 w-4" />
                İptal
              </span>
            </button>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {header.navLinks.length === 0 && (
            <div className="rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-8 text-center text-sm text-[#5e4734]/70">
              Henüz menü linki eklenmemiş.
            </div>
          )}

          {header.navLinks.map((link) => (
            <div
              key={link.id}
              className="flex flex-col gap-4 rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-4 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                  {link.label}
                </h3>

                <p className="mt-1 text-sm text-[#5e4734]/70">{link.href}</p>

                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-[#efe3cf] px-3 py-1 text-xs font-bold text-[#7a3b1e]">
                    Sıra: {link.order}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      link.isActive
                        ? "bg-[#dcebd4] text-[#476f3c]"
                        : "bg-[#f4dfdc] text-[#8f2f2f]"
                    }`}
                  >
                    {link.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEditLink(link)}
                  className="flex items-center gap-2 rounded-full border border-[#3d77c4]/30 bg-[#edf4ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#315f9a]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </button>

                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
