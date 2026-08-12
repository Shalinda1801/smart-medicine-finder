import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  LanguageProvider,
  type Language,
} from "@/i18n/language-context";
import "leaflet/dist/leaflet.css";
import "./pharmacy-portal.css";
import "./pharmacy-register.css";
import "./globals.css";
import "./premium.css";
import "./navbar-fix.css";
import "./hero-slider.css";
import "./medicine-orbit.css";
import "./search-map.css";
import "./role-navigation.css";

export const metadata: Metadata = {
  title:
    "MediFlux | Smart Medicine Availability",

  description:
    "Search medicine availability, compare pharmacy stock and manage reservations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore =
    await cookies();

  const storedLanguage =
    cookieStore.get(
      "mediflux-language",
    )?.value;

  const initialLanguage: Language =
    storedLanguage === "si"
      ? "si"
      : "en";

  return (
    <html
      lang={
        initialLanguage === "si"
          ? "si"
          : "en"
      }
      suppressHydrationWarning
    >
      <body>
        <LanguageProvider
          initialLanguage={
            initialLanguage
          }
        >
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}