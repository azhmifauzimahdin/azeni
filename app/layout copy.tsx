import "./globals.css";
import "aos/dist/aos.css";

import { Poppins, Alex_Brush, Scheherazade_New } from "next/font/google";
import AOSInit from "@/components/AOSInit";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import UserSync from "@/components/ui/user-sync";
import ClientWrapper from "./client-wrapper";

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

export const metadata = {
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="id"
        className={`${poppins.variable} ${alexBrush.variable} ${scheherazade.variable} ${gallery.variable}`}
      >
        <body>
          <AOSInit />
          <Toaster />
          <UserSync />
          <ClientWrapper>{children}</ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
