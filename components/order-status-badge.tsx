import type { OrderStatus } from "@/types/tables";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: "待确认",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  confirmed: {
    label: "已确认",
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  shipped: {
    label: "已发货",
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
  },
  completed: {
    label: "已完成",
    bg: "bg-green-500/15",
    text: "text-green-300",
    border: "border-green-500/30",
  },
  cancelled: {
    label: "已取消",
    bg: "bg-rose-500/15",
    text: "text-rose-300",
    border: "border-rose-500/30",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text} ${c.border}`}
    >
      {c.label}
    </span>
  );
}
