import Link from "next/link";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/app/dashboard">
          <Logo variant="horizontal" size="xs" />
        </Link>
        <div className="flex items-center gap-4 text-xs text-muted">
          <Link href="/app/rules/new" className="hover:text-amber transition">+ RULE</Link>
          <Link href="/app/temptations/new" className="hover:text-amber transition">LOG TEMPTATION</Link>
          <Link href="/app/settings" className="hover:text-amber transition">SETTINGS</Link>
          <SignOutButton />
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
