"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, ShoppingCart, Minus, Plus, Check } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get<Product>(`/api/products/${id}`);
      return response.data;
    },
  });

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem(product.id);
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return <LoadingSpinner text="Ürün yükleniyor..." fullScreen />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage message={error?.message || "Ürün bulunamadı"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-32 w-32 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm text-primary font-medium mb-2">
            {product.category?.name || "Genel"}
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <span className="text-4xl font-bold text-primary">
              {product.price} TL
            </span>
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-green-600 font-medium">
                ✓ Stokta var ({product.stock} adet)
              </p>
            ) : (
              <p className="text-red-600 font-medium">✗ Stokta yok</p>
            )}
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Miktar</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-20 text-center"
                  min={1}
                  max={product.stock}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full gap-2"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <>
                  <Check className="h-5 w-5" />
                  Sepete Eklendi!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Sepete Ekle ({quantity} adet)
                </>
              )}
            </Button>

            {isAdded && (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/cart")}
              >
                Sepete Git
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
