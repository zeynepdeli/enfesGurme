"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import {
  User,
  Package,
  LogOut,
  Edit2,
  Check,
  X,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Clock,
} from "lucide-react";

/* ===================== */
/* TYPES */
/* ===================== */
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
  createdAt: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
}

/* ===================== */
/* HELPERS */
/* ===================== */
const STATUS_MAP: Record<
  Order["status"],
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Beklemede", color: "text-amber-700", bg: "bg-amber-100" },
  processing: {
    label: "Hazırlanıyor",
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  shipped: { label: "Kargoda", color: "text-purple-700", bg: "bg-purple-100" },
  delivered: {
    label: "Teslim Edildi",
    color: "text-green-700",
    bg: "bg-green-100",
  },
  cancelled: { label: "İptal", color: "text-red-700", bg: "bg-red-100" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ===================== */
/* TAB TYPE */
/* ===================== */
type Tab = "profile" | "orders";

/* ===================== */
/* FIELD ROW */
/* ===================== */
function FieldRow({
  icon,
  label,
  value,
  editing,
  placeholder,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  placeholder?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-[#3d3020]/40">
        <span className="text-[#9c5732]">{icon}</span>
        {label}
      </div>
      {editing && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#f3eae0] border border-[#3d3020]/10 rounded-xl px-4 py-2.5 text-[13px] text-[#3d3020] placeholder:text-[#3d3020]/30 outline-none focus:border-[#9c5732]/40 transition"
        />
      ) : (
        <p className="text-[13px] text-[#3d3020]/70 px-1">
          {value || (
            <span className="italic text-[#3d3020]/30">Belirtilmemiş</span>
          )}
        </p>
      )}
    </div>
  );
}

/* ===================== */
/* PAGE */
/* ===================== */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  /* ── Profil verisi ── */
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get<UserProfile>("/api/users/profile");
      return res.data;
    },
  });

  // onSuccess yerine useEffect
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile]);

  /* ── Sipariş verisi ── */
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get<Order[]>("/api/orders");
      return res.data;
    },
    enabled: activeTab === "orders",
  });

  /* ── Güncelleme mutation ── */
  const updateMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await api.put("/api/users/profile", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
    },
  });

  if (profileLoading)
    return <LoadingSpinner text="Profil Yükleniyor..." fullScreen />;
  if (profileError || !profile)
    return (
      <div className="p-20 text-center">
        <ErrorMessage message="Profil yüklenemedi." />
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#f3eae0] pt-36 pb-20 px-4 md:px-10 overflow-hidden">
      {/* Arka plan doku */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <Image src="/duvarBg.png" alt="" fill className="object-cover" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* ─── KULLANICI BANNER ─── */}
        <div className="bg-[#efe6d6] rounded-[2rem] border border-[#3d3020]/5 shadow-xl overflow-hidden">
          {/* Üst amber şerit */}
          <div className="h-24 bg-[#c49a52] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <Image src="/duvarBg.png" alt="" fill className="object-cover" />
            </div>
            <div className="absolute left-6 bottom-0 [writing-mode:vertical-rl] rotate-180 text-[7px] font-black tracking-[0.4em] text-white/25 uppercase select-none">
              Anatolia Harvest Heritage
            </div>
          </div>

          {/* Avatar + bilgi */}
          <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-[#9c5732] border-4 border-[#efe6d6] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white uppercase">
                  {profile.name?.charAt(0) ?? "U"}
                </span>
              </div>

              {/* Çıkış yap */}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#9c5732] hover:text-[#3d3020] transition-colors"
              >
                <LogOut size={13} />
                Çıkış Yap
              </button>
            </div>

            <div>
              <h1
                className="text-2xl font-bold text-[#3d3020] uppercase tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {profile.name}
              </h1>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a67c3d]">
                {profile.role === "admin" ? "⭐ Admin" : "Üye"}
              </span>
            </div>
          </div>
        </div>

        {/* ─── SEKMELER ─── */}
        <div className="flex gap-2">
          {(
            [
              { key: "profile", label: "Profilim", icon: User },
              { key: "orders", label: "Siparişlerim", icon: Package },
            ] as { key: Tab; label: string; icon: React.ElementType }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
                activeTab === key
                  ? "bg-[#9c5732] text-white shadow-lg shadow-[#9c5732]/25"
                  : "bg-[#efe6d6] text-[#3d3020]/50 hover:text-[#3d3020] border border-[#3d3020]/10"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ─── PROFİL SEKMESİ ─── */}
        {activeTab === "profile" && (
          <div className="bg-[#efe6d6] rounded-[2rem] border border-[#3d3020]/5 shadow-xl p-8 space-y-6">
            {/* Başlık + Düzenle */}
            <div className="flex items-center justify-between border-b border-[#3d3020]/10 pb-5">
              <h2
                className="text-lg font-bold text-[#3d3020] uppercase tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Kişisel Bilgiler
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#9c5732] hover:text-[#3d3020] transition-colors"
                >
                  <Edit2 size={12} />
                  Düzenle
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#3d3020]/40 hover:text-[#3d3020] transition-colors"
                  >
                    <X size={12} />
                    İptal
                  </button>
                  <button
                    onClick={() => updateMutation.mutate(form)}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white bg-[#9c5732] hover:bg-[#3d3020] px-4 py-2 rounded-full transition-all disabled:opacity-50"
                  >
                    <Check size={12} />
                    {updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              )}
            </div>

            {/* Alanlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldRow
                icon={<User size={14} />}
                label="Ad Soyad"
                value={form.name}
                editing={isEditing}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              />
              <FieldRow
                icon={<Mail size={14} />}
                label="E-posta"
                value={profile.email}
                editing={false}
              />
              <FieldRow
                icon={<Phone size={14} />}
                label="Telefon"
                value={form.phone}
                placeholder="05XX XXX XX XX"
                editing={isEditing}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              />
              <FieldRow
                icon={<Clock size={14} />}
                label="Üyelik Tarihi"
                value={formatDate(profile.createdAt)}
                editing={false}
              />
            </div>

            {/* Adres — tam genişlik */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-[#3d3020]/40">
                <MapPin size={12} className="text-[#9c5732]" />
                Teslimat Adresi
              </div>
              {isEditing ? (
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="Adresinizi girin..."
                  rows={3}
                  className="w-full bg-[#f3eae0] border border-[#3d3020]/10 rounded-xl px-4 py-3 text-[13px] text-[#3d3020] placeholder:text-[#3d3020]/30 outline-none focus:border-[#9c5732]/40 transition resize-none"
                />
              ) : (
                <p className="text-[13px] text-[#3d3020]/70 leading-relaxed px-1">
                  {profile.address || (
                    <span className="italic text-[#3d3020]/30">
                      Henüz adres eklenmemiş
                    </span>
                  )}
                </p>
              )}
            </div>

            {updateMutation.isError && (
              <p className="text-xs text-red-500 font-semibold">
                Güncelleme başarısız, lütfen tekrar deneyin.
              </p>
            )}
          </div>
        )}

        {/* ─── SİPARİŞLER SEKMESİ ─── */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner text="Siparişler yükleniyor..." />
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="bg-[#efe6d6] rounded-[2rem] border border-[#3d3020]/5 shadow-xl p-16 text-center space-y-3">
                <Package size={36} className="text-[#3d3020]/20 mx-auto" />
                <p className="text-sm font-bold text-[#3d3020]/40 uppercase tracking-widest">
                  Henüz siparişiniz yok
                </p>
                <Link
                  href="/products"
                  className="inline-block mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-[#9c5732] hover:bg-[#3d3020] px-6 py-3 rounded-full transition-all"
                >
                  Alışverişe Başla
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const status = STATUS_MAP[order.status];
                return (
                  <div
                    key={order.id}
                    className="bg-[#efe6d6] rounded-2xl border border-[#3d3020]/5 shadow-lg overflow-hidden"
                  >
                    {/* Sipariş başlığı */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#3d3020]/8">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3d3020]/40">
                          Sipariş #{order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-[#3d3020]/50">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <ChevronRight size={14} className="text-[#3d3020]/30" />
                      </div>
                    </div>

                    {/* Ürünler */}
                    <div className="px-6 py-4 space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[12px]"
                        >
                          <span className="text-[#3d3020]/70">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold text-[#3d3020]">
                            {(item.price * item.quantity).toLocaleString(
                              "tr-TR",
                            )}
                            ,00 ₺
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Toplam */}
                    <div className="flex items-center justify-between px-6 py-3 bg-[#f3eae0] border-t border-[#3d3020]/8">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#3d3020]/40">
                        Toplam
                      </span>
                      <span
                        className="text-base font-black text-[#a67c3d]"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {order.total.toLocaleString("tr-TR")},00 ₺
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
      `}</style>
    </div>
  );
}
