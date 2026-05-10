"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { editPurchaseOrder } from "@/app/desk/actions";
import type { CoffeeLot, DeskOrder } from "@/types/tables";

type Props = {
  order: DeskOrder;
  lots: CoffeeLot[];
  onClose: () => void;
};

export function OrderEditForm({ order, lots, onClose }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      setError(null);
      const res = await editPurchaseOrder(formData);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm">
      <div className="mt-12 w-full max-w-md rounded-3xl border border-amber-500/25 bg-[#2a1f14]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-lg sm:mt-20">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-amber-50">✏️ 编辑订单</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-amber-200/70 hover:bg-white/10"
          >
            关闭
          </button>
        </div>

        <form action={onSubmit} className="grid gap-4">
          <input type="hidden" name="id" value={order.id} />
          <input type="hidden" name="lot_id" value={order.lot_id} />

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">采购方</span>
            <input
              name="buyer_company"
              defaultValue={order.buyer_company}
              required
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 placeholder:text-amber-200/40 focus:ring-4"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">联系电话</span>
            <input
              name="phone"
              defaultValue={order.phone}
              required
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 placeholder:text-amber-200/40 focus:ring-4"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">选择豆子</span>
            <select
              name="lot_id"
              defaultValue={order.lot_id}
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
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={order.kg}
              required
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 focus:ring-4"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-amber-200/80">备注</span>
            <textarea
              name="note"
              rows={3}
              defaultValue={order.note}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-amber-50 outline-none ring-amber-400/30 placeholder:text-amber-200/40 focus:ring-4"
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 py-2.5 text-sm font-semibold text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "保存中…" : "💾 保存修改"}
            </button>
            <button
              type="button"
              onClick={onClose}
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
