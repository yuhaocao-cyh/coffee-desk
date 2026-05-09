"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

export async function createPurchaseOrder(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "请先登录" };

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
    user_id: user.id,
    submitter_email: user.email ?? null,
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

export async function deletePurchaseOrder(orderId: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "未配置 Supabase 环境变量" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "请先登录" };

  const { error } = await supabase.from("purchase_orders").delete().eq("id", orderId).eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/desk");
  return { ok: true as const };
}
