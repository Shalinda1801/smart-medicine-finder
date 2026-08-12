import Link from "next/link";

import RoleGuard from "@/components/auth/role-guard";

export default function AdminLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <RoleGuard
      allowedRoles={[
        "ADMIN",
      ]}
    >
      <nav className="role-navigation admin-navigation">
        <div className="role-navigation-inner">
          <div className="role-navigation-brand">
            <span className="role-navigation-icon">
              A
            </span>

            <div>
              <strong>
                Admin Portal
              </strong>

              <small>
                MediFlux Control Center
              </small>
            </div>
          </div>

          <div className="role-navigation-links">
            <Link href="/admin">
              Overview
            </Link>

            <Link href="/admin/pharmacies">
              Pharmacy Approvals
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
    </RoleGuard>
  );
}