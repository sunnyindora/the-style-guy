"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } else {
      const data = await res.json();
      toast.error(data.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3 text-center">Join</p>
        <h1 className="font-serif-display text-4xl font-bold mb-8 text-center">Create Account</h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Name</label>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-neutral-300 py-2 bg-transparent focus:outline-none focus:border-neutral-900"
            />
          </div>
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
              required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-neutral-300 py-2 bg-transparent focus:outline-none focus:border-neutral-900"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
