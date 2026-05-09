import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { DeskWorkspace } from "@/app/desk/desk-workspace";
import { createServerSupabase } from "@/lib/supabase/server";
import type { CoffeeLot, DeskOrder, PurchaseOrderFlat } from "@/types/tables";

function EnvMissing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center text-zinc-100">
      <p className="text-4xl">🔧</p>
      <h1 className="text-xl font-semibold">还差一步：配置 Supabase</h1>
      <p className="max-w-md text-sm text-zinc-400">
        请在项目根目录复制 <code className="rounded bg-zinc-800 px-1">.env.local.example</code> 为{" "}
        <code className="rounded bg-zinc-800 px-1">.env.local</code>，填入你的 URL 与 anon key，然后重启{" "}
        <code className="rounded bg-zinc-800 px-1">npm run dev</code>。
      </p>
      <p className="max-w-md text-sm text-zinc-500">
        数据库表请执行仓库内 <code className="rounded bg-zinc-800 px-1">supabase/migrations/001_init.sql</code>。
      </p>
      <Link href="/" className="mt-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-stone-900">
        返回首页
      </Link>
    </div>
  );
}

export default async function DeskPage() {
  const supabase = await createServerSupabase();
  if (!supabase) return <EnvMissing />;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    redirect("/login?next=%2Fdesk");
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-zinc-100">
        <p className="text-3xl">⚠️</p>
        <p className="text-sm text-zinc-300">读取数据失败（请确认已在 Supabase 执行建表 SQL）</p>
        <pre className="max-w-lg overflow-auto rounded-lg bg-black/50 p-3 text-left text-xs text-rose-300">
          {lotsError?.message ?? ordersError?.message}
        </pre>
        <Link href="/" className="text-sm text-amber-400 underline">
          返回首页
        </Link>
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
          请在 Supabase → SQL Editor 执行仓库中的{" "}
          <code className="rounded bg-white/10 px-1">supabase/migrations/001_init.sql</code>，其中包含示例 INSERT。
        </p>
        <Link href="/" className="mt-2 text-sm text-amber-300 underline">
          返回首页
        </Link>
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

  return (
    <DeskWorkspace userEmail={user.email} userId={user.id} lots={lots} orders={orders} />
  );
}
