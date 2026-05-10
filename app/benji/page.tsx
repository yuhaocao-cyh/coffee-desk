import { redirect } from "next/navigation";

/** 本机版已归档，统一跳转到云端工作台 */
export default function BenjiRedirect() {
  redirect("/desk");
}
