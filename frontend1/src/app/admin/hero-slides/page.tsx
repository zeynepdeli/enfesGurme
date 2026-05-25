"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { api } from "@/lib/api";

import {
  ImagePlus,
  Loader2,
  Pencil,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers3,
} from "lucide-react";

type Slide = {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  scatterImages: string[];
};

const empty: Slide = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "Keşfet ve Satın Al",
  buttonLink: "/products",
  imageUrl: "",
  order: 0,
  isActive: true,
  scatterImages: [],
};

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [form, setForm] = useState<Slide>(empty);

  const [editing, setEditing] = useState<number | null>(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [scatterUploading, setScatterUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const scatterFileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await api.get<Slide[]>("/api/hero-slides/admin/all");
    setSlides(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/hero-slides/upload`,
        {
          method: "POST",
          credentials: "include",
          body: fd,
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        setForm((f) => ({
          ...f,
          imageUrl: data.data.url,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  const handleScatterUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setScatterUploading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/hero-slides/upload`,
        {
          method: "POST",
          credentials: "include",
          body: fd,
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        setForm((f) => ({
          ...f,
          scatterImages: [...f.scatterImages, data.data.url],
        }));
      }
    } catch (error) {
      console.error("Scatter upload error:", error);
    } finally {
      setScatterUploading(false);

      if (scatterFileRef.current) {
        scatterFileRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) return;

    setSaving(true);

    if (editing !== null) {
      await api.put(`/api/hero-slides/${editing}`, form);
    } else {
      await api.post("/api/hero-slides", form);
    }

    setForm(empty);
    setEditing(null);

    setSaving(false);

    load();
  };

  const handleEdit = (slide: Slide) => {
    setForm(slide);
    setEditing(slide.id!);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Silinsin mi?")) return;

    await api.delete(`/api/hero-slides/${id}`);

    load();
  };

  const handleToggleActive = async (slide: Slide) => {
    await api.put(`/api/hero-slides/${slide.id}`, {
      ...slide,
      isActive: !slide.isActive,
    });

    load();
  };

  const handleCancel = () => {
    setForm(empty);
    setEditing(null);
  };

  const inputClassName = `
    border-[#d0bc90]
    bg-[#fff5ea]/70
    text-[#2c1a0e]
    placeholder:text-[#5e4734]/45
    focus-visible:border-[#bc7b56]
    focus-visible:ring-[#bc7b56]/25
  `;

  const labelClassName =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* HEADER */}
      <div
        className="
          relative overflow-hidden rounded-[24px]
          border border-[#d0bc90]
          bg-[#efe6cf]
          p-6
          shadow-[0_14px_30px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]
        "
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

        <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[18px] border border-[#d6c49a]/70" />

        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
            Yönetim Paneli
          </span>

          <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e]">
            Hero Slide Yönetimi
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
            Ana sayfa hero alanındaki slider içeriklerini buradan
            yönetebilirsiniz.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div
        className="
          relative overflow-hidden rounded-[24px]
          border border-[#d0bc90]
          bg-[#efe6cf]
          p-6
          shadow-[0_14px_30px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]
        "
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

        <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[18px] border border-[#d6c49a]/70" />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 items-center justify-center
                overflow-hidden rounded-full
                border border-[#d8bf8a]
                bg-cover bg-center
                text-[#2c1a0e]
                shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28)]
              "
              style={{
                backgroundImage: "url('/bkrr.png')",
              }}
            >
              <Sparkles size={18} />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c3d]">
                Hero Alanı
              </span>

              <h2 className="font-serif text-2xl font-black italic text-[#2c1a0e]">
                {editing !== null ? "Slide Düzenle" : "Yeni Slide"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className={labelClassName}>Başlık *</label>

              <input
                className={`h-11 w-full rounded-md px-4 text-sm ${inputClassName}`}
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                  }))
                }
                placeholder="Antep Fıstığı"
              />
            </div>

            <div className="space-y-2">
              <label className={labelClassName}>Alt Başlık</label>

              <input
                className={`h-11 w-full rounded-md px-4 text-sm ${inputClassName}`}
                value={form.subtitle}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    subtitle: e.target.value,
                  }))
                }
                placeholder="Zeugma'nın Lezzeti"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className={labelClassName}>Açıklama</label>

              <textarea
                rows={4}
                className={`w-full rounded-md px-4 py-3 text-sm ${inputClassName}`}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                placeholder="Tarihin ve lezzetin beşiği Zeugma'dan sofranıza..."
              />
            </div>

            <div className="space-y-2">
              <label className={labelClassName}>Buton Metni</label>

              <input
                className={`h-11 w-full rounded-md px-4 text-sm ${inputClassName}`}
                value={form.buttonText}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    buttonText: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClassName}>Buton Linki</label>

              <input
                className={`h-11 w-full rounded-md px-4 text-sm ${inputClassName}`}
                value={form.buttonLink}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    buttonLink: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className={labelClassName}>Sıra</label>

              <input
                type="number"
                className={`h-11 w-full rounded-md px-4 text-sm ${inputClassName}`}
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    order: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* MAIN IMAGE */}
          <div className="mt-6 space-y-2">
            <label className={labelClassName}>Ana Görsel *</label>

            <div
              className="
                relative overflow-hidden rounded-[18px]
                border border-[#d0bc90]
                bg-[#efe6cf]
                p-4
              "
            >
              <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,248,236,0.9),rgba(239,227,207,0.55))]" />

              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className="
                    relative flex h-28 w-full items-center justify-center
                    overflow-hidden rounded-[14px]
                    border border-[#d8bf8a]
                    bg-cover bg-center sm:w-40
                  "
                  style={{
                    backgroundImage: "url('/bkrr.png')",
                  }}
                >
                  {form.imageUrl ? (
                    <Image
                      src={form.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-[#2c1a0e]/65" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#2c1a0e]">
                    Hero görseli
                  </p>

                  <p className="mt-1 text-xs text-[#5e4734]/65">
                    Slider’da kullanılacak ana görseli yükleyin.
                  </p>

                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="
                      mt-4 rounded-full border border-[#bc7b56]
                      bg-[#fff5ea]/60 px-5 py-2
                      text-xs font-bold uppercase tracking-[0.14em]
                      text-[#6b3f18]
                      transition-all hover:bg-[#efe3cf]
                    "
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Yükleniyor...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ImagePlus className="h-4 w-4" />
                        Görsel Seç
                      </span>
                    )}
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SCATTER */}
          <div className="mt-6 space-y-2">
            <label className={labelClassName}>Scatter Görseller</label>

            <div className="flex flex-wrap gap-3">
              {form.scatterImages.map((url, index) => (
                <div
                  key={index}
                  className="
                    relative h-20 w-20 overflow-hidden rounded-[14px]
                    border border-[#d8bf8a]
                    bg-cover bg-center
                  "
                  style={{
                    backgroundImage: "url('/bkrr.png')",
                  }}
                >
                  <Image src={url} alt="" fill className="object-cover" />

                  <button
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        scatterImages: f.scatterImages.filter(
                          (_, i) => i !== index,
                        ),
                      }))
                    }
                    className="
                      absolute right-1 top-1
                      flex h-5 w-5 items-center justify-center
                      rounded-full bg-red-500
                      text-xs text-white
                    "
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {form.scatterImages.length < 5 && (
              <button
                onClick={() => scatterFileRef.current?.click()}
                disabled={scatterUploading}
                className="
                  mt-2 rounded-full border border-[#bc7b56]
                  bg-[#fff5ea]/60 px-5 py-2
                  text-xs font-bold uppercase tracking-[0.14em]
                  text-[#6b3f18]
                  transition-all hover:bg-[#efe3cf]
                "
              >
                {scatterUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Yükleniyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4" />
                    Scatter Görsel Ekle
                  </span>
                )}
              </button>
            )}

            <input
              ref={scatterFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScatterUpload}
            />
          </div>

          {/* ACTIVE */}
          <label
            htmlFor="isActive"
            className="
              mt-6 flex cursor-pointer items-center justify-between
              rounded-[16px]
              border border-[#d0bc90]
              bg-[#efe3cf]/60
              px-4 py-3
            "
          >
            <div>
              <p className="text-sm font-bold text-[#2c1a0e]">Slide aktif</p>

              <p className="mt-1 text-xs text-[#5e4734]/60">
                Aktif olduğunda ana sayfada görünür.
              </p>
            </div>

            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  isActive: e.target.checked,
                }))
              }
              className="peer sr-only"
            />

            <span
              className={`
                relative flex h-7 w-12 items-center rounded-full border

                ${
                  form.isActive
                    ? "border-[#bc7b56] bg-[#7a3b1e]"
                    : "border-[#d0bc90] bg-[#efe6cf]"
                }
              `}
            >
              <span
                className={`
                  absolute h-5 w-5 rounded-full bg-[#f6efdd]
                  transition-all duration-300

                  ${form.isActive ? "left-[22px]" : "left-[3px]"}
                `}
              />
            </span>
          </label>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3 border-t border-[#3d3020]/10 pt-5">
            <button
              onClick={handleSave}
              disabled={saving || uploading || !form.title || !form.imageUrl}
              className="
                rounded-full border-2 border-transparent
                px-6 py-2.5
                text-xs font-bold uppercase tracking-[0.16em]
                text-[#e8dcc0]
                transition-all duration-300 hover:brightness-110
              "
              style={{
                backgroundImage: `
                  linear-gradient(#524528, #524528),
                  linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
                `,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {editing !== null ? "Güncelle" : "Kaydet"}
                </span>
              )}
            </button>

            {editing !== null && (
              <button
                onClick={handleCancel}
                className="
                  rounded-full border border-[#bc7b56]
                  bg-[#fff5ea]/60 px-6 py-2.5
                  text-xs font-bold uppercase tracking-[0.14em]
                  text-[#6b3f18]
                  transition-all hover:bg-[#efe3cf]
                "
              >
                İptal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {slides.length === 0 && (
          <div
            className="
              rounded-[22px]
              border border-[#d0bc90]
              bg-[#efe6cf]
              py-14 text-center
              text-[#5e4734]/60
            "
          >
            Henüz slide eklenmemiş.
          </div>
        )}

        {slides.map((slide) => (
          <div
            key={slide.id}
            className="
              relative overflow-hidden rounded-[22px]
              border border-[#d0bc90]
              bg-[#efe6cf]
              p-4
              shadow-[0_10px_22px_rgba(120,92,58,0.12)]
            "
          >
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,248,236,0.9),rgba(239,227,207,0.55))]" />

            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center">
              {/* IMAGE */}
              <div
                className="
                  relative h-24 w-full shrink-0 overflow-hidden
                  rounded-[16px]
                  border border-[#d8bf8a]
                  bg-cover bg-center
                  lg:w-32
                "
                style={{
                  backgroundImage: "url('/bkrr.png')",
                }}
              >
                <Image
                  src={slide.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-2xl font-black italic text-[#2c1a0e]">
                  {slide.title}
                </h3>

                {slide.subtitle && (
                  <p className="mt-1 text-sm text-[#7a3b1e]">
                    {slide.subtitle}
                  </p>
                )}

                {slide.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5e4734]/70">
                    {slide.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#efe3cf] px-3 py-1 text-xs font-bold text-[#7a3b1e]">
                    Sıra: {slide.order}
                  </span>

                  <span
                    className={`
                      rounded-full px-3 py-1 text-xs font-bold

                      ${
                        slide.isActive
                          ? "bg-[#dcebd4] text-[#476f3c]"
                          : "bg-[#f4dfdc] text-[#8f2f2f]"
                      }
                    `}
                  >
                    {slide.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleToggleActive(slide)}
                  className="
                    rounded-full border border-[#bc7b56]
                    bg-[#fff5ea]/60 px-4 py-2
                    text-xs font-bold uppercase tracking-[0.14em]
                    text-[#6b3f18]
                  "
                >
                  {slide.isActive ? "Pasif Yap" : "Aktif Yap"}
                </button>

                <button
                  onClick={() => handleEdit(slide)}
                  className="
                    flex items-center gap-2 rounded-full
                    border border-[#3d77c4]/30
                    bg-[#edf4ff]
                    px-4 py-2
                    text-xs font-bold uppercase tracking-[0.14em]
                    text-[#315f9a]
                  "
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </button>

                <button
                  onClick={() => handleDelete(slide.id!)}
                  className="
                    flex items-center gap-2 rounded-full
                    border border-red-300
                    bg-red-50
                    px-4 py-2
                    text-xs font-bold uppercase tracking-[0.14em]
                    text-red-600
                  "
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
