-- 在 Supabase 控制台 → SQL Editor 中整段粘贴执行（仅需执行一次）
-- 执行前请确认项目已创建；Auth 里建议开发阶段关闭「邮箱确认」以便快速测试

-- 1) 豆子批次表：所有人可读
create table if not exists public.coffee_lots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  grade text,
  origin text,
  price_yuan_per_kg numeric(10,2) not null check (price_yuan_per_kg >= 0),
  image_url text not null,
  emoji text not null default '☕',
  tagline text,
  sort_order int not null default 0
);

alter table public.coffee_lots enable row level security;

drop policy if exists "coffee_lots_select_public" on public.coffee_lots;
create policy "coffee_lots_select_public"
  on public.coffee_lots for select
  using (true);

-- 2) 采购意向单：登录用户可读全员、只能改自己的
create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  submitter_email text,
  buyer_company text not null,
  phone text not null,
  lot_id uuid not null references public.coffee_lots (id),
  kg numeric(12,2) not null check (kg > 0),
  note text not null default ''
);

create index if not exists purchase_orders_created_at_idx
  on public.purchase_orders (created_at desc);

alter table public.purchase_orders enable row level security;

drop policy if exists "purchase_orders_select_auth" on public.purchase_orders;
create policy "purchase_orders_select_auth"
  on public.purchase_orders for select
  to authenticated
  using (true);

drop policy if exists "purchase_orders_insert_own" on public.purchase_orders;
create policy "purchase_orders_insert_own"
  on public.purchase_orders for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "purchase_orders_update_own" on public.purchase_orders;
create policy "purchase_orders_update_own"
  on public.purchase_orders for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "purchase_orders_delete_own" on public.purchase_orders;
create policy "purchase_orders_delete_own"
  on public.purchase_orders for delete
  to authenticated
  using (auth.uid() = user_id);

-- 3) 示例数据（图片为 Unsplash 可外链地址）
insert into public.coffee_lots (name, grade, origin, price_yuan_per_kg, image_url, emoji, tagline, sort_order)
values
  ('云南保山 · 水洗', 'SCAA 84+', '云南保山', 118,
   'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', '🌿',
   '明亮酸质，柑橘与焦糖尾韵', 1),
  ('云南普洱 · 日晒', '商业级', '云南普洱', 72,
   'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80', '🍯',
   '甜感扎实，适合意式拼配', 2),
  ('埃塞耶加雪菲 · G1', '手冲推荐', '埃塞俄比亚', 156,
   'https://images.unsplash.com/photo-1514066558159-fc8c73773959?w=800&q=80', '🫐',
   '花香蓝莓，经典耶加调性', 3),
  ('巴西喜拉多 · 黄波旁', '意式基底', '巴西', 95,
   'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', '🍫',
   '坚果巧克力，油脂友好', 4),
  ('哥伦比亚蕙兰 · 水洗', '平衡型', '哥伦比亚', 132,
   'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', '🍎',
   '苹果酸质，焦糖甜感', 5);

-- 若重复执行导致示例数据重复，可在控制台手动 delete from public.coffee_lots;
