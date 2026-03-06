import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-10 font-mono text-xs text-muted">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Links row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          <Link href="/privacy" className="hover:text-amber transition">PRIVACY POLICY</Link>
          <Link href="/terms" className="hover:text-amber transition">TERMS OF SERVICE</Link>
          <Link href="/pricing" className="hover:text-amber transition">PRICING</Link>
          <Link href="/leaderboard" className="hover:text-amber transition">LEADERBOARD</Link>
          <a href="mailto:reachout@actvli.com" className="hover:text-amber transition">CONTACT</a>
        </div>

        {/* GDPR notice */}
        <div className="text-center space-y-1 text-muted/80 leading-relaxed max-w-2xl mx-auto">
          <p>
            Data controller: <strong className="text-muted">Äctvli Responsible Consulting</strong> ·{" "}
            <a href="mailto:reachout@actvli.com" className="hover:text-amber transition">reachout@actvli.com</a>
          </p>
          <p>
            We store only what you give us. No ads. No tracking. No selling your data.
            Session cookies only. You can delete your account and all data at any time from Settings.
          </p>
          <p>
            EU residents have rights under GDPR: access, rectification, erasure, portability, and the right to lodge a complaint with your national data protection authority.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="text-center border-t border-border pt-4">
          <p>
            © {new Date().getFullYear()} NOBUY STREAK · A product by{" "}
            <a
              href="https://actvli.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber transition"
            >
              ÄCTVLI RESPONSIBLE CONSULTING
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
