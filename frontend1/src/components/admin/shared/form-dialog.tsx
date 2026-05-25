import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = "md",
}: FormDialogProps) {
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          max-h-[88vh] overflow-hidden
          border border-[#d0bc90]
          bg-[#efe6cf] p-0
          shadow-[0_18px_45px_rgba(120,92,58,0.22),inset_0_1px_2px_rgba(255,255,255,0.55)]

          [&>button]:z-[60]
          [&>button]:text-[#6b3f18]
          [&>button]:opacity-100
          [&>button]:hover:text-[#2c1a0e]

          ${widthClasses[maxWidth]}
        `}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

        <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[18px] border border-[#d6c49a]/70" />

        <div className="relative z-10 flex max-h-[88vh] flex-col">
          <DialogHeader className="shrink-0 border-b border-[#3d3020]/10 px-6 py-5 text-left">
            <div className="flex items-start gap-4 pr-8">
              <div
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  overflow-hidden rounded-full
                  border border-[#d8bf8a]
                  bg-cover bg-center
                  text-[#2c1a0e]
                  shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28)]
                "
                style={{
                  backgroundImage: "url('/bkrr.png')",
                }}
              >
                ✦
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
                  Yönetim
                </span>

                <DialogTitle className="mt-1 font-serif text-2xl font-black italic text-[#2c1a0e]">
                  {title}
                </DialogTitle>

                {description && (
                  <DialogDescription className="mt-1 text-sm leading-relaxed text-[#5e4734]/70">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          <div
            className="
    min-h-0 flex-1 overflow-y-auto px-6 py-5

    [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]
  "
          >
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
