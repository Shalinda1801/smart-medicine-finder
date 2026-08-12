"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import SiteHeader from "@/components/site-header";
import { useLanguage } from "@/i18n/language-context";
import { apiRequest } from "@/lib/api-client";

type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function LoginPage() {
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data =
        await apiRequest<LoginResponse>(
          "/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              email,
              password,
            }),
          },
        );

      if (
        data.user.role ===
        "PHARMACY_STAFF"
      ) {
        window.location.href =
          "/pharmacy";
        return;
      }

      if (
        data.user.role === "ADMIN"
      ) {
        window.location.href =
          "/admin";
        return;
      }

      window.location.href =
        "/search";
    } catch (loginError: unknown) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : t("login.failed"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-heading">
            <span className="auth-icon">
              +
            </span>

            <h1>
              {t("login.title")}
            </h1>

            <p>
              {t("login.description")}
            </p>
          </div>

          {error && (
            <div
              className="error-box"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label>
              {t("login.email")}

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder={t(
                  "login.emailPlaceholder",
                )}
                autoComplete="email"
                required
              />
            </label>

            <label>
              {t("login.password")}

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder={t(
                  "login.passwordPlaceholder",
                )}
                autoComplete="current-password"
                required
              />
            </label>

            <button
              className="button primary auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? t("login.loading")
                : t("login.button")}
            </button>
          </form>

          <p className="auth-footer">
            {t("login.newUser")}{" "}

            <Link href="/register">
              {t("login.join")}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
