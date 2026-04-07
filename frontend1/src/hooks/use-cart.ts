import { clearCart } from "./../../../backend/src/controllers/cartController";
import { useCartStore } from "@/stores/cart.store";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // Toplam Ürün Sayısı
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
