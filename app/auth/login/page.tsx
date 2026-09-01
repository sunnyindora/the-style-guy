"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3 text-center">Account</p>
        <h1 className="font-serif-display text-4xl font-bold mb-8 text-center">Sign In</h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</label>
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-neutral-300 py-2 bg-transparent focus:outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Password</label>
            <input
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-neutral-300 py-2 bg-transparent focus:outline-none focus:border-neutral-900"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Don't have an account?{" "}
          <Link href="/auth/register" className="underline font-semibold">Create one</Link>
        </p>
        <div className="mt-8 p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
          <p className="font-semibold mb-1">Demo Admin:</p>
          <p>Email: admin@thestyleguy.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
