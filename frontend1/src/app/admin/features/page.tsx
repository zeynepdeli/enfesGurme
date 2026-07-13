"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  Award,
  CheckCircle2,
  Gift,
  Heart,
  ImagePlus,
  Leaf,
  Loader2,
  Package,
  Pencil,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
  X,
} from "lucide-react";

type FeatureItem = {
  id?: number;
  icon: string;
  title: string;
  order: number;
  isActive: boolean;
};

type FeatureSection = {
  title: string;
  description: string;
  backgroundImage: string;
  cardTexture: string;
  items: FeatureItem[];
};

type ImageField = "backgroundImage" | "cardTexture";

const emptySection: FeatureSection = {
  title: "ANTEP'İN BEREKETİ",
  description:
    "Gaziantep'in binlerce yıllık köklü mutfak mirasını, geleneksel yöntemlerle ve el emeğiyle modern sofralara taşıyoruz.",
  backgroundImage: "/duvarBg.png",
  cardTexture: "/cardDuvar.png",
  items: [],
};

const emptyItem: FeatureItem = {
  icon: "leaf",
  title: "",
  order: 0,
  isActive: true,
};

const ICON_OPTIONS = [
  { value: "leaf", label: "Leaf", Icon: Leaf },
  { value: "award", label: "Award", Icon: Award },
  { value: "shield", label: "Shield", Icon: ShieldCheck },
  { value: "truck", label: "Truck", Icon: Truck },
  { value: "star", label: "Star", Icon: Star },
  { value: "gift", label: "Gift", Icon: Gift },
  { value: "heart", label: "Heart", Icon: Heart },
  { value: "package", label: "Package", Icon: Package },
];

