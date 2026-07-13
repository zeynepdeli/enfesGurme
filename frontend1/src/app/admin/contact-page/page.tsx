"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type ContactSocial = {
  id?: number;
  type: string;
  title: string;
  subtitle: string;
  href: string;
  order: number;
  isActive: boolean;
};

type ContactPage = {
  pageTitle: string;

  backgroundImage: string;
  sketchImageOne?: string;
  sketchImageTwo?: string;

  mapImage: string;
  logoImage: string;
  mapTitle: string;
  mapSubtitle: string;

  cardBgImage: string;
  textureImage: string;

  infoSmallTitle: string;
  infoTitle: string;

  addressTitle: string;
  addressText: string;
  addressLinkText: string;
  addressLink?: string;

  phoneTitle: string;
  phoneText: string;

  emailTitle: string;
  emailText: string;

  socials: ContactSocial[];
};

type ImageField = keyof ContactPage;

const emptyContact: ContactPage = {
  pageTitle: "",

  backgroundImage: "",
  sketchImageOne: "",
  sketchImageTwo: "",

  mapImage: "",
  logoImage: "",
  mapTitle: "",
  mapSubtitle: "",

  cardBgImage: "/cardDuvar.png",
  textureImage: "/bkrr.png",

  infoSmallTitle: "",
  infoTitle: "",

  addressTitle: "",
  addressText: "",
  addressLinkText: "",
  addressLink: "",

  phoneTitle: "",
  phoneText: "",

  emailTitle: "",
  emailText: "",

  socials: [],
};

const emptySocial: ContactSocial = {
  type: "instagram",
  title: "",
  subtitle: "",
  href: "",
  order: 0,
  isActive: true,
};

