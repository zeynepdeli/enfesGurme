"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { CheckCircle2, ImagePlus, Loader2 } from "lucide-react";

type ProfilePageSetting = {
  backgroundColor: string;
  backgroundImage: string;
  cardBgImage: string;
  textureImage: string;

  bannerImage: string;
  bannerText: string;

  profileTabText: string;
  ordersTabText: string;

  profileTitle: string;
  editText: string;
  cancelText: string;
  saveText: string;
  logoutText: string;

  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  dateLabel: string;
  addressLabel: string;
  addressEmpty: string;
  unknownText: string;

  noOrdersText: string;
  startShoppingText: string;

  pendingText: string;
  processingText: string;
  shippedText: string;
  deliveredText: string;
  cancelledText: string;

  totalText: string;
};

type ImageField =
  | "backgroundImage"
  | "cardBgImage"
  | "textureImage"
  | "bannerImage";

const emptySettings: ProfilePageSetting = {
  backgroundColor: "#f6efdd",
  backgroundImage: "/duvarBg.png",
  cardBgImage: "/cardDuvar.png",
  textureImage: "/bkrr.png",

  bannerImage: "/duvarBg.png",
  bannerText: "Anatolia Harvest Heritage",

  profileTabText: "Profilim",
  ordersTabText: "Siparişlerim",

  profileTitle: "Kişisel Bilgiler",
  editText: "Düzenle",
  cancelText: "İptal",
  saveText: "Kaydet",
  logoutText: "Çıkış Yap",

  nameLabel: "Ad Soyad",
  emailLabel: "E-posta",
  phoneLabel: "Telefon",
  dateLabel: "Üyelik Tarihi",
  addressLabel: "Teslimat Adresi",
  addressEmpty: "Henüz adres eklenmemiş",
  unknownText: "Belirtilmemiş",

  noOrdersText: "Henüz siparişiniz yok",
  startShoppingText: "Alışverişe Başla",

  pendingText: "Beklemede",
  processingText: "Hazırlanıyor",
  shippedText: "Kargoda",
  deliveredText: "Teslim Edildi",
  cancelledText: "İptal",

  totalText: "Toplam",
};

export default function ProfilePageAdmin() {
  const [form, setForm] = useState<ProfilePageSetting>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadSettings = async () => {
    try {
      setLoading(true);

      const res = await api.get<ProfilePageSetting>("/api/profile-page/admin");

      setForm({
        ...emptySettings,
        ...(res.data || {}),
      });
    } catch (error) {
      console.error("Profile page settings load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/api/profile-page/admin", form);
      await loadSettings();
    } catch (error) {
      console.error("Profile page settings save error:", error);
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
          Profil Sayfası Yönetimi
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Kullanıcı profil sayfasındaki görselleri, başlıkları, butonları,
          sekmeleri ve sipariş durum metinlerini buradan yönetebilirsiniz.
        </p>
      </div>

      <Panel title="Genel Görsel Ayarları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Background Color"
            value={form.backgroundColor}
            onChange={(v) => setForm((f) => ({ ...f, backgroundColor: v }))}
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

      <Panel title="Banner Alanı">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ImageInput
            label="Banner Image"
            field="bannerImage"
            value={form.bannerImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Banner Yazısı"
            value={form.bannerText}
            onChange={(v) => setForm((f) => ({ ...f, bannerText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Sekme Yazıları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Profil Sekmesi"
            value={form.profileTabText}
            onChange={(v) => setForm((f) => ({ ...f, profileTabText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Sipariş Sekmesi"
            value={form.ordersTabText}
            onChange={(v) => setForm((f) => ({ ...f, ordersTabText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Profil Kartı Yazıları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Profil Başlığı"
            value={form.profileTitle}
            onChange={(v) => setForm((f) => ({ ...f, profileTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Düzenle Yazısı"
            value={form.editText}
            onChange={(v) => setForm((f) => ({ ...f, editText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="İptal Yazısı"
            value={form.cancelText}
            onChange={(v) => setForm((f) => ({ ...f, cancelText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Kaydet Yazısı"
            value={form.saveText}
            onChange={(v) => setForm((f) => ({ ...f, saveText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Çıkış Yazısı"
            value={form.logoutText}
            onChange={(v) => setForm((f) => ({ ...f, logoutText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Bilgi Alanı Etiketleri">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Ad Soyad"
            value={form.nameLabel}
            onChange={(v) => setForm((f) => ({ ...f, nameLabel: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="E-posta"
            value={form.emailLabel}
            onChange={(v) => setForm((f) => ({ ...f, emailLabel: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Telefon"
            value={form.phoneLabel}
            onChange={(v) => setForm((f) => ({ ...f, phoneLabel: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Üyelik Tarihi"
            value={form.dateLabel}
            onChange={(v) => setForm((f) => ({ ...f, dateLabel: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Adres Etiketi"
            value={form.addressLabel}
            onChange={(v) => setForm((f) => ({ ...f, addressLabel: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Adres Boş Yazısı"
            value={form.addressEmpty}
            onChange={(v) => setForm((f) => ({ ...f, addressEmpty: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Belirtilmemiş Yazısı"
            value={form.unknownText}
            onChange={(v) => setForm((f) => ({ ...f, unknownText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Sipariş Alanı Yazıları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Sipariş Yok Yazısı"
            value={form.noOrdersText}
            onChange={(v) => setForm((f) => ({ ...f, noOrdersText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Alışverişe Başla Yazısı"
            value={form.startShoppingText}
            onChange={(v) => setForm((f) => ({ ...f, startShoppingText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Toplam Yazısı"
            value={form.totalText}
            onChange={(v) => setForm((f) => ({ ...f, totalText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Sipariş Durum Yazıları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Beklemede"
            value={form.pendingText}
            onChange={(v) => setForm((f) => ({ ...f, pendingText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Hazırlanıyor"
            value={form.processingText}
            onChange={(v) => setForm((f) => ({ ...f, processingText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Kargoda"
            value={form.shippedText}
            onChange={(v) => setForm((f) => ({ ...f, shippedText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="Teslim Edildi"
            value={form.deliveredText}
            onChange={(v) => setForm((f) => ({ ...f, deliveredText: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
          <InputField
            label="İptal"
            value={form.cancelledText}
            onChange={(v) => setForm((f) => ({ ...f, cancelledText: v }))}
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
            Profil Sayfasını Kaydet
          </span>
        )}
      </button>
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
  setForm: React.Dispatch<React.SetStateAction<ProfilePageSetting>>;
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
