"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * /categories/[id] artık kullanılmıyor.
 * Gelen kategori ID'sini query param'a çevirip /products'a yönlendirir.
 * Böylece eski linkler bozulmaz.
 */
export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      router.replace(`/products?category=${id}`);
    } else {
      router.replace("/products");
    }
  }, [id, router]);

  return null;
}
