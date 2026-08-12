"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

type UserRole =
  | "CUSTOMER"
  | "PHARMACY_STAFF"
  | "ADMIN";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type MeResponse = {
  success: boolean;

  data?:
    | User
    | {
        user: User;
      };

  error?: {
    message?: string;
  };
};

type RoleGuardProps = {
  children: ReactNode;

  allowedRoles:
    UserRole[];
};

export default function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {
  const router =
    useRouter();

  const [
    checking,
    setChecking,
  ] = useState(true);

  const [
    allowed,
    setAllowed,
  ] = useState(false);

  useEffect(() => {
    let cancelled =
      false;

    async function checkAccess() {
      try {
        const response =
          await fetch(
            "/api/auth/me",
            {
              cache:
                "no-store",
            },
          );

        if (
          response.status ===
          401
        ) {
          router.replace(
            "/login",
          );

          return;
        }

        const payload =
          (await response.json()) as MeResponse;

        if (
          !response.ok ||
          !payload.success ||
          !payload.data
        ) {
          router.replace(
            "/login",
          );

          return;
        }

        const user =
          "user" in
          payload.data
            ? payload.data.user
            : payload.data;

        if (
          cancelled
        ) {
          return;
        }

        if (
          allowedRoles.includes(
            user.role,
          )
        ) {
          setAllowed(true);

          return;
        }

        /*
          Logged in, but wrong role.
          Send them to their own dashboard.
        */

        router.replace(
          "/dashboard",
        );
      } catch {
        router.replace(
          "/login",
        );
      } finally {
        if (
          !cancelled
        ) {
          setChecking(false);
        }
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
 // eslint-disable-next-line react-hooks/exhaustive-deps
}, [router]);

  if (
    checking
  ) {
    return (
      <main className="portal-routing-page">
        <div className="portal-routing-card">
          <div className="portal-routing-spinner" />

          <span>
            MediFlux Security
          </span>

          <h1>
            Checking access...
          </h1>

          <p>
            Verifying your account
            permissions.
          </p>
        </div>
      </main>
    );
  }

  if (
    !allowed
  ) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}