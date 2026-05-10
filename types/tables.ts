/** 订单状态枚举 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "completed"
  | "cancelled";

/** 与数据库 coffee_lots 表字段对应 */
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
  stock_kg: number;
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
  status: OrderStatus;
  confirmed_at: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
};

/** 工作台展示：订单 + 关联豆子 */
export type DeskOrder = PurchaseOrderFlat & { lot: CoffeeLot };

/** 用户档案 */
export type UserProfile = {
  id: string;
  created_at: string;
  display_name: string | null;
  role: "admin" | "member";
};

/** 数据看板统计 */
export type DashboardStats = {
  totalOrders: number;
  totalKg: number;
  totalValue: number;
  ordersByStatus: { status: OrderStatus; count: number }[];
  monthlyTrends: { month: string; count: number; kg: number; value: number }[];
  popularLots: {
    lot_id: string;
    lotName: string;
    emoji: string;
    orderCount: number;
    totalKg: number;
  }[];
};
