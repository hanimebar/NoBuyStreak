import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/app/dashboard" className="font-bold text-gray-900">
          NoBuy Streak
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/app/rules/new" className="text-gray-600 hover:text-gray-900">+ Rule</Link>
          <Link href="/app/temptations/new" className="text-gray-600 hover:text-gray-900">Log temptation</Link>
          <Link href="/app/settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
