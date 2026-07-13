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

type FooterNavLink = {
  id?: number;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
};

type FooterContactItem = {
  id?: number;
  type: string;
  text: string;
  order: number;
  isActive: boolean;
};

type FooterSocial = {
  id?: number;
  type: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
};

type FooterBottomLink = {
  id?: number;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
};

type SiteFooter = {
  backgroundImage: string;
  overlayColor: string;

  brandTitle: string;
  brandHighlight: string;
  brandDescription: string;

  corporateTitle: string;
  contactTitle: string;
  newsletterTitle: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;

  cardBgImage: string;
  textureImage: string;

  copyrightText: string;

  navLinks: FooterNavLink[];
  contactItems: FooterContactItem[];
  socials: FooterSocial[];
  bottomLinks: FooterBottomLink[];
};

type ImageField = keyof SiteFooter;

const emptyFooter: SiteFooter = {
  backgroundImage: "/footer1.png",
  overlayColor: "rgba(246,239,221,0.75)",

  brandTitle: "",
  brandHighlight: "",
  brandDescription: "",

  corporateTitle: "",
  contactTitle: "",
  newsletterTitle: "",
  newsletterPlaceholder: "",
  newsletterButtonText: "",

  cardBgImage: "/cardDuvar.png",
  textureImage: "/bkrr.png",

  copyrightText: "",

  navLinks: [],
  contactItems: [],
  socials: [],
  bottomLinks: [],
};

const emptyNav: FooterNavLink = {
  label: "",
  href: "",
  order: 0,
  isActive: true,
};

const emptyContact: FooterContactItem = {
  type: "phone",
  text: "",
  order: 0,
  isActive: true,
};

const emptySocial: FooterSocial = {
  type: "instagram",
  label: "",
  href: "",
  order: 0,
  isActive: true,
};

const emptyBottomLink: FooterBottomLink = {
  label: "",
  href: "",
  order: 0,
  isActive: true,
};

