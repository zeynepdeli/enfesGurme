import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyStateCard({
  icon,
  title,
  description,
  action,
}: EmptyStateCardProps) {
  return (
    <div
      className="
        relative overflow-hidden rounded-[22px]
        border border-[#d0bc90]
        bg-[#efe6cf]
        px-4 py-14
        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
      "
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[16px] border border-[#d6c49a]/70" />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center justify-center text-center">
        <div
          className="
            mb-5 flex h-20 w-20 items-center justify-center
            overflow-hidden rounded-full
            border border-[#d8bf8a]
            bg-cover bg-center
            text-[#2c1a0e]
            shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
          "
          style={{
            backgroundImage: "url('/bkrr.png')",
          }}
        >
          <div className="text-4xl">{icon}</div>
        </div>

        <h3 className="font-serif text-2xl font-black italic text-[#2c1a0e]">
          {title}
        </h3>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5e4734]/70">
          {description}
        </p>

        {action && (
          <Button
            onClick={action.onClick}
            className="
              mt-7 h-12 rounded-full border-2 border-transparent
              bg-transparent px-7
              text-xs font-bold uppercase tracking-[0.18em]
              text-[#e8dcc0]
              shadow-none
              transition-all duration-300
              hover:brightness-110
            "
            style={{
              backgroundImage: `
                linear-gradient(#524528, #524528),
                linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
              `,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow:
                "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
