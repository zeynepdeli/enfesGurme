"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { BestsellerCard } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ImagePlus, Loader2, CheckCircle2, Sparkles } from "lucide-react";

interface Props {
  card?: BestsellerCard | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function BestsellerCardForm({
  card,
  onSubmit,
  isLoading,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    title: card?.title ?? "",
    description: card?.description ?? "",
    imageUrl: card?.imageUrl ?? "",
    price: card?.price ?? 0,
    slug: card?.slug ?? "",
    order: card?.order ?? 0,
    isActive: card?.isActive ?? true,
  });

  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (title: string) => {
    setFormData({
      ...formData,

      title,

      slug: title
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const uploadData = new FormData();

      uploadData.append("image", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/upload`,
        {
          method: "POST",
          credentials: "include",
          body: uploadData,
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.data.url,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const labelClassName =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

  const inputClassName = `
    border-[#d0bc90]
    bg-[#fff5ea]/70
    text-[#2c1a0e]
    placeholder:text-[#5e4734]/45
    focus-visible:border-[#bc7b56]
    focus-visible:ring-[#bc7b56]/25
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* TITLE */}
      <div className="space-y-2">
        <Label className={labelClassName}>Başlık *</Label>

        <Input
          value={formData.title}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Örn: Antep Fıstığı"
          required
          className={inputClassName}
        />
      </div>

      {/* SLUG */}
      <div className="space-y-2">
        <Label className={labelClassName}>Slug</Label>

        <Input
          value={formData.slug}
          onChange={(e) =>
            setFormData({
              ...formData,
              slug: e.target.value,
            })
          }
          placeholder="antep-fistigi"
          className={inputClassName}
        />

        <p className="text-xs text-[#5e4734]/55">
          Otomatik oluşturulur ve ürün detay sayfasına yönlendirir.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <Label className={labelClassName}>Açıklama</Label>

        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          rows={3}
          className={inputClassName}
        />
      </div>

      {/* IMAGE */}
      <div className="space-y-2">
        <Label className={labelClassName}>Görsel</Label>

        <div
          className="
            relative overflow-hidden rounded-[18px]
            border border-[#d0bc90]
            bg-[#efe6cf]
            p-4
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.55)]
          "
        >
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.96)_0%,_rgba(250,243,228,0.88)_45%,_rgba(246,236,214,0.74)_72%,_rgba(228,212,176,0.38)_100%)]" />

          <div className="pointer-events-none absolute inset-[5px] z-[2] rounded-[13px] border border-[#d6c49a]/60" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* PREVIEW */}
            <div
              className="
                relative flex h-28 w-full items-center justify-center
                overflow-hidden rounded-[14px]
                border border-[#d8bf8a]
                bg-cover bg-center
                sm:w-36
              "
              style={{
                backgroundImage: "url('/bkrr.png')",
              }}
            >
              {formData.imageUrl ? (
                <Image
                  src={formData.imageUrl}
                  alt="Önizleme"
                  fill
                  className="object-cover"
                />
              ) : (
                <Sparkles className="h-8 w-8 text-[#2c1a0e]/75" />
              )}
            </div>

            {/* RIGHT */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2c1a0e]">
                Bestseller kart görseli
              </p>

              <p className="mt-1 text-xs leading-relaxed text-[#5e4734]/65">
                Ana sayfadaki “En Çok Satanlar” alanında kullanılacak ürün
                görselini yükleyin.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="
                  mt-4 rounded-full
                  border-[#bc7b56]
                  bg-[#fff5ea]/60
                  text-xs font-bold uppercase tracking-[0.14em]
                  text-[#6b3f18]
                  hover:bg-[#efe3cf]
                "
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Görsel Yükle
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PRICE + ORDER */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className={labelClassName}>Fiyat (TL)</Label>

          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClassName}>Sıra</Label>

          <Input
            type="number"
            min="0"
            value={formData.order}
            onChange={(e) =>
              setFormData({
                ...formData,
                order: parseInt(e.target.value) || 0,
              })
            }
            className={inputClassName}
          />

          <p className="text-xs text-[#5e4734]/55">0 en üstte görünür.</p>
        </div>
      </div>

      {/* ACTIVE */}
      <label
        htmlFor="isActive"
        className="
          flex cursor-pointer items-center justify-between gap-4
          rounded-[16px]
          border border-[#d0bc90]
          bg-[#efe3cf]/60
          px-4 py-3
        "
      >
        <div>
          <p className="text-sm font-bold text-[#2c1a0e]">Kartı aktif göster</p>

          <p className="mt-1 text-xs text-[#5e4734]/60">
            Aktif olduğunda ana sayfadaki bestseller alanında görünür.
          </p>
        </div>

        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({
              ...formData,
              isActive: e.target.checked,
            })
          }
          className="peer sr-only"
        />

        <span
          className={`
            relative flex h-7 w-12 shrink-0 items-center rounded-full
            border transition-all duration-300

            ${
              formData.isActive
                ? "border-[#bc7b56] bg-[#7a3b1e]"
                : "border-[#d0bc90] bg-[#efe6cf]"
            }
          `}
        >
          <span
            className={`
              absolute h-5 w-5 rounded-full
              bg-[#f6efdd]
              transition-all duration-300

              ${formData.isActive ? "left-[22px]" : "left-[3px]"}
            `}
          />
        </span>
      </label>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 border-t border-[#3d3020]/10 pt-5">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="
              rounded-full
              border-[#bc7b56]
              bg-[#fff5ea]/60
              text-xs font-bold uppercase tracking-[0.14em]
              text-[#6b3f18]
              hover:bg-[#efe3cf]
            "
          >
            İptal
          </Button>
        )}

        <Button
          type="submit"
          disabled={isLoading || uploading}
          className="
            rounded-full border-2 border-transparent
            bg-transparent px-6
            text-xs font-bold uppercase tracking-[0.16em]
            text-[#e8dcc0]
            shadow-none
            transition-all duration-300
            hover:brightness-110
          "
          style={{
            backgroundImage: `
              linear-gradient(#524528, #524528),
              linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
            `,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Kaydet
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
