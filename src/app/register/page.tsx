"use client";

import {
  type FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/i18n/language-context";

import styles from "./register-choice.module.css";

type AccountType =
  | "CUSTOMER"
  | "PHARMACY";

type RegisterResponse = {
  success: boolean;
  data?: unknown;
  error?: {
    code?: string;
    message?: string;
    fieldErrors?: Record<
      string,
      string[]
    >;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [
    accountType,
    setAccountType,
  ] =
    useState<AccountType>(
      "CUSTOMER",
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function registerCustomer(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError(
        t("register.error.name"),
      );
      return;
    }

    if (!email.trim()) {
      setError(
        t("register.error.email"),
      );
      return;
    }

    if (password.length < 8) {
      setError(
        t(
          "register.error.passwordLength",
        ),
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        t(
          "register.error.passwordMatch",
        ),
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  name.trim(),

                email:
                  email
                    .trim()
                    .toLowerCase(),

                password,

                confirmPassword,
              }),
          },
        );

      const payload =
        (await response.json()) as
          RegisterResponse;

      if (
        !response.ok ||
        !payload.success
      ) {
        const fieldErrors =
          payload.error
            ?.fieldErrors;

        if (fieldErrors) {
          const firstError =
            Object.values(
              fieldErrors,
            )
              .flat()
              .find(Boolean);

          if (firstError) {
            throw new Error(
              firstError,
            );
          }
        }

        throw new Error(
          payload.error
            ?.message ??
            t(
              "register.error.generic",
            ),
        );
      }

      setSuccess(
        t("register.success"),
      );

      window.setTimeout(
        () => {
          router.push(
            "/login",
          );
        },
        800,
      );
    } catch (
      registerError:
        unknown
    ) {
      setError(
        registerError instanceof
          Error
          ? registerError.message
          : t(
              "register.error.generic",
            ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={styles.page}
    >
      <section
        className={styles.intro}
      >
        <Link
          href="/"
          className={styles.brand}
        >
          <span
            className={styles.logo}
          >
            +
          </span>

          <span>
            Medi
            <strong>
              Flux
            </strong>
          </span>
        </Link>

        <span
          className={styles.badge}
        >
          {t("register.badge")}
        </span>

        <h1>
          {t(
            "register.heroTitle",
          )}
        </h1>

        <p>
          {t(
            "register.heroDescription",
          )}
        </p>

        <div
          className={styles.steps}
        >
          <div>
            <strong>
              01
            </strong>

            <span>
              {t(
                "register.step1",
              )}
            </span>
          </div>

          <div>
            <strong>
              02
            </strong>

            <span>
              {t(
                "register.step2",
              )}
            </span>
          </div>

          <div>
            <strong>
              03
            </strong>

            <span>
              {t(
                "register.step3",
              )}
            </span>
          </div>
        </div>
      </section>

      <section
        className={styles.panel}
      >
        <div
          className={
            styles.panelHeader
          }
        >
          <span>
            {t(
              "register.accountType",
            )}
          </span>

          <h2>
            {t(
              "register.question",
            )}
          </h2>

          <p>
            {t(
              "register.selectDescription",
            )}
          </p>
        </div>

        <div
          className={styles.roleGrid}
          role="radiogroup"
          aria-label={t(
            "register.chooseAccountAria",
          )}
        >
          <label
            className={`${styles.roleCard} ${
              accountType ===
              "CUSTOMER"
                ? styles.roleCardActive
                : ""
            }`}
          >
            <input
              className={
                styles.radioInput
              }
              type="radio"
              name="accountType"
              value="CUSTOMER"
              checked={
                accountType ===
                "CUSTOMER"
              }
              onChange={() =>
                setAccountType(
                  "CUSTOMER",
                )
              }
            />

            <div
              className={
                styles.roleIcon
              }
            >
              👤
            </div>

            <div
              className={
                styles.roleText
              }
            >
              <strong>
                {t(
                  "register.customer",
                )}
              </strong>

              <span>
                {t(
                  "register.customerDescription",
                )}
              </span>
            </div>

            <div
              className={
                styles.selector
              }
            >
              {accountType ===
              "CUSTOMER"
                ? "✓"
                : ""}
            </div>
          </label>

          <label
            className={`${styles.roleCard} ${
              accountType ===
              "PHARMACY"
                ? styles.roleCardActive
                : ""
            }`}
          >
            <input
              className={
                styles.radioInput
              }
              type="radio"
              name="accountType"
              value="PHARMACY"
              checked={
                accountType ===
                "PHARMACY"
              }
              onChange={() =>
                setAccountType(
                  "PHARMACY",
                )
              }
            />

            <div
              className={
                styles.roleIcon
              }
            >
              ✚
            </div>

            <div
              className={
                styles.roleText
              }
            >
              <strong>
                {t(
                  "register.pharmacy",
                )}
              </strong>

              <span>
                {t(
                  "register.pharmacyDescription",
                )}
              </span>
            </div>

            <div
              className={
                styles.selector
              }
            >
              {accountType ===
              "PHARMACY"
                ? "✓"
                : ""}
            </div>
          </label>
        </div>

        {accountType ===
        "CUSTOMER" ? (
          <div
            className={
              styles.formSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <div
                className={
                  styles.smallIcon
                }
              >
                👤
              </div>

              <div>
                <h3>
                  {t(
                    "register.customerTitle",
                  )}
                </h3>

                <p>
                  {t(
                    "register.customerSubtitle",
                  )}
                </p>
              </div>
            </div>

            <form
              onSubmit={
                registerCustomer
              }
              className={styles.form}
            >
              <label>
                {t(
                  "register.fullName",
                )}

                <input
                  type="text"
                  placeholder={t(
                    "register.namePlaceholder",
                  )}
                  value={name}
                  onChange={(
                    event,
                  ) =>
                    setName(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                {t(
                  "register.email",
                )}

                <input
                  type="email"
                  placeholder={t(
                    "login.emailPlaceholder",
                  )}
                  value={email}
                  onChange={(
                    event,
                  ) =>
                    setEmail(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="email"
                  required
                />
              </label>

              <div
                className={
                  styles.twoColumns
                }
              >
                <label>
                  {t(
                    "register.password",
                  )}

                  <input
                    type="password"
                    placeholder={t(
                      "register.passwordPlaceholder",
                    )}
                    value={password}
                    onChange={(
                      event,
                    ) =>
                      setPassword(
                        event.target
                          .value,
                      )
                    }
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label>
                  {t(
                    "register.confirmPassword",
                  )}

                  <input
                    type="password"
                    placeholder={t(
                      "register.confirmPlaceholder",
                    )}
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event,
                    ) =>
                      setConfirmPassword(
                        event.target
                          .value,
                      )
                    }
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />
                </label>
              </div>

              {error && (
                <div
                  className={
                    styles.error
                  }
                  role="alert"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className={
                    styles.success
                  }
                  role="status"
                >
                  {success}
                </div>
              )}

              <button
                className={
                  styles.primaryButton
                }
                type="submit"
                disabled={loading}
              >
                {loading
                  ? t(
                      "register.creating",
                    )
                  : t(
                      "register.customerButton",
                    )}
              </button>
            </form>
          </div>
        ) : (
          <div
            className={
              styles.pharmacyPanel
            }
          >
            <div
              className={
                styles.pharmacyIcon
              }
            >
              +
            </div>

            <span
              className={
                styles.partnerLabel
              }
            >
              {t(
                "register.pharmacyPartnerLabel",
              )}
            </span>

            <h3>
              {t(
                "register.pharmacyTitle",
              )}
            </h3>

            <p>
              {t(
                "register.pharmacyText",
              )}
            </p>

            <div
              className={
                styles.partnerBenefits
              }
            >
              <div>
                <span>
                  ✓
                </span>

                {t(
                  "register.inventory",
                )}
              </div>

              <div>
                <span>
                  ✓
                </span>

                {t(
                  "register.prices",
                )}
              </div>

              <div>
                <span>
                  ✓
                </span>

                {t(
                  "register.map",
                )}
              </div>

              <div>
                <span>
                  ✓
                </span>

                {t(
                  "register.reservations",
                )}
              </div>
            </div>

            <div
              className={
                styles.verificationNotice
              }
            >
              <span>
                🛡
              </span>

              <div>
                <strong>
                  {t(
                    "register.verification",
                  )}
                </strong>

                <p>
                  {t(
                    "register.verificationText",
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={() =>
                router.push(
                  "/pharmacy/register",
                )
              }
            >
              {t(
                "register.pharmacyButton",
              )}{" "}
              →
            </button>
          </div>
        )}

        <div
          className={
            styles.loginFooter
          }
        >
          {t(
            "register.already",
          )}{" "}

          <Link href="/login">
            {t(
              "register.signin",
            )}
          </Link>
        </div>
      </section>
    </main>
  );
}
