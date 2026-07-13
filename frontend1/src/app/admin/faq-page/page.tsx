"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { api } from "@/lib/api";

type FaqPageSetting = {
  id?: number;
  backgroundColor: string;
  backgroundImage: string;
  cardBgImage: string;
  textureImage: string;
  title: string;
  subtitle?: string;
  contactTitle: string;
  buttonText: string;
  buttonLink: string;
};

type FaqCategory = {
  id: number;
  name: string;
  order: number;
  isActive: boolean;
};

type FaqItem = {
  id: number;
  categoryId?: number | null;
  question: string;
  answer: string;
  topIcon?: string | null;
  bottomIcon?: string | null;
  order: number;
  isActive: boolean;
};

type FaqAdminResponse = {
  settings: FaqPageSetting | null;
  categories: FaqCategory[];
  items: FaqItem[];
};

type ImageField =
  | "backgroundImage"
  | "cardBgImage"
  | "textureImage"
  | "topIcon"
  | "bottomIcon";

const defaultSettings: FaqPageSetting = {
  backgroundColor: "#efe3cc",
  backgroundImage: "/duvarBg.png",
  cardBgImage: "/cardDuvar.png",
  textureImage: "/bkrr.png",
  title: "SIKÇA SORULAN SORULAR",
  subtitle: "Merak ettiğiniz tüm soruların cevaplarını burada bulabilirsiniz.",
  contactTitle: "Hala Sorunuz Mu Var?",
  buttonText: "Bize Yazın",
  buttonLink: "/contact",
};

const emptyItem: Omit<FaqItem, "id"> = {
  categoryId: null,
  question: "",
  answer: "",
  topIcon: "",
  bottomIcon: "",
  order: 0,
  isActive: true,
};

