"use client";

import Image from "next/image";
import Link from "next/link";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  type Language,
  useLanguage,
} from "@/i18n/language-context";

import styles from "./premium-home.module.css";

/* =========================================================
   TYPES
========================================================= */

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type HeroSlide = {
  image: string;
  label: string;
};

/* =========================================================
   HERO SLIDES
========================================================= */

const heroSlides: HeroSlide[] = [
  {
    image:
      "/images/hero/hero-pharmacy.png",
    label:
      "Modern pharmacy",
  },
  {
    image:
      "/images/hero/hero-pharmacist.png",
    label:
      "Pharmacist care",
  },
  {
    image:
      "/images/hero/hero-care.png",
    label:
      "Customer care",
  },
  {
    image:
      "/images/hero/hero-laboratory.png",
    label:
      "Pharmacy laboratory",
  },
  {
    image:
      "/images/hero/hero-medicine.png",
    label:
      "Medicine availability",
  },
];

/* =========================================================
   AUTH RESPONSE HELPERS
========================================================= */

function isAuthUser(
  value: unknown,
): value is AuthUser {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const item =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof item.id ===
      "string" &&
    typeof item.name ===
      "string" &&
    typeof item.email ===
      "string" &&
    typeof item.role ===
      "string"
  );
}

function extractUser(
  payload: unknown,
): AuthUser | null {
  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return null;
  }

  const root =
    payload as Record<
      string,
      unknown
    >;

  if (
    isAuthUser(
      root.user,
    )
  ) {
    return root.user;
  }

  if (
    isAuthUser(
      root.data,
    )
  ) {
    return root.data;
  }

  if (
    root.data &&
    typeof root.data ===
      "object"
  ) {
    const data =
      root.data as Record<
        string,
        unknown
      >;

    if (
      isAuthUser(
        data.user,
      )
    ) {
      return data.user;
    }
  }

  return null;
}

/* =========================================================
   ANIMATED COUNTER
========================================================= */

function Counter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const elementRef =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    display,
    setDisplay,
  ] =
    useState(0);

  useEffect(() => {
    const element =
      elementRef.current;

    if (!element) {
      return;
    }

    let started =
      false;

    let animationFrame:
      number | null = null;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            !entry.isIntersecting ||
            started
          ) {
            return;
          }

          started =
            true;

          const start =
            performance.now();

          const duration =
            1250;

          function animate(
            current:
              number,
          ) {
            const progress =
              Math.min(
                (current -
                  start) /
                  duration,
                1,
              );

            const eased =
              1 -
              Math.pow(
                1 -
                  progress,
                3,
              );

            setDisplay(
              Math.round(
                value *
                  eased,
              ),
            );

            if (
              progress <
              1
            ) {
              animationFrame =
                requestAnimationFrame(
                  animate,
                );
            }
          }

          animationFrame =
            requestAnimationFrame(
              animate,
            );
        },
        {
          threshold:
            0.4,
        },
      );

    observer.observe(
      element,
    );

    return () => {
      observer.disconnect();

      if (
        animationFrame !==
        null
      ) {
        cancelAnimationFrame(
          animationFrame,
        );
      }
    };
  }, [value]);

  return (
    <div
      ref={elementRef}
      className={
        styles.statNumber
      }
    >
      {display}
      {suffix}
    </div>
  );
}

/* =========================================================
   MAIN HOME
========================================================= */

