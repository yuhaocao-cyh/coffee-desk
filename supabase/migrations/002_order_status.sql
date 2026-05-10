-- 阶段 1：为采购订单增加状态流转和时间戳
-- 独立执行，不会破坏现有数据

alter table public.purchase_orders
  add column if not exists status text not null default 'pending'
  check (status in ('pending', 'confirmed', 'shipped', 'completed', 'cancelled'));

alter table public.purchase_orders
  add column if not exists confirmed_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists cancelled_at timestamptz;

-- 现有行状态设为 pending（新行 default 已处理）
update public.purchase_orders set status = 'pending' where status is null;
