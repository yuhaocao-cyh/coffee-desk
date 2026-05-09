"use client";

/**
 * 本机版：不注册、不配 Supabase，数据存在当前浏览器里。
 * 适合先交作业 / 演示流程；要多人长期共用再回到「云端工作台 /desk」。
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const DEMO_LOTS = [
  {
    id: "y1",
    name: "云南保山 · 水洗",
    grade: "SCAA 84+",
    priceYuanPerKg: 118,
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
  {
    id: "y2",
    name: "云南普洱 · 日晒",
    grade: "商业级",
    priceYuanPerKg: 72,
    emoji: "🍯",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
  },
  {
    id: "e1",
    name: "埃塞耶加 · G1",
    grade: "手冲",
    priceYuanPerKg: 156,
    emoji: "🫐",
    image: "https://images.unsplash.com/photo-1514066558159-fc8c73773959?w=600&q=80",
  },
] as const;

type OrderRow = {
  id: string;
  createdAt: string;
  buyer: string;
  phone: string;
  lotId: string;
  lotName: string;
  kg: number;
  note: string;
};

const STORAGE_KEY = "coffee-benji-orders-v1";

function loadOrders(): OrderRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrderRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(rows: OrderRow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export default function BenjiPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [buyer, setBuyer] = useState("");
  const [phone, setPhone] = useState("");
  const [lotId, setLotId] = useState<string>(DEMO_LOTS[0].id);
  const [kg, setKg] = useState("10");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const selectedLot = useMemo(
    () => DEMO_LOTS.find((l) => l.id === lotId) ?? DEMO_LOTS[0],
    [lotId]
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const kgNum = Number(kg);
    if (!buyer.trim() || !phone.trim()) {
      showToast("请填写采购方与电话 📋");
      return;
    }
    if (!Number.isFinite(kgNum) || kgNum <= 0) {
      showToast("数量要是大于 0 的数字哦");
      return;
    }
    const row: OrderRow = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      buyer: buyer.trim(),
      phone: phone.trim(),
      lotId: selectedLot.id,
      lotName: selectedLot.name,
      kg: kgNum,
      note: note.trim(),
    };
    const next = [row, ...orders];
    setOrders(next);
    saveOrders(next);
    showToast("✅ 已存到本机浏览器");
    setNote("");
  }

  function onClear() {
    if (!confirm("确定清空本机全部记录？")) return;
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY);
    showToast("🗑️ 已清空");
  }

  function exportCsv() {
    const header = ["时间", "采购方", "电话", "豆子", "kg", "备注"];
    const lines = orders.map((o) =>
      [o.createdAt, o.buyer, o.phone, o.lotName, String(o.kg), o.note.replaceAll(",", "，")].join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `本机登记_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📤 已导出 CSV");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-zinc-50 text-zinc-900">
      <header className="border-b border-amber-200/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <div>
              <p className="font-semibold">本机轻松版</p>
              <p className="text-xs text-zinc-500">零配置 · 不注册 · 数据只在这台电脑的浏览器里</p>
            </div>
          </div>
          <Link href="/" className="text-sm font-medium text-amber-800 underline-offset-4 hover:underline">
            ← 回首页
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p className="font-medium">💡 为什么你会觉得云端「麻烦」？</p>
          <p className="mt-2 leading-relaxed text-amber-900/90">
            云端版要多注册一个 Supabase、复制密钥、跑一段 SQL——这是**正常会多出来的步骤**，不是你笨。
            若老师只要求「能演示页面」，你完全可以**先用这个本机版**；以后需要多人长期再用云端也不迟。
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {DEMO_LOTS.map((lot) => (
            <div
              key={lot.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image src={lot.image} alt={lot.name} fill className="object-cover" sizes="33vw" />
                <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                  {lot.emoji}
                </span>
              </div>
              <div className="p-3 text-sm">
                <p className="font-medium">{lot.name}</p>
                <p className="text-zinc-500">{lot.grade}</p>
                <p className="mt-1 text-amber-800">¥{lot.priceYuanPerKg}/kg</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">📝 登记一笔（存本机）</h2>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600">采购方</span>
              <input
                className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-amber-500/20 focus:ring-4"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                placeholder="咖啡馆 / 公司名"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600">电话</span>
              <input
                className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-amber-500/20 focus:ring-4"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="手机号"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600">豆子</span>
              <select
                className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-amber-500/20 focus:ring-4"
                value={lotId}
                onChange={(e) => setLotId(e.target.value)}
              >
                {DEMO_LOTS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.emoji} {l.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600">数量 kg</span>
              <input
                className="rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-amber-500/20 focus:ring-4"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600">备注</span>
              <textarea
                className="min-h-[72px] rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-amber-500/20 focus:ring-4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="可选"
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                保存到本机 ☕
              </button>
              <button
                type="button"
                onClick={exportCsv}
                disabled={orders.length === 0}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm disabled:opacity-40"
              >
                导出 CSV
              </button>
              <button
                type="button"
                onClick={onClear}
                disabled={orders.length === 0}
                className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700 disabled:opacity-40"
              >
                清空
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold">📋 本机记录（{orders.length} 条）</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">还没有，先在上面填一条吧。</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="rounded-xl border border-zinc-100 bg-white px-4 py-3 text-sm shadow-sm">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium">{o.buyer}</span>
                    <time className="text-xs text-zinc-400 tabular-nums">
                      {new Date(o.createdAt).toLocaleString("zh-CN")}
                    </time>
                  </div>
                  <p className="text-zinc-600">
                    {o.lotName} · {o.kg} kg
                  </p>
                  <p className="text-zinc-500">{o.phone}</p>
                  {o.note ? <p className="mt-1 text-zinc-600">💬 {o.note}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {toast ? (
        <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