export default function PremiumHome() {
  const router =
    useRouter();

  const {
    language,
    setLanguage,
    t,
  } =
    useLanguage();

  const [
    booting,
    setBooting,
  ] =
    useState(true);

  const [
    slide,
    setSlide,
  ] =
    useState(0);

  const [
    testimonial,
    setTestimonial,
  ] =
    useState(0);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    toast,
    setToast,
  ] =
    useState("");

  const [
    commandOpen,
    setCommandOpen,
  ] =
    useState(false);

  const [
    commandQuery,
    setCommandQuery,
  ] =
    useState("");

  const [
    servicesOpen,
    setServicesOpen,
  ] =
    useState(false);

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const [
  darkMode,
  setDarkMode,
] = useState(() => {
  if (
    typeof document ===
    "undefined"
  ) {
    return false;
  }

  return (
    document
      .documentElement
      .dataset
      .theme ===
    "dark"
  );
});

  const [
    authUser,
    setAuthUser,
  ] =
    useState<AuthUser | null>(
      null,
    );

  /* =======================================================
     GUARANTEED GAME-STYLE INTRO
  ======================================================= */

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setBooting(
            false,
          );
        },
        1350,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, []);

  /* =======================================================
     HERO AUTO ROTATION
  ======================================================= */

  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setSlide(
            (current) =>
              (current +
                1) %
              heroSlides.length,
          );
        },
        5500,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, []);

  /* =======================================================
     TESTIMONIAL ROTATION
  ======================================================= */

  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setTestimonial(
            (current) =>
              (current +
                1) %
              3,
          );
        },
        6500,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, []);

  /* =======================================================
     THEME
  ======================================================= */



  /* =======================================================
     AUTH USER
  ======================================================= */

  useEffect(() => {
    let cancelled =
      false;

    async function loadUser() {
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
          !response.ok
        ) {
          return;
        }

        const payload:
          unknown =
          await response.json();

        const user =
          extractUser(
            payload,
          );

        if (
          !cancelled
        ) {
          setAuthUser(
            user,
          );
        }
      } catch {
        if (
          !cancelled
        ) {
          setAuthUser(
            null,
          );
        }
      }
    }

    void loadUser();

    return () => {
      cancelled =
        true;
    };
  }, []);

  /* =======================================================
     COMMAND PALETTE SHORTCUT
  ======================================================= */

  useEffect(() => {
    function handleKeyDown(
      event:
        KeyboardEvent,
    ) {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        setCommandOpen(
          (current) =>
            !current,
        );
      }

      if (
        event.key ===
        "Escape"
      ) {
        setCommandOpen(
          false,
        );

        setServicesOpen(
          false,
        );

        setMobileOpen(
          false,
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /* =======================================================
     CONTENT DATA
  ======================================================= */

  const capabilities =
    [
      {
        number:
          "01",

        icon:
          "⌕",

        title:
          t(
            "home.capability.search.title",
          ),

        description:
          t(
            "home.capability.search.description",
          ),

        href:
          "/search",

        image:
          "/images/capabilities/medicine-search.png",
      },

      {
        number:
          "02",

        icon:
          "▣",

        title:
          t(
            "home.capability.reservation.title",
          ),

        description:
          t(
            "home.capability.reservation.description",
          ),

        href:
          "/reservations",

        image:
          "/images/capabilities/reservation.png",
      },

      {
        number:
          "03",

        icon:
          "♡",

        title:
          t(
            "home.capability.watchlist.title",
          ),

        description:
          t(
            "home.capability.watchlist.description",
          ),

        href:
          "/watchlist",

        image:
          "/images/capabilities/watchlist.png",
      },

      {
        number:
          "04",

        icon:
          "◉",

        title:
          t(
            "home.capability.status.title",
          ),

        description:
          t(
            "home.capability.status.description",
          ),

        href:
          "/notifications",

        image:
          "/images/capabilities/status-updates.png",
      },
    ];

  const testimonials =
    [
      {
        quote:
          t(
            "home.testimonial.1.quote",
          ),

        name:
          t(
            "home.testimonial.1.name",
          ),

        role:
          t(
            "home.testimonial.1.role",
          ),
      },

      {
        quote:
          t(
            "home.testimonial.2.quote",
          ),

        name:
          t(
            "home.testimonial.2.name",
          ),

        role:
          t(
            "home.testimonial.2.role",
          ),
      },

      {
        quote:
          t(
            "home.testimonial.3.quote",
          ),

        name:
          t(
            "home.testimonial.3.name",
          ),

        role:
          t(
            "home.testimonial.3.role",
          ),
      },
    ];

  const commandItems =
    useMemo(
      () => [
        {
          icon:
            "⌕",

          label:
            t(
              "nav.search",
            ),

          description:
            language ===
            "si"
              ? "ඖෂධ සහ ෆාමසි සොයන්න"
              : "Find medicines and pharmacies",

          href:
            "/search",
        },

        {
          icon:
            "▣",

          label:
            t(
              "services.reservations",
            ),

          description:
            language ===
            "si"
              ? "ඔබගේ වෙන්කරගැනීම් බලන්න"
              : "View your reservations",

          href:
            "/reservations",
        },

        {
          icon:
            "♡",

          label:
            t(
              "services.watchlist",
            ),

          description:
            language ===
            "si"
              ? "නිරීක්ෂණය කරන ඖෂධ"
              : "Medicines you follow",

          href:
            "/watchlist",
        },

        {
          icon:
            "◉",

          label:
            t(
              "services.notifications",
            ),

          description:
            language ===
            "si"
              ? "ඔබගේ යාවත්කාලීන බලන්න"
              : "Review status updates",

          href:
            "/notifications",
        },

        {
          icon:
            "＋",

          label:
            t(
              "register.pharmacyTitle",
            ),

          description:
            language ===
            "si"
              ? "ෆාමසි හවුල්කරුවෙකු ලෙස එක්වන්න"
              : "Join as a pharmacy partner",

          href:
            "/pharmacy/register",
        },
      ],
      [
        language,
        t,
      ],
    );

  const filteredCommands =
    commandItems.filter(
      (item) =>
        `${item.label} ${item.description}`
          .toLowerCase()
          .includes(
            commandQuery
              .toLowerCase()
              .trim(),
          ),
    );

  /* =======================================================
     ACTIONS
  ======================================================= */

  function nextSlide() {
    setSlide(
      (current) =>
        (current +
          1) %
        heroSlides.length,
    );
  }

  function previousSlide() {
    setSlide(
      (current) =>
        (current -
          1 +
          heroSlides.length) %
        heroSlides.length,
    );
  }

  function handleSearch(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value =
      search.trim();

    if (!value) {
      router.push(
        "/search",
      );

      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(
        value,
      )}`,
    );
  }

 function toggleTheme() {
  const currentTheme =
    document
      .documentElement
      .dataset
      .theme;

  const nextDarkMode =
    currentTheme !==
    "dark";

  document
    .documentElement
    .dataset
    .theme =
    nextDarkMode
      ? "dark"
      : "light";

  window.localStorage.setItem(
    "mediflux-theme",
    nextDarkMode
      ? "dark"
      : "light",
  );

  setDarkMode(
    nextDarkMode,
  );
}
  async function logout() {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method:
            "POST",
        },
      );
    } finally {
      window.location.href =
        "/";
    }
  }

  function submitContact(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setToast(
      t(
        "home.contact.success",
      ),
    );

    event.currentTarget.reset();

    window.setTimeout(
      () => {
        setToast("");
      },
      3500,
    );
  }

  /* =======================================================
     STARTUP LOADER
  ======================================================= */

  if (booting) {
    return (
      <div
        className={
          styles.bootScreen
        }
      >
        <div
          className={
            styles.bootGrid
          }
        />

        <div
          className={
            styles.bootGlow
          }
        />

        <div
          className={
            styles.bootPanel
          }
        >
          <div
            className={
              styles.bootLogo
            }
          >
            <span>
              +
            </span>
          </div>

          <div
            className={
              styles.bootBrand
            }
          >
            Medi
            <strong>
              Flux
            </strong>
          </div>

          <p>
            {language ===
            "si"
              ? "ඖෂධ ප්‍රවේශ පද්ධතිය ආරම්භ වෙමින්..."
              : "Initializing medicine access system..."}
          </p>

          <div
            className={
              styles.bootTrack
            }
          >
            <div
              className={
                styles.bootProgress
              }
            />
          </div>

          <div
            className={
              styles.bootSegments
            }
          >
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <small>
            MEDIFLUX /
            READY SYSTEM
          </small>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        styles.shell
      }
    >
      {/* ===================================================
          LUXURY HEADER
      =================================================== */}

      <header
        className={
          styles.header
        }
      >
        <div
          className={
            styles.navbar
          }
        >
          <Link
            href="/"
            className={
              styles.brand
            }
            aria-label="MediFlux home"
          >
            <span
              className={
                styles.brandMark
              }
            >
              <i />
            </span>

            <span
              className={
                styles.brandText
              }
            >
              Medi
              <strong>
                Flux
              </strong>
            </span>
          </Link>

          <nav
            className={
              styles.desktopNav
            }
          >
            <Link href="/">
              {t(
                "nav.home",
              )}
            </Link>

            <a href="#about">
              {t(
                "nav.about",
              )}
            </a>

            <div
              className={
                styles.servicesMenu
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
                {t(
                  "nav.services",
                )}

                <span>
                  ▾
                </span>
              </button>

              {servicesOpen && (
                <div
                  className={
                    styles.servicesDropdown
                  }
                >
                  <Link
                    href="/search"
                    onClick={() =>
                      setServicesOpen(
                        false,
                      )
                    }
                  >
                    <span>
                      ⌕
                    </span>

                    <div>
                      <strong>
                        {t(
                          "services.search",
                        )}
                      </strong>

                      <small>
                        {t(
                          "services.searchDescription",
                        )}
                      </small>
                    </div>
                  </Link>

                  <Link
                    href="/reservations"
                    onClick={() =>
                      setServicesOpen(
                        false,
                      )
                    }
                  >
                    <span>
                      ▣
                    </span>

                    <div>
                      <strong>
                        {t(
                          "services.reservations",
                        )}
                      </strong>

                      <small>
                        {t(
                          "services.reservationsDescription",
                        )}
                      </small>
                    </div>
                  </Link>

                  <Link
                    href="/watchlist"
                    onClick={() =>
                      setServicesOpen(
                        false,
                      )
                    }
                  >
                    <span>
                      ♡
                    </span>

                    <div>
                      <strong>
                        {t(
                          "services.watchlist",
                        )}
                      </strong>

                      <small>
                        {t(
                          "services.watchlistDescription",
                        )}
                      </small>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <a href="#experience">
              {t(
                "nav.experience",
              )}
            </a>

            <a href="#faq">
              {t(
                "nav.faq",
              )}
            </a>

            <a href="#contact">
              {t(
                "nav.contact",
              )}
            </a>
          </nav>

          <div
            className={
              styles.navActions
            }
          >
            <form
              className={
                styles.navSearch
              }
              onSubmit={
                handleSearch
              }
            >
              <span>
                ⌕
              </span>

              <input
                value={
                  search
                }
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event
                      .target
                      .value,
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
              className={
                styles.commandButton
              }
              onClick={() =>
                setCommandOpen(
                  true,
                )
              }
              aria-label="Open command palette"
            >
              <span>
                ⌘
              </span>

              <small>
                K
              </small>
            </button>

            <select
              className={
                styles.languageSelect
              }
              value={
                language
              }
              onChange={(
                event,
              ) =>
                setLanguage(
                  event
                    .target
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

            {authUser ? (
              <div
                className={
                  styles.authLogged
                }
              >
                <span
                  className={
                    styles.userName
                  }
                >
                  {
                    authUser.name
                  }
                </span>

                <Link
                  href="/dashboard"
                  className={
                    styles.dashboardButton
                  }
                >
                  {authUser.role ===
                  "ADMIN"
                    ? t(
                        "nav.admin",
                      )
                    : t(
                        "nav.dashboard",
                      )}
                </Link>

                <button
                  type="button"
                  className={
                    styles.logoutButton
                  }
                  onClick={
                    logout
                  }
                >
                  {t(
                    "nav.logout",
                  )}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={
                    styles.loginLink
                  }
                >
                  {t(
                    "nav.login",
                  )}
                </Link>

                <Link
                  href="/register"
                  className={
                    styles.joinButton
                  }
                >
                  {t(
                    "nav.signup",
                  )}
                </Link>
              </>
            )}

            <button
              type="button"
              className={
                styles.themeToggle
              }
              onClick={
                toggleTheme
              }
              aria-label="Toggle theme"
            >
              <span
                className={
                  darkMode
                    ? styles.themeBallDark
                    : styles.themeBall
                }
              />

              <i>
                {darkMode
                  ? "☀"
                  : "☾"}
              </i>
            </button>

            <button
              type="button"
              className={
                styles.mobileToggle
              }
              onClick={() =>
                setMobileOpen(
                  (current) =>
                    !current,
                )
              }
              aria-label="Open navigation"
            >
              {mobileOpen
                ? "×"
                : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className={
              styles.mobileMenu
            }
          >
            <Link
              href="/"
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
            >
              {t(
                "nav.home",
              )}
            </Link>

            <a
              href="#about"
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
            >
              {t(
                "nav.about",
              )}
            </a>

            <a
              href="#services"
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
            >
              {t(
                "nav.services",
              )}
            </a>

            <a
              href="#experience"
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
            >
              {t(
                "nav.experience",
              )}
            </a>

            <a
              href="#faq"
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
            >
              {t(
                "nav.faq",
              )}
            </a>

            <a
              href="#contact"
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
            >
              {t(
                "nav.contact",
              )}
            </a>

            <Link
              href="/search"
            >
              {t(
                "nav.search",
              )}
            </Link>
          </div>
        )}
      </header>

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className={
            styles.hero
          }
        >
          <div
            className={
              styles.heroSlides
            }
          >
            {heroSlides.map(
              (
                item,
                index,
              ) => (
                <div
                  key={
                    item.image
                  }
                  className={`${styles.heroSlide} ${
                    index ===
                    slide
                      ? styles.heroSlideActive
                      : ""
                  }`}
                  style={{
                    backgroundImage:
                      `url("${item.image}")`,
                  }}
                  aria-hidden={
                    index !==
                    slide
                  }
                />
              ),
            )}
          </div>

          <div
            className={
              styles.heroShade
            }
          />

          <div
            className={
              styles.heroGrid
            }
          />

          <div
            className={
              styles.heroGlow
            }
          />

          <div
            className={
              styles.heroContent
            }
          >
            <div
              className={
                styles.heroCopy
              }
            >
              <div
                className={
                  styles.eyebrow
                }
              >
                <span />

                {t(
                  "home.hero.badge",
                )}
              </div>

              <h1>
                {t(
                  "home.hero.find",
                )}

                <span>
                  {t(
                    "home.hero.reserve",
                  )}{" "}
                  <strong>
                    {t(
                      "home.hero.confidence",
                    )}
                  </strong>
                </span>
              </h1>

              <p>
                {t(
                  "home.hero.description",
                )}
              </p>

              <div
                className={
                  styles.heroButtons
                }
              >
                <Link
                  href="/search"
                  className={
                    styles.primaryButton
                  }
                >
                  {t(
                    "home.hero.exploreMedicines",
                  )}

                  <span>
                    ↗
                  </span>
                </Link>

                <a
                  href="#experience"
                  className={
                    styles.secondaryButton
                  }
                >
                  {t(
                    "home.hero.exploreExperience",
                  )}

                  <span>
                    ↓
                  </span>
                </a>
              </div>

              <div
                className={
                  styles.heroSteps
                }
              >
                <div>
                  <b>
                    01
                  </b>

                  <span>
                    {t(
                      "home.action.search",
                    )}
                  </span>
                </div>

                <i />

                <div>
                  <b>
                    02
                  </b>

                  <span>
                    {t(
                      "home.action.reserve",
                    )}
                  </span>
                </div>

                <i />

                <div>
                  <b>
                    03
                  </b>

                  <span>
                    {t(
                      "home.action.collect",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* =============================================
                CUSTOM MEDICINE ORBIT
            ============================================= */}

            <div
              className={
                styles.orbitStage
              }
            >
              <div
                className={
                  styles.orbitAura
                }
              />

              <div
                className={
                  styles.orbitCircle
                }
              />

              <div
                className={
                  styles.orbitRingOne
                }
              />

              <div
                className={
                  styles.orbitRingTwo
                }
              />

              <div
                className={
                  styles.orbitRingThree
                }
              />

              <div
                className={
                  styles.capsule
                }
              >
                <div
                  className={
                    styles.capsuleGreen
                  }
                />
              </div>

              <div
                className={`${styles.statusCard} ${styles.availabilityCard}`}
              >
                <span
                  className={
                    styles.liveDot
                  }
                />

                <div>
                  <small>
                    {t(
                      "home.liveAvailability",
                    )}
                  </small>

                  <strong>
                    35{" "}
                    {t(
                      "home.units",
                    )}
                  </strong>
                </div>
              </div>

              <div
                className={`${styles.statusCard} ${styles.pharmacyCard}`}
              >
                <span
                  className={
                    styles.checkBadge
                  }
                >
                  ✓
                </span>

                <div>
                  <small>
                    {t(
                      "home.verifiedPharmacy",
                    )}
                  </small>

                  <strong>
                    CityCare
                  </strong>
                </div>
              </div>

              <div
                className={`${styles.statusCard} ${styles.priceCard}`}
              >
                <div>
                  <small>
                    {t(
                      "home.bestPrice",
                    )}
                  </small>

                  <strong>
                    LKR 115
                  </strong>
                </div>
              </div>

              <div
                className={`${styles.systemCard}`}
              >
                <span />

                {t(
                  "home.systemConnected",
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={
              styles.heroArrowLeft
            }
            onClick={
              previousSlide
            }
            aria-label="Previous hero image"
          >
            ‹
          </button>

          <button
            type="button"
            className={
              styles.heroArrowRight
            }
            onClick={
              nextSlide
            }
            aria-label="Next hero image"
          >
            ›
          </button>

          {/* RADIO / SLIDER INDICATORS */}

          <div
            className={
              styles.heroDots
            }
          >
            {heroSlides.map(
              (
                item,
                index,
              ) => (
                <button
                  key={
                    item.image
                  }
                  type="button"
                  className={
                    index ===
                    slide
                      ? styles.heroDotActive
                      : styles.heroDot
                  }
                  onClick={() =>
                    setSlide(
                      index,
                    )
                  }
                  aria-label={`Show ${item.label}`}
                />
              ),
            )}
          </div>

          <div
            className={
              styles.heroProgress
            }
          >
            <span
              key={slide}
            />
          </div>
        </section>

        {/* =================================================
            CAPABILITIES WITH YOUR NEW IMAGES
        ================================================= */}

        <section
          id="services"
          className={
            styles.capabilitySection
          }
        >
          <div
            className={
              styles.container
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <span>
                {t(
                  "home.capabilities.label",
                )}
              </span>

              <h2>
                {t(
                  "home.capabilities.title",
                )}
              </h2>

              <p>
                {t(
                  "home.capabilities.description",
                )}
              </p>
            </div>

            <div
              className={
                styles.capabilityGrid
              }
            >
              {capabilities.map(
                (
                  capability,
                ) => (
                  <Link
                    key={
                      capability.number
                    }
                    href={
                      capability.href
                    }
                    className={
                      styles.capabilityCard
                    }
                  >
                    <div
                      className={
                        styles.capabilityImage
                      }
                    >
                      <Image
                        src={
                          capability.image
                        }
                        alt={
                          capability.title
                        }
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      />

                      <div
                        className={
                          styles.imageFade
                        }
                      />

                      <span
                        className={
                          styles.capabilityIcon
                        }
                      >
                        {
                          capability.icon
                        }
                      </span>

                      <span
                        className={
                          styles.capabilityNumber
                        }
                      >
                        {
                          capability.number
                        }
                      </span>
                    </div>

                    <div
                      className={
                        styles.capabilityBody
                      }
                    >
                      <h3>
                        {
                          capability.title
                        }
                      </h3>

                      <p>
                        {
                          capability.description
                        }
                      </p>

                      <span
                        className={
                          styles.exploreLink
                        }
                      >
                        {t(
                          "home.action.explore",
                        )}

                        <b>
                          ↗
                        </b>
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section
          className={
            styles.statsSection
          }
        >
          <div
            className={
              styles.statsGrid
            }
          >
            <div>
              <Counter
                value={5}
                suffix="+"
              />

              <p>
                {t(
                  "home.stats.workflows",
                )}
              </p>
            </div>

            <div>
              <Counter
                value={3}
                suffix=""
              />

              <p>
                {t(
                  "home.stats.roles",
                )}
              </p>
            </div>

            <div>
              <Counter
                value={30}
                suffix=" min"
              />

              <p>
                {t(
                  "home.stats.reservationWindow",
                )}
              </p>
            </div>

            <div>
              <Counter
                value={100}
                suffix="%"
              />

              <p>
                {t(
                  "home.stats.demoData",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            ABOUT
        ================================================= */}

        <section
          id="about"
          className={
            styles.aboutSection
          }
        >
          <div
            className={
              styles.aboutGrid
            }
          >
            <div
              className={
                styles.aboutIntro
              }
            >
              <span
                className={
                  styles.sectionKicker
                }
              >
                {t(
                  "home.about.label",
                )}
              </span>

              <h2>
                {t(
                  "home.about.title",
                )}
              </h2>

              <blockquote>
                “
                {t(
                  "home.about.quote",
                )}
                ”
              </blockquote>

              <Link
                href="/search"
                className={
                  styles.textLink
                }
              >
                {t(
                  "home.about.trySearch",
                )}{" "}
                ↗
              </Link>
            </div>

            <div
              className={
                styles.timeline
              }
            >
              <article>
                <span>
                  01
                </span>

                <div>
                  <small>
                    {t(
                      "home.about.discover",
                    )}
                  </small>

                  <h3>
                    {t(
                      "home.about.searchBefore",
                    )}
                  </h3>

                  <p>
                    {t(
                      "home.about.searchBeforeDescription",
                    )}
                  </p>
                </div>
              </article>

              <article>
                <span>
                  02
                </span>

                <div>
                  <small>
                    {t(
                      "home.about.secure",
                    )}
                  </small>

                  <h3>
                    {t(
                      "home.about.holdStock",
                    )}
                  </h3>

                  <p>
                    {t(
                      "home.about.holdStockDescription",
                    )}
                  </p>
                </div>
              </article>

              <article>
                <span>
                  03
                </span>

                <div>
                  <small>
                    {t(
                      "home.about.operate",
                    )}
                  </small>

                  <h3>
                    {t(
                      "home.about.pharmacyData",
                    )}
                  </h3>

                  <p>
                    {t(
                      "home.about.pharmacyDataDescription",
                    )}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =================================================
            CONNECTED EXPERIENCE
        ================================================= */}

        <section
          id="experience"
          className={
            styles.experienceSection
          }
        >
          <div
            className={
              styles.container
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <span>
                {t(
                  "home.gallery.label",
                )}
              </span>

              <h2>
                {t(
                  "home.gallery.title",
                )}
              </h2>
            </div>

            <div
              className={
                styles.experienceGallery
              }
            >
              <Link
                href="/search"
                className={`${styles.journeyCard} ${styles.journeyLarge}`}
              >
                <Image
                  src="/images/hero/hero-pharmacy.png"
                  alt="Medicine search"
                  fill
                  sizes="70vw"
                />

                <div
                  className={
                    styles.journeyShade
                  }
                />

                <span>
                  {t(
                    "home.gallery.searchLabel",
                  )}
                </span>

                <h3>
                  {t(
                    "home.gallery.searchText",
                  )}
                </h3>

                <b>
                  ↗
                </b>
              </Link>

              <Link
                href="/reservations"
                className={
                  styles.journeyCard
                }
              >
                <Image
                  src="/images/hero/hero-pharmacist.png"
                  alt="Reservations"
                  fill
                  sizes="35vw"
                />

                <div
                  className={
                    styles.journeyShade
                  }
                />

                <span>
                  {t(
                    "home.gallery.reservationsLabel",
                  )}
                </span>

                <h3>
                  {t(
                    "home.gallery.reservationsText",
                  )}
                </h3>

                <b>
                  ↗
                </b>
              </Link>

              <Link
                href="/notifications"
                className={
                  styles.journeyCard
                }
              >
                <Image
                  src="/images/hero/hero-laboratory.png"
                  alt="Updates"
                  fill
                  sizes="35vw"
                />

                <div
                  className={
                    styles.journeyShade
                  }
                />

                <span>
                  {t(
                    "home.gallery.updatesLabel",
                  )}
                </span>

                <h3>
                  {t(
                    "home.gallery.updatesText",
                  )}
                </h3>

                <b>
                  ↗
                </b>
              </Link>
            </div>
          </div>
        </section>

        {/* =================================================
            TESTIMONIALS
        ================================================= */}

        <section
          className={
            styles.testimonialSection
          }
        >
          <div
            className={
              styles.testimonialInner
            }
          >
            <div
              className={
                styles.testimonialMeta
              }
            >
              <span>
                {t(
                  "home.testimonials.label",
                )}
              </span>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setTestimonial(
                      (current) =>
                        (current -
                          1 +
                          testimonials.length) %
                        testimonials.length,
                    )
                  }
                  aria-label={t(
                    "home.testimonials.previous",
                  )}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTestimonial(
                      (current) =>
                        (current +
                          1) %
                        testimonials.length,
                    )
                  }
                  aria-label={t(
                    "home.testimonials.next",
                  )}
                >
                  →
                </button>
              </div>
            </div>

            <div
              className={
                styles.testimonialQuote
              }
              key={
                testimonial
              }
            >
              “
              {
                testimonials[
                  testimonial
                ].quote
              }
              ”
            </div>

            <div
              className={
                styles.testimonialPerson
              }
            >
              <span>
                {testimonials[
                  testimonial
                ].name.charAt(
                  0,
                )}
              </span>

              <div>
                <strong>
                  {
                    testimonials[
                      testimonial
                    ].name
                  }
                </strong>

                <small>
                  {
                    testimonials[
                      testimonial
                    ].role
                  }
                </small>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FAQ
        ================================================= */}

        <section
          id="faq"
          className={
            styles.faqSection
          }
        >
          <div
            className={
              styles.faqGrid
            }
          >
            <div>
              <span
                className={
                  styles.sectionKicker
                }
              >
                {t(
                  "home.faq.label",
                )}
              </span>

              <h2>
                {t(
                  "home.faq.title",
                )}
              </h2>

              <p>
                {t(
                  "home.faq.description",
                )}
              </p>
            </div>

            <div
              className={
                styles.faqList
              }
            >
              <details>
                <summary>
                  {t(
                    "home.faq.q1",
                  )}
                </summary>

                <p>
                  {t(
                    "home.faq.a1",
                  )}
                </p>
              </details>

              <details>
                <summary>
                  {t(
                    "home.faq.q2",
                  )}
                </summary>

                <p>
                  {t(
                    "home.faq.a2",
                  )}
                </p>
              </details>

              <details>
                <summary>
                  {t(
                    "home.faq.q3",
                  )}
                </summary>

                <p>
                  {t(
                    "home.faq.a3",
                  )}
                </p>
              </details>

              <details>
                <summary>
                  {t(
                    "home.faq.q4",
                  )}
                </summary>

                <p>
                  {t(
                    "home.faq.a4",
                  )}
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section
          className={
            styles.ctaSection
          }
        >
          <div
            className={
              styles.ctaGlowOne
            }
          />

          <div
            className={
              styles.ctaGlowTwo
            }
          />

          <div
            className={
              styles.ctaContent
            }
          >
            <span>
              {t(
                "home.cta.label",
              )}
            </span>

            <h2>
              {t(
                "home.cta.title",
              )}
            </h2>

            <div>
              <Link
                href="/search"
                className={
                  styles.ctaLight
                }
              >
                {t(
                  "home.cta.search",
                )}{" "}
                ↗
              </Link>

              <Link
                href="/register"
                className={
                  styles.ctaGlass
                }
              >
                {t(
                  "home.cta.join",
                )}
              </Link>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTACT
        ================================================= */}

        <section
          id="contact"
          className={
            styles.contactSection
          }
        >
          <div
            className={
              styles.contactGrid
            }
          >
            <div
              className={
                styles.contactCopy
              }
            >
              <span
                className={
                  styles.sectionKicker
                }
              >
                {t(
                  "contact.kicker",
                )}
              </span>

              <h2>
                {t(
                  "contact.title",
                )}
              </h2>

              <p>
                {t(
                  "contact.description",
                )}
              </p>

              <div
                className={
                  styles.contactInfo
                }
              >
                <div>
                  <small>
                    {t(
                      "contact.supportEmail",
                    )}
                  </small>

                  <strong>
                    support@mediflux.com
                  </strong>
                </div>

                <div>
                  <small>
                    {t(
                      "contact.location",
                    )}
                  </small>

                  <strong>
                    {t(
                      "contact.locationValue",
                    )}
                  </strong>
                </div>

                <div>
                  <small>
                    {t(
                      "contact.hours",
                    )}
                  </small>

                  <strong>
                    {t(
                      "contact.hoursValue",
                    )}
                  </strong>
                </div>
              </div>
            </div>

            <form
              className={
                styles.contactForm
              }
              onSubmit={
                submitContact
              }
            >
              <div
                className={
                  styles.formRow
                }
              >
                <label>
                  <span>
                    {t(
                      "contact.name",
                    )}
                  </span>

                  <input
                    required
                    placeholder={t(
                      "contact.namePlaceholder",
                    )}
                  />
                </label>

                <label>
                  <span>
                    {t(
                      "contact.email",
                    )}
                  </span>

                  <input
                    required
                    type="email"
                    placeholder={t(
                      "contact.emailPlaceholder",
                    )}
                  />
                </label>
              </div>

              <label>
                <span>
                  {t(
                    "contact.topic",
                  )}
                </span>

                <select
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    {t(
                      "contact.selectTopic",
                    )}
                  </option>

                  <option value="search">
                    {t(
                      "contact.topicSearch",
                    )}
                  </option>

                  <option value="reservation">
                    {t(
                      "contact.topicReservation",
                    )}
                  </option>

                  <option value="account">
                    {t(
                      "contact.topicAccount",
                    )}
                  </option>

                  <option value="pharmacy">
                    {t(
                      "contact.topicPharmacy",
                    )}
                  </option>
                </select>
              </label>

              <label>
                <span>
                  {t(
                    "contact.message",
                  )}
                </span>

                <textarea
                  required
                  rows={5}
                  placeholder={t(
                    "contact.messagePlaceholder",
                  )}
                />
              </label>

              <button
                type="submit"
              >
                {t(
                  "contact.send",
                )}

                <span>
                  ↗
                </span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ===================================================
          LUXURY FOOTER
      =================================================== */}

      <footer
        className={
          styles.footer
        }
      >
        <div
          className={
            styles.footerGlow
          }
        />

        <div
          className={
            styles.footerInner
          }
        >
          <div
            className={
              styles.footerBrand
            }
          >
            <Link
              href="/"
              className={
                styles.footerLogo
              }
            >
              <span
                className={
                  styles.footerMark
                }
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

            <h2>
              {language ===
              "si"
                ? "ඖෂධ ප්‍රවේශය සරල, විශ්වාසදායක සහ පැහැදිලි විය යුතුය."
                : "Medicine access should feel simpler."}
            </h2>

            <p>
              {language ===
              "si"
                ? "ඖෂධ තොග සෙවීම, ෆාමසි සසඳීම සහ වෙන්කරගැනීම් කළමනාකරණය කිරීම සඳහා නිර්මාණය කළ අධ්‍යයන පද්ධතියකි."
                : "A polished portfolio platform for discovering fictional pharmacy stock, comparing availability and managing reservations."}
            </p>

            <div
              className={
                styles.footerStatus
              }
            >
              <span />

              {language ===
              "si"
                ? "ආදර්ශ පද්ධතිය ක්‍රියාත්මකයි"
                : "Demo systems operational"}
            </div>
          </div>

          <div
            className={
              styles.footerColumns
            }
          >
            <div>
              <strong>
                Platform
              </strong>

              <Link href="/search">
                {t(
                  "services.search",
                )}
              </Link>

              <Link href="/reservations">
                {t(
                  "services.reservations",
                )}
              </Link>

              <Link href="/watchlist">
                {t(
                  "services.watchlist",
                )}
              </Link>

              <Link href="/notifications">
                {t(
                  "services.notifications",
                )}
              </Link>
            </div>

            <div>
              <strong>
                Explore
              </strong>

              <a href="#about">
                {t(
                  "nav.about",
                )}
              </a>

              <a href="#experience">
                {t(
                  "nav.experience",
                )}
              </a>

              <a href="#faq">
                {t(
                  "nav.faq",
                )}
              </a>

              <a href="#contact">
                {t(
                  "nav.contact",
                )}
              </a>
            </div>

            <div>
              <strong>
                Accounts
              </strong>

              <Link href="/login">
                {t(
                  "nav.login",
                )}
              </Link>

              <Link href="/register">
                {t(
                  "nav.signup",
                )}
              </Link>

              <Link href="/pharmacy/register">
                Pharmacy Partner
              </Link>

              <Link href="/dashboard">
                {t(
                  "nav.dashboard",
                )}
              </Link>
            </div>
          </div>
        </div>

        <div
          className={
            styles.footerBottom
          }
        >
          <span>
            © 2026
            MediFlux
          </span>

          <span>
            Portfolio demonstration
            only — fictional medicine
            and pharmacy data.
          </span>

          <div>
            <a href="#faq">
              Privacy
            </a>

            <a href="#faq">
              Terms
            </a>

            <a href="#faq">
              Demo Disclaimer
            </a>
          </div>
        </div>
      </footer>

      {/* ===================================================
          FLOATING DOCK
      =================================================== */}

      <nav
        className={
          styles.floatingDock
        }
        aria-label="Quick navigation"
      >
        <Link
          href="/"
          aria-label="Home"
        >
          ◇
        </Link>

        <Link
          href="/search"
          aria-label="Search"
        >
          ⌕
        </Link>

        <a
          href="#services"
          aria-label="Services"
        >
          ▣
        </a>

        <a
          href="#contact"
          aria-label="Contact"
        >
          ✉
        </a>

        <a
          href="#"
          aria-label="Back to top"
        >
          ↑
        </a>
      </nav>

      {/* ===================================================
          COMMAND PALETTE
      =================================================== */}

      {commandOpen && (
        <div
          className={
            styles.commandOverlay
          }
          onMouseDown={() =>
            setCommandOpen(
              false,
            )
          }
        >
          <div
            className={
              styles.commandPalette
            }
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <div
              className={
                styles.commandHeader
              }
            >
              <span>
                ⌕
              </span>

              <input
                autoFocus
                value={
                  commandQuery
                }
                onChange={(
                  event,
                ) =>
                  setCommandQuery(
                    event
                      .target
                      .value,
                  )
                }
                placeholder={
                  language ===
                  "si"
                    ? "MediFlux සොයන්න..."
                    : "Search MediFlux..."
                }
              />

              <kbd>
                ESC
              </kbd>
            </div>

            <div
              className={
                styles.commandItems
              }
            >
              {filteredCommands.map(
                (
                  item,
                ) => (
                  <button
                    type="button"
                    key={
                      item.href
                    }
                    onClick={() => {
                      setCommandOpen(
                        false,
                      );

                      router.push(
                        item.href,
                      );
                    }}
                  >
                    <span>
                      {
                        item.icon
                      }
                    </span>

                    <div>
                      <strong>
                        {
                          item.label
                        }
                      </strong>

                      <small>
                        {
                          item.description
                        }
                      </small>
                    </div>

                    <b>
                      ↗
                    </b>
                  </button>
                ),
              )}
            </div>

            <div
              className={
                styles.commandFooter
              }
            >
              <span>
                ↑↓ Navigate
              </span>

              <span>
                Enter Open
              </span>

              <span>
                Ctrl + K
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          TOAST
      =================================================== */}

      {toast && (
        <div
          className={
            styles.toast
          }
          role="status"
        >
          <span>
            ✓
          </span>

          {toast}
        </div>
      )}
    </div>
  );
}