export default function ContactPageAdmin() {
  const [form, setForm] = useState<ContactPage>(emptyContact);
  const [socialForm, setSocialForm] = useState<ContactSocial>(emptySocial);

  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadContact = async () => {
    try {
      setLoading(true);
      const res = await api.get<ContactPage>("/api/contact-page/admin");
      setForm(res.data || emptyContact);
    } catch (error) {
      console.error("Contact load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const { socials, ...payload } = form;

      await api.put("/api/contact-page/admin", payload);
      await loadContact();
    } catch (error) {
      console.error("Contact save error:", error);
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
      console.error("Image upload error:", error);
    } finally {
      setUploadingField(null);

      if (fileRefs.current[field]) {
        fileRefs.current[field]!.value = "";
      }
    }
  };

  const handleSocialSave = async () => {
    if (!socialForm.title || !socialForm.href) return;

    try {
      if (editingSocialId) {
        await api.put(
          `/api/contact-page/admin/socials/${editingSocialId}`,
          socialForm,
        );
      } else {
        await api.post("/api/contact-page/admin/socials", socialForm);
      }

      setSocialForm(emptySocial);
      setEditingSocialId(null);
      await loadContact();
    } catch (error) {
      console.error("Social save error:", error);
    }
  };

  const handleEditSocial = (item: ContactSocial) => {
    setSocialForm({
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      href: item.href,
      order: item.order,
      isActive: item.isActive,
    });

    setEditingSocialId(item.id || null);
  };

  const handleDeleteSocial = async (id?: number) => {
    if (!id) return;
    if (!confirm("Sosyal medya linki silinsin mi?")) return;

    await api.delete(`/api/contact-page/admin/socials/${id}`);
    await loadContact();
  };

  const handleCancelSocial = () => {
    setSocialForm(emptySocial);
    setEditingSocialId(null);
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
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
          Yönetim Paneli
        </span>

        <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e]">
          Contact Sayfası Yönetimi
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          İletişim sayfasındaki başlıkları, görselleri, adres, telefon, e-posta
          ve sosyal medya linklerini buradan yönetebilirsiniz.
        </p>
      </div>

      <Panel title="Genel Görsel Ayarları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Sayfa Başlığı"
            value={form.pageTitle}
            onChange={(v) => setForm((f) => ({ ...f, pageTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

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
            label="Sketch Image 1"
            field="sketchImageOne"
            value={form.sketchImageOne || ""}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Sketch Image 2"
            field="sketchImageTwo"
            value={form.sketchImageTwo || ""}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Map Image"
            field="mapImage"
            value={form.mapImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Logo Image"
            field="logoImage"
            value={form.logoImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Card Bg Image"
            field="cardBgImage"
            value={form.cardBgImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Texture Image"
            field="textureImage"
            value={form.textureImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Harita Alanı">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Map Title"
            value={form.mapTitle}
            onChange={(v) => setForm((f) => ({ ...f, mapTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Map Subtitle"
            value={form.mapSubtitle}
            onChange={(v) => setForm((f) => ({ ...f, mapSubtitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="İletişim Kartı">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Küçük Başlık"
            value={form.infoSmallTitle}
            onChange={(v) => setForm((f) => ({ ...f, infoSmallTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Ana Başlık"
            value={form.infoTitle}
            onChange={(v) => setForm((f) => ({ ...f, infoTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Adres Bilgileri">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Adres Başlığı"
            value={form.addressTitle}
            onChange={(v) => setForm((f) => ({ ...f, addressTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Konum Link Yazısı"
            value={form.addressLinkText}
            onChange={(v) => setForm((f) => ({ ...f, addressLinkText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <div className="md:col-span-2">
            <TextareaField
              label="Adres Metni"
              value={form.addressText}
              onChange={(v) => setForm((f) => ({ ...f, addressText: v }))}
              textareaClassName={textareaClassName}
              labelClassName={labelClassName}
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              label="Google Maps Linki"
              value={form.addressLink || ""}
              onChange={(v) => setForm((f) => ({ ...f, addressLink: v }))}
              inputClassName={inputClassName}
              labelClassName={labelClassName}
            />
          </div>
        </div>
      </Panel>

      <Panel title="Telefon ve E-posta">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Telefon Başlığı"
            value={form.phoneTitle}
            onChange={(v) => setForm((f) => ({ ...f, phoneTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Telefon"
            value={form.phoneText}
            onChange={(v) => setForm((f) => ({ ...f, phoneText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="E-posta Başlığı"
            value={form.emailTitle}
            onChange={(v) => setForm((f) => ({ ...f, emailTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="E-posta"
            value={form.emailText}
            onChange={(v) => setForm((f) => ({ ...f, emailText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-full bg-[#524528] px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Kaydediliyor
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Contact Sayfasını Kaydet
          </span>
        )}
      </button>

      <Panel title="Sosyal Medya Linkleri">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_1fr_100px]">
          <InputField
            label="Tip"
            value={socialForm.type}
            onChange={(v) => setSocialForm((f) => ({ ...f, type: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Başlık"
            value={socialForm.title}
            onChange={(v) => setSocialForm((f) => ({ ...f, title: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Alt Başlık"
            value={socialForm.subtitle}
            onChange={(v) => setSocialForm((f) => ({ ...f, subtitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Link"
            value={socialForm.href}
            onChange={(v) => setSocialForm((f) => ({ ...f, href: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Sıra"
            value={String(socialForm.order)}
            onChange={(v) => setSocialForm((f) => ({ ...f, order: Number(v) }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-bold text-[#2c1a0e]">
          <input
            type="checkbox"
            checked={socialForm.isActive}
            onChange={(e) =>
              setSocialForm((f) => ({ ...f, isActive: e.target.checked }))
            }
            className="h-5 w-5 accent-[#7a3b1e]"
          />
          Aktif
        </label>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleSocialSave}
            disabled={!socialForm.title || !socialForm.href}
            className="rounded-full bg-[#524528] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {editingSocialId ? "Güncelle" : "Sosyal Link Ekle"}
            </span>
          </button>

          {editingSocialId && (
            <button
              onClick={handleCancelSocial}
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
          {form.socials.length === 0 && (
            <div className="rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-8 text-center text-sm text-[#5e4734]/70">
              Henüz sosyal medya linki eklenmemiş.
            </div>
          )}

          {form.socials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-4 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-[#5e4734]/70">
                  {item.subtitle}
                </p>

                <p className="mt-1 break-all text-xs text-[#5e4734]/60">
                  {item.href}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#efe3cf] px-3 py-1 text-xs font-bold text-[#7a3b1e]">
                    Tip: {item.type}
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
                  onClick={() => handleEditSocial(item)}
                  className="flex items-center gap-2 rounded-full border border-[#3d77c4]/30 bg-[#edf4ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#315f9a]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </button>

                <button
                  onClick={() => handleDeleteSocial(item.id)}
                  className="flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
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
  setForm: React.Dispatch<React.SetStateAction<ContactPage>>;
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
