"use client";

import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface LowStockAlertProps {
  products: Product[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Düşük Stok Uyarıları
          </CardTitle>
          <CardDescription>Stoku azalan ürünler</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Düşük stoklu ürün yok
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Düşük Stok Uyarıları
        </CardTitle>
        <CardDescription>Stoku 10'un altında olan ürünler</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
            >
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {product.category?.name}
                </div>
              </div>
              <Badge variant="destructive">{product.stock} adet</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
