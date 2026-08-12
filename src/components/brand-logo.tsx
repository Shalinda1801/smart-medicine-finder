import Link from "next/link";

type BrandLogoProps = {
  compact?: boolean;
};

export default function BrandLogo({
  compact = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className="mf-brand"
      aria-label="MediFlux home"
    >
      <span className="mf-logo-mark">
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="mediflux-gradient"
              x1="4"
              y1="4"
              x2="44"
              y2="44"
            >
              <stop
                stopColor="#12b981"
              />
              <stop
                offset="1"
                stopColor="#3478f6"
              />
            </linearGradient>
          </defs>

          <path
            d="M24 3C13.5 3 5 11.5 5 22c0 13.7 19 23 19 23s19-9.3 19-23C43 11.5 34.5 3 24 3Z"
            fill="url(#mediflux-gradient)"
          />

          <path
            d="M21 12h6v7h7v6h-7v7h-6v-7h-7v-6h7v-7Z"
            fill="white"
          />
        </svg>

        <span className="mf-logo-pulse" />
      </span>

      {!compact && (
        <span className="mf-brand-text">
          Medi<span>Flux</span>
        </span>
      )}
    </Link>
  );
}