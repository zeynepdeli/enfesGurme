import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "./empty-state-card";

export interface TableColumn<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  width?: string;
}

export interface TableAction<T> {
  label: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "ghost";
  onClick: (item: T) => void;
}

interface EmptyState {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  emptyState?: EmptyState;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions = [],
  emptyState,
}: DataTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <EmptyStateCard {...emptyState} />;
  }

  return (
    <div
      className="
        relative overflow-hidden rounded-[20px]
        border border-[#d0bc90]
        bg-[#efe6cf]
        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
      "
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[15px] border border-[#d6c49a]/70" />

      <div className="relative z-10 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#3d3020]/10 bg-[#efe3cf]/55">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="
                    px-6 py-4 text-left
                    text-[11px] font-bold uppercase tracking-[0.18em]
                    text-[#7a3b1e]
                  "
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}

              {actions.length > 0 && (
                <th
                  className="
                    w-36 px-6 py-4 text-right
                    text-[11px] font-bold uppercase tracking-[0.18em]
                    text-[#7a3b1e]
                  "
                >
                  İşlemler
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#3d3020]/10">
            {data.map((item) => (
              <tr
                key={item.id}
                className="
                  transition-colors
                  hover:bg-[#efe3cf]/55
                "
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-5">
                    {column.render(item)}
                  </td>
                ))}

                {actions.length > 0 && (
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      {actions.map((action, idx) => {
                        const isDestructive = action.variant === "destructive";

                        return (
                          <Button
                            key={idx}
                            variant={isDestructive ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => action.onClick(item)}
                            className={`
                              rounded-full
                              text-xs font-bold uppercase tracking-[0.12em]
                              transition-all duration-300

                              ${
                                isDestructive
                                  ? `
                                    bg-red-50
                                    text-red-600
                                    hover:bg-red-100
                                  `
                                  : `
                                    border-[#bc7b56]
                                    bg-[#fff5ea]/60
                                    text-[#6b3f18]
                                    hover:bg-[#efe3cf]
                                  `
                              }
                            `}
                          >
                            {action.icon && (
                              <span className={action.label ? "mr-2" : ""}>
                                {action.icon}
                              </span>
                            )}

                            {action.label}
                          </Button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
