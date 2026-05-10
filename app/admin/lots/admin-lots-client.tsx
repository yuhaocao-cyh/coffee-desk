"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CoffeeLot } from "@/types/tables";
import { createCoffeeLot, updateCoffeeLot, deleteCoffeeLot } from "@/app/desk/actions";

type Props = { lots: CoffeeLot[] };

export function AdminLotsClient({ lots }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 2600);
  }

  async function onCreate(formData: FormData) {
    startTransition(async () => {
      const res = await createCoffeeLot(formData);
      if ("error" in res && res.error) {
        showToast(res.error, "error");
        return;
      }
      showToast("✅ 批次已添加");
      setEditingId(null);
      router.refresh();
    });
  }

  async function onUpdate(formData: FormData) {
    startTransition(async () => {
      const res = await updateCoffeeLot(formData);
      if ("error" in res && res.error) {
        showToast(res.error, "error");
        return;
      }
      showToast("✅ 已更新");
      setEditingId(null);
      router.refresh();
    });
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`确定删除「${name}」？关联的订单可能受影响。`)) return;
    startTransition(async () => {
      const res = await deleteCoffeeLot(id);
      if ("error" in res && res.error) {
        showToast(res.error, "error");
        return;
      }
      showToast("🗑️ 已删除");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {/* 顶部 */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 via-transparent to-orange-600/10 p-8 shadow-2xl shadow-black/40">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
        <p className="text-sm font-medium text-amber-200/90">🫘 批次管理</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">咖啡豆批次</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-amber-100/75">
          添加、编辑或删除咖啡豆批次。新增批次会自动出现在工作台中。
        </p>
        <button
          type="button"
          onClick={() => setEditingId("__new__")}
          className="mt-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-lg shadow-amber-900/30 hover:from-amber-300 hover:to-orange-400"
        >
          ＋ 添加新批次
        </button>
      </section>

      {/* 新建/编辑表单 */}
      {editingId && (
        <LotForm
          lot={editingId === "__new__" ? null : lots.find((l) => l.id === editingId) ?? null}
          onSave={editingId === "__new__" ? onCreate : onUpdate}
          onCancel={() => setEditingId(null)}
          pending={pending}
        />
      )}

      {/* 批次列表 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lots.map((lot) => (
          <div
            key={lot.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <span className="text-xl">{lot.emoji}</span>
                <h3 className="mt-1 font-medium text-amber-50">{lot.name}</h3>
              </div>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
                ¥{lot.price_yuan_per_kg.toFixed(0)}/kg
              </span>
            </div>
            <div className="space-y-1 text-xs text-amber-200/70">
              {lot.grade && <p>等级：{lot.grade}</p>}
              {lot.origin && <p>产地：{lot.origin}</p>}
              <p>库存：{lot.stock_kg} kg</p>
              <p>排序：{lot.sort_order}</p>
              {lot.tagline && <p className="text-amber-100/80">&ldquo;{lot.tagline}&rdquo;</p>}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setEditingId(lot.id)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-amber-200/80 hover:bg-white/20"
              >
                ✏️ 编辑
              </button>
              <button
                type="button"
                onClick={() => onDelete(lot.id, lot.name)}
                className="rounded-full px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/15"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border px-4 py-2 text-sm shadow-xl backdrop-blur ${
            toast.type === "error"
              ? "border-rose-500/30 bg-rose-900/80 text-rose-100"
              : "border-white/10 bg-black/80 text-amber-50"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ---------- 批次表单（新建 & 编辑共用） ---------- */

function LotForm({
  lot,
  onSave,
  onCancel,
  pending,
}: {
  lot: CoffeeLot | null;
  onSave: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const isNew = !lot;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm">
      <div className="mt-12 w-full max-w-lg rounded-3xl border border-amber-500/25 bg-[#2a1f14]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-lg sm:mt-20">
        <h2 className="mb-4 text-lg font-semibold text-amber-50">
          {isNew ? "➕ 添加新批次" : "✏️ 编辑批次"}
        </h2>

        <form action={onSave} className="grid gap-3 sm:grid-cols-2">
          {!isNew && <input type="hidden" name="id" value={lot!.id} />}

          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="text-amber-200/80">名称 *</span>
            <input
              name="name"
              defaultValue={lot?.name ?? ""}
              required
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 placeholder:text-amber-200/40 focus:ring-4"
              placeholder="云南保山 · 水洗"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">等级</span>
            <input
              name="grade"
              defaultValue={lot?.grade ?? ""}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
              placeholder="SCAA 84+"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">产地</span>
            <input
              name="origin"
              defaultValue={lot?.origin ?? ""}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
              placeholder="云南保山"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">价格（元/kg）*</span>
            <input
              name="price_yuan_per_kg"
              type="number"
              step="0.01"
              min="0"
              defaultValue={lot?.price_yuan_per_kg ?? ""}
              required
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">库存（kg）*</span>
            <input
              name="stock_kg"
              type="number"
              step="0.01"
              min="0"
              defaultValue={lot?.stock_kg ?? 0}
              required
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
            />
          </label>

          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="text-amber-200/80">图片链接 *</span>
            <input
              name="image_url"
              defaultValue={lot?.image_url ?? ""}
              required
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
              placeholder="https://images.unsplash.com/..."
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">Emoji</span>
            <input
              name="emoji"
              defaultValue={lot?.emoji ?? "☕"}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">排序</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={lot?.sort_order ?? 0}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
            />
          </label>

          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="text-amber-200/80">一句话描述</span>
            <input
              name="tagline"
              defaultValue={lot?.tagline ?? ""}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
              placeholder="明亮酸质，柑橘与焦糖尾韵"
            />
          </label>

          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 py-2.5 text-sm font-semibold text-stone-900 disabled:opacity-50"
            >
              {pending ? "保存中…" : isNew ? "➕ 添加" : "💾 保存"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-amber-200/80 hover:bg-white/10 disabled:opacity-40"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
