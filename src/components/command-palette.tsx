"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

const commands = [
  {
    title: "Home",
    subtitle: "Return to homepage",
    href: "/",
    icon: "⌂",
  },
  {
    title: "Find Medicine",
    subtitle: "Search pharmacy inventory",
    href: "/search",
    icon: "⌕",
  },
  {
    title: "My Reservations",
    subtitle: "View reservation activity",
    href: "/reservations",
    icon: "▣",
  },
  {
    title: "Watchlist",
    subtitle: "Medicines you follow",
    href: "/watchlist",
    icon: "♡",
  },
  {
    title: "Notifications",
    subtitle: "Medicine and pickup updates",
    href: "/notifications",
    icon: "◉",
  },
  {
    title: "Login",
    subtitle: "Sign in to MediFlux",
    href: "/login",
    icon: "→",
  },
];

export default function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [query, setQuery] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const filtered =
    commands.filter((command) =>
      `${command.title} ${command.subtitle}`
        .toLowerCase()
        .includes(
          query.toLowerCase(),
        ),
    );

  function navigate(href: string) {
    onClose();
    setQuery("");
    router.push(href);
  }

  return (
    <div
      className="command-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command center"
      onMouseDown={onClose}
    >
      <div
        className="command-panel"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="command-search">
          <span>⌕</span>

          <input
            ref={inputRef}
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Search MediFlux..."
          />

          <kbd>ESC</kbd>
        </div>

        <div className="command-label">
          Quick navigation
        </div>

        <div className="command-results">
          {filtered.map(
            (command) => (
              <button
                type="button"
                key={command.href}
                onClick={() =>
                  navigate(
                    command.href,
                  )
                }
              >
                <span className="command-icon">
                  {command.icon}
                </span>

                <span>
                  <strong>
                    {command.title}
                  </strong>

                  <small>
                    {command.subtitle}
                  </small>
                </span>

                <span className="command-arrow">
                  →
                </span>
              </button>
            ),
          )}

          {filtered.length === 0 && (
            <div className="command-empty">
              No results found.
            </div>
          )}
        </div>

        <div className="command-footer">
          <span>
            ↑ ↓ Navigate
          </span>

          <span>Enter Open</span>

          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}