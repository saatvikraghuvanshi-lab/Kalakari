import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// I combined your two metadata blocks into one perfect one here
export const metadata: Metadata = {
  title: "Kalakari | Handcrafted Saree Boutique",
  description: "Exquisite handcrafted sarees and bespoke ethnic wear. Discover the heritage of Indian craftsmanship at Kalakari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Verification meta tag is best placed inside the <head> */}
        <meta name="google-site-verification" content="tl_ql4V-k96UfHYImRCbfTf1dW0reh_VY7ajtPZVpmM" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}