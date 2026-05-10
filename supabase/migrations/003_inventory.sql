-- 阶段 2：为咖啡豆批次增加库存字段
-- 独立执行，不会破坏现有数据

alter table public.coffee_lots
  add column if not exists stock_kg numeric(12,2) not null default 0
  check (stock_kg >= 0);

-- 为现有示例数据填充初始库存
update public.coffee_lots set stock_kg = 500 where name = '云南保山 · 水洗';
update public.coffee_lots set stock_kg = 300 where name = '云南普洱 · 日晒';
update public.coffee_lots set stock_kg = 200 where name = '埃塞耶加雪菲 · G1';
update public.coffee_lots set stock_kg = 400 where name = '巴西喜拉多 · 黄波旁';
update public.coffee_lots set stock_kg = 250 where name = '哥伦比亚蕙兰 · 水洗';
