"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { DashboardStats, OrderStatus } from "@/types/tables";

/* ---------- 创建订单 ---------- */

export async function createPurchaseOrder(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const buyer_company = String(formData.get("buyer_company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const lot_id = String(formData.get("lot_id") ?? "").trim();
  const kgRaw = String(formData.get("kg") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const kg = Number(kgRaw);

  if (!buyer_company || !phone) return { error: "请填写采购方与联系电话" };
  if (!lot_id) return { error: "请选择豆子批次" };
  if (!Number.isFinite(kg) || kg <= 0) return { error: "数量需为大于 0 的数字" };

  const { error } = await supabase.from("purchase_orders").insert({
    buyer_company,
    phone,
    lot_id,
    kg,
    note,
  });

  if (error) return { error: error.message };
  revalidatePath("/desk");
  return { ok: true as const };
}

/* ---------- 删除订单 ---------- */

export async function deletePurchaseOrder(orderId: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const { error } = await supabase.from("purchase_orders").delete().eq("id", orderId);
  if (error) return { error: error.message };

  revalidatePath("/desk");
  return { ok: true as const };
}

/* ---------- 编辑订单 ---------- */

export async function editPurchaseOrder(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const id = String(formData.get("id") ?? "").trim();
  const buyer_company = String(formData.get("buyer_company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const lot_id = String(formData.get("lot_id") ?? "").trim();
  const kgRaw = String(formData.get("kg") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const kg = Number(kgRaw);

  if (!id) return { error: "缺少订单 ID" };
  if (!buyer_company || !phone) return { error: "请填写采购方与联系电话" };
  if (!lot_id) return { error: "请选择豆子批次" };
  if (!Number.isFinite(kg) || kg <= 0) return { error: "数量需为大于 0 的数字" };

  const { error } = await supabase
    .from("purchase_orders")
    .update({ buyer_company, phone, lot_id, kg, note })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/desk");
  return { ok: true as const };
}

/* ---------- 更新订单状态 ---------- */

const STATUS_TIMESTAMP_MAP: Record<OrderStatus, string | null> = {
  pending: null,
  confirmed: "confirmed_at",
  shipped: "shipped_at",
  completed: "completed_at",
  cancelled: "cancelled_at",
};

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  // 查出现有订单
  const { data: order, error: fetchErr } = await supabase
    .from("purchase_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (fetchErr || !order) return { error: "订单不存在" };

  // 库存逻辑：确认时扣减，取消已确认订单时恢复
  if (newStatus === "confirmed" && order.status === "pending") {
    const { data: lot } = await supabase
      .from("coffee_lots")
      .select("stock_kg")
      .eq("id", order.lot_id)
      .single();

    if (lot) {
      if (Number(lot.stock_kg) < Number(order.kg)) {
        return { error: `库存不足（当前 ${lot.stock_kg} kg，需要 ${order.kg} kg）` };
      }
      await supabase
        .from("coffee_lots")
        .update({ stock_kg: Number(lot.stock_kg) - Number(order.kg) })
        .eq("id", order.lot_id);
    }
  }

  // 取消已确认/已发货的订单 → 恢复库存
  if (
    newStatus === "cancelled" &&
    (order.status === "confirmed" || order.status === "shipped")
  ) {
    const { data: lot } = await supabase
      .from("coffee_lots")
      .select("stock_kg")
      .eq("id", order.lot_id)
      .single();

    if (lot) {
      await supabase
        .from("coffee_lots")
        .update({ stock_kg: Number(lot.stock_kg) + Number(order.kg) })
        .eq("id", order.lot_id);
    }
  }

  const timestampField = STATUS_TIMESTAMP_MAP[newStatus];
  const updateData: Record<string, string | null> = { status: newStatus };
  if (timestampField) {
    updateData[timestampField] = new Date().toISOString();
  }

  const { error: updateErr } = await supabase
    .from("purchase_orders")
    .update(updateData)
    .eq("id", orderId);

  if (updateErr) return { error: updateErr.message };
  revalidatePath("/desk");
  return { ok: true as const };
}

/* ---------- 管理员：咖啡豆 CRUD ---------- */

export async function createCoffeeLot(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim() || null;
  const origin = String(formData.get("origin") ?? "").trim() || null;
  const priceRaw = formData.get("price_yuan_per_kg");
  const image_url = String(formData.get("image_url") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || "☕";
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const stockRaw = formData.get("stock_kg");
  const price_yuan_per_kg = Number(priceRaw);
  const stock_kg = Number(stockRaw);

  if (!name) return { error: "请填写名称" };
  if (!Number.isFinite(price_yuan_per_kg) || price_yuan_per_kg < 0) return { error: "价格无效" };
  if (!image_url) return { error: "请填写图片链接" };

  const { error } = await supabase.from("coffee_lots").insert({
    name, grade, origin, price_yuan_per_kg, image_url, emoji, tagline, sort_order, stock_kg,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/lots");
  revalidatePath("/desk");
  return { ok: true as const };
}

export async function updateCoffeeLot(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim() || null;
  const origin = String(formData.get("origin") ?? "").trim() || null;
  const priceRaw = formData.get("price_yuan_per_kg");
  const image_url = String(formData.get("image_url") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || "☕";
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const stockRaw = formData.get("stock_kg");
  const price_yuan_per_kg = Number(priceRaw);
  const stock_kg = Number(stockRaw);

  if (!id) return { error: "缺少批次 ID" };
  if (!name) return { error: "请填写名称" };

  const { error } = await supabase
    .from("coffee_lots")
    .update({ name, grade, origin, price_yuan_per_kg, image_url, emoji, tagline, sort_order, stock_kg })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/lots");
  revalidatePath("/desk");
  return { ok: true as const };
}

export async function deleteCoffeeLot(lotId: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const { error } = await supabase.from("coffee_lots").delete().eq("id", lotId);

  if (error) return { error: error.message };
  revalidatePath("/admin/lots");
  revalidatePath("/desk");
  return { ok: true as const };
}

/* ---------- 数据看板统计 ---------- */

export async function getDashboardStats(): Promise<
  { data: DashboardStats } | { error: string }
> {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const { data: orders, error: ordersErr } = await supabase
    .from("purchase_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: lots, error: lotsErr } = await supabase
    .from("coffee_lots")
    .select("*");

  if (ordersErr || lotsErr) return { error: "读取数据失败" };

  const orderList = orders ?? [];
  const lotList = lots ?? [];
  const lotMap = new Map(lotList.map((l) => [l.id, l]));

  const totalOrders = orderList.length;
  const totalKg = orderList.reduce((s, o) => s + Number(o.kg), 0);
  const totalValue = orderList.reduce((s, o) => {
    const lot = lotMap.get(o.lot_id);
    return s + Number(o.kg) * (lot ? Number(lot.price_yuan_per_kg) : 0);
  }, 0);

  const statusCount: Record<string, number> = {};
  for (const o of orderList) {
    statusCount[o.status] = (statusCount[o.status] ?? 0) + 1;
  }
  const ordersByStatus = Object.entries(statusCount).map(([status, count]) => ({
    status: status as OrderStatus,
    count,
  }));

  const monthMap = new Map<string, { count: number; kg: number; value: number }>();
  for (const o of orderList) {
    const m = new Date(o.created_at).toISOString().slice(0, 7);
    const prev = monthMap.get(m) ?? { count: 0, kg: 0, value: 0 };
    const lot = lotMap.get(o.lot_id);
    const lotPrice = lot ? Number(lot.price_yuan_per_kg) : 0;
    monthMap.set(m, {
      count: prev.count + 1,
      kg: prev.kg + Number(o.kg),
      value: prev.value + Number(o.kg) * lotPrice,
    });
  }
  const monthlyTrends = [...monthMap.entries()]
    .map(([month, v]) => ({ month, ...v }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const lotCount = new Map<
    string,
    { lot_id: string; lotName: string; emoji: string; orderCount: number; totalKg: number }
  >();
  for (const o of orderList) {
    const lot = lotMap.get(o.lot_id);
    if (!lot) continue;
    const prev = lotCount.get(o.lot_id) ?? {
      lot_id: o.lot_id,
      lotName: lot.name,
      emoji: lot.emoji,
      orderCount: 0,
      totalKg: 0,
    };
    prev.orderCount += 1;
    prev.totalKg += Number(o.kg);
    lotCount.set(o.lot_id, prev);
  }
  const popularLots = [...lotCount.values()]
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 10);

  return {
    data: { totalOrders, totalKg, totalValue, ordersByStatus, monthlyTrends, popularLots },
  };
}
