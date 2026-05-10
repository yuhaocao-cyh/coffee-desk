-- 阶段 6：免登录匿名访问
-- 移除 user_id 非空约束，开放所有策略为公开访问

alter table public.purchase_orders
  alter column user_id drop not null;

-- purchase_orders 公开访问
drop policy if exists "purchase_orders_select_auth" on public.purchase_orders;
drop policy if exists "purchase_orders_select_public" on public.purchase_orders;
create policy "purchase_orders_select_public"
  on public.purchase_orders for select
  using (true);

drop policy if exists "purchase_orders_insert_own" on public.purchase_orders;
drop policy if exists "purchase_orders_insert_public" on public.purchase_orders;
create policy "purchase_orders_insert_public"
  on public.purchase_orders for insert
  with check (true);

drop policy if exists "purchase_orders_update" on public.purchase_orders;
drop policy if exists "purchase_orders_update_public" on public.purchase_orders;
create policy "purchase_orders_update_public"
  on public.purchase_orders for update
  using (true);

drop policy if exists "purchase_orders_delete" on public.purchase_orders;
drop policy if exists "purchase_orders_delete_public" on public.purchase_orders;
create policy "purchase_orders_delete_public"
  on public.purchase_orders for delete
  using (true);

-- coffee_lots 公开管理（免登录后不区分管理员）
drop policy if exists "coffee_lots_insert_admin" on public.coffee_lots;
drop policy if exists "coffee_lots_insert_public" on public.coffee_lots;
create policy "coffee_lots_insert_public"
  on public.coffee_lots for insert
  with check (true);

drop policy if exists "coffee_lots_update_admin" on public.coffee_lots;
drop policy if exists "coffee_lots_update_public" on public.coffee_lots;
create policy "coffee_lots_update_public"
  on public.coffee_lots for update
  using (true);

drop policy if exists "coffee_lots_delete_admin" on public.coffee_lots;
drop policy if exists "coffee_lots_delete_public" on public.coffee_lots;
create policy "coffee_lots_delete_public"
  on public.coffee_lots for delete
  using (true);
