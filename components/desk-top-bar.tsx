"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";

/** 工作台顶栏：账号信息与退出登录 */
export function DeskTopBar({ email }: { email: string }) {
  const router = useRouter();

  async function onSignOut() {
    const supabase = createBrowserSupabase();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#1a120b]/90 text-amber-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            ☕
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide">云豆工作台</p>
            <p className="text-xs text-amber-200/80">多人共享 · 云端保存</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1 text-amber-100/90">
            👤 {email}
          </span>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-3 py-1 text-amber-50/90 hover:bg-white/10"
          >
            返回首页
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-full bg-amber-500/90 px-3 py-1 font-medium text-stone-900 hover:bg-amber-400"
          >
            退出
          </button>
        </div>
      </div>
    </header>
  );
}
