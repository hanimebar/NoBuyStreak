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
      {/* Top nav — desktop */}
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Logo variant="horizontal" size="xs" />
        </Link>
        <div className="hidden sm:flex items-center gap-4 text-xs text-muted">
          <Link href="/app/dashboard" className="hover:text-amber transition">DASHBOARD</Link>
          <Link href="/app/rules/new" className="hover:text-amber transition">+ RULE</Link>
          <Link href="/app/temptations/new" className="hover:text-amber transition">LOG</Link>
          <Link href="/app/settings" className="hover:text-amber transition">SETTINGS</Link>
          <SignOutButton />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 sm:pb-8">{children}</main>

      {/* Bottom nav — mobile only */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background flex items-center justify-around px-2 py-3 z-40">
        <Link href="/app/dashboard" className="flex flex-col items-center gap-0.5 text-muted hover:text-amber transition">
          <span className="text-lg leading-none">⌂</span>
          <span className="font-mono text-[9px]">HOME</span>
        </Link>
        <Link href="/app/rules/new" className="flex flex-col items-center gap-0.5 text-muted hover:text-amber transition">
          <span className="text-lg leading-none">+</span>
          <span className="font-mono text-[9px]">RULE</span>
        </Link>
        <Link href="/app/temptations/new" className="flex flex-col items-center gap-0.5 text-muted hover:text-amber transition">
          <span className="text-lg leading-none">!</span>
          <span className="font-mono text-[9px]">LOG</span>
        </Link>
        <Link href="/app/settings" className="flex flex-col items-center gap-0.5 text-muted hover:text-amber transition">
          <span className="text-lg leading-none">⚙</span>
          <span className="font-mono text-[9px]">SETTINGS</span>
        </Link>
      </nav>
    </div>
  );
}
