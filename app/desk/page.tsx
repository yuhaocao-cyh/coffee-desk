import { createServerSupabase } from "@/lib/supabase/server";
import { DeskWorkspace } from "@/app/desk/desk-workspace";
import type { CoffeeLot, DeskOrder, PurchaseOrderFlat } from "@/types/tables";

export const dynamic = "force-dynamic";

export default async function DeskPage() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#120d08] text-amber-50">
        <p className="rounded-3xl border border-amber-500/20 bg-amber-500/10 px-8 py-6 text-center">
          请先配置 Supabase 环境变量
        </p>
      </div>
    );
  }

  const { data: lotsData, error: lotsError } = await supabase
    .from("coffee_lots")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: ordersData, error: ordersError } = await supabase
    .from("purchase_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (lotsError || ordersError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#120d08] text-amber-200/80">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-4 text-sm text-rose-300">
          读取数据失败：{lotsError?.message ?? ordersError?.message}
        </div>
      </div>
    );
  }

  const lots = (lotsData ?? []) as CoffeeLot[];
  if (lots.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#120d08] px-6 text-center text-amber-50">
        <p className="text-4xl">🫘</p>
        <h1 className="text-lg font-semibold">还没有豆子批次数据</h1>
        <p className="max-w-md text-sm text-amber-200/75">
          请在 Supabase → SQL Editor 执行仓库中的建表 SQL。
        </p>
      </div>
    );
  }

  const lotMap = new Map(lots.map((l) => [l.id, l]));
  const ordersRaw = (ordersData ?? []) as PurchaseOrderFlat[];
  const orders: DeskOrder[] = ordersRaw
    .map((o) => {
      const lot = lotMap.get(o.lot_id);
      if (!lot) return null;
      return { ...o, lot };
    })
    .filter((x): x is DeskOrder => x !== null);

  return <DeskWorkspace lots={lots} orders={orders} />;
}
