"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/types";
import { useUserMutations } from "@/hooks/use-user-mutations";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { CrudPageLayout } from "@/components/admin/shared/layouts/crud-page-layout";
import { DataTable } from "@/components/admin/shared/data-display/data-table";
import { UserDetailModal } from "@/components/admin/users/user-detail-modal";
import {
  UserFilters,
  UserFilterValues,
} from "@/components/admin/users/user-filters";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Mail, Calendar, ShoppingCart, MapPin, Eye } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilterValues>({
    search: "",
    role: "all",
    startDate: "",
    endDate: "",
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<User[]>("/api/users/admin/all");
      return response.data || [];
    },
  });

  const { updateRole } = useUserMutations();

  // Client-side filtreleme
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // İsim veya email arama
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(searchLower);
        const matchesEmail = user.email.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesEmail) return false;
      }

      // Rol filtresi
      if (filters.role !== "all" && user.role !== filters.role) {
        return false;
      }

      // Başlangıç tarihi
      if (filters.startDate) {
        const userDate = new Date(user.createdAt);
        const startDate = new Date(filters.startDate);
        if (userDate < startDate) return false;
      }

      // Bitiş tarihi
      if (filters.endDate) {
        const userDate = new Date(user.createdAt);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (userDate > endDate) return false;
      }

      return true;
    });
  }, [users, filters]);

  const handleRoleChange = (userId: string, newRole: "USER" | "ADMIN") => {
    if (confirm("Kullanıcı rolünü değiştirmek istediğinizden emin misiniz?")) {
      updateRole({ id: userId, role: newRole });
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUserId(user.id);
    setIsModalOpen(true);
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" => {
    return role === "ADMIN" ? "default" : "secondary";
  };

  const columns = [
    {
      key: "user",
      label: "Kullanıcı",
      width: "30%",
      render: (user: User) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rol",
      width: "15%",
      render: (user: User) => (
        <Select
          value={user.role}
          onValueChange={(value: "USER" | "ADMIN") =>
            handleRoleChange(user.id, value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "orders",
      label: "Siparişler",
      width: "15%",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{user._count?.orders || 0}</span>
        </div>
      ),
    },
    {
      key: "addresses",
      label: "Adresler",
      width: "15%",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{user._count?.addresses || 0}</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Kayıt Tarihi",
      width: "15%",
      render: (user: User) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            {format(new Date(user.createdAt), "dd MMM yyyy", { locale: tr })}
          </div>
        </div>
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
    return <LoadingSpinner text="Kullanıcılar yükleniyor..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <CrudPageLayout
        title="Kullanıcılar"
        description="Kayıtlı kullanıcıları görüntüleyin ve yönetin"
      >
        {/* Filtreleme */}
        <UserFilters onFilterChange={setFilters} />

        {/* Sonuç Sayısı */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredUsers.length} kullanıcı bulundu
          </p>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredUsers}
          columns={columns}
          actions={actions}
          emptyState={{
            icon: <Users className="h-16 w-16 text-muted-foreground" />,
            title: "Kullanıcı bulunamadı",
            description: "Filtreleri değiştirmeyi deneyin",
          }}
        />
      </CrudPageLayout>

      {/* User Detail Modal */}
      <UserDetailModal
        userId={selectedUserId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
