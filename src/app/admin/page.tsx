import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="admin-home-page">
      <section className="admin-home-hero">
        <div>
          <span className="portal-label">
            MediFlux Administration
          </span>

          <h1>
            Administration
            <br />
            Control Center
          </h1>

          <p>
            Review pharmacy registrations,
            monitor the MediFlux platform and
            manage the services available to
            customers and pharmacy partners.
          </p>
        </div>

        <div className="admin-system-card">
          <span>Platform status</span>

          <strong>
            <i />
            System Online
          </strong>

          <small>
            PostgreSQL connected
          </small>
        </div>
      </section>

      <section className="admin-home-grid">
        <Link
          href="/admin/pharmacies"
          className="admin-action-card primary"
        >
          <div className="admin-action-icon">
            +
          </div>

          <span>Verification</span>

          <h2>
            Pharmacy Approvals
          </h2>

          <p>
            Review newly registered pharmacies,
            inspect their details and approve or
            reject applications.
          </p>

          <strong>
            Open verification →
          </strong>
        </Link>

        <Link
          href="/search"
          className="admin-action-card"
        >
          <div className="admin-action-icon">
            ⌕
          </div>

          <span>Customer Experience</span>

          <h2>
            Medicine Search
          </h2>

          <p>
            View the same medicine availability
            and pharmacy map experience used by
            MediFlux customers.
          </p>

          <strong>
            Open medicine finder →
          </strong>
        </Link>

        <Link
          href="/pharmacy/register"
          className="admin-action-card"
        >
          <div className="admin-action-icon">
            ✚
          </div>

          <span>Partners</span>

          <h2>
            Pharmacy Registration
          </h2>

          <p>
            Open the pharmacy partner registration
            process and inspect the experience seen
            by new pharmacies.
          </p>

          <strong>
            View registration →
          </strong>
        </Link>

        <Link
          href="/"
          className="admin-action-card"
        >
          <div className="admin-action-icon">
            ↗
          </div>

          <span>Public Website</span>

          <h2>
            MediFlux Home
          </h2>

          <p>
            Return to the public MediFlux website
            and review the main customer
            experience.
          </p>

          <strong>
            Visit website →
          </strong>
        </Link>
      </section>

      <section className="admin-workflow-panel">
        <div>
          <span className="portal-label">
            Pharmacy onboarding
          </span>

          <h2>
            How new pharmacy data reaches customers
          </h2>
        </div>

        <div className="admin-workflow">
          <article>
            <strong>01</strong>
            <span>Pharmacy registers</span>
          </article>

          <article>
            <strong>02</strong>
            <span>Admin verifies</span>
          </article>

          <article>
            <strong>03</strong>
            <span>Staff adds inventory</span>
          </article>

          <article>
            <strong>04</strong>
            <span>Medicine enters search</span>
          </article>

          <article>
            <strong>05</strong>
            <span>Map marker appears</span>
          </article>
        </div>
      </section>
    </main>
  );
}