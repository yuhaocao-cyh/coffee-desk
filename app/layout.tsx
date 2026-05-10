import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "云豆集 · 咖啡豆采购登记",
  description: "Supabase 云端保存 · 多人协作工作台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
