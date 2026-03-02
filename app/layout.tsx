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

export const metadata: Metadata = {
  title: "KALAKARI|Handcrafted Traditional-wear Boutique",
  description: "Exquisite handcrafted sarees and bespoke ethnic wear. Discover the heritage of Indian craftsmanship at Kalakari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <meta name="google-site-verification" content="tl_ql4V-k96UfHYImRCbfTf1dW0reh_VY7ajtPZVpmM" />
        {children}
      </body>
    </html>
  );
}
