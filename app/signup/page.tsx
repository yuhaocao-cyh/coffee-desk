"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setMsg("缺少 .env.local 配置");
      return;
    }
    if (password.length < 6) {
      setMsg("密码至少 6 位");
      return;
    }
    setLoading(true);
    const origin = window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/desk`,
      },
    });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (data.session) {
      router.push("/desk");
      router.refresh();
      return;
    }
    setMsg("注册成功！若开启了邮箱验证，请查收邮件后点击链接再登录。");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0a06] text-amber-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(52,211,153,0.12),transparent_45%),radial-gradient(circle_at_10%_80%,rgba(251,191,36,0.12),transparent_40%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-amber-200/80 hover:text-amber-100">
          ← 返回首页
        </Link>
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0f1714]/90 p-8 shadow-2xl shadow-black/50 backdrop-blur">
          <p className="text-3xl">🌱</p>
          <h1 className="mt-3 text-2xl font-semibold">注册账号</h1>
          <p className="mt-2 text-sm text-emerald-100/70">每位成员各自注册，即可多人共用同一块数据看板。</p>
          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-1 text-sm">
              <span className="text-emerald-100/80">邮箱</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 outline-none ring-emerald-400/25 focus:ring-4"
                required
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-emerald-100/80">密码（≥6 位）</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 outline-none ring-emerald-400/25 focus:ring-4"
                required
              />
            </label>
            {msg ? <p className="text-sm text-emerald-200/90">{msg}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 py-2.5 text-sm font-semibold text-stone-900 disabled:opacity-50"
            >
              {loading ? "提交中…" : "创建并登录"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-emerald-100/70">
            已有账号？{" "}
            <Link href="/login" className="font-medium text-emerald-300 underline-offset-4 hover:underline">
              去登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
