import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/");
  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-6 text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}>
        관리자 로그인
      </h1>
      <LoginForm />
    </main>
  );
}
