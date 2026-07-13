"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { Address, Order } from "@/types";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AddressForm,
  AddressFormData,
} from "@/components/shop/checkout/address-form";
import {
  MapPin,
  Plus,
  ChevronRight,
  CheckCircle2,
  Loader2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const HEADER_HEIGHT = 116;
const SHIPPING = 250;

// Başında + olmayacak
const WHATSAPP_NUMBER = "905370221616";

function SidePanel() {
  return (
    <aside
      className="sticky hidden shrink-0 overflow-hidden px-4 py-6 lg:flex lg:w-[240px] lg:flex-col lg:justify-between"
      style={{
        top: HEADER_HEIGHT,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#efe3cb_0%,#e8dcc4_14%,#c9c29d_36%,#b7b08a_52%,#cec6a3_70%,#e7dbc3_88%,#efe3cb_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_34%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,248,236,0.18),transparent_38%)]" />

      <img
        src="/wo.png"
        alt=""
        className="absolute left-[8%] top-[-6%] w-[72%] opacity-[0.11] mix-blend-multiply"
      />

      <img
        src="/wo.png"
        alt=""
        className="absolute left-[25%] top-[42%] w-[62%] rotate-[10deg] opacity-[0.09] mix-blend-multiply"
      />
    </aside>
  );
}

export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { items } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get<Address[]>("/api/addresses");
      return res.data || [];
    },
  });

  const productIds = items.map((i) => i.productId);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products-by-ids", productIds],
    queryFn: async () => {
      const res = await api.get(`/api/products?ids=${productIds.join(",")}`);
      return res.data as Array<{ id: string; name: string; price: number }>;
    },
    enabled: productIds.length > 0,
  });

  const createAddress = useMutation({
    mutationFn: async (data: AddressFormData) => {
      const res = await api.post("/api/addresses", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsAddressDialogOpen(false);
    },
  });

  const selectedAddress = addresses?.find(
    (address) => address.id === selectedAddressId,
  );

  const cartWithDetails = items.map((item) => {
    const product = products?.find((p) => p.id === item.productId);

    return {
      ...item,
      name: product?.name ?? "Yükleniyor...",
      price: product?.price ?? 0,
    };
  });

  const subtotal = cartWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const total = subtotal + SHIPPING;

  const buildWhatsappMessage = (orderId: string) => {
    return `
Merhaba, sipariş vermek istiyorum.

Sipariş No: ${orderId}

Ürünler:
${cartWithDetails
  .map(
    (item) =>
      `- ${item.name} x${item.quantity} = ₺${(
        item.price * item.quantity
      ).toLocaleString("tr-TR")}`,
  )
  .join("\n")}

Ara Toplam: ₺${subtotal.toLocaleString("tr-TR")}
Kargo: ₺${SHIPPING.toLocaleString("tr-TR")}
Toplam: ₺${total.toLocaleString("tr-TR")}

Teslimat Bilgileri:
Ad Soyad: ${selectedAddress?.fullName || "-"}
Telefon: ${selectedAddress?.phone || "-"}
Adres: ${selectedAddress?.address || "-"}, ${selectedAddress?.district || "-"} / ${selectedAddress?.city || "-"}
`.trim();
  };

  const handleCompleteOrder = async () => {
    if (!selectedAddressId || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const orderRes = await api.post<Order>("/api/orders", {
        addressId: selectedAddressId,
        items,
      });

      if (!orderRes.data?.id) {
        throw new Error("Sipariş oluşturulamadı");
      }

      const orderId = orderRes.data.id;
      const message = buildWhatsappMessage(orderId);

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message,
      )}`;

      window.open(whatsappUrl, "_blank");

      router.push(`/orders/${orderId}/success`);
    } catch (error: any) {
      setErrorMessage(
        error?.message || "Bir hata oluştu, lütfen tekrar deneyin.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="relative min-h-screen overflow-hidden bg-[#f6efdd]"
        style={{ paddingTop: HEADER_HEIGHT }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-multiply">
          <img
            src="/heroB.png"
            alt=""
            className="fixed h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-116px)]">
          <SidePanel />

          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon="🛒"
              title="Sepetiniz boş"
              description="Sipariş vermek için önce sepete ürün ekleyin"
              action={{
                label: "Ürünlere Dön",
                onClick: () => router.push("/products"),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#f6efdd]"
      style={{ paddingTop: HEADER_HEIGHT }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-multiply">
        <img
          src="/heroB.png"
          alt=""
          className="fixed h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-116px)]">
        <SidePanel />

        <main className="flex-1 px-5 pb-24 pt-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1680px]">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a67c3d]">
              <span
                className="cursor-pointer transition hover:text-[#6b3f18]"
                onClick={() => router.push("/")}
              >
                Anasayfa
              </span>

              <ChevronRight size={12} />

              <span
                className="cursor-pointer transition hover:text-[#6b3f18]"
                onClick={() => router.push("/cart")}
              >
                Sepet
              </span>

              <ChevronRight size={12} />

              <span className="text-[#3d3020]/50">Sipariş Ver</span>
            </div>

            <div className="mb-10 border-b border-[#3d3020]/10 pb-6">
              <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e] md:text-5xl">
                Sipariş Ver
              </h1>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_380px] xl:gap-14">
              <section>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="font-serif text-2xl font-black italic text-[#2c1a0e]">
                    Teslimat Adresi
                  </h2>

                  <button
                    onClick={() => setIsAddressDialogOpen(true)}
                    className="flex items-center gap-1.5 rounded-full border border-[#bc7b56] bg-[#fff5ea]/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6b3f18] transition hover:bg-[#efe3cf]"
                  >
                    <Plus size={13} />
                    Yeni Adres
                  </button>
                </div>

                {addressesLoading ? (
                  <LoadingSpinner text="Adresler yükleniyor..." />
                ) : addresses && addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => {
                      const isSelected = selectedAddressId === address.id;

                      return (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`
                            relative cursor-pointer overflow-hidden rounded-[18px]
                            border p-6 transition-all
                            ${
                              isSelected
                                ? "border-[#d8bf8a] bg-[#efe6cf] shadow-[0_14px_26px_rgba(120,92,58,0.14)]"
                                : "border-[#d0bc90]/50 bg-[#efe6cf]/55 hover:bg-[#efe6cf]"
                            }
                          `}
                        >
                          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.96)_0%,_rgba(250,243,228,0.88)_44%,_rgba(246,236,214,0.72)_70%,_rgba(228,212,176,0.35)_100%)]" />
                          <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[14px] border border-[#d6c49a]/60" />

                          <div className="relative z-10 flex items-start gap-5">
                            <div
                              className="
                                flex h-11 w-11 shrink-0 items-center justify-center
                                overflow-hidden rounded-full bg-cover bg-center
                                text-[#2c1a0e]
                                shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
                              "
                              style={{
                                backgroundImage: "url('/bkrr.png')",
                              }}
                            >
                              {isSelected ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <MapPin size={20} />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="font-serif text-lg font-black text-[#2c1a0e]">
                                  {address.title}
                                </span>

                                {address.isDefault && (
                                  <span className="rounded-full bg-[#a67c3d]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#7a3b1e]">
                                    Varsayılan
                                  </span>
                                )}
                              </div>

                              <p className="text-sm font-medium text-[#5e4734]/75">
                                {address.fullName} · {address.phone}
                              </p>

                              <p className="mt-1 text-sm leading-relaxed text-[#5e4734]/65">
                                {address.address}, {address.district} /{" "}
                                {address.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-[20px] border border-dashed border-[#d0bc90] bg-[#efe6cf]/60 py-16 text-center">
                    <MapPin
                      className="mx-auto mb-3 text-[#a67c3d]/45"
                      size={32}
                    />

                    <p className="mb-4 text-sm text-[#3d3020]/55">
                      Henüz kayıtlı adresiniz yok
                    </p>

                    <button
                      onClick={() => setIsAddressDialogOpen(true)}
                      className="mx-auto flex items-center gap-1.5 rounded-full border border-[#bc7b56] bg-[#fff5ea]/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6b3f18] transition hover:bg-[#efe3cf]"
                    >
                      <Plus size={13} />
                      Adres Ekle
                    </button>
                  </div>
                )}
              </section>

              <aside>
                <div className="sticky top-36 overflow-hidden rounded-[20px] border border-[#d0bc90] bg-[#efe6cf] p-6 shadow-[0_14px_28px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]">
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />
                  <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[15px] border border-[#d6c49a]/70" />

                  <div className="relative z-10">
                    <h2 className="border-b border-[#3d3020]/10 pb-4 font-serif text-2xl font-black italic text-[#7a3b1e]">
                      Sipariş Özeti
                    </h2>

                    {productsLoading ? (
                      <LoadingSpinner text="Ürünler yükleniyor..." />
                    ) : (
                      <div className="mb-6 mt-6 space-y-3">
                        {cartWithDetails.map((item) => (
                          <div
                            key={item.productId}
                            className="flex justify-between gap-4 text-sm text-[#5e4734]"
                          >
                            <span>
                              {item.name}{" "}
                              <span className="text-[#3d3020]/40">
                                × {item.quantity}
                              </span>
                            </span>

                            <span className="shrink-0 font-bold text-[#2c1a0e]">
                              ₺
                              {(item.price * item.quantity).toLocaleString(
                                "tr-TR",
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3 border-t border-[#3d3020]/10 pt-4 text-sm">
                      <div className="flex justify-between text-[#5e4734]">
                        <span>Ara Toplam</span>
                        <span>₺{subtotal.toLocaleString("tr-TR")}</span>
                      </div>

                      <div className="flex justify-between text-[#5e4734]">
                        <span>Kargo</span>
                        <span>₺{SHIPPING.toLocaleString("tr-TR")}</span>
                      </div>

                      <div className="flex justify-between border-t border-[#3d3020]/10 pt-4 text-lg font-black text-[#2c1a0e]">
                        <span>Toplam</span>
                        <span className="text-[#7a3b1e]">
                          ₺{total.toLocaleString("tr-TR")}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`
                        mt-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold
                        ${
                          selectedAddressId
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-[#d8bf8a]/70 bg-[#efe3cf]/70 text-[#5e4734]"
                        }
                      `}
                    >
                      {selectedAddressId ? (
                        <>
                          <CheckCircle2 size={14} />
                          Teslimat adresi seçildi
                        </>
                      ) : (
                        <>
                          <MapPin size={14} />
                          Lütfen teslimat adresi seçin
                        </>
                      )}
                    </div>

                    {errorMessage && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      size="lg"
                      disabled={
                        !selectedAddressId || isProcessing || productsLoading
                      }
                      onClick={handleCompleteOrder}
                      className="mt-4 h-14 w-full overflow-hidden rounded-full border-2 border-transparent bg-transparent text-xs font-bold uppercase tracking-[0.18em] text-[#e8dcc0] shadow-none transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{
                        backgroundImage: `
                          linear-gradient(#524528, #524528),
                          linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
                        `,
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        boxShadow:
                          "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                      }}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          İşleniyor...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          WhatsApp ile Siparişi Tamamla
                          <MessageCircle size={16} />
                        </span>
                      )}
                    </Button>

                    <button
                      onClick={() => router.push("/cart")}
                      className="mt-4 w-full text-sm font-semibold text-[#6b3f18]/65 transition hover:text-[#6b3f18]"
                    >
                      ← Sepete dön
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-[#d0bc90] bg-[#f6efdd]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-black italic text-[#2c1a0e]">
              Yeni Adres Ekle
            </DialogTitle>
          </DialogHeader>

          <AddressForm
            onSubmit={(data) => createAddress.mutate(data)}
            onCancel={() => setIsAddressDialogOpen(false)}
            isLoading={createAddress.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
