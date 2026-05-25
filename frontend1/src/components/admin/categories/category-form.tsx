"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Category } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ImagePlus, Loader2, Trash2, CheckCircle2, Shapes } from "lucide-react";

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CategoryForm({
  category,
  onSubmit,
  isLoading,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image: category.image || "",
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
      });
    }
  }, [category]);

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,

      name,

      slug: name
        .toLocaleLowerCase()
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
          image: data.data.url,
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
      {/* NAME */}
      <div className="space-y-2">
        <Label htmlFor="name" className={labelClassName}>
          Kategori Adı *
        </Label>

        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Örn: Peynirler"
          required
          className={inputClassName}
        />
      </div>

      {/* SLUG */}
      <div className="space-y-2">
        <Label htmlFor="slug" className={labelClassName}>
          Slug
        </Label>

        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) =>
            setFormData({
              ...formData,
              slug: e.target.value,
            })
          }
          placeholder="Örn: peynirler"
          required
          className={inputClassName}
        />

        <p className="text-xs text-[#5e4734]/55">
          URL'de görünecek isim otomatik oluşturulur.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <Label htmlFor="description" className={labelClassName}>
          Açıklama
        </Label>

        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          placeholder="Kategori açıklaması..."
          rows={4}
          className={inputClassName}
        />
      </div>

      {/* IMAGE */}
      <div className="space-y-2">
        <Label className={labelClassName}>Kategori Görseli</Label>

        <div
          className="
            relative overflow-hidden rounded-[18px]
            border border-[#d0bc90]
            bg-[#efe6cf]
            p-4
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.55)]
          "
        >
          {/* BG */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.96)_0%,_rgba(250,243,228,0.88)_45%,_rgba(246,236,214,0.74)_72%,_rgba(228,212,176,0.38)_100%)]" />

          {/* INNER */}
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
              {formData.image ? (
                <>
                  <Image
                    src={formData.image}
                    alt="Kategori görseli"
                    fill
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        image: "",
                      }))
                    }
                    className="
                      absolute right-2 top-2 z-20
                      flex h-7 w-7 items-center justify-center
                      rounded-full
                      bg-red-500 text-white
                      shadow-lg
                      transition-all hover:bg-red-600
                    "
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <Shapes className="h-9 w-9 text-[#2c1a0e]/65" />
              )}
            </div>

            {/* RIGHT */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2c1a0e]">
                Kategori görseli
              </p>

              <p className="mt-1 text-xs leading-relaxed text-[#5e4734]/65">
                Ürün listeleme ve kategori alanlarında kullanılacak görseli
                yükleyin.
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
                    Görsel Seç
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

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
