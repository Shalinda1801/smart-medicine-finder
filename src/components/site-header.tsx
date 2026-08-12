"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BrandLogo from "@/components/brand-logo";
import CommandPalette from "@/components/command-palette";
import { apiRequest } from "@/lib/api-client";

import {
  type Language,
  useLanguage,
} from "@/i18n/language-context";

type CurrentUserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role:
      | "CUSTOMER"
      | "PHARMACY_STAFF"
      | "ADMIN";
  };
};

export default function SiteHeader() {
  const router = useRouter();

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const [user, setUser] =
    useState<CurrentUserResponse["user"] | null>(
      null,
    );

  const [servicesOpen, setServicesOpen] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [commandOpen, setCommandOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const data =
          await apiRequest<CurrentUserResponse>(
            "/api/auth/me",
          );

        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem(
        "mediflux-theme",
      );

    document.documentElement.dataset.theme =
      savedTheme === "dark"
        ? "dark"
        : "light";
  }, []);

  useEffect(() => {
    function handleShortcut(
      event: KeyboardEvent,
    ) {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setCommandOpen(
          (current) => !current,
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut,
      );
    };
  }, []);

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value =
      searchText.trim();

    if (!value) {
      router.push("/search");
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(
        value,
      )}`,
    );
  }

  function toggleTheme() {
    const current =
      document.documentElement.dataset
        .theme;

    const next =
      current === "dark"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme =
      next;

    window.localStorage.setItem(
      "mediflux-theme",
      next,
    );
  }

  async function logout() {
    try {
      await apiRequest(
        "/api/auth/logout",
        {
          method: "POST",
        },
      );
    } catch {
      // Continue with local logout.
    }

    setUser(null);

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="mf-header">
        <div className="mf-header-inner">
          <BrandLogo />

          <nav
            className="mf-nav"
            aria-label="Main navigation"
          >
            <Link href="/">
              {t("nav.home")}
            </Link>

            <Link href="/#about">
              {t("nav.about")}
            </Link>

            <div
              className="mf-nav-dropdown"
              onMouseEnter={() =>
                setServicesOpen(true)
              }
              onMouseLeave={() =>
                setServicesOpen(false)
              }
            >
              <button
                type="button"
                onClick={() =>
                  setServicesOpen(
                    (current) =>
                      !current,
                  )
                }
              >
                {t("nav.services")}
                <span>▾</span>
              </button>

              {servicesOpen && (
                <div className="mf-mega-menu">
                  <div className="mf-mega-intro">
                    <small>
                      {t(
                        "services.title",
                      )}
                    </small>

                    <h3>
                      Find, reserve and
                      follow medicine.
                    </h3>

                    <p>
                      Everything you need
                      for medicine
                      availability in one
                      place.
                    </p>
                  </div>

                  <div className="mf-mega-links">
                    <Link href="/search">
                      <span>⌕</span>

                      <div>
                        <strong>
                          {t(
                            "services.search",
                          )}
                        </strong>

                        <small>
                          Compare medicine
                          stock and prices
                        </small>
                      </div>
                    </Link>

                    <Link href="/reservations">
                      <span>▣</span>

                      <div>
                        <strong>
                          {t(
                            "services.reservations",
                          )}
                        </strong>

                        <small>
                          Manage your
                          reservations
                        </small>
                      </div>
                    </Link>

                    <Link href="/watchlist">
                      <span>♡</span>

                      <div>
                        <strong>
                          {t(
                            "services.watchlist",
                          )}
                        </strong>

                        <small>
                          Follow medicine
                          availability
                        </small>
                      </div>
                    </Link>

                    <Link href="/notifications">
                      <span>◉</span>

                      <div>
                        <strong>
                          {t(
                            "services.notifications",
                          )}
                        </strong>

                        <small>
                          Stock and pickup
                          updates
                        </small>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/#experience">
              {t("nav.experience")}
            </Link>

            <Link href="/#faq">
              {t("nav.faq")}
            </Link>

            <Link href="/#contact">
              {t("nav.contact")}
            </Link>
          </nav>

          <div className="mf-header-actions">
            <form
              className="mf-header-search"
              onSubmit={handleSearch}
            >
              <span aria-hidden="true">
                ⌕
              </span>

              <input
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value,
                  )
                }
                placeholder={t(
                  "nav.searchPlaceholder",
                )}
                aria-label={t(
                  "nav.search",
                )}
              />

              <button
                type="submit"
                aria-label={t(
                  "nav.search",
                )}
              >
                →
              </button>
            </form>

            <button
              type="button"
              className="mf-command"
              onClick={() =>
                setCommandOpen(true)
              }
              aria-label="Open command center"
            >
              ⌘
              <kbd>K</kbd>
            </button>

            <div className="mf-language">
              <span>◎</span>

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target
                      .value as Language,
                  )
                }
                aria-label="Language"
              >
                <option value="en">
                  English
                </option>

                <option value="si">
                  සිංහල
                </option>
              </select>
            </div>

            {user ? (
              <div className="mf-user-menu">
                <span className="mf-user-name">
                  {user.name}
                </span>

                {user.role ===
                  "PHARMACY_STAFF" && (
                  <Link href="/pharmacy">
                    Dashboard
                  </Link>
                )}

                {user.role ===
                  "ADMIN" && (
                  <Link href="/admin">
                    Admin
                  </Link>
                )}

                <button
                  type="button"
                  onClick={logout}
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="mf-auth-links">
                <Link href="/login">
                  {t("nav.login")}
                </Link>

                <Link
                  href="/register"
                  className="mf-signup"
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )}

            <button
              type="button"
              className="mf-theme-switch"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <span className="mf-switch-track">
                <span className="mf-sun">
                  ☀
                </span>

                <span className="mf-moon">
                  ☾
                </span>

                <span className="mf-switch-dot" />
              </span>
            </button>

            <button
              type="button"
              className="mf-mobile-button"
              onClick={() =>
                setMobileOpen(
                  (current) =>
                    !current,
                )
              }
              aria-label="Mobile menu"
            >
              {mobileOpen
                ? "✕"
                : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="mf-mobile-nav">
            <Link href="/">
              {t("nav.home")}
            </Link>

            <Link href="/#about">
              {t("nav.about")}
            </Link>

            <Link href="/search">
              {t("nav.search")}
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

            <Link href="/#faq">
              FAQ
            </Link>

            <Link href="/#contact">
              Contact
            </Link>
          </nav>
        )}
      </header>

      <CommandPalette
        open={commandOpen}
        onClose={() =>
          setCommandOpen(false)
        }
      />
    </>
  );
}