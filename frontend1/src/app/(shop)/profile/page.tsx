"use client";

import { useEffect, useState } from "react";
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

type Tab = "profile" | "orders";

const DEFAULT_SETTINGS: ProfilePageSetting = {
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function FieldRow({
  icon,
  label,
  value,
  editing,
  placeholder,
  unknownText,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  placeholder?: string;
  unknownText: string;
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
          className="w-full rounded-xl border border-[#3d3020]/10 bg-[#f3eae0] px-4 py-2.5 text-[13px] text-[#3d3020] outline-none transition placeholder:text-[#3d3020]/30 focus:border-[#9c5732]/40"
        />
      ) : (
        <p className="px-1 text-[13px] text-[#3d3020]/70">
          {value || (
            <span className="italic text-[#3d3020]/30">{unknownText}</span>
          )}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const { data: settingsData } = useQuery({
    queryKey: ["profile-page-settings"],
    queryFn: async () => {
      const res = await api.get<ProfilePageSetting>("/api/profile-page");
      return res.data;
    },
  });

  const settings: ProfilePageSetting = {
    ...DEFAULT_SETTINGS,
    ...(settingsData || {}),
  };

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get<UserProfile>("/api/users/profile");

      if (!res.data) {
        throw new Error("Profil bulunamadı.");
      }

      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get<Order[]>("/api/orders");
      return res.data || [];
    },
    enabled: activeTab === "orders",
  });

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

  const STATUS_MAP: Record<
    Order["status"],
    { label: string; color: string; bg: string }
  > = {
    pending: {
      label: settings.pendingText,
      color: "text-amber-700",
      bg: "bg-amber-100",
    },
    processing: {
      label: settings.processingText,
      color: "text-blue-700",
      bg: "bg-blue-100",
    },
    shipped: {
      label: settings.shippedText,
      color: "text-purple-700",
      bg: "bg-purple-100",
    },
    delivered: {
      label: settings.deliveredText,
      color: "text-green-700",
      bg: "bg-green-100",
    },
    cancelled: {
      label: settings.cancelledText,
      color: "text-red-700",
      bg: "bg-red-100",
    },
  };

  if (profileLoading) {
    return <LoadingSpinner text="Profil Yükleniyor..." fullScreen />;
  }

  if (profileError || !profile) {
    return (
      <div className="p-20 text-center">
        <ErrorMessage message="Profil yüklenemedi." />
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-36 md:px-10 lg:px-14 xl:px-20 2xl:px-28"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {settings.backgroundImage && (
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.12] mix-blend-multiply">
          <Image
            src={settings.backgroundImage}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_18%,rgba(255,248,230,0.82)_0%,rgba(246,239,221,0.52)_48%,rgba(225,205,165,0.24)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1680px] space-y-6">
        <div
          className="overflow-hidden rounded-[2rem] bg-cover bg-center shadow-xl"
          style={{
            backgroundImage: `url('${settings.cardBgImage}')`,
          }}
        >
          <div className="relative h-28 overflow-hidden bg-[#c49a52] sm:h-32 lg:h-36 xl:h-40 2xl:h-44">
            <div className="absolute inset-0 opacity-25">
              <Image
                src={settings.bannerImage || settings.backgroundImage}
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.12] mix-blend-soft-light"
              style={{
                backgroundImage: `url('${settings.textureImage}')`,
              }}
            />

            <div className="absolute bottom-0 left-6 select-none [writing-mode:vertical-rl] rotate-180 text-[7px] font-black uppercase tracking-[0.4em] text-white/25">
              {settings.bannerText}
            </div>
          </div>

          <div className="px-6 pb-7 sm:px-8 lg:px-10 xl:px-12">
            <div className="-mt-10 mb-5 flex items-end justify-between sm:-mt-12 xl:-mt-14">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#efe6d6] bg-[#9c5732] shadow-lg sm:h-24 sm:w-24 xl:h-28 xl:w-28">
                <span className="text-2xl font-black uppercase text-white sm:text-3xl xl:text-4xl">
                  {profile.name?.charAt(0) ?? "U"}
                </span>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#9c5732] transition-colors hover:text-[#3d3020]"
              >
                <LogOut size={13} />
                {settings.logoutText}
              </button>
            </div>

            <div>
              <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-[#3d3020] sm:text-3xl xl:text-4xl 2xl:text-5xl">
                {profile.name}
              </h1>

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a67c3d]">
                {profile.role === "admin" ? "⭐ Admin" : "Üye"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: "profile", label: settings.profileTabText, icon: User },
            { key: "orders", label: settings.ordersTabText, icon: Package },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
                activeTab === key
                  ? "bg-[#9c5732] text-white shadow-lg shadow-[#9c5732]/25"
                  : "bg-[#efe6d6] text-[#3d3020]/50 hover:text-[#3d3020]"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div
            className="space-y-6 rounded-[2rem] bg-cover bg-center p-6 shadow-xl sm:p-8 lg:p-10 xl:p-12 2xl:p-14"
            style={{
              backgroundImage: `linear-gradient(rgba(239,230,214,0.86),rgba(239,230,214,0.86)),url('${settings.cardBgImage}')`,
            }}
          >
            <div className="flex items-center justify-between border-b border-[#3d3020]/10 pb-5">
              <h2 className="font-serif text-lg font-bold uppercase tracking-wide text-[#3d3020] sm:text-xl xl:text-2xl">
                {settings.profileTitle}
              </h2>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#9c5732] transition-colors hover:text-[#3d3020]"
                >
                  <Edit2 size={12} />
                  {settings.editText}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#3d3020]/40 transition-colors hover:text-[#3d3020]"
                  >
                    <X size={12} />
                    {settings.cancelText}
                  </button>

                  <button
                    onClick={() => updateMutation.mutate(form)}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-1.5 rounded-full bg-[#9c5732] px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-[#3d3020] disabled:opacity-50"
                  >
                    <Check size={12} />
                    {updateMutation.isPending
                      ? "Kaydediliyor..."
                      : settings.saveText}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
              <FieldRow
                icon={<User size={14} />}
                label={settings.nameLabel}
                value={form.name}
                editing={isEditing}
                unknownText={settings.unknownText}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              />

              <FieldRow
                icon={<Mail size={14} />}
                label={settings.emailLabel}
                value={profile.email}
                editing={false}
                unknownText={settings.unknownText}
              />

              <FieldRow
                icon={<Phone size={14} />}
                label={settings.phoneLabel}
                value={form.phone}
                placeholder="05XX XXX XX XX"
                editing={isEditing}
                unknownText={settings.unknownText}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              />

              <FieldRow
                icon={<Clock size={14} />}
                label={settings.dateLabel}
                value={formatDate(profile.createdAt)}
                editing={false}
                unknownText={settings.unknownText}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-[#3d3020]/40">
                <MapPin size={12} className="text-[#9c5732]" />
                {settings.addressLabel}
              </div>

              {isEditing ? (
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="Adresinizi girin..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#3d3020]/10 bg-[#f3eae0] px-4 py-3 text-[13px] text-[#3d3020] outline-none transition placeholder:text-[#3d3020]/30 focus:border-[#9c5732]/40"
                />
              ) : (
                <p className="px-1 text-[13px] leading-relaxed text-[#3d3020]/70">
                  {profile.address || (
                    <span className="italic text-[#3d3020]/30">
                      {settings.addressEmpty}
                    </span>
                  )}
                </p>
              )}
            </div>

            {updateMutation.isError && (
              <p className="text-xs font-semibold text-red-500">
                Güncelleme başarısız, lütfen tekrar deneyin.
              </p>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-5">
            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner text="Siparişler yükleniyor..." />
              </div>
            ) : !orders || orders.length === 0 ? (
              <div
                className="rounded-[2rem] p-14 text-center shadow-xl"
                style={{
                  backgroundImage: `linear-gradient(rgba(239,230,214,.92),rgba(239,230,214,.92)),url('${settings.cardBgImage}')`,
                }}
              >
                <Package size={42} className="mx-auto mb-5 text-[#3d3020]/20" />

                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#3d3020]/40">
                  {settings.noOrdersText}
                </p>

                <Link
                  href="/products"
                  className="mt-7 inline-flex rounded-full bg-[#9c5732] px-7 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#3d3020]"
                >
                  {settings.startShoppingText}
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const status = STATUS_MAP[order.status];

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-[2rem] shadow-xl"
                    style={{
                      backgroundImage: `linear-gradient(rgba(239,230,214,.94),rgba(239,230,214,.94)),url('${settings.cardBgImage}')`,
                    }}
                  >
                    {/* HEADER */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3d3020]/10 px-6 py-5 xl:px-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3d3020]/40">
                          Sipariş #{order.id.slice(-6).toUpperCase()}
                        </p>

                        <p className="mt-1 text-[13px] text-[#3d3020]/55">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </span>

                        <ChevronRight size={16} className="text-[#3d3020]/30" />
                      </div>
                    </div>

                    {/* ITEMS */}

                    <div className="space-y-3 px-6 py-6 xl:px-8">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9c5732]/10">
                              <Package size={17} className="text-[#9c5732]" />
                            </div>

                            <div>
                              <p className="text-[14px] font-semibold text-[#3d3020]">
                                {item.name}
                              </p>

                              <p className="text-[12px] text-[#3d3020]/50">
                                {item.quantity} Adet
                              </p>
                            </div>
                          </div>

                          <span className="font-bold text-[#3d3020]">
                            {(item.quantity * item.price).toLocaleString(
                              "tr-TR",
                            )}
                            ₺
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* FOOTER */}

                    <div className="flex items-center justify-between bg-[#f3eae0]/80 px-6 py-5 xl:px-8">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3d3020]/45">
                        {settings.totalText}
                      </span>

                      <span className="font-serif text-2xl font-black text-[#a67c3d]">
                        {order.total.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
