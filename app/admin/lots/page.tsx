import { createServerSupabase } from "@/lib/supabase/server";
import { AdminLotsClient } from "@/app/admin/lots/admin-lots-client";

export const dynamic = "force-dynamic";

export default async function AdminLotsPage() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-8 text-center text-amber-200/80">未配置 Supabase</div>;
  }

  const { data: lots } = await supabase
    .from("coffee_lots")
    .select("*")
    .order("sort_order", { ascending: true });

  return <AdminLotsClient lots={lots ?? []} />;
}
