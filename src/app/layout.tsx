import type { Metadata } from "next";
import { Archivo, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const label = JetBrains_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.econepalenergy.com.np"),
  title: {
    default: "Eco Nepal Energy Industries Pvt. Ltd. | Waste Tyre Recycling & Pyrolysis",
    template: "%s | Eco Nepal Energy Industries Pvt. Ltd.",
  },
  description:
    "Eco Nepal Energy Industries Pvt. Ltd. converts end-of-life tyres into pyrolysis oil, fuel char, and recovered steel at SEZ Bhairahawa, Rupandehi, Nepal.",
  openGraph: {
    title: "Eco Nepal Energy Industries Pvt. Ltd.",
    description:
      "Waste tyre recycling and pyrolysis in Nepal — pyrolysis oil, fuel char, and recovered steel.",
    url: "https://www.econepalenergy.com.np",
    siteName: "Eco Nepal Energy Industries Pvt. Ltd.",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${label.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
