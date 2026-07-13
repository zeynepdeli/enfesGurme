import { UseQueryResult } from "@tanstack/react-query";
import { LoadingSpinner } from "../shared/loading-spinner";
import { ErrorMessage } from "../shared/error-message";
import { EmptyState } from "../shared/empty-state";

interface QueryContainerProps<T> {
  query: UseQueryResult<T, Error>;
  loadingText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  children: (data: T) => React.ReactNode;
}

export function QueryContainer<T>({
  query,
  loadingText = "Yükleniyor...",
  emptyTitle = "Veri Bulunamadı",
  emptyDescription,
  emptyIcon,
  children,
}: QueryContainerProps<T>) {
  const { data, isLoading, error, refetch } = query;

  if (isLoading) {
    return <LoadingSpinner text={loadingText} />;
  }

  if (error) {
    return <ErrorMessage message={error.message} retry={refetch} />;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return <>{children(data)}</>;
}
