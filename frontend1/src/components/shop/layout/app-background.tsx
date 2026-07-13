"use client";

import { usePathname } from "next/navigation";

const hiddenBgRoutes = ["/cart"];

export function AppBackground() {
  const pathname = usePathname();

  const hiddenBgRoutes = ["/cart"];

  const shouldHideBg =
    hiddenBgRoutes.some((route) => pathname.startsWith(route)) ||
    (pathname.startsWith("/admin") && pathname !== "/admin/login");

  if (shouldHideBg) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/antepKalesi.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[0]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_45%,rgba(246,239,221,0.4)_0%,rgba(246,239,221,0.08)_42%,transparent_72%)]" />
        <div className="absolute bottom-[-10%] right-[-6%] h-[40%] w-[52%] rounded-full bg-[#e0ccaa] blur-[40px]" />
        <div className="absolute top-[-8%] left-[-4%] h-[40%] w-[38%] rounded-full bg-[#e8d9b8]/50 blur-[35px]" />
        <div className="absolute top-[-5%] right-[-4%] h-[15%] w-[50%] rounded-full bg-[#e8d4b0] blur-[30px]" />
      </div>
    </div>
  );
}
