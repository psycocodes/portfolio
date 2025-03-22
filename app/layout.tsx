import type { Metadata } from "next";
import { Geist, Viaoda_Libre } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const Caleb = localFont({
  src: [
    {
      path: "fonts/CSCalebMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-caleb",
});

const playfair = Viaoda_Libre({
  variable: "--font-playfair",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohikshit Ghorai",
  description: "Portfolio of Mohikshit Ghorai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${Caleb.variable} ${playfair.variable} h-screen w-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
