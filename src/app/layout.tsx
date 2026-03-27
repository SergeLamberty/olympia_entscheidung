import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { loadSiteContent } from "@/lib/content-loader";
import { QuizProvider } from "@/context/QuizContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { PWARegistration } from "@/components/pwa/PWARegistration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = loadSiteContent();
  const siteUrl = site.meta.siteUrl;
  const ogImage = `${siteUrl}/icons/icon-512.png`;
  return {
    title: { default: site.meta.title, template: `%s | ${site.meta.title}` },
    description: site.meta.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteUrl),
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/apple-touch-icon.png",
    },
    openGraph: {
      title: site.meta.title,
      description: site.meta.description,
      locale: site.meta.locale,
      type: "website",
      url: siteUrl,
      siteName: site.meta.title,
      images: [
        {
          url: ogImage,
          width: 512,
          height: 512,
          alt: site.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.meta.title,
      description: site.meta.description,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = loadSiteContent();
  return (
    <html lang={site.meta.locale} className={inter.variable}>
      <body className="flex flex-col min-h-dvh">
        <QuizProvider>
          <PWARegistration />
          <AnalyticsTracker />
          <Header title={site.meta.title} navLinks={site.navigation.links} />
          {children}
          <Footer copyright={site.footer.copyright} links={site.footer.links} />
        </QuizProvider>
      </body>
    </html>
  );
}
