import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a120b] via-[#241a10] to-[#120d08] text-amber-50">
      <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#1a120b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="text-sm font-semibold tracking-wide">管理后台</p>
              <p className="text-xs text-amber-200/80">管理员专享 · 豆子批次管理</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/admin/lots"
              className="rounded-full border border-white/15 px-3 py-1 text-amber-50/90 hover:bg-white/10"
            >
              批次管理
            </Link>
            <Link
              href="/desk"
              className="rounded-full bg-amber-500/90 px-3 py-1 font-medium text-stone-900 hover:bg-amber-400"
            >
              ← 返回工作台
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
