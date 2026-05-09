"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/desk";
  const errParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(errParam === "missing_env" ? "服务端未配置环境变量" : null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setMsg("缺少 .env.local 配置");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    router.push(next.startsWith("/") ? next : "/desk");
    router.refresh();
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-amber-200/80 hover:text-amber-100">
        ← 返回首页
      </Link>
      <div className="rounded-3xl border border-amber-500/25 bg-[#1c140c]/90 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <p className="text-3xl">🔐</p>
        <h1 className="mt-3 text-2xl font-semibold">登录</h1>
        <p className="mt-2 text-sm text-amber-200/70">登录后可进入工作台，查看与提交云端登记。</p>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">邮箱</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 outline-none ring-amber-400/25 focus:ring-4"
              required
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">密码</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 outline-none ring-amber-400/25 focus:ring-4"
              required
            />
          </label>
          {msg ? <p className="text-sm text-rose-300">{msg}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 py-2.5 text-sm font-semibold text-stone-900 disabled:opacity-50"
          >
            {loading ? "登录中…" : "进入工作台 →"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-amber-200/70">
          还没有账号？{" "}
          <Link href="/signup" className="font-medium text-amber-300 underline-offset-4 hover:underline">
            免费注册
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0a06] text-amber-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(249,115,22,0.15),transparent_40%)]" />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-sm text-amber-200/80">加载中…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
