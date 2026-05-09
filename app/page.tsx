import Image from "next/image";
import Link from "next/link";

/** 落地页：偏展示与引导，数据读写在工作台 /desk */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="text-2xl" aria-hidden>
              ☕
            </span>
            <span>云豆集 · 采购登记</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/benji"
              className="rounded-full bg-amber-100 px-3 py-1.5 font-medium text-amber-950 hover:bg-amber-200"
            >
              本机版（最简单）
            </Link>
            <Link href="/desk" className="rounded-full px-3 py-1.5 text-zinc-600 hover:bg-zinc-100">
              工作台
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
            >
              登录
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-800"
            >
              注册
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-amber-50/80 via-white to-zinc-50">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-amber-800/90">🎯 比赛 / 课程 / 小团队都适用</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              把咖啡豆采购意向
              <span className="block text-amber-700">搬到云上一起用</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-600">
              不再是「只存在某台电脑里」的表格：注册登录后，{" "}
              <span className="font-medium text-zinc-800">数据长期保存在 Supabase</span>，团队成员都能查看、登记、留痕。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/benji"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-amber-950 shadow-md hover:bg-amber-300"
              >
                🧸 本机版（零配置，先点这个）
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 hover:bg-zinc-800"
              >
                ✨ 云端：注册账号
              </Link>
              <Link
                href="/desk"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                进入工作台
              </Link>
            </div>
            <ul className="mt-10 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
              <li className="flex gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 px-3 py-2">
                <span>☁️</span>
                <span>云端数据库，换电脑也能继续用</span>
              </li>
              <li className="flex gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 px-3 py-2">
                <span>👥</span>
                <span>多人登录，共享同一块登记动态</span>
              </li>
              <li className="flex gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 px-3 py-2">
                <span>🖼️</span>
                <span>批次卡片配图 + emoji，展示更直观</span>
              </li>
              <li className="flex gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 px-3 py-2">
                <span>🛡️</span>
                <span>每人只能删除自己提交的记录</span>
              </li>
            </ul>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-100 shadow-2xl shadow-zinc-900/10 sm:aspect-auto sm:min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80"
              alt="咖啡与器具氛围图"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-4 text-sm text-zinc-800 shadow-lg backdrop-blur">
              <p className="font-medium">📸 首页配图可随意替换</p>
              <p className="mt-1 text-xs text-zinc-600">当前使用 Unsplash 外链；也可把图片放到 public/ 目录改为本地引用。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">三步上手</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1️⃣",
              title: "创建 Supabase 项目",
              desc: "在 supabase.com 新建项目，把 URL 与 anon key 写入 .env.local。",
            },
            {
              step: "2️⃣",
              title: "执行建表 SQL",
              desc: "打开 SQL Editor，粘贴仓库内 supabase/migrations/001_init.sql 并运行。",
            },
            {
              step: "3️⃣",
              title: "npm run dev",
              desc: "本地启动后注册账号，即可在工作台协同登记。",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-2xl">{c.step}</p>
              <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-900 py-16 text-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="text-sm text-amber-200/80">准备好了吗？</p>
            <h2 className="mt-2 text-2xl font-semibold">先注册，再打开工作台体验完整流程 🚀</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-300"
            >
              立即注册
            </Link>
            <Link href="/login" className="rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10">
              已有账号登录
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-500">
        云豆集 · 演示项目 · 图片版权归 Unsplash 摄影师
      </footer>
    </div>
  );
}
