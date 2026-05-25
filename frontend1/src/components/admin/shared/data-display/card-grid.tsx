import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "./empty-state-card";
import { GridCols } from "./data-grid";

export interface GridColumn<T> {
  key: string;
  render: (item: T) => ReactNode;
}

export interface GridAction<T> {
  label: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "outline";
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

interface CardGridProps<T> {
  data: T[];
  columns: GridColumn<T>[];
  actions?: GridAction<T>[];
  emptyState?: EmptyState;
  gridCols?: GridCols;
}

export function CardGrid<T extends { id: string }>({
  data,
  columns,
  actions = [],
  emptyState,
}: CardGridProps<T>) {
  if (data.length === 0 && emptyState) {
    return <EmptyStateCard {...emptyState} />;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="
            group relative overflow-hidden rounded-[20px]
            border border-[#d0bc90]
            bg-[#efe6cf]
            p-6
            shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
            transition-all duration-300
            hover:-translate-y-1
          "
        >
          <div
            className="
              pointer-events-none absolute inset-0 z-[1]
              bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]
            "
          />

          <div
            className="
              pointer-events-none absolute inset-[6px] z-[2]
              rounded-[15px]
              border border-[#d6c49a]/70
            "
          />

          <div className="relative z-10 space-y-4">
            {columns.map((column) => (
              <div key={column.key}>{column.render(item)}</div>
            ))}

            {actions.length > 0 && (
              <div className="flex gap-2 border-t border-[#3d3020]/10 pt-4">
                {actions.map((action, idx) => {
                  const isDestructive = action.variant === "destructive";
                  const isPrimary = idx === 0 && !isDestructive;

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

                        ${idx === 0 ? "flex-1" : ""}

                        ${
                          isPrimary
                            ? `
                              border-[#bc7b56]
                              bg-[#fff5ea]/60
                              text-[#6b3f18]
                              hover:bg-[#efe3cf]
                            `
                            : ""
                        }

                        ${
                          isDestructive
                            ? `
                              bg-red-50
                              text-red-600
                              hover:bg-red-100
                            `
                            : ""
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
