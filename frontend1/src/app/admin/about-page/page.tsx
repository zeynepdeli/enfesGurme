"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { CheckCircle2, ImagePlus, Loader2 } from "lucide-react";

type AboutPage = {
  backgroundColor: string;
  cardBgImage: string;
  textureImage: string;

  sketchImageOne?: string;
  sketchImageTwo?: string;
  sketchImageThree?: string;
  sketchImageFour?: string;

  visionTitle: string;
  visionText: string;
  visionImage: string;
  visionMiniImage?: string;

  missionHeading: string;
  missionTitle: string;
  missionText: string;
  missionImage: string;

  storyHeading: string;
  storyTitle: string;
  storyText: string;
  storyImage: string;

  valuesHeading: string;
  valuesTitle: string;
  valuesText: string;
  valuesImage: string;

  miniImageOne: string;
  miniImageTwo: string;
  miniImageThree: string;
};

type ImageField = keyof AboutPage;

const emptyAbout: AboutPage = {
  backgroundColor: "#efe3cc",
  cardBgImage: "/cardDuvar.png",
  textureImage: "/bkrr.png",

  sketchImageOne: "",
  sketchImageTwo: "",
  sketchImageThree: "",
  sketchImageFour: "",

  visionTitle: "",
  visionText: "",
  visionImage: "",
  visionMiniImage: "",

  missionHeading: "",
  missionTitle: "",
  missionText: "",
  missionImage: "",

  storyHeading: "",
  storyTitle: "",
  storyText: "",
  storyImage: "",

  valuesHeading: "",
  valuesTitle: "",
  valuesText: "",
  valuesImage: "",

  miniImageOne: "",
  miniImageTwo: "",
  miniImageThree: "",
};

export default function AboutPageAdmin() {
  const [form, setForm] = useState<AboutPage>(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadAbout = async () => {
    try {
      setLoading(true);
      const res = await api.get<AboutPage>("/api/about-page/admin");

      setForm({
        ...emptyAbout,
        ...(res.data || {}),
      });
    } catch (error) {
      console.error("About load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/api/about-page/admin", form);
      await loadAbout();
    } catch (error) {
      console.error("About save error:", error);
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
          About Sayfası Yönetimi
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          About sayfasındaki tüm metinleri, ana görselleri, mini görselleri ve
          dekor görsellerini buradan yönetebilirsiniz.
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

          <ImageInput
            label="Sketch Görsel 1"
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
            label="Sketch Görsel 2"
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
            label="Sketch Görsel 3"
            field="sketchImageThree"
            value={form.sketchImageThree || ""}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Sketch Görsel 4"
            field="sketchImageFour"
            value={form.sketchImageFour || ""}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <Panel title="Vizyon Alanı">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <InputField
              label="Başlık"
              value={form.visionTitle}
              onChange={(v) => setForm((f) => ({ ...f, visionTitle: v }))}
              inputClassName={inputClassName}
              labelClassName={labelClassName}
            />
          </div>

          <div className="md:col-span-2">
            <TextareaField
              label="Açıklama"
              value={form.visionText}
              onChange={(v) => setForm((f) => ({ ...f, visionText: v }))}
              textareaClassName={textareaClassName}
              labelClassName={labelClassName}
            />
          </div>

          <ImageInput
            label="Vizyon Ana Görsel"
            field="visionImage"
            value={form.visionImage}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Vizyon Alt Mini Görsel"
            field="visionMiniImage"
            value={form.visionMiniImage || ""}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </Panel>

      <SectionForm
        title="Misyon Alanı"
        headingValue={form.missionHeading}
        titleValue={form.missionTitle}
        textValue={form.missionText}
        imageValue={form.missionImage}
        headingField="missionHeading"
        titleField="missionTitle"
        textField="missionText"
        imageField="missionImage"
        setForm={setForm}
        uploadImage={uploadImage}
        fileRefs={fileRefs}
        uploadingField={uploadingField}
        inputClassName={inputClassName}
        textareaClassName={textareaClassName}
        labelClassName={labelClassName}
      />

      <SectionForm
        title="Hikaye Alanı"
        headingValue={form.storyHeading}
        titleValue={form.storyTitle}
        textValue={form.storyText}
        imageValue={form.storyImage}
        headingField="storyHeading"
        titleField="storyTitle"
        textField="storyText"
        imageField="storyImage"
        setForm={setForm}
        uploadImage={uploadImage}
        fileRefs={fileRefs}
        uploadingField={uploadingField}
        inputClassName={inputClassName}
        textareaClassName={textareaClassName}
        labelClassName={labelClassName}
      />

      <SectionForm
        title="Değerler Alanı"
        headingValue={form.valuesHeading}
        titleValue={form.valuesTitle}
        textValue={form.valuesText}
        imageValue={form.valuesImage}
        headingField="valuesHeading"
        titleField="valuesTitle"
        textField="valuesText"
        imageField="valuesImage"
        setForm={setForm}
        uploadImage={uploadImage}
        fileRefs={fileRefs}
        uploadingField={uploadingField}
        inputClassName={inputClassName}
        textareaClassName={textareaClassName}
        labelClassName={labelClassName}
      />

      <Panel title="Mini Görseller">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ImageInput
            label="Mini Görsel 1"
            field="miniImageOne"
            value={form.miniImageOne}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Mini Görsel 2"
            field="miniImageTwo"
            value={form.miniImageTwo}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Mini Görsel 3"
            field="miniImageThree"
            value={form.miniImageThree}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
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
            About Sayfasını Kaydet
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
  setForm: React.Dispatch<React.SetStateAction<AboutPage>>;
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

function SectionForm({
  title,
  headingValue,
  titleValue,
  textValue,
  imageValue,
  headingField,
  titleField,
  textField,
  imageField,
  setForm,
  uploadImage,
  fileRefs,
  uploadingField,
  inputClassName,
  textareaClassName,
  labelClassName,
}: {
  title: string;
  headingValue?: string;
  titleValue: string;
  textValue: string;
  imageValue: string;
  headingField?: keyof AboutPage;
  titleField: keyof AboutPage;
  textField: keyof AboutPage;
  imageField: ImageField;
  setForm: React.Dispatch<React.SetStateAction<AboutPage>>;
  uploadImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageField,
  ) => Promise<void>;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  uploadingField: ImageField | null;
  inputClassName: string;
  textareaClassName: string;
  labelClassName: string;
}) {
  return (
    <Panel title={title}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {headingField && (
          <InputField
            label="Üst Başlık"
            value={headingValue || ""}
            onChange={(v) =>
              setForm((f) => ({
                ...f,
                [headingField]: v,
              }))
            }
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        )}

        <div className={headingField ? "" : "md:col-span-2"}>
          <InputField
            label="Başlık"
            value={titleValue}
            onChange={(v) =>
              setForm((f) => ({
                ...f,
                [titleField]: v,
              }))
            }
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>

        <div className="md:col-span-2">
          <TextareaField
            label="Açıklama"
            value={textValue}
            onChange={(v) =>
              setForm((f) => ({
                ...f,
                [textField]: v,
              }))
            }
            textareaClassName={textareaClassName}
            labelClassName={labelClassName}
          />
        </div>

        <div className="md:col-span-2">
          <ImageInput
            label="Görsel"
            field={imageField}
            value={imageValue}
            setForm={setForm}
            uploadImage={uploadImage}
            fileRefs={fileRefs}
            uploadingField={uploadingField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>
      </div>
    </Panel>
  );
}
