import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simulateur Capacité d'Emprunt · Bankin'",
  description:
    "Calculez votre capacité d'emprunt en 2 minutes — CDI, CDD ou indépendant.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
