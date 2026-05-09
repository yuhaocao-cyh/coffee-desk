import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { SupabaseClient } from "@supabase/supabase-js";

/** 服务端（Server Component / Server Action）使用的 Supabase 客户端；未配置环境变量时返回 null（便于无密钥时仍能 build） */
export async function createServerSupabase(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* 在部分 Server Action 场景下 set cookie 会失败，可忽略 */
        }
      },
    },
  });
}
