import Link from "next/link";

import BrandLogo from "@/components/brand-logo";

export default function SiteFooter() {
  return (
    <footer className="premium-footer">
      <div className="footer-glow" />

      <div className="footer-main">
        <div className="footer-brand-column">
          <BrandLogo />

          <h2>
            Medicine access should feel
            simpler.
          </h2>

          <p>
            A portfolio demonstration for
            discovering fictional pharmacy
            stock, comparing availability
            and managing reservations.
          </p>

          <div className="system-status">
            <span />
            Demo systems operational
          </div>
        </div>

        <div className="footer-column">
          <strong>Platform</strong>

          <Link href="/search">
            Medicine Search
          </Link>

          <Link href="/reservations">
            Reservations
          </Link>

          <Link href="/watchlist">
            Watchlist
          </Link>

          <Link href="/notifications">
            Notifications
          </Link>
        </div>

        <div className="footer-column">
          <strong>Explore</strong>

          <Link href="/#about">
            About
          </Link>

          <Link href="/#experience">
            Experience
          </Link>

          <Link href="/#faq">
            FAQ
          </Link>

          <Link href="/#contact">
            Contact
          </Link>
        </div>

        <div className="footer-column">
          <strong>Resources</strong>

          <span>Privacy</span>
          <span>Terms</span>
          <span>Accessibility</span>
          <span>Demo Disclaimer</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 MediFlux
        </span>

        <span>
          Portfolio demonstration only —
          fictional medicine and pharmacy
          data.
        </span>

        <div>
          <span>GitHub</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}