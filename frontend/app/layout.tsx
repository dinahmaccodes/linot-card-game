import type { Metadata } from "next";
import { Titan_One, Lilita_One } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { UserProfileProvider } from "@/lib/UserProfileContext";
import { AudioProvider } from "@/lib/AudioContext";

// Load the font
const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const lilitaOne = Lilita_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lilita",
});

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Linot Card Game",
  description: "Multiplayer Whot card game on Linera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${titanOne.className} ${lilitaOne.variable} ${satoshi.variable} antialiased`}
      >
        <UserProfileProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </UserProfileProvider>
      </body>
    </html>
  );
}
