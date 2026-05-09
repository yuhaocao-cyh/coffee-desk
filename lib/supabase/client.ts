import { createBrowserClient } from "@supabase/ssr";

/**
 * 浏览器端 Supabase 单例（组件里调用）
 * 环境变量未配置时返回 null，避免本地误跑直接崩溃
 */
export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
