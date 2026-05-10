-- 阶段 3：用户角色与权限系统

-- 1) 用户档案表
create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  display_name text,
  role text not null default 'member'
    check (role in ('admin', 'member'))
);

alter table public.user_profiles enable row level security;

-- 所有已认证用户可读
drop policy if exists "user_profiles_select_auth" on public.user_profiles;
create policy "user_profiles_select_auth"
  on public.user_profiles for select
  to authenticated
  using (true);

-- 用户可插入自己的档案（首次登录时自动创建）
drop policy if exists "user_profiles_insert_own" on public.user_profiles;
create policy "user_profiles_insert_own"
  on public.user_profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- 用户更新自己的档案，管理员可更新全部
drop policy if exists "user_profiles_update" on public.user_profiles;
create policy "user_profiles_update"
  on public.user_profiles for update
  to authenticated
  using (
    auth.uid() = id or
    exists (select 1 from public.user_profiles where id = auth.uid() and role = 'admin')
  );

-- 2) 更新 purchase_orders 策略：管理员可管理全部
drop policy if exists "purchase_orders_delete_own" on public.purchase_orders;
drop policy if exists "purchase_orders_delete" on public.purchase_orders;
create policy "purchase_orders_delete"
  on public.purchase_orders for delete
  to authenticated
  using (
    auth.uid() = user_id or
    exists (select 1 from public.user_profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "purchase_orders_update_own" on public.purchase_orders;
drop policy if exists "purchase_orders_update" on public.purchase_orders;
create policy "purchase_orders_update"
  on public.purchase_orders for update
  to authenticated
  using (
    auth.uid() = user_id or
    exists (select 1 from public.user_profiles where id = auth.uid() and role = 'admin')
  );

-- 3) 管理员对 coffee_lots 的增删改权限
drop policy if exists "coffee_lots_insert_admin" on public.coffee_lots;
create policy "coffee_lots_insert_admin"
  on public.coffee_lots for insert
  to authenticated
  with check (exists (
    select 1 from public.user_profiles where id = auth.uid() and role = 'admin'
  ));

drop policy if exists "coffee_lots_update_admin" on public.coffee_lots;
create policy "coffee_lots_update_admin"
  on public.coffee_lots for update
  to authenticated
  using (exists (
    select 1 from public.user_profiles where id = auth.uid() and role = 'admin'
  ));

drop policy if exists "coffee_lots_delete_admin" on public.coffee_lots;
create policy "coffee_lots_delete_admin"
  on public.coffee_lots for delete
  to authenticated
  using (exists (
    select 1 from public.user_profiles where id = auth.uid() and role = 'admin'
  ));

-- 提示：部署后需手动执行以下 SQL 将某个用户设为管理员（替换为实际 UUID）：
-- insert into public.user_profiles (id, display_name, role)
-- values ('<用户UUID>', '管理员', 'admin');
