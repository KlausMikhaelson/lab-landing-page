import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s · Understudy",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "synthetic users",
    "simulated users",
    "agent-based testing",
    "AI user simulation",
    "A/B test prediction",
    "conversion rate optimization",
    "CRO",
    "experimentation platform",
    "pre-launch testing",
    "behavioral simulation",
    "product analytics",
  ],
  authors: [{ name: "Understudy" }],
  creator: "Understudy",
  publisher: "Understudy",
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    creator: SITE.twitter,
  },
};

export const viewport: Viewport = {
  themeColor: SITE.bg,
};

// JSON-LD structured data: helps search engines and AI answer engines (GEO)
// understand what Understudy is and describe/cite it accurately.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      logo: `${SITE.url}/icon`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: SITE.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE.url,
      description: SITE.description,
      featureList: [
        "Simulated-user A/B test prediction",
        "Behavior-grounded agent swarms",
        "Abandonment and drop-off analysis",
        "Backtested on real randomized experiments: 94% winner accuracy vs 35% scrambled control",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Early access",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Microsoft Clarity: session recordings + heatmaps for our own data */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xl5ff9j3be");`}
        </Script>
        {children}
      </body>
    </html>
  );
}
