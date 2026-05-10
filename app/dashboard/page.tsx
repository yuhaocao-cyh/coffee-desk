import { createServerSupabase } from "@/lib/supabase/server";
import { getDashboardStats } from "@/app/desk/actions";
import { DashboardView } from "@/components/dashboard-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  if (!supabase) return <div className="p-8 text-center text-amber-200/80">未配置 Supabase</div>;

  const result = await getDashboardStats();

  if ("error" in result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#120d08] text-amber-200/80">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-8 py-6 text-center text-sm text-rose-300">
          {result.error}
        </div>
      </div>
    );
  }

  return <DashboardView stats={result.data} />;
}
