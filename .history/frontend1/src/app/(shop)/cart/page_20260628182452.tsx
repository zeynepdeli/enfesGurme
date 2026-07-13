"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCart();

  const productIds = items.map((item) => item.productId);

  const { data: products, isLoading } = useQuery({
    queryKey: ["cart-products", productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];

      const response = await api.get<Product[]>("/api/products");
      const allProducts = response.data || [];

      return allProducts.filter((p) => productIds.includes(p.id));
    },
    enabled: productIds.length > 0,
  });

  // Toplam hesaplama
  const summary = useMemo(() => {
    if (!products) return { subtotal: 0, total: 0, itemCount: 0 };

    const subtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      total: subtotal, // Şimdilik kargo vs yok
      itemCount,
    };
  }, [items, products]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    if (confirm("Bu ürünü sepetten çıkarmak istediğinizden emin misiniz?")) {
      removeItem(productId);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Sepet yükleniyor..." fullScreen />;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon="🛒"
          title="Sepetiniz boş"
          description="Alışverişe başlamak için ürünleri inceleyin"
          action={{
            label: "Ürünleri Gör",
            onClick: () => router.push("/products"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Sepetim ({summary.itemCount} ürün)
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sol: Ürün Listesi */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = products?.find((p) => p.id === item.productId);

            if (!product) return null;

            return (
              <div
                key={item.productId}
                className="bg-white p-4 rounded-lg border"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.category?.name}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-primary">
                        {product.price} TL
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between">
                    <p className="text-xl font-bold text-primary">
                      {(product.price * item.quantity).toFixed(2)} TL
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemove(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sağ: Sipariş Özeti */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border sticky top-4">
            <h2 className="text-xl font-bold mb-6">Sipariş Özeti</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span className="font-medium">
                  {summary.subtotal.toFixed(2)} TL
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kargo</span>
                <span className="font-medium text-green-600">Ücretsiz</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Toplam</span>
                  <span className="text-2xl font-bold text-primary">
                    {summary.total.toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => router.push("/checkout")}
            >
              Sipariş Ver
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Güvenli ödeme ile alışverişinizi tamamlayın
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
