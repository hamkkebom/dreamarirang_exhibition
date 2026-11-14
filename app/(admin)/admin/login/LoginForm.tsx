"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="password" className="text-sm font-semibold text-[#6b6b6b]">
        비밀번호
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="rounded-md border border-[#e8e4df] bg-white px-3 py-2"
      />
      {state?.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="mt-2 rounded-md bg-[#1B1F3B] px-4 py-2 font-semibold text-white disabled:opacity-50">
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
