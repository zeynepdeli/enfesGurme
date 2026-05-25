"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { Product, Category } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ImagePlus,
  Loader2,
  CheckCircle2,
  Package,
  Trash2,
  Sparkles,
} from "lucide-react";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProductForm({
  product,
  onSubmit,
  isLoading,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    isActive: true,
    images: [] as { url: string; alt: string }[],
  });

  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const response = await api.get<Category[]>("/api/categories");

      return response.data || [];
    },
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        isActive: product.isActive,

        images:
          product.images?.map((img) => ({
            url: img.url,
            alt: img.alt || product.name,
          })) || [],
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: "",
        isActive: true,
        images: [],
      });
    }
  }, [product]);

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,

      name,

      slug: name
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

          images: [
            ...prev.images,
            {
              url: data.data.url,
              alt: formData.name,
            },
          ],
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

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,

      images: prev.images.filter((_, i) => i !== index),
    }));
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* NAME */}
      <div className="space-y-2">
        <Label htmlFor="name" className={labelClassName}>
          Ürün Adı *
        </Label>

        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Örn: Antep Peyniri"
          required
          className={inputClassName}
        />
      </div>

      {/* SLUG */}
      <div className="space-y-2">
        <Label htmlFor="slug" className={labelClassName}>
          Slug *
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
          placeholder="antep-peyniri"
          required
          className={inputClassName}
        />

        <p className="text-xs text-[#5e4734]/55">
          URL’de görünecek isim otomatik oluşturulur.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <Label htmlFor="description" className={labelClassName}>
          Açıklama *
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
          placeholder="Ürün açıklaması..."
          rows={4}
          required
          className={inputClassName}
        />
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <Label htmlFor="category" className={labelClassName}>
          Kategori *
        </Label>

        {categoriesLoading ? (
          <div className="text-sm text-[#5e4734]/60">
            Kategoriler yükleniyor...
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-sm text-red-600">Önce kategori oluşturun</div>
        ) : (
          <Select
            value={formData.categoryId}
            onValueChange={(value: string) =>
              setFormData({
                ...formData,
                categoryId: value,
              })
            }
          >
            <SelectTrigger className={`w-full ${inputClassName}`}>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>

            <SelectContent className="border-[#d0bc90] bg-[#efe6cf] text-[#2c1a0e]">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* PRICE + STOCK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price" className={labelClassName}>
            Fiyat (TL) *
          </Label>

          <Input
            id="price"
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
            placeholder="0.00"
            required
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock" className={labelClassName}>
            Stok *
          </Label>

          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({
                ...formData,
                stock: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
            required
            className={inputClassName}
          />
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
          <p className="text-sm font-bold text-[#2c1a0e]">Ürün aktif</p>

          <p className="mt-1 text-xs text-[#5e4734]/60">
            Aktif olduğunda mağazada görünür.
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

      {/* IMAGES */}
      <div className="space-y-2">
        <Label className={labelClassName}>Ürün Görselleri</Label>

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

          <div className="relative z-10">
            {/* PREVIEW */}
            <div className="mb-4 flex flex-wrap gap-3">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className="
                    group relative h-24 w-24 overflow-hidden rounded-[14px]
                    border border-[#d8bf8a]
                    bg-cover bg-center
                  "
                  style={{
                    backgroundImage: "url('/bkrr.png')",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="
                      absolute right-1 top-1
                      flex h-6 w-6 items-center justify-center
                      rounded-full
                      bg-red-500 text-white
                      opacity-0 transition-all
                      hover:bg-red-600
                      group-hover:opacity-100
                    "
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* EMPTY */}
              {formData.images.length === 0 && (
                <div
                  className="
                    flex h-24 w-24 items-center justify-center
                    rounded-[14px]
                    border border-dashed border-[#bc7b56]
                    bg-[#fff5ea]/40
                  "
                >
                  <Package className="h-8 w-8 text-[#7a3b1e]/45" />
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2c1a0e]">
                  Ürün görselleri
                </p>

                <p className="mt-1 text-xs leading-relaxed text-[#5e4734]/65">
                  Ürün detay ve listeleme sayfalarında kullanılacak görselleri
                  yükleyin.
                </p>
              </div>

              {/* BUTTON */}
              <div>
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
                    rounded-full
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
                      Görsel Ekle
                    </>
                  )}
                </Button>
              </div>
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
