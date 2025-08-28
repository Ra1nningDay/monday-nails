import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Monday Nail Studio - ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้ ม.กรุงเทพ (รังสิต)",
  description:
    "ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต) งานละเอียด เสร็จไว สีสวยทน รับประกัน 7 วัน จองง่ายใน LINE",
  keywords:
    "ทำเล็บเจล, งานปั้นนูน, เพ้นท์เล็บ, รังสิต, มหาวิทยาลัยกรุงเทพ, ต่อ PVC, เล็บเจล, นิชอาร์ท",
  authors: [{ name: "Monday Nail Studio" }],
  creator: "Monday Nail Studio",
  publisher: "Monday Nail Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://monday-nail-studio.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Monday Nail Studio - ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้ ม.กรุงเทพ (รังสิต)",
    description:
      "ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต) งานละเอียด เสร็จไว สีสวยทน รับประกัน 7 วัน",
    url: "https://monday-nail-studio.com",
    siteName: "Monday Nail Studio",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Monday Nail Studio - ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Monday Nail Studio - ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้ ม.กรุงเทพ (รังสิต)",
    description:
      "ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต) งานละเอียด เสร็จไว สีสวยทน รับประกัน 7 วัน",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              name: "Monday Nail Studio",
              description:
                "ทำเล็บเจล งานปั้นนูน เพ้นท์เล็บ ใกล้มหาวิทยาลัยกรุงเทพ (รังสิต)",
              url: "https://monday-nail-studio.com",
              telephone: "097-695-6195",
              address: {
                "@type": "PostalAddress",
                addressLocality: "รังสิต",
                addressRegion: "ปทุมธานี",
                addressCountry: "TH",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "14.0167",
                longitude: "100.7333",
              },
              openingHours: "Mo-Su 10:00-19:00",
              priceRange: "฿฿",
              serviceType: ["ทำเล็บเจล", "งานปั้นนูน", "เพ้นท์เล็บ", "ต่อ PVC"],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "500",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
