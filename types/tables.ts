/** 与数据库 coffee_lots 表字段对应（便于组件传参） */
export type CoffeeLot = {
  id: string;
  name: string;
  grade: string | null;
  origin: string | null;
  price_yuan_per_kg: number;
  image_url: string;
  emoji: string;
  tagline: string | null;
  sort_order: number;
};

/** purchase_orders 扁平行 */
export type PurchaseOrderFlat = {
  id: string;
  created_at: string;
  user_id: string;
  submitter_email: string | null;
  buyer_company: string;
  phone: string;
  lot_id: string;
  kg: number;
  note: string;
};

/** 工作台展示：订单 + 关联豆子（服务端拼好，避免嵌套查询命名差异） */
export type DeskOrder = PurchaseOrderFlat & { lot: CoffeeLot };
