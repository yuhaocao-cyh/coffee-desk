import { redirect } from "next/navigation";

/** 免登录模式：直接跳转到工作台 */
export default function SignupPage() {
  redirect("/desk");
}
