import Link from "next/link";

type Props = {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

/** 可复用的空状态组件 */
export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-500/30 bg-black/20 px-6 py-12 text-center">
      <p className="text-4xl">{icon}</p>
      <h3 className="mt-3 text-base font-medium text-amber-50">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-amber-200/70">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-block rounded-full bg-amber-500/20 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/30"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/** 骨架屏：卡片加载状态 */
export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="aspect-[4/3] w-full rounded-xl bg-white/10" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  );
}

/** 骨架屏：列表行 */
export function SkeletonRow() {
  return (
    <div className="animate-pulse flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="h-24 w-24 shrink-0 rounded-xl bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
        <div className="h-3 w-1/4 rounded bg-white/5" />
      </div>
    </div>
  );
}
