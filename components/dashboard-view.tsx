"use client";

import { DeskTopBar } from "@/components/desk-top-bar";
import type { DashboardStats, OrderStatus } from "@/types/tables";

type Props = { stats: DashboardStats };

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "待确认",
  confirmed: "已确认",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-400",
  shipped: "bg-cyan-400",
  completed: "bg-green-400",
  cancelled: "bg-rose-400",
};

export function DashboardView({ stats }: Props) {
  const maxStatusCount = Math.max(...stats.ordersByStatus.map((s) => s.count), 1);
  const maxMonthlyKg = Math.max(...stats.monthlyTrends.map((m) => m.kg), 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a120b] via-[#241a10] to-[#120d08] text-amber-50">
      <DeskTopBar />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 via-transparent to-orange-600/10 p-8 shadow-2xl shadow-black/40">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <p className="text-sm font-medium text-amber-200/90">📊 数据看板</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">采购总览</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-amber-100/75">
            所有登记自动汇总，数据实时更新。
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon="📋" title="总订单数" value={stats.totalOrders.toLocaleString()} unit="单" />
          <StatCard icon="⚖️" title="总采购量" value={stats.totalKg.toLocaleString()} unit="kg" />
          <StatCard icon="💰" title="总采购金额" value={`¥${stats.totalValue.toLocaleString()}`} unit="" />
        </div>

        <section className="rounded-3xl border border-amber-500/25 bg-[#2a1f14]/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <h2 className="text-base font-semibold">📌 订单状态分布</h2>
          <div className="mt-5 space-y-3">
            {stats.ordersByStatus.length === 0 ? (
              <p className="text-sm text-amber-200/60">暂无数据</p>
            ) : (
              stats.ordersByStatus.map((s) => {
                const pct = Math.max((s.count / maxStatusCount) * 100, 4);
                return (
                  <div key={s.status} className="flex items-center gap-3">
                    <span className="w-14 text-right text-xs text-amber-200/80">{STATUS_LABEL[s.status]}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all ${STATUS_COLOR[s.status]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-amber-200/70">{s.count}</span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-500/25 bg-[#2a1f14]/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <h2 className="text-base font-semibold">📈 月度采购趋势</h2>
          {stats.monthlyTrends.length === 0 ? (
            <p className="mt-4 text-sm text-amber-200/60">暂无数据</p>
          ) : (
            <div className="mt-6">
              <div className="flex items-end gap-2" style={{ height: 160 }}>
                {stats.monthlyTrends.map((m) => {
                  const pct = (m.kg / maxMonthlyKg) * 100;
                  return (
                    <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-[10px] text-amber-200/60">{m.count}单</span>
                      <div
                        className="w-full rounded-t bg-amber-400/80 transition-all"
                        style={{ height: `${Math.max(pct, 2)}%` }}
                      />
                      <span className="text-[10px] text-amber-200/60">{m.month.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-amber-500/25 bg-[#2a1f14]/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <h2 className="text-base font-semibold">🏆 热门豆种排行</h2>
          {stats.popularLots.length === 0 ? (
            <p className="mt-4 text-sm text-amber-200/60">暂无数据</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {stats.popularLots.map((lot, i) => (
                <li
                  key={lot.lot_id}
                  className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                >
                  <span className="text-sm">
                    <span className="mr-2 text-amber-300">#{i + 1}</span>
                    {lot.emoji} {lot.lotName}
                  </span>
                  <span className="text-xs text-amber-200/70">
                    {lot.orderCount} 单 · {lot.totalKg} kg
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, unit }: { icon: string; title: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
      <p className="text-xl">{icon}</p>
      <p className="mt-3 text-xs text-amber-200/70">{title}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-amber-200/60">{unit}</span>}
      </p>
    </div>
  );
}
