import type { Metadata } from "next";
import "./globals.css";
import "aos/dist/aos.css";

import { Poppins, Dancing_Script } from "next/font/google";
import AOSInit from "@/components/AOSInit";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "AZENI",
  description: "AZENI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${dancingScript.variable}`}>
      <body>
        <AOSInit />
        {children}
      </body>
    </html>
  );
}
