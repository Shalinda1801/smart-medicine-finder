import RoleGuard from "@/components/auth/role-guard";

export default function PharmacyDashboardLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <RoleGuard
      allowedRoles={[
        "PHARMACY_STAFF",
      ]}
    >
      {children}
    </RoleGuard>
  );
}