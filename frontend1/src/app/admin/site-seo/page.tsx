"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CheckCircle2, Loader2, SearchCode } from "lucide-react";

type SiteSeo = {
  title: string;
  description: string;
  keywords: string;
  siteName: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDesc?: string;
  twitterImage?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

const emptySeo: SiteSeo = {
  title: "",
  description: "",
  keywords: "",
  siteName: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterTitle: "",
  twitterDesc: "",
  twitterImage: "",
  robotsIndex: true,
  robotsFollow: true,
};

export default function SiteSeoAdminPage() {
  const [seo, setSeo] = useState<SiteSeo>(emptySeo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSeo = async () => {
    try {
      setLoading(true);
      const res = await api.get<SiteSeo>("/api/site-seo/admin");
      setSeo(res.data || emptySeo);
    } catch (error) {
      console.error("SEO load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/api/site-seo/admin", seo);
      await loadSeo();
    } catch (error) {
      console.error("SEO save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const inputClassName =
    "h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

  const textareaClassName =
    "w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 py-3 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

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
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c2815c] text-[#2c1a0e]">
            <SearchCode size={22} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
              Yönetim Paneli
            </span>

            <h1 className="mt-1 font-serif text-4xl font-black italic text-[#2c1a0e]">
              SEO Yönetimi
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Site title, description, keyword, OpenGraph ve Twitter SEO alanlarını
          buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
          Genel SEO
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className={labelClassName}>Site Title</label>
            <input
              className={inputClassName}
              value={seo.title}
              onChange={(e) => setSeo((s) => ({ ...s, title: e.target.value }))}
              placeholder="Enfes Gurme - Geleneksel Lezzetler"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              rows={4}
              className={textareaClassName}
              value={seo.description}
              onChange={(e) =>
                setSeo((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="Gaziantep’in geleneksel gurme lezzetleri"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Keywords</label>
            <input
              className={inputClassName}
              value={seo.keywords}
              onChange={(e) =>
                setSeo((s) => ({ ...s, keywords: e.target.value }))
              }
              placeholder="antep, gurme, fıstık, yöresel ürünler"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Site Name</label>
            <input
              className={inputClassName}
              value={seo.siteName}
              onChange={(e) =>
                setSeo((s) => ({ ...s, siteName: e.target.value }))
              }
              placeholder="Enfes Gurme"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
          OpenGraph Ayarları
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName}>OG Title</label>
            <input
              className={inputClassName}
              value={seo.ogTitle || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, ogTitle: e.target.value }))
              }
              placeholder="Boş kalırsa Site Title kullanılır"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>OG Image URL</label>
            <input
              className={inputClassName}
              value={seo.ogImage || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, ogImage: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={labelClassName}>OG Description</label>
            <textarea
              rows={3}
              className={textareaClassName}
              value={seo.ogDescription || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, ogDescription: e.target.value }))
              }
              placeholder="Boş kalırsa Description kullanılır"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
          Twitter Card Ayarları
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName}>Twitter Title</label>
            <input
              className={inputClassName}
              value={seo.twitterTitle || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, twitterTitle: e.target.value }))
              }
              placeholder="Boş kalırsa Site Title kullanılır"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Twitter Image URL</label>
            <input
              className={inputClassName}
              value={seo.twitterImage || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, twitterImage: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={labelClassName}>Twitter Description</label>
            <textarea
              rows={3}
              className={textareaClassName}
              value={seo.twitterDesc || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, twitterDesc: e.target.value }))
              }
              placeholder="Boş kalırsa Description kullanılır"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
          Robots Ayarları
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-between rounded-[16px] border border-[#d0bc90] bg-[#fff5ea]/50 px-4 py-3">
            <span className="text-sm font-bold text-[#2c1a0e]">
              Index alınsın
            </span>

            <input
              type="checkbox"
              checked={seo.robotsIndex}
              onChange={(e) =>
                setSeo((s) => ({ ...s, robotsIndex: e.target.checked }))
              }
              className="h-5 w-5 accent-[#7a3b1e]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-[16px] border border-[#d0bc90] bg-[#fff5ea]/50 px-4 py-3">
            <span className="text-sm font-bold text-[#2c1a0e]">
              Linkler takip edilsin
            </span>

            <input
              type="checkbox"
              checked={seo.robotsFollow}
              onChange={(e) =>
                setSeo((s) => ({ ...s, robotsFollow: e.target.checked }))
              }
              className="h-5 w-5 accent-[#7a3b1e]"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-8 rounded-full bg-[#524528] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Kaydediliyor
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              SEO Kaydet
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
