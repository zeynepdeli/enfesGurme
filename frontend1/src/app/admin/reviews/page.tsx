"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  MessageSquare,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";

type HomeReviewCard = {
  id?: number;
  name: string;
  rating: number;
  comment: string;
  userImage?: string;
  productImage: string;
  order: number;
  isActive: boolean;
};

type ReviewSection = {
  title: string;
  description: string;
  backgroundImage: string;
  cardTexture: string;
  frameImage: string;
  cards: HomeReviewCard[];
};

type SectionImageField = "backgroundImage" | "cardTexture" | "frameImage";
type CardImageField = "userImage" | "productImage";

const emptySection: ReviewSection = {
  title: "Müşterilerimizin Kalbinden",
  description:
    "Anadolu'nun eşsiz lezzetlerini deneyimleyen müşterilerimizin gerçek yorumları ve samimi paylaşımları.",
  backgroundImage: "/duvarBg.png",
  cardTexture: "/cardDuvar.png",
  frameImage: "/hakiCerceve.png",
  cards: [],
};

const emptyCard: HomeReviewCard = {
  name: "",
  rating: 5,
  comment: "",
  userImage: "",
  productImage: "",
  order: 0,
  isActive: true,
};

export default function ReviewsAdminPage() {
  const [form, setForm] = useState<ReviewSection>(emptySection);
  const [cardForm, setCardForm] = useState<HomeReviewCard>(emptyCard);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingCard, setSavingCard] = useState(false);

  const [uploadingSectionField, setUploadingSectionField] =
    useState<SectionImageField | null>(null);
  const [uploadingCardField, setUploadingCardField] =
    useState<CardImageField | null>(null);

  const sectionFileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const cardFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const inputClassName =
    "h-11 w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

  const textareaClassName =
    "w-full rounded-md border border-[#d0bc90] bg-[#fff5ea]/70 px-4 py-3 text-sm text-[#2c1a0e] outline-none placeholder:text-[#5e4734]/45 focus:border-[#bc7b56]";

  const labelClassName =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get<ReviewSection>("/api/reviews-section/admin");
      setForm(res.data || emptySection);
    } catch (error) {
      console.error("Reviews load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await api.upload<{ url: string }>("/api/upload", fd);
    return res.data?.url;
  };

  const handleSectionImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: SectionImageField,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingSectionField(field);

      const imageUrl = await uploadImage(file);
      if (!imageUrl) return;

      setForm((prev) => ({
        ...prev,
        [field]: imageUrl,
      }));
    } catch (error) {
      console.error("Section image upload error:", error);
    } finally {
      setUploadingSectionField(null);
      if (sectionFileRefs.current[field]) {
        sectionFileRefs.current[field]!.value = "";
      }
    }
  };

  const handleCardImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: CardImageField,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCardField(field);

      const imageUrl = await uploadImage(file);
      if (!imageUrl) return;

      setCardForm((prev) => ({
        ...prev,
        [field]: imageUrl,
      }));
    } catch (error) {
      console.error("Card image upload error:", error);
    } finally {
      setUploadingCardField(null);
      if (cardFileRefs.current[field]) {
        cardFileRefs.current[field]!.value = "";
      }
    }
  };

  const handleSaveSection = async () => {
    try {
      setSavingSection(true);

      const { cards, ...payload } = form;

      await api.put("/api/reviews-section/admin", payload);
      await loadReviews();
    } catch (error) {
      console.error("Review section save error:", error);
    } finally {
      setSavingSection(false);
    }
  };

  const handleSaveCard = async () => {
    if (!cardForm.name || !cardForm.comment || !cardForm.productImage) return;

    try {
      setSavingCard(true);

      if (editingId) {
        await api.put(`/api/reviews-section/cards/${editingId}`, cardForm);
      } else {
        await api.post("/api/reviews-section/cards", cardForm);
      }

      setCardForm(emptyCard);
      setEditingId(null);
      await loadReviews();
    } catch (error) {
      console.error("Review card save error:", error);
    } finally {
      setSavingCard(false);
    }
  };

  const handleEditCard = (card: HomeReviewCard) => {
    setCardForm({
      name: card.name,
      rating: card.rating,
      comment: card.comment,
      userImage: card.userImage || "",
      productImage: card.productImage,
      order: card.order,
      isActive: card.isActive,
    });

    setEditingId(card.id || null);
  };

  const handleDeleteCard = async (id?: number) => {
    if (!id) return;
    if (!confirm("Yorum kartı silinsin mi?")) return;

    await api.delete(`/api/reviews-section/cards/${id}`);
    await loadReviews();
  };

  const handleCancelEdit = () => {
    setCardForm(emptyCard);
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
            <MessageSquare size={22} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
              Yönetim Paneli
            </span>

            <h1 className="mt-1 font-serif text-4xl font-black italic text-[#2c1a0e]">
              Müşteri Yorumları
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
          Ana sayfadaki yorumlar bölümünün başlığını, açıklamasını, görsellerini
          ve yorum kartlarını buradan yönetebilirsiniz.
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

          <SectionImageInput
            label="Background Image"
            field="backgroundImage"
            value={form.backgroundImage}
            setForm={setForm}
            uploadImage={handleSectionImageUpload}
            fileRefs={sectionFileRefs}
            uploadingField={uploadingSectionField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <SectionImageInput
            label="Card Texture"
            field="cardTexture"
            value={form.cardTexture}
            setForm={setForm}
            uploadImage={handleSectionImageUpload}
            fileRefs={sectionFileRefs}
            uploadingField={uploadingSectionField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <SectionImageInput
            label="Frame Image"
            field="frameImage"
            value={form.frameImage}
            setForm={setForm}
            uploadImage={handleSectionImageUpload}
            fileRefs={sectionFileRefs}
            uploadingField={uploadingSectionField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>

        <button
          onClick={handleSaveSection}
          disabled={savingSection}
          className="mt-8 rounded-full bg-[#524528] px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
        >
          {savingSection ? (
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

      <Panel title={editingId ? "Yorum Kartı Düzenle" : "Yeni Yorum Kartı"}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Ad Soyad"
            value={cardForm.name}
            onChange={(v) => setCardForm((f) => ({ ...f, name: v }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Puan"
            type="number"
            value={String(cardForm.rating)}
            onChange={(v) =>
              setCardForm((f) => ({
                ...f,
                rating: Math.min(5, Math.max(1, Number(v))),
              }))
            }
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <InputField
            label="Sıra"
            type="number"
            value={String(cardForm.order)}
            onChange={(v) => setCardForm((f) => ({ ...f, order: Number(v) }))}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <label className="flex cursor-pointer items-center gap-2 self-end pb-2 text-sm font-bold text-[#2c1a0e]">
            <input
              type="checkbox"
              checked={cardForm.isActive}
              onChange={(e) =>
                setCardForm((f) => ({
                  ...f,
                  isActive: e.target.checked,
                }))
              }
              className="h-5 w-5 accent-[#7a3b1e]"
            />
            Aktif
          </label>

          <div className="md:col-span-2">
            <TextareaField
              label="Yorum"
              value={cardForm.comment}
              onChange={(v) => setCardForm((f) => ({ ...f, comment: v }))}
              textareaClassName={textareaClassName}
              labelClassName={labelClassName}
            />
          </div>

          <CardImageInput
            label="Profil Fotoğrafı"
            field="userImage"
            value={cardForm.userImage || ""}
            setCardForm={setCardForm}
            uploadImage={handleCardImageUpload}
            fileRefs={cardFileRefs}
            uploadingField={uploadingCardField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />

          <CardImageInput
            label="Ürün Fotoğrafı *"
            field="productImage"
            value={cardForm.productImage}
            setCardForm={setCardForm}
            uploadImage={handleCardImageUpload}
            fileRefs={cardFileRefs}
            uploadingField={uploadingCardField}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-[#3d3020]/10 pt-5">
          <button
            onClick={handleSaveCard}
            disabled={
              savingCard ||
              !cardForm.name ||
              !cardForm.comment ||
              !cardForm.productImage
            }
            className="rounded-full bg-[#524528] px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#e8dcc0] transition hover:brightness-110 disabled:opacity-60"
          >
            {savingCard ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Kaydediliyor
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {editingId ? "Güncelle" : "Yorum Kartı Ekle"}
              </span>
            )}
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
      </Panel>

      <Panel title="Yorum Kartları">
        <div className="space-y-3">
          {form.cards.length === 0 && (
            <div className="rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-8 text-center text-sm text-[#5e4734]/70">
              Henüz yorum kartı eklenmemiş.
            </div>
          )}

          {form.cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col gap-4 rounded-[18px] border border-[#d0bc90] bg-[#fff5ea]/50 p-4 lg:flex-row lg:items-center"
            >
              <div className="flex items-center gap-4">
                <PreviewImage src={card.userImage} label={card.name} round />
                <PreviewImage src={card.productImage} label={card.name} />
              </div>

              <div className="flex-1">
                <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                  {card.name}
                </h3>

                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className="text-[#d29a34]"
                      fill={i < card.rating ? "#d29a34" : "transparent"}
                    />
                  ))}
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5e4734]/70">
                  {card.comment}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#efe3cf] px-3 py-1 text-xs font-bold text-[#7a3b1e]">
                    Sıra: {card.order}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      card.isActive
                        ? "bg-[#dcebd4] text-[#476f3c]"
                        : "bg-[#f4dfdc] text-[#8f2f2f]"
                    }`}
                  >
                    {card.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEditCard(card)}
                  className="flex items-center gap-2 rounded-full border border-[#3d77c4]/30 bg-[#edf4ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#315f9a]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </button>

                <button
                  onClick={() => handleDeleteCard(card.id)}
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClassName: string;
  labelClassName: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClassName}>{label}</label>
      <input
        type={type}
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

function SectionImageInput({
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
  field: SectionImageField;
  value: string;
  setForm: React.Dispatch<React.SetStateAction<ReviewSection>>;
  uploadImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: SectionImageField,
  ) => Promise<void>;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  uploadingField: SectionImageField | null;
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

function CardImageInput({
  label,
  field,
  value,
  setCardForm,
  uploadImage,
  fileRefs,
  uploadingField,
  inputClassName,
  labelClassName,
}: {
  label: string;
  field: CardImageField;
  value: string;
  setCardForm: React.Dispatch<React.SetStateAction<HomeReviewCard>>;
  uploadImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: CardImageField,
  ) => Promise<void>;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  uploadingField: CardImageField | null;
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
            setCardForm((f) => ({
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

function PreviewImage({
  src,
  label,
  round = false,
}: {
  src?: string;
  label: string;
  round?: boolean;
}) {
  return (
    <div
      className={`relative h-16 w-16 shrink-0 overflow-hidden border border-[#d0bc90] bg-[#efe3cf] ${
        round ? "rounded-full" : "rounded-[14px]"
      }`}
    >
      {src ? (
        <Image src={src} alt={label} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#7a3b1e]">
          Yok
        </div>
      )}
    </div>
  );
}
