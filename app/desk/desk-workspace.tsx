"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DeskTopBar } from "@/components/desk-top-bar";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { OrderEditForm } from "@/components/order-edit-form";
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  updateOrderStatus,
} from "@/app/desk/actions";
import type { CoffeeLot, DeskOrder, OrderStatus } from "@/types/tables";

type Props = {
  lots: CoffeeLot[];
  orders: DeskOrder[];
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "completed",
  completed: null,
  cancelled: null,
};

const STATUS_ACTION_LABEL: Record<OrderStatus, string> = {
  pending: "✅ 确认",
  confirmed: "📦 发货",
  shipped: "🎉 完成",
  completed: "",
  cancelled: "",
};

export function DeskWorkspace({ lots, orders }: Props) {
  const router = useRouter();
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [pending, startTransition] = useTransition();
  const [lotId, setLotId] = useState(lots[0]?.id ?? "");
  const [editingOrder, setEditingOrder] = useState<DeskOrder | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 2600);
  }

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createPurchaseOrder(formData);
      if ("error" in res && res.error) {
        showToast(res.error, "error");
        return;
      }
      showToast("✅ 已保存到云端");
      router.refresh();
    });
  }

  async function onDelete(id: string) {
    if (!confirm("确定删除这条登记？")) return;
    startTransition(async () => {
      const res = await deletePurchaseOrder(id);
      if ("error" in res && res.error) {
        showToast(res.error, "error");
        return;
      }
      showToast("🗑️ 已删除");
      router.refresh();
    });
  }

  async function onStatusChange(id: string, newStatus: OrderStatus) {
    startTransition(async () => {
      const res = await updateOrderStatus(id, newStatus);
      if ("error" in res && res.error) {
        showToast(res.error, "error");
        return;
      }
      router.refresh();
    });
  }

  function formatTime(iso: string | null) {
    if (!iso) return null;
    return new Date(iso).toLocaleString("zh-CN");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a120b] via-[#241a10] to-[#120d08] text-amber-50">
      <DeskTopBar />

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 via-transparent to-orange-600/10 p-8 shadow-2xl shadow-black/40">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
          <p className="text-sm font-medium text-amber-200/90">☕ 云豆集</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            咖啡豆采购登记
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-amber-100/75">
            无需登录，所有人均可查看、登记、管理采购意向，数据实时保存在云端。
          </p>
        </section>

        {/* 批次 + 表单 */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* 批次卡片 */}
          <section className="space-y-5">
            <h2 className="text-lg font-semibold">🫘 批次精选</h2>
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
                    {lot.stock_kg > 0 && (
                      <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs backdrop-blur">
                        库存 {lot.stock_kg} kg
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 px-4 py-4">
                    <h3 className="font-medium text-amber-50">{lot.name}</h3>
                    <p className="text-xs text-amber-200/75">{lot.grade}</p>
                    {lot.tagline ? <p className="text-xs text-amber-100/80">{lot.tagline}</p> : null}
                    <p className="pt-2 text-sm font-semibold text-amber-300">
                      ¥{lot.price_yuan_per_kg.toFixed(0)}{" "}
                      <span className="text-xs font-normal text-amber-200/70">/ kg</span>
                    </p>
                    {lot.stock_kg > 0 && (
                      <div className="pt-1">
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all"
                            style={{ width: `${Math.min(100, (lot.stock_kg / 500) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 新建表单 */}
          <section className="rounded-3xl border border-amber-500/25 bg-[#2a1f14]/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <h2 className="text-lg font-semibold">📝 新建登记</h2>
            <p className="mt-1 text-xs text-amber-200/70">无需登录，提交后所有人可见</p>
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
                      {l.stock_kg > 0 ? `（库存 ${l.stock_kg} kg）` : "（暂无库存）"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-amber-200/80">数量（kg）</span>
                <input
                  name="kg"
                  type="number"
                  step="0.01"
                  min="0.01"
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
                disabled={pending || !lots.find((l) => l.id === lotId)}
                className="mt-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-lg shadow-amber-900/30 hover:from-amber-300 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "提交中…" : "🚀 提交"}
              </button>
            </form>
          </section>
        </div>

        {/* 全员登记动态 */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">📋 全员登记动态</h2>
              <p className="text-xs text-amber-200/70">共 {orders.length} 条</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-500/30 bg-black/20 px-6 py-12 text-center text-sm text-amber-200/80">
              暂无记录，先提交一单吧 ☕
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={o.lot.image_url}
                      alt={o.lot.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-xs">
                      {o.lot.emoji}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-amber-50">{o.buyer_company}</p>
                      <OrderStatusBadge status={o.status} />
                    </div>

                    <p className="text-xs text-amber-200/70">
                      {o.lot.name} · {o.kg} kg · ¥{o.lot.price_yuan_per_kg.toFixed(0)}/kg
                    </p>
                    <p className="text-xs text-amber-100/80">📞 {o.phone}</p>
                    {o.note ? <p className="text-xs text-amber-100/85">💬 {o.note}</p> : null}

                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-amber-200/50">
                      <span>创建 {formatTime(o.created_at)}</span>
                      {o.confirmed_at && <span>✅ {formatTime(o.confirmed_at)}</span>}
                      {o.shipped_at && <span>📦 {formatTime(o.shipped_at)}</span>}
                      {o.completed_at && <span>🎉 {formatTime(o.completed_at)}</span>}
                      {o.cancelled_at && <span>🚫 {formatTime(o.cancelled_at)}</span>}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {NEXT_STATUS[o.status] && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(o.id, NEXT_STATUS[o.status]!)}
                          disabled={pending}
                          className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs text-amber-300 hover:bg-amber-500/30 disabled:opacity-40"
                        >
                          {STATUS_ACTION_LABEL[o.status]}
                        </button>
                      )}

                      {o.status !== "completed" && o.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(o.id, "cancelled")}
                          disabled={pending}
                          className="rounded-full px-2.5 py-1 text-xs text-rose-300 hover:bg-rose-500/15 disabled:opacity-40"
                        >
                          取消
                        </button>
                      )}

                      {o.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => setEditingOrder(o)}
                          disabled={pending}
                          className="rounded-full px-2.5 py-1 text-xs text-amber-200/80 hover:bg-white/10 disabled:opacity-40"
                        >
                          ✏️ 编辑
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDelete(o.id)}
                        disabled={pending}
                        className="rounded-full px-2.5 py-1 text-xs text-rose-300 hover:bg-rose-500/15 disabled:opacity-40"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {editingOrder && (
        <OrderEditForm
          order={editingOrder}
          lots={lots}
          onClose={() => setEditingOrder(null)}
        />
      )}

      {toast ? (
        <div
          className={`pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border px-4 py-2 text-sm shadow-xl backdrop-blur ${
            toast.type === "error"
              ? "border-rose-500/30 bg-rose-900/80 text-rose-100"
              : "border-white/10 bg-black/80 text-amber-50"
          }`}
        >
          {toast.msg}
        </div>
      ) : null}
    </div>
  );
}
