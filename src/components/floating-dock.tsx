"use client";

import Link from "next/link";

export default function FloatingDock() {
  return (
    <aside
      className="floating-dock"
      aria-label="Quick actions"
    >
      <Link
        href="/"
        title="Home"
      >
        ⌂
      </Link>

      <Link
        href="/search"
        title="Search"
      >
        ⌕
      </Link>

      <Link
        href="/reservations"
        title="Reservations"
      >
        ◫
      </Link>

      <Link
        href="/#contact"
        title="Contact"
      >
        ✉
      </Link>

      <button
        type="button"
        title="Back to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        ↑
      </button>
    </aside>
  );
}