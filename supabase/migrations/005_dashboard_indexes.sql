-- 阶段 5：性能索引（独立执行）

-- 按状态查询（看板/筛选）
create index if not exists purchase_orders_status_idx
  on public.purchase_orders (status);

-- 按用户查询（我的订单）
create index if not exists purchase_orders_user_id_idx
  on public.purchase_orders (user_id);

-- 按豆子查询（热门分析）
create index if not exists purchase_orders_lot_id_idx
  on public.purchase_orders (lot_id);

-- 月度聚合索引
create index if not exists purchase_orders_created_at_month_idx
  on public.purchase_orders ((date_trunc('month', created_at)));

-- 看板常用排序
create index if not exists purchase_orders_status_created_idx
  on public.purchase_orders (status, created_at desc);
