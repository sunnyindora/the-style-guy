import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User, Package, Heart, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <User className="w-12 h-12 mx-auto mb-6 text-neutral-400" />
        <h1 className="font-serif-display text-4xl font-bold mb-4">My Account</h1>
        <p className="text-neutral-600 mb-8">Sign in to access your wishlist, orders and account settings.</p>
        <div className="flex gap-4 justify-center">
          <Button as="link" href="/auth/login">Sign In</Button>
          <Button as="link" href="/auth/register" variant="outline">Create Account</Button>
        </div>
      </div>
    );
  }

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif-display text-4xl font-bold mb-2">Hello, {session.user.name || "there"}</h1>
      <p className="text-neutral-500 mb-10">{session.user.email}</p>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Link href="/wishlist" className="border border-neutral-200 p-6 hover:border-neutral-900 transition-colors">
          <Heart className="w-6 h-6 mb-3" />
          <h3 className="font-bold mb-1">Wishlist</h3>
          <p className="text-sm text-neutral-500">Saved products</p>
        </Link>
        <div className="border border-neutral-200 p-6 opacity-50">
          <Package className="w-6 h-6 mb-3" />
          <h3 className="font-bold mb-1">Orders</h3>
          <p className="text-sm text-neutral-500">Coming soon</p>
        </div>
        {isAdmin && (
          <Link href="/admin" className="border border-neutral-900 bg-neutral-900 text-white p-6 hover:bg-neutral-800 transition-colors">
            <User className="w-6 h-6 mb-3" />
            <h3 className="font-bold mb-1">Admin Dashboard</h3>
            <p className="text-sm text-neutral-400">Manage site</p>
          </Link>
        )}
      </div>

      <Link href="/api/auth/signout">
        <Button variant="outline">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </Link>
    </div>
  );
}
