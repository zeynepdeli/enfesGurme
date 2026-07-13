"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ImagePlus, Loader2, Wallpaper } from "lucide-react";

import { api } from "@/lib/api";

type AppBackgroundSetting = {
  backgroundImage: string;
  isActive: boolean;
  hiddenRoutes: string;
};

type ImageField = "backgroundImage";

const EMPTY_SETTING: AppBackgroundSetting = {
  backgroundImage: "/antepKalesi.png",
  isActive: true,
  hiddenRoutes: "/admin,/login,/register,/cart",
};

export default function AppBackgroundAdminPage() {
  const [form, setForm] = useState<AppBackgroundSetting>(EMPTY_SETTING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const inputClassName =
    "h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

  const labelClassName =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<AppBackgroundSetting>("/api/app-background");
      setForm({
        ...EMPTY_SETTING,
        ...(res.data || {}),
      });
    } catch (error) {
      console.error("App background settings load error:", error);
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
      await api.put("/api/app-background/admin", form);
      await loadSettings();
    } catch (error) {
      console.error("App background settings save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ImageField,
  ) => {
    const file = event.target.files?.[0];
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
      console.error("App background image upload error:", error);
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
            <Wallpaper size={22} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
              Yönetim Paneli
            </span>

            <h1 className="mt-1 font-serif text-4xl font-black italic text-[#2c1a0e]">
              Site Arka Planı
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Site genelinde kullanılan arka plan görselini, aktiflik durumunu ve
          arka planın gizleneceği sayfaları buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <h2 className="mb-6 font-serif text-2xl font-black italic text-[#2c1a0e]">
          Arka Plan Ayarları
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <ImageInput
            label="Site Background Image"
            field="backgroundImage"
            value={form.backgroundImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Gizlenecek Route'lar"
            value={form.hiddenRoutes}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                hiddenRoutes: value,
              }))
            }
            inputClassName={inputClassName}
            labelClassName={labelClassName}
            helper="/admin,/login,/register,/cart şeklinde virgülle ayır."
          />

          <label className="mt-2 flex cursor-pointer items-center justify-between rounded-[16px] border border-[#d0bc90] bg-[#fff5ea]/50 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#2c1a0e]">
                Background aktif
              </p>
              <p className="mt-1 text-xs text-[#5e4734]/60">
                Pasif olduğunda site genel arka planı görünmez.
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: event.target.checked,
                }))
              }
              className="h-5 w-5 accent-[#7a3b1e]"
            />
          </label>
        </div>
      </div>

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
            Arka Planı Kaydet
          </span>
        )}
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  inputClassName,
  labelClassName,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClassName: string;
  labelClassName: string;
  helper?: string;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClassName}>{label}</label>

      <input
        className={inputClassName}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />

      {helper && <p className="text-xs text-[#5e4734]/60">{helper}</p>}
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
  setForm: React.Dispatch<React.SetStateAction<AppBackgroundSetting>>;
  uploadImage: (
    event: React.ChangeEvent<HTMLInputElement>,
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
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              [field]: event.target.value,
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
          onChange={(event) => uploadImage(event, field)}
        />
      </div>

      {value && (
        <div className="relative mt-3 h-56 w-full overflow-hidden rounded-[14px] border border-[#d0bc90] bg-[#fff5ea]/40">
          <Image src={value} alt={label} fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
