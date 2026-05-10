import Link from "next/link"
import Image from "next/image"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .legal-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(251, 250, 245, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(26, 15, 46, 0.08);
        }
        .legal-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .legal-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        @media (max-width: 640px) {
          .legal-nav-links { display: none; }
        }
        .legal-nav-links a {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6B489A;
          text-decoration: none;
          transition: color 0.15s;
        }
        .legal-nav-links a:hover { color: #25034E; }
        .legal-nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legal-btn-ghost {
          font-size: 0.875rem;
          font-weight: 500;
          color: #25034E;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .legal-btn-ghost:hover { background: rgba(26,15,46,0.06); }
        .legal-btn-primary {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          background: #25034E;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 8px;
          transition: opacity 0.15s;
        }
        .legal-btn-primary:hover { opacity: 0.88; }

        .legal-footer {
          background: #110820;
          padding: 32px 24px;
          margin-top: 80px;
        }
        .legal-footer-inner {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .legal-footer p { font-size: 13px; color: #6B489A; margin: 0; }
        .legal-footer-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .legal-footer-links a {
          font-size: 13px;
          color: #6B489A;
          text-decoration: none;
          transition: color 0.15s;
        }
        .legal-footer-links a:hover { color: #B8A5D5; }
      `}</style>

      <nav className="legal-nav">
        <div className="legal-nav-inner">
          <Link href="/">
            <Image src="/logos/logo-dark.png" alt="keskireste." width={140} height={34} style={{ height: 30, width: "auto" }} priority />
          </Link>
          <ul className="legal-nav-links">
            <li><Link href="/#how">Comment ça marche</Link></li>
            <li><Link href="/#pricing">Tarifs</Link></li>
            <li><Link href="/histoire">Notre histoire</Link></li>
          </ul>
          <div className="legal-nav-actions">
            <Link href="/login" className="legal-btn-ghost">Se connecter</Link>
            <Link href="/signup" className="legal-btn-primary">Essayer gratuitement</Link>
          </div>
        </div>
      </nav>

      {children}

      <footer className="legal-footer">
        <div className="legal-footer-inner">
          <p>© 2025 keskireste. — Fait avec ♥ à Mpl.</p>
          <nav className="legal-footer-links">
            <Link href="/legal/mentions">Mentions légales</Link>
            <Link href="/legal/confidentialite">Confidentialité</Link>
            <Link href="/legal/cgv">CGV</Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
