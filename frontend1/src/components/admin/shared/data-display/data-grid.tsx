import { ReactNode } from "react";
import { CardGrid, GridColumn, GridAction } from "./card-grid";
import { DataTable, TableColumn, TableAction } from "./data-table";
import { EmptyStateCard } from "./empty-state-card";

interface EmptyState {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GridCols {
  default?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

interface DataGridProps<T> {
  data: T[];
  columns: GridColumn<T>[] | TableColumn<T>[];
  actions?: GridAction<T>[] | TableAction<T>[];
  layout?: "grid" | "table";
  emptyState?: EmptyState;
  gridCols?: GridCols;
}

export function DataGrid<T extends { id: string }>({
  data,
  columns,
  actions = [],
  layout = "grid",
  emptyState,
 gridCols,
}: DataGridProps<T>) {
  if (data.length === 0 && emptyState) {
    return <EmptyStateCard {...emptyState} />;
  }

  if (layout === "grid") {
    return (
      <CardGrid
        data={data}
        columns={columns as GridColumn<T>[]}
        actions={actions as GridAction<T>[]}
        gridCols={gridCols}
      />
    );
  }

  return (
    <DataTable
      data={data}
      columns={columns as TableColumn<T>[]}
      actions={actions as TableAction<T>[]}
    />
  );
}

export type { GridColumn, GridAction,GridCols, TableColumn, TableAction };
