import Link from "next/link";

export default function PharmacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="role-navigation pharmacy-navigation">
        <div className="role-navigation-inner">
          <div className="role-navigation-brand">
            <span className="role-navigation-icon">
              +
            </span>

            <div>
              <strong>
                Pharmacy Portal
              </strong>

              <small>
                MediFlux Partner Services
              </small>
            </div>
          </div>

          <div className="role-navigation-links">
            <Link href="/pharmacy/dashboard">
              Inventory Dashboard
            </Link>

            <Link href="/pharmacy/register">
              Register Pharmacy
            </Link>

            <Link href="/search">
              Medicine Search
            </Link>

            <Link href="/">
              Public Website
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </>
  );
}