export default function AdminFaqPage() {
  const [settings, setSettings] = useState<FaqPageSetting>(defaultSettings);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    order: 0,
    isActive: true,
  });
  const [newItem, setNewItem] = useState<Omit<FaqItem, "id">>(emptyItem);

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadFaq = async () => {
    try {
      setLoading(true);

      const res = await api.get<FaqAdminResponse>("/api/faq-page/admin");

      const data = res.data;

      if (!data) {
        setSettings(defaultSettings);
        setCategories([]);
        setItems([]);
        return;
      }

      setSettings({
        ...defaultSettings,
        ...(data.settings ?? {}),
      });

      setCategories(data.categories ?? []);
      setItems(data.items ?? []);
    } catch (error) {
      console.error("FAQ admin load error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadFaq();
  }, []);

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    onUploaded: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingKey(key);

      const fd = new FormData();
      fd.append("image", file);

      const res = await api.upload<{ url: string }>("/api/upload", fd);
      const url = res.data?.url;

      if (url) onUploaded(url);
    } catch (error) {
      console.error("FAQ image upload error:", error);
    } finally {
      setUploadingKey(null);

      if (fileRefs.current[key]) {
        fileRefs.current[key]!.value = "";
      }
    }
  };

  const saveSettings = async () => {
    try {
      setSavingSettings(true);
      await api.put("/api/faq-page/admin/settings", settings);
      await loadFaq();
    } catch (error) {
      console.error("FAQ settings save error:", error);
    } finally {
      setSavingSettings(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.name.trim()) return;

    await api.post("/api/faq-page/admin/categories", newCategory);
    setNewCategory({ name: "", order: 0, isActive: true });
    await loadFaq();
  };

  const updateCategory = async (category: FaqCategory) => {
    await api.put(`/api/faq-page/admin/categories/${category.id}`, category);
    await loadFaq();
  };

  const deleteCategory = async (id: number) => {
    await api.delete(`/api/faq-page/admin/categories/${id}`);
    await loadFaq();
  };

  const createItem = async () => {
    if (!newItem.question.trim() || !newItem.answer.trim()) return;

    await api.post("/api/faq-page/admin/items", {
      ...newItem,
      categoryId: newItem.categoryId || null,
    });

    setNewItem(emptyItem);
    await loadFaq();
  };

  const updateItem = async (item: FaqItem) => {
    await api.put(`/api/faq-page/admin/items/${item.id}`, {
      ...item,
      categoryId: item.categoryId || null,
    });

    await loadFaq();
  };

  const deleteItem = async (id: number) => {
    await api.delete(`/api/faq-page/admin/items/${id}`);
    await loadFaq();
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7a3b1e]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <Header />

      <Panel title="Sayfa Ayarları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Background Color"
            value={settings.backgroundColor}
            onChange={(v) => setSettings((s) => ({ ...s, backgroundColor: v }))}
          />

          <ImageInput
            label="Background Image"
            value={settings.backgroundImage}
            uploadKey="settings-background"
            uploadingKey={uploadingKey}
            fileRefs={fileRefs}
            onChange={(v) => setSettings((s) => ({ ...s, backgroundImage: v }))}
            onUpload={(e) =>
              uploadImage(e, "settings-background", (url) =>
                setSettings((s) => ({ ...s, backgroundImage: url })),
              )
            }
          />

          <ImageInput
            label="Card Bg Image"
            value={settings.cardBgImage}
            uploadKey="settings-card-bg"
            uploadingKey={uploadingKey}
            fileRefs={fileRefs}
            onChange={(v) => setSettings((s) => ({ ...s, cardBgImage: v }))}
            onUpload={(e) =>
              uploadImage(e, "settings-card-bg", (url) =>
                setSettings((s) => ({ ...s, cardBgImage: url })),
              )
            }
          />

          <ImageInput
            label="Texture Image"
            value={settings.textureImage}
            uploadKey="settings-texture"
            uploadingKey={uploadingKey}
            fileRefs={fileRefs}
            onChange={(v) => setSettings((s) => ({ ...s, textureImage: v }))}
            onUpload={(e) =>
              uploadImage(e, "settings-texture", (url) =>
                setSettings((s) => ({ ...s, textureImage: url })),
              )
            }
          />

          <Input
            label="Başlık"
            value={settings.title}
            onChange={(v) => setSettings((s) => ({ ...s, title: v }))}
          />

          <Input
            label="Alt Başlık"
            value={settings.subtitle || ""}
            onChange={(v) => setSettings((s) => ({ ...s, subtitle: v }))}
          />

          <Input
            label="CTA Başlık"
            value={settings.contactTitle}
            onChange={(v) => setSettings((s) => ({ ...s, contactTitle: v }))}
          />

          <Input
            label="Buton Yazısı"
            value={settings.buttonText}
            onChange={(v) => setSettings((s) => ({ ...s, buttonText: v }))}
          />

          <Input
            label="Buton Link"
            value={settings.buttonLink}
            onChange={(v) => setSettings((s) => ({ ...s, buttonLink: v }))}
          />
        </div>

        <SaveButton
          loading={savingSettings}
          text="Sayfa Ayarlarını Kaydet"
          onClick={saveSettings}
        />
      </Panel>

      <Panel title="Kategori Yönetimi">
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-[18px] bg-[#fff5ea]/45 p-4 md:grid-cols-[1fr_120px_120px_auto]">
          <Input
            label="Kategori Adı"
            value={newCategory.name}
            onChange={(v) => setNewCategory((c) => ({ ...c, name: v }))}
          />

          <Input
            label="Sıra"
            type="number"
            value={String(newCategory.order)}
            onChange={(v) =>
              setNewCategory((c) => ({ ...c, order: Number(v) }))
            }
          />

          <SwitchInput
            label="Aktif"
            checked={newCategory.isActive}
            onChange={(v) => setNewCategory((c) => ({ ...c, isActive: v }))}
          />

          <button
            onClick={createCategory}
            className="mt-6 flex h-11 items-center justify-center gap-2 rounded-full bg-[#524528] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#e8dcc0]"
          >
            <Plus className="h-4 w-4" />
            Ekle
          </button>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-1 gap-3 rounded-[18px] bg-[#fff5ea]/45 p-4 md:grid-cols-[1fr_120px_120px_auto_auto]"
            >
              <Input
                label="Kategori"
                value={category.name}
                onChange={(v) =>
                  setCategories((list) =>
                    list.map((c) =>
                      c.id === category.id ? { ...c, name: v } : c,
                    ),
                  )
                }
              />

              <Input
                label="Sıra"
                type="number"
                value={String(category.order)}
                onChange={(v) =>
                  setCategories((list) =>
                    list.map((c) =>
                      c.id === category.id ? { ...c, order: Number(v) } : c,
                    ),
                  )
                }
              />

              <SwitchInput
                label="Aktif"
                checked={category.isActive}
                onChange={(v) =>
                  setCategories((list) =>
                    list.map((c) =>
                      c.id === category.id ? { ...c, isActive: v } : c,
                    ),
                  )
                }
              />

              <button
                onClick={() => updateCategory(category)}
                className="mt-6 flex h-11 items-center justify-center gap-2 rounded-full bg-[#7a3b1e] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#f4ead8]"
              >
                <Save className="h-4 w-4" />
                Kaydet
              </button>

              <button
                onClick={() => deleteCategory(category.id)}
                className="mt-6 flex h-11 items-center justify-center gap-2 rounded-full bg-[#9f2f1f] px-5 text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="SSS Kartları">
        <FaqItemEditor
          title="Yeni Soru Ekle"
          item={newItem}
          categories={categories}
          uploadingKey={uploadingKey}
          fileRefs={fileRefs}
          uploadImage={uploadImage}
          onChange={(item) => setNewItem(item)}
          onSave={createItem}
          isNew
        />

        <div className="mt-8 space-y-5">
          {items.map((item) => (
            <FaqItemEditor
              key={item.id}
              title={`Soru #${item.id}`}
              item={item}
              categories={categories}
              uploadingKey={uploadingKey}
              fileRefs={fileRefs}
              uploadImage={uploadImage}
              onChange={(updated) =>
                setItems((list) =>
                  list.map((i) =>
                    i.id === item.id ? (updated as FaqItem) : i,
                  ),
                )
              }
              onSave={() => updateItem(item)}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Header() {
  return (
    <div className="rounded-[24px] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
        Yönetim Paneli
      </span>

      <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e]">
        Sıkça Sorulan Sorular Yönetimi
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
        SSS sayfasının başlığını, arka planını, kategorilerini ve tüm soru
        kartlarını buradan dinamik olarak yönetebilirsiniz.
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
      <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]">
        {label}
      </span>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none focus:border-[#bc7b56]"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]">
        {label}
      </span>

      <textarea
        rows={4}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 py-3 text-sm text-[#2c1a0e] outline-none focus:border-[#bc7b56]"
      />
    </label>
  );
}

function SwitchInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-11 w-full rounded-full text-xs font-bold uppercase tracking-[0.14em] ${
          checked
            ? "bg-[#524528] text-[#e8dcc0]"
            : "bg-[#cbb892] text-[#5e4734]"
        }`}
      >
        {checked ? "Aktif" : "Pasif"}
      </button>
    </label>
  );
}

function ImageInput({
  label,
  value,
  uploadKey,
  uploadingKey,
  fileRefs,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  uploadKey: string;
  uploadingKey: string | null;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onChange: (value: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]">
        {label}
      </span>

      <div className="flex gap-2">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none focus:border-[#bc7b56]"
        />

        <button
          type="button"
          onClick={() => fileRefs.current[uploadKey]?.click()}
          className="flex h-11 shrink-0 items-center gap-2 rounded-md border border-[#bc7b56] bg-[#fff5ea]/70 px-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6b3f18]"
        >
          {uploadingKey === uploadKey ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Seç
        </button>

        <input
          ref={(el) => {
            fileRefs.current[uploadKey] = el;
          }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>

      {value && (
        <div className="relative mt-3 h-28 w-full overflow-hidden rounded-[14px] bg-[#fff5ea]/40">
          <Image src={value} alt={label} fill className="object-contain p-2" />
        </div>
      )}
    </div>
  );
}

function SaveButton({
  loading,
  text,
  onClick,
}: {
  loading?: boolean;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 rounded-full bg-[#524528] px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Kaydediliyor
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {text}
        </span>
      )}
    </button>
  );
}

function FaqItemEditor({
  title,
  item,
  categories,
  uploadingKey,
  fileRefs,
  uploadImage,
  onChange,
  onSave,
  onDelete,
  isNew = false,
}: {
  title: string;
  item: Omit<FaqItem, "id"> | FaqItem;
  categories: FaqCategory[];
  uploadingKey: string | null;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  uploadImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    onUploaded: (url: string) => void,
  ) => Promise<void>;
  onChange: (item: Omit<FaqItem, "id"> | FaqItem) => void;
  onSave: () => void;
  onDelete?: () => void;
  isNew?: boolean;
}) {
  const id = "id" in item ? item.id : "new";

  return (
    <div className="rounded-[22px] bg-[#fff5ea]/45 p-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45)]">
      <h3 className="mb-4 font-serif text-xl font-black italic text-[#2c1a0e]">
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]">
            Kategori
          </span>

          <select
            value={item.categoryId || ""}
            onChange={(e) =>
              onChange({
                ...item,
                categoryId: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none focus:border-[#bc7b56]"
          >
            <option value="">Kategori Yok</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="Sıra"
          type="number"
          value={String(item.order)}
          onChange={(v) => onChange({ ...item, order: Number(v) })}
        />

        <div className="md:col-span-2">
          <Input
            label="Soru"
            value={item.question}
            onChange={(v) => onChange({ ...item, question: v })}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Cevap"
            value={item.answer}
            onChange={(v) => onChange({ ...item, answer: v })}
          />
        </div>

        <ImageInput
          label="Üst İkon"
          value={item.topIcon || ""}
          uploadKey={`top-icon-${id}`}
          uploadingKey={uploadingKey}
          fileRefs={fileRefs}
          onChange={(v) => onChange({ ...item, topIcon: v })}
          onUpload={(e) =>
            uploadImage(e, `top-icon-${id}`, (url) =>
              onChange({ ...item, topIcon: url }),
            )
          }
        />

        <ImageInput
          label="Alt Dekor İkon"
          value={item.bottomIcon || ""}
          uploadKey={`bottom-icon-${id}`}
          uploadingKey={uploadingKey}
          fileRefs={fileRefs}
          onChange={(v) => onChange({ ...item, bottomIcon: v })}
          onUpload={(e) =>
            uploadImage(e, `bottom-icon-${id}`, (url) =>
              onChange({ ...item, bottomIcon: url }),
            )
          }
        />

        <SwitchInput
          label="Aktif"
          checked={item.isActive}
          onChange={(v) => onChange({ ...item, isActive: v })}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onSave}
          className="flex h-11 items-center gap-2 rounded-full bg-[#7a3b1e] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#f4ead8]"
        >
          {isNew ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isNew ? "Soru Ekle" : "Kaydet"}
        </button>

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex h-11 items-center gap-2 rounded-full bg-[#9f2f1f] px-5 text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </button>
        )}
      </div>
    </div>
  );
}
