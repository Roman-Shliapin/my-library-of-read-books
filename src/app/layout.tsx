import type { Metadata, Viewport } from "next";
import { Literata, Manrope } from "next/font/google";
import { Header } from "@/components/Header/Header";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { ServiceWorkerRegister } from "@/components/PWA/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/PWA/InstallPrompt";
import "./globals.css";

const display = Literata({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Моя бібліотека",
    template: "%s · Моя бібліотека",
  },
  description: "Особиста бібліотека прочитаних книг і цитат",
  applicationName: "Моя бібліотека",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Бібліотека",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a3c34" },
    { media: "(prefers-color-scheme: dark)", color: "#1a3c34" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Header />
        <main className="page">{children}</main>
        <BottomNav />
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}