export default function FeaturesAdminPage() {
  const [form, setForm] = useState<FeatureSection>(emptySection);
  const [itemForm, setItemForm] = useState<FeatureItem>(emptyItem);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const inputClassName =
    "h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

  const textareaClassName =
    "w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 py-3 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

  const labelClassName =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

  const loadSection = async () => {
    try {
      setLoading(true);
      const res = await api.get<FeatureSection>("/api/features-section/admin");
      setForm(res.data || emptySection);
    } catch (error) {
      console.error("Features load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, []);

  const handleSaveSection = async () => {
    try {
      setSaving(true);

      const { items, ...payload } = form;

      await api.put("/api/features-section/admin", payload);
      await loadSection();
    } catch (error) {
      console.error("Features section save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageField,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(field);

      const fd = new FormData();
      fd.append("image", file);

      const res = await api.upload<{ url: string }>("/api/upload", fd);
      const imageUrl = res.data?.url;

      if (!imageUrl) return;

      setForm((prev) => ({
        ...prev,
        [field]: imageUrl,
      }));
    } catch (error) {
      console.error("Feature image upload error:", error);
    } finally {
      setUploadingField(null);

      if (fileRefs.current[field]) {
        fileRefs.current[field]!.value = "";
      }
    }
  };

  const handleSaveItem = async () => {
    if (!itemForm.title) return;

    try {
      if (editingId) {
        await api.put(`/api/features-section/items/${editingId}`, itemForm);
      } else {
        await api.post("/api/features-section/items", itemForm);
      }

      setItemForm(emptyItem);
      setEditingId(null);
      await loadSection();
    } catch (error) {
      console.error("Feature item save error:", error);
    }
  };

  const handleEditItem = (item: FeatureItem) => {
    setItemForm({
      icon: item.icon,
      title: item.title,
      order: item.order,
      isActive: item.isActive,
    });

    setEditingId(item.id || null);
  };

  const handleDeleteItem = async (id?: number) => {
    if (!id) return;
    if (!confirm("Özellik silinsin mi?")) return;

    await api.delete(`/api/features-section/items/${id}`);
    await loadSection();
  };

  const handleCancelEdit = () => {
    setItemForm(emptyItem);
    setEditingId(null);
  };

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
            <Star size={22} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
              Yönetim Paneli
            </span>

            <h1 className="mt-1 font-serif text-4xl font-black italic text-[#2c1a0e]">
              Özellikler Bölümü
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Ana sayfadaki özellikler bölümünün başlığını, açıklamasını,
          görsellerini ve kartlarını buradan yönetebilirsiniz.
        </p>
      </div>

      <Panel title="Bölüm Ayarları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Başlık"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <div className="md:col-span-2">
            <TextareaField
              label="Açıklama"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              textareaClassName={textareaClassName}
              labelClassName={labelClassName}
            />
          </div>

          <ImageInput
            label="Background Image"
            field="backgroundImage"
            value={form.backgroundImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Card Texture"
            field="cardTexture"
            value={form.cardTexture}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>

        <button
          onClick={handleSaveSection}
          disabled={saving}
          className="mt-8 rounded-full bg-[#524528] px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Kaydediliyor
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Bölüm Ayarlarını Kaydet
            </span>
          )}
        </button>
      </Panel>

      <Panel title="Feature Kartları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_120px]">
          <div className="space-y-2">
            <label className={labelClassName}>Icon</label>

            <select
              value={itemForm.icon}
              onChange={(e) =>
                setItemForm((f) => ({
                  ...f,
                  icon: e.target.value,
                }))
              }
              className={inputClassName}
            >
              {ICON_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Başlık"
            value={itemForm.title}
            onChange={(v) => setItemForm((f) => ({ ...f, title: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Sıra"
            value={String(itemForm.order)}
            onChange={(v) => setItemForm((f) => ({ ...f, order: Number(v) }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-bold text-[#2c1a0e]">
          <input
            type="checkbox"
            checked={itemForm.isActive}
            onChange={(e) =>
              setItemForm((f) => ({
                ...f,
                isActive: e.target.checked,
              }))
            }
            className="h-5 w-5 accent-[#7a3b1e]"
          />
          Aktif
        </label>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleSaveItem}
            disabled={!itemForm.title}
            className="rounded-full bg-[#524528] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
          >
            {editingId ? "Güncelle" : "Feature Ekle"}
          </button>

          {editingId && (
            <button
              onClick={handleCancelEdit}
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
          {form.items.length === 0 && (
            <div className="rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-8 text-center text-sm text-[#5e4734]/70">
              Henüz özellik eklenmemiş.
            </div>
          )}

          {form.items.map((item) => {
            const Icon = getIcon(item.icon);

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-4 md:flex-row md:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#efe3cf] text-[#7a3b1e]">
                  <Icon size={22} />
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                    {item.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#efe3cf] px-3 py-1 text-xs font-bold text-[#7a3b1e]">
                      Icon: {item.icon}
                    </span>

                    <span className="rounded-full bg-[#efe3cf] px-3 py-1 text-xs font-bold text-[#7a3b1e]">
                      Sıra: {item.order}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.isActive
                          ? "bg-[#dcebd4] text-[#476f3c]"
                          : "bg-[#f4dfdc] text-[#8f2f2f]"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex items-center gap-2 rounded-full border border-[#3d77c4]/30 bg-[#edf4ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#315f9a]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Düzenle
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function getIcon(icon: string) {
  switch (icon) {
    case "leaf":
      return Leaf;
    case "award":
      return Award;
    case "shield":
      return ShieldCheck;
    case "truck":
      return Truck;
    case "star":
      return Star;
    case "gift":
      return Gift;
    case "heart":
      return Heart;
    case "package":
      return Package;
    default:
      return Leaf;
  }
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
      <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
        {title}
      </h2>

      {children}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  inputClassName,
  labelClassName,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClassName: string;
  labelClassName: string;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClassName}>{label}</label>

      <input
        className={inputClassName}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  textareaClassName,
  labelClassName,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textareaClassName: string;
  labelClassName: string;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClassName}>{label}</label>

      <textarea
        rows={4}
        className={textareaClassName}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ImageInput({
  label,
  field,
  value,
  setForm,
  uploadImage,
  fileRefs,
  uploadingField,
  inputClassName,
  labelClassName,
}: {
  label: string;
  field: ImageField;
  value: string;
  setForm: React.Dispatch<React.SetStateAction<FeatureSection>>;
  uploadImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageField,
  ) => Promise<void>;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  uploadingField: ImageField | null;
  inputClassName: string;
  labelClassName: string;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClassName}>{label}</label>

      <div className="flex gap-2">
        <input
          className={inputClassName}
          value={value || ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              [field]: e.target.value,
            }))
          }
        />

        <button
          type="button"
          onClick={() => fileRefs.current[field]?.click()}
          className="flex h-11 shrink-0 items-center gap-2 rounded-md border border-[#bc7b56] bg-[#fff5ea]/70 px-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6b3f18]"
        >
          {uploadingField === field ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Seç
        </button>

        <input
          ref={(el) => {
            fileRefs.current[field] = el;
          }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => uploadImage(e, field)}
        />
      </div>

      {value && (
        <div className="relative mt-3 h-28 w-full overflow-hidden rounded-[14px] border border-[#d0bc90] bg-[#fff5ea]/40">
          <Image src={value} alt={label} fill className="object-contain p-2" />
        </div>
      )}
    </div>
  );
}
