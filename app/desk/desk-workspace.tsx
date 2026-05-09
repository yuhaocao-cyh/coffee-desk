"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DeskTopBar } from "@/components/desk-top-bar";
import { createPurchaseOrder, deletePurchaseOrder } from "@/app/desk/actions";
import type { CoffeeLot, DeskOrder } from "@/types/tables";

type Props = {
  userEmail: string;
  userId: string;
  lots: CoffeeLot[];
  orders: DeskOrder[];
};

export function DeskWorkspace({ userEmail, userId, lots, orders }: Props) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [lotId, setLotId] = useState(lots[0]?.id ?? "");

  const selectedLot = useMemo(() => lots.find((l) => l.id === lotId) ?? lots[0], [lots, lotId]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createPurchaseOrder(formData);
      if ("error" in res && res.error) {
        showToast(res.error);
        return;
      }
      showToast("✅ 已保存到云端，团队可见");
      router.refresh();
    });
  }

  async function onDelete(id: string) {
    if (!confirm("确定删除这条登记？（仅本人可删）")) return;
    startTransition(async () => {
      const res = await deletePurchaseOrder(id);
      if ("error" in res && res.error) {
        showToast(res.error);
        return;
      }
      showToast("🗑️ 已删除");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a120b] via-[#241a10] to-[#120d08] text-amber-50">
      <DeskTopBar email={userEmail} />

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 via-transparent to-orange-600/10 p-8 shadow-2xl shadow-black/40">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
          <p className="text-sm font-medium text-amber-200/90">✨ 团队看板</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            记录每一单采购意向
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-amber-100/75">
            数据保存在 Supabase 云端，换电脑登录同一账号仍可查看；团队成员各自登录后，可在此看到
            <span className="font-medium text-amber-200"> 全员登记 </span>
            列表，便于协同跟单。
          </p>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">🫘 批次精选</h2>
                <p className="text-xs text-amber-200/70">示例图来自 Unsplash，可在数据库里替换为你们实拍图</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {lots.map((lot) => (
                <article
                  key={lot.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/30 transition hover:border-amber-400/40 hover:bg-white/10"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={lot.image_url}
                      alt={lot.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-sm backdrop-blur">
                      {lot.emoji} {lot.origin ?? "产地待定"}
                    </div>
                  </div>
                  <div className="space-y-1 px-4 py-4">
                    <h3 className="font-medium text-amber-50">{lot.name}</h3>
                    <p className="text-xs text-amber-200/75">{lot.grade}</p>
                    {lot.tagline ? <p className="text-xs text-amber-100/80">{lot.tagline}</p> : null}
                    <p className="pt-2 text-sm font-semibold text-amber-300">
                      ¥{lot.price_yuan_per_kg.toFixed(0)} <span className="text-xs font-normal text-amber-200/70">/ kg</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-500/25 bg-[#2a1f14]/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <h2 className="text-lg font-semibold">📝 新建登记</h2>
            <p className="mt-1 text-xs text-amber-200/70">提交后写入云端，所有已登录成员可见</p>
            <form action={onSubmit} className="mt-5 grid gap-4">
              <input type="hidden" name="lot_id" value={lotId} />
              <label className="grid gap-1 text-sm">
                <span className="text-amber-200/80">采购方</span>
                <input
                  name="buyer_company"
                  required
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 placeholder:text-amber-200/40 focus:ring-4"
                  placeholder="咖啡馆 / 公司名称"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-amber-200/80">联系电话</span>
                <input
                  name="phone"
                  required
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 placeholder:text-amber-200/40 focus:ring-4"
                  placeholder="手机号"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-amber-200/80">选择豆子</span>
                <select
                  value={lotId}
                  onChange={(e) => setLotId(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
                >
                  {lots.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.emoji} {l.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-amber-200/80">数量（kg）</span>
                <input
                  name="kg"
                  defaultValue="10"
                  required
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-amber-200/80">备注</span>
                <textarea
                  name="note"
                  rows={3}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 placeholder:text-amber-200/40 focus:ring-4"
                  placeholder="交割时间、烘焙度、发票需求等"
                />
              </label>
              <button
                type="submit"
                disabled={pending || !selectedLot}
                className="mt-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-lg shadow-amber-900/30 hover:from-amber-300 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "提交中…" : "🚀 提交到云端"}
              </button>
            </form>
          </section>
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">📋 全员登记动态</h2>
              <p className="text-xs text-amber-200/70">共 {orders.length} 条 · 仅创建者可删除自己的记录</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-500/30 bg-black/20 px-6 py-12 text-center text-sm text-amber-200/80">
              暂无记录，先在右侧提交一单吧 ☕
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <Image src={o.lot.image_url} alt={o.lot.name} fill className="object-cover" sizes="96px" />
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-xs">{o.lot.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-amber-50">{o.buyer_company}</p>
                        <p className="text-xs text-amber-200/70">
                          {o.lot.name} · {o.kg} kg · ¥{o.lot.price_yuan_per_kg.toFixed(0)}/kg 参考价
                        </p>
                      </div>
                      <time className="shrink-0 text-[11px] text-amber-200/60 tabular-nums">
                        {new Date(o.created_at).toLocaleString("zh-CN")}
                      </time>
                    </div>
                    <p className="text-xs text-amber-100/80">📞 {o.phone}</p>
                    <p className="text-xs text-amber-200/70">✉️ 提交账号：{o.submitter_email ?? "（无邮箱）"}</p>
                    {o.note ? <p className="text-xs text-amber-100/85">💬 {o.note}</p> : null}
                    {o.user_id === userId ? (
                      <button
                        type="button"
                        onClick={() => onDelete(o.id)}
                        disabled={pending}
                        className="mt-2 text-xs text-rose-300 hover:text-rose-200 disabled:opacity-40"
                      >
                        删除本条（本人）
                      </button>
                    ) : (
                      <p className="mt-2 text-[11px] text-amber-200/50">仅创建人可删除</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {toast ? (
        <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-sm text-amber-50 shadow-xl backdrop-blur">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
