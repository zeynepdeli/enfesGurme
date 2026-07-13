"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ImagePlus, Loader2, Settings } from "lucide-react";

import { api } from "@/lib/api";

type AuthPageSetting = {
  logoImage: string;
  cardBgImage: string;
  leftDecorImage: string;
  rightDecorImage: string;

  loginTitle: string;
  registerTitle: string;

  loginButtonText: string;
  registerButtonText: string;

  forgotText: string;
  registerLinkText: string;
  loginLinkText: string;
  haveAccountText: string;
};

type ImageField =
  | "logoImage"
  | "cardBgImage"
  | "leftDecorImage"
  | "rightDecorImage";

const EMPTY_SETTING: AuthPageSetting = {
  logoImage: "/logo.png",
  cardBgImage: "/cardDuvar.png",
  leftDecorImage: "/fistik.png",
  rightDecorImage: "/fistik.png",

  loginTitle: "Üye Girişi",
  registerTitle: "Kayıt Ol",

  loginButtonText: "Giriş Yap",
  registerButtonText: "Kayıt Ol",

  forgotText: "Şifremi Unuttum?",
  registerLinkText: "Kayıt Ol",
  loginLinkText: "Giriş Yap",
  haveAccountText: "Zaten hesabınız var mı?",
};

const inputClassName =
  "h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

const labelClassName =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

export default function AuthPageSettingsAdminPage() {
  const [form, setForm] = useState<AuthPageSetting>(EMPTY_SETTING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<AuthPageSetting>("/api/auth-page-settings");
      setForm({
        ...EMPTY_SETTING,
        ...(res.data || {}),
      });
    } catch (error) {
      console.error("Auth page settings load error:", error);
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
      await api.put("/api/auth-page-settings/admin", form);
      await loadSettings();
    } catch (error) {
      console.error("Auth page settings save error:", error);
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
      console.error("Auth page image upload error:", error);
    } finally {
      setUploadingField(null);

      if (fileRefs.current[field]) {
        fileRefs.current[field]!.value = "";
      }
    }
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
            <Settings size={22} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
              Yönetim Paneli
            </span>

            <h1 className="mt-1 font-serif text-4xl font-black italic text-[#2c1a0e]">
              Giriş / Kayıt Ayarları
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Login ve register sayfalarındaki logo, kart zemini, dekor görselleri
          ve metinleri buradan yönetebilirsiniz.
        </p>
      </div>

      <AdminCard title="Görseller">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ImageInput
            label="Logo"
            field="logoImage"
            value={form.logoImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
          />

          <ImageInput
            label="Kart Arka Planı"
            field="cardBgImage"
            value={form.cardBgImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
          />

          <ImageInput
            label="Sol Alt Dekor"
            field="leftDecorImage"
            value={form.leftDecorImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
          />

          <ImageInput
            label="Sağ Alt Dekor"
            field="rightDecorImage"
            value={form.rightDecorImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
          />
        </div>
      </AdminCard>

      <AdminCard title="Login Metinleri">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Login Başlığı"
            value={form.loginTitle}
            onChange={(v) => setForm((f) => ({ ...f, loginTitle: v }))}
          />

          <InputField
            label="Login Button"
            value={form.loginButtonText}
            onChange={(v) => setForm((f) => ({ ...f, loginButtonText: v }))}
          />

          <InputField
            label="Şifremi Unuttum Yazısı"
            value={form.forgotText}
            onChange={(v) => setForm((f) => ({ ...f, forgotText: v }))}
          />

          <InputField
            label="Kayıt Link Yazısı"
            value={form.registerLinkText}
            onChange={(v) => setForm((f) => ({ ...f, registerLinkText: v }))}
          />
        </div>
      </AdminCard>

      <AdminCard title="Register Metinleri">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Register Başlığı"
            value={form.registerTitle}
            onChange={(v) => setForm((f) => ({ ...f, registerTitle: v }))}
          />

          <InputField
            label="Register Button"
            value={form.registerButtonText}
            onChange={(v) => setForm((f) => ({ ...f, registerButtonText: v }))}
          />

          <InputField
            label="Hesabınız Var Mı Yazısı"
            value={form.haveAccountText}
            onChange={(v) => setForm((f) => ({ ...f, haveAccountText: v }))}
          />

          <InputField
            label="Giriş Link Yazısı"
            value={form.loginLinkText}
            onChange={(v) => setForm((f) => ({ ...f, loginLinkText: v }))}
          />
        </div>
      </AdminCard>

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
            Ayarları Kaydet
          </span>
        )}
      </button>
    </div>
  );
}

function AdminCard({
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
}: {
  label: string;
  field: ImageField;
  value: string;
  setForm: React.Dispatch<React.SetStateAction<AuthPageSetting>>;
  uploadImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageField,
  ) => Promise<void>;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  uploadingField: ImageField | null;
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
