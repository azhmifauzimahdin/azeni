import type { Metadata } from "next";
import "./globals.css";
import "aos/dist/aos.css";

import { Poppins, Alex_Brush, Scheherazade_New } from "next/font/google";
import AOSInit from "@/components/AOSInit";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alexbrush",
});

const scheherazade = Scheherazade_New({
  weight: "400",
  subsets: ["arabic"],
  variable: "--font-scheherazade",
});

const gallery = localFont({
  src: "./fonts/Gallery.ttf",
  variable: "--font-gallery",
});

export const metadata: Metadata = {
  title: "AZRIN",
  description: "AZRIN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${alexBrush.variable} ${scheherazade.variable} ${gallery.variable}`}
    >
      <body>
        <AOSInit />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
