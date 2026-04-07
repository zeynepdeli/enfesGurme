"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { useOrderMutations } from "@/hooks/use-order-mutations";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { CrudPageLayout } from "@/components/admin/shared/layouts/crud-page-layout";
import { DataTable } from "@/components/admin/shared/data-display/data-table";
import { OrderDetailModal } from "@/components/admin/orders/order-detail-modal";
import {
  OrderFilters,
  OrderFilterValues,
} from "@/components/admin/orders/order-filters";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, User, MapPin, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilterValues>({
    search: "",
    status: "all",
    startDate: "",
    endDate: "",
  });

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get<Order[]>("/api/orders/admin/all");
      return response.data || [];
    },
  });

  const { updateStatus } = useOrderMutations();

  // Client-side filtreleme
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      // Müşteri arama (isim veya email)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = order.user?.name
          ?.toLowerCase()
          .includes(searchLower);
        const matchesEmail = order.user?.email
          ?.toLowerCase()
          .includes(searchLower);
        if (!matchesName && !matchesEmail) return false;
      }

      // Durum filtresi
      if (filters.status !== "all" && order.status !== filters.status) {
        return false;
      }

      // Başlangıç tarihi
      if (filters.startDate) {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(filters.startDate);
        if (orderDate < startDate) return false;
      }

      // Bitiş tarihi
      if (filters.endDate) {
        const orderDate = new Date(order.createdAt);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Günün sonuna ayarla
        if (orderDate > endDate) return false;
      }

      return true;
    });
  }, [orders, filters]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus({ id: orderId, status: newStatus });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusVariant = (
    status: OrderStatus,
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      PENDING: "Bekliyor",
      CONFIRMED: "Onaylandı",
      SHIPPED: "Kargoda",
      DELIVERED: "Teslim Edildi",
      CANCELLED: "İptal Edildi",
    };
    return labels[status];
  };

  const columns = [
    {
      key: "order",
      label: "Sipariş",
      width: "20%",
      render: (order: Order) => (
        <div>
          <div className="font-mono text-sm">{order.id.slice(0, 8)}...</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(order.createdAt), "dd MMM yyyy HH:mm", {
              locale: tr,
            })}
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "Müşteri",
      width: "20%",
      render: (order: Order) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {order.user?.name || "Bilinmiyor"}
          </div>
          <div className="text-xs text-muted-foreground">
            {order.user?.email}
          </div>
        </div>
      ),
    },
    {
      key: "address",
      label: "Adres",
      width: "20%",
      render: (order: Order) => (
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="text-sm">
            <div className="font-medium">{order.address.title}</div>
            <div className="text-muted-foreground">
              {order.address.city}, {order.address.district}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "items",
      label: "Ürünler",
      width: "10%",
      render: (order: Order) => (
        <div className="text-sm">
          <div className="font-medium">{order.items.length} ürün</div>
          <div className="text-xs text-muted-foreground">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} adet
          </div>
        </div>
      ),
    },
    {
      key: "total",
      label: "Toplam",
      width: "10%",
      render: (order: Order) => (
        <span className="font-bold text-green-600">
          {Number(order.total).toFixed(2)} TL
        </span>
      ),
    },
    {
      key: "status",
      label: "Durum",
      width: "20%",
      render: (order: Order) => (
        <Select
          value={order.status}
          onValueChange={(value: OrderStatus) =>
            handleStatusChange(order.id, value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <Badge variant={getStatusVariant(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Bekliyor</SelectItem>
            <SelectItem value="CONFIRMED">Onaylandı</SelectItem>
            <SelectItem value="SHIPPED">Kargoda</SelectItem>
            <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
            <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  const actions = [
    {
      label: "Detay",
      icon: <Eye className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: handleViewDetails,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="Siparişler yükleniyor..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <CrudPageLayout
        title="Siparişler"
        description="Tüm siparişleri görüntüleyin ve yönetin"
      >
        {/* Filtreleme */}
        <OrderFilters onFilterChange={setFilters} />

        {/* Sonuç Sayısı */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredOrders.length} sipariş bulundu
          </p>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredOrders}
          columns={columns}
          actions={actions}
          emptyState={{
            icon: <ShoppingCart className="h-16 w-16 text-muted-foreground" />,
            title: "Sipariş bulunamadı",
            description: "Filtreleri değiştirmeyi deneyin",
          }}
        />
      </CrudPageLayout>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
