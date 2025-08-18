import "./globals.css";
import "aos/dist/aos.css";

import {
  Poppins,
  Alex_Brush,
  Scheherazade_New,
  Lora,
  Italiana,
} from "next/font/google";
import AOSInit from "@/components/AOSInit";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import UserSync from "@/components/ui/user-sync";
import ClientWrapper from "./client-wrapper";
import Script from "next/script";
import { idID } from "@clerk/localizations";

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

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
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
    <ClerkProvider
      localization={idID}
      appearance={{
        variables: {
          colorPrimary: "#008080",
          colorForeground: "#006666",
        },
        elements: {
          formFieldInput:
            "flex h-10 w-full rounded-md border bg-white/75 border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          formFieldLabel: "text-sm font-medium text-foreground",
          formButtonPrimary:
            "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-green-app-primary text-white text-sm font-medium shadow hover:bg-green-app-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
          formButtonSecondary:
            "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
          socialButtonsBlockButton:
            "w-full h-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors",
          formFieldCheckbox:
            "border-input text-primary rounded-sm focus-visible:ring-1 focus-visible:ring-ring",
          footerActionLink: "text-sm text-muted-foreground hover:underline",
        },
      }}
    >
      <html
        lang="id"
        className={`${poppins.variable} ${alexBrush.variable} ${scheherazade.variable} ${gallery.variable} ${lora.variable} ${italiana.variable}`}
      >
        <Script
          src={`${process.env.NEXT_PUBLIC_MIDTRANS_SCRIPT_URL}/snap/snap.js`}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        />
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
