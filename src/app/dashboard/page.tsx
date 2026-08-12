"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

type UserRole =
  | "CUSTOMER"
  | "PHARMACY_STAFF"
  | "ADMIN";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type MeResponse = {
  success: boolean;

  data?:
    | CurrentUser
    | {
        user:
          CurrentUser;
      };

  error?: {
    message?: string;
  };
};

export default function DashboardRouterPage() {
  const router =
    useRouter();

  useEffect(() => {
    let cancelled =
      false;

    async function resolveDashboard() {
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

        if (cancelled) {
          return;
        }

        switch (
          user.role
        ) {
          case "ADMIN":
            router.replace(
              "/admin",
            );

            break;

          case "PHARMACY_STAFF":
            router.replace(
              "/pharmacy/dashboard",
            );

            break;

          case "CUSTOMER":
            router.replace(
              "/reservations",
            );

            break;

          default:
            router.replace(
              "/",
            );
        }
      } catch {
        if (!cancelled) {
          router.replace(
            "/login",
          );
        }
      }
    }

    void resolveDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="portal-routing-page">
      <div className="portal-routing-card">
        <div className="portal-routing-spinner" />

        <span>
          MediFlux
        </span>

        <h1>
          Opening your portal...
        </h1>

        <p>
          Checking your account role and
          loading the correct dashboard.
        </p>
      </div>
    </main>
  );
}