export default function SiteFooterAdminPage() {
  const [form, setForm] = useState<SiteFooter>(emptyFooter);

  const [navForm, setNavForm] = useState<FooterNavLink>(emptyNav);
  const [contactForm, setContactForm] =
    useState<FooterContactItem>(emptyContact);
  const [socialForm, setSocialForm] = useState<FooterSocial>(emptySocial);
  const [bottomForm, setBottomForm] =
    useState<FooterBottomLink>(emptyBottomLink);

  const [editingNavId, setEditingNavId] = useState<number | null>(null);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);
  const [editingBottomId, setEditingBottomId] = useState<number | null>(null);

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

  const loadFooter = async () => {
    try {
      setLoading(true);
      const res = await api.get<SiteFooter>("/api/site-footer/admin");
      setForm(res.data || emptyFooter);
    } catch (error) {
      console.error("Footer load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFooter();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const { navLinks, contactItems, socials, bottomLinks, ...payload } = form;

      await api.put("/api/site-footer/admin", payload);
      await loadFooter();
    } catch (error) {
      console.error("Footer save error:", error);
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
      console.error("Footer image upload error:", error);
    } finally {
      setUploadingField(null);

      if (fileRefs.current[field]) {
        fileRefs.current[field]!.value = "";
      }
    }
  };

  const saveNav = async () => {
    if (!navForm.label || !navForm.href) return;

    if (editingNavId) {
      await api.put(
        `/api/site-footer/admin/nav-links/${editingNavId}`,
        navForm,
      );
    } else {
      await api.post("/api/site-footer/admin/nav-links", navForm);
    }

    setNavForm(emptyNav);
    setEditingNavId(null);
    await loadFooter();
  };

  const saveContact = async () => {
    if (!contactForm.text) return;

    if (editingContactId) {
      await api.put(
        `/api/site-footer/admin/contact-items/${editingContactId}`,
        contactForm,
      );
    } else {
      await api.post("/api/site-footer/admin/contact-items", contactForm);
    }

    setContactForm(emptyContact);
    setEditingContactId(null);
    await loadFooter();
  };

  const saveSocial = async () => {
    if (!socialForm.label || !socialForm.href) return;

    if (editingSocialId) {
      await api.put(
        `/api/site-footer/admin/socials/${editingSocialId}`,
        socialForm,
      );
    } else {
      await api.post("/api/site-footer/admin/socials", socialForm);
    }

    setSocialForm(emptySocial);
    setEditingSocialId(null);
    await loadFooter();
  };

  const saveBottomLink = async () => {
    if (!bottomForm.label || !bottomForm.href) return;

    if (editingBottomId) {
      await api.put(
        `/api/site-footer/admin/bottom-links/${editingBottomId}`,
        bottomForm,
      );
    } else {
      await api.post("/api/site-footer/admin/bottom-links", bottomForm);
    }

    setBottomForm(emptyBottomLink);
    setEditingBottomId(null);
    await loadFooter();
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
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
          Yönetim Paneli
        </span>

        <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e]">
          Footer Yönetimi
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Footer marka bilgileri, menü linkleri, iletişim bilgileri, sosyal
          medya ve alt linkleri buradan yönetebilirsiniz.
        </p>
      </div>

      <Panel title="Genel Footer Ayarları">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <InputField
            label="Overlay Color"
            value={form.overlayColor}
            onChange={(v) => setForm((f) => ({ ...f, overlayColor: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <ImageInput
            label="Card Background Image"
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

      <Panel title="Marka Alanı">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Brand Title"
            value={form.brandTitle}
            onChange={(v) => setForm((f) => ({ ...f, brandTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Brand Highlight"
            value={form.brandHighlight}
            onChange={(v) => setForm((f) => ({ ...f, brandHighlight: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <div className="md:col-span-2">
            <TextareaField
              label="Brand Description"
              value={form.brandDescription}
              onChange={(v) => setForm((f) => ({ ...f, brandDescription: v }))}
              textareaClassName={textareaClassName}
              labelClassName={labelClassName}
            />
          </div>
        </div>
      </Panel>

      <Panel title="Başlıklar ve Bülten">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Corporate Title"
            value={form.corporateTitle}
            onChange={(v) => setForm((f) => ({ ...f, corporateTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Contact Title"
            value={form.contactTitle}
            onChange={(v) => setForm((f) => ({ ...f, contactTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Newsletter Title"
            value={form.newsletterTitle}
            onChange={(v) => setForm((f) => ({ ...f, newsletterTitle: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Newsletter Placeholder"
            value={form.newsletterPlaceholder}
            onChange={(v) =>
              setForm((f) => ({ ...f, newsletterPlaceholder: v }))
            }
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Newsletter Button Text"
            value={form.newsletterButtonText}
            onChange={(v) =>
              setForm((f) => ({ ...f, newsletterButtonText: v }))
            }
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Copyright Text"
            value={form.copyrightText}
            onChange={(v) => setForm((f) => ({ ...f, copyrightText: v }))}
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
            Footer Kaydet
          </span>
        )}
      </button>

      <ListPanel
        title="Footer Menü Linkleri"
        form={
          <CrudForm
            fields={[
              {
                label: "Başlık",
                value: navForm.label,
                onChange: (v) => setNavForm((f) => ({ ...f, label: v })),
              },
              {
                label: "Link",
                value: navForm.href,
                onChange: (v) => setNavForm((f) => ({ ...f, href: v })),
              },
              {
                label: "Sıra",
                value: String(navForm.order),
                onChange: (v) =>
                  setNavForm((f) => ({ ...f, order: Number(v) })),
              },
            ]}
            isActive={navForm.isActive}
            setIsActive={(v) => setNavForm((f) => ({ ...f, isActive: v }))}
            onSave={saveNav}
            onCancel={() => {
              setNavForm(emptyNav);
              setEditingNavId(null);
            }}
            editing={!!editingNavId}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        }
      >
        {form.navLinks.map((item) => (
          <CrudItem
            key={item.id}
            title={item.label}
            subtitle={item.href}
            meta={`Sıra: ${item.order}`}
            active={item.isActive}
            onEdit={() => {
              setNavForm(item);
              setEditingNavId(item.id || null);
            }}
            onDelete={async () => {
              if (!item.id) return;
              await api.delete(`/api/site-footer/admin/nav-links/${item.id}`);
              await loadFooter();
            }}
          />
        ))}
      </ListPanel>

      <ListPanel
        title="Footer İletişim Bilgileri"
        form={
          <CrudForm
            fields={[
              {
                label: "Tip",
                value: contactForm.type,
                onChange: (v) => setContactForm((f) => ({ ...f, type: v })),
              },
              {
                label: "Metin",
                value: contactForm.text,
                onChange: (v) => setContactForm((f) => ({ ...f, text: v })),
              },
              {
                label: "Sıra",
                value: String(contactForm.order),
                onChange: (v) =>
                  setContactForm((f) => ({ ...f, order: Number(v) })),
              },
            ]}
            isActive={contactForm.isActive}
            setIsActive={(v) => setContactForm((f) => ({ ...f, isActive: v }))}
            onSave={saveContact}
            onCancel={() => {
              setContactForm(emptyContact);
              setEditingContactId(null);
            }}
            editing={!!editingContactId}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        }
      >
        {form.contactItems.map((item) => (
          <CrudItem
            key={item.id}
            title={item.text}
            subtitle={`Tip: ${item.type}`}
            meta={`Sıra: ${item.order}`}
            active={item.isActive}
            onEdit={() => {
              setContactForm(item);
              setEditingContactId(item.id || null);
            }}
            onDelete={async () => {
              if (!item.id) return;
              await api.delete(
                `/api/site-footer/admin/contact-items/${item.id}`,
              );
              await loadFooter();
            }}
          />
        ))}
      </ListPanel>

      <ListPanel
        title="Footer Sosyal Medya"
        form={
          <CrudForm
            fields={[
              {
                label: "Tip",
                value: socialForm.type,
                onChange: (v) => setSocialForm((f) => ({ ...f, type: v })),
              },
              {
                label: "Label",
                value: socialForm.label,
                onChange: (v) => setSocialForm((f) => ({ ...f, label: v })),
              },
              {
                label: "Link",
                value: socialForm.href,
                onChange: (v) => setSocialForm((f) => ({ ...f, href: v })),
              },
              {
                label: "Sıra",
                value: String(socialForm.order),
                onChange: (v) =>
                  setSocialForm((f) => ({ ...f, order: Number(v) })),
              },
            ]}
            isActive={socialForm.isActive}
            setIsActive={(v) => setSocialForm((f) => ({ ...f, isActive: v }))}
            onSave={saveSocial}
            onCancel={() => {
              setSocialForm(emptySocial);
              setEditingSocialId(null);
            }}
            editing={!!editingSocialId}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        }
      >
        {form.socials.map((item) => (
          <CrudItem
            key={item.id}
            title={item.label}
            subtitle={item.href}
            meta={`Tip: ${item.type} / Sıra: ${item.order}`}
            active={item.isActive}
            onEdit={() => {
              setSocialForm(item);
              setEditingSocialId(item.id || null);
            }}
            onDelete={async () => {
              if (!item.id) return;
              await api.delete(`/api/site-footer/admin/socials/${item.id}`);
              await loadFooter();
            }}
          />
        ))}
      </ListPanel>

      <ListPanel
        title="Footer Alt Linkleri"
        form={
          <CrudForm
            fields={[
              {
                label: "Başlık",
                value: bottomForm.label,
                onChange: (v) => setBottomForm((f) => ({ ...f, label: v })),
              },
              {
                label: "Link",
                value: bottomForm.href,
                onChange: (v) => setBottomForm((f) => ({ ...f, href: v })),
              },
              {
                label: "Sıra",
                value: String(bottomForm.order),
                onChange: (v) =>
                  setBottomForm((f) => ({ ...f, order: Number(v) })),
              },
            ]}
            isActive={bottomForm.isActive}
            setIsActive={(v) => setBottomForm((f) => ({ ...f, isActive: v }))}
            onSave={saveBottomLink}
            onCancel={() => {
              setBottomForm(emptyBottomLink);
              setEditingBottomId(null);
            }}
            editing={!!editingBottomId}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        }
      >
        {form.bottomLinks.map((item) => (
          <CrudItem
            key={item.id}
            title={item.label}
            subtitle={item.href}
            meta={`Sıra: ${item.order}`}
            active={item.isActive}
            onEdit={() => {
              setBottomForm(item);
              setEditingBottomId(item.id || null);
            }}
            onDelete={async () => {
              if (!item.id) return;
              await api.delete(
                `/api/site-footer/admin/bottom-links/${item.id}`,
              );
              await loadFooter();
            }}
          />
        ))}
      </ListPanel>
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

function ListPanel({
  title,
  form,
  children,
}: {
  title: string;
  form: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Panel title={title}>
      {form}
      <div className="mt-6 space-y-3">{children}</div>
    </Panel>
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
  setForm: React.Dispatch<React.SetStateAction<SiteFooter>>;
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

function CrudForm({
  fields,
  isActive,
  setIsActive,
  onSave,
  onCancel,
  editing,
  inputClassName,
  labelClassName,
}: {
  fields: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }[];
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  editing: boolean;
  inputClassName: string;
  labelClassName: string;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {fields.map((field) => (
          <InputField
            key={field.label}
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        ))}
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-bold text-[#2c1a0e]">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-5 w-5 accent-[#7a3b1e]"
        />
        Aktif
      </label>

      <div className="mt-5 flex gap-3">
        <button
          onClick={onSave}
          className="rounded-full bg-[#524528] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {editing ? "Güncelle" : "Ekle"}
          </span>
        </button>

        {editing && (
          <button
            onClick={onCancel}
            className="rounded-full border border-[#bc7b56] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#6b3f18]"
          >
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              İptal
            </span>
          </button>
        )}
      </div>
    </>
  );
}

function CrudItem({
  title,
  subtitle,
  meta,
  active,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  meta: string;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-4 md:flex-row md:items-center">
      <div className="flex-1">
        <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
          {title}
        </h3>

        <p className="mt-1 break-all text-sm text-[#5e4734]/70">{subtitle}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#efe3cf] px-3 py-1 text-xs font-bold text-[#7a3b1e]">
            {meta}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              active
                ? "bg-[#dcebd4] text-[#476f3c]"
                : "bg-[#f4dfdc] text-[#8f2f2f]"
            }`}
          >
            {active ? "Aktif" : "Pasif"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-full border border-[#3d77c4]/30 bg-[#edf4ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#315f9a]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Düzenle
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Sil
        </button>
      </div>
    </div>
  );
}
