"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 工作台顶栏：导航 */
export function DeskTopBar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/desk", label: "工作台" },
    { href: "/dashboard", label: "数据看板" },
    { href: "/admin/lots", label: "管理后台" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#1a120b]/90 text-amber-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            ☕
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide">云豆集</p>
            <p className="text-xs text-amber-200/80">免登录 · 全员协同</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1 transition ${
                  isActive
                    ? "bg-amber-500/20 text-amber-200"
                    : "text-amber-50/80 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
