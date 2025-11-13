import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recap | Analyse de l'engagement pédagogique",
  description:
    "Recap aide les enseignants à diffuser des tutoriels vidéo haut de gamme et à suivre l'attention de chaque étudiant en temps réel.",
  openGraph: {
    title: "Recap | Analyse de l'engagement pédagogique",
    description:
      "Créez des parcours vidéo sur-mesure, mesurez le visionnage et coacher vos étudiants avec précision.",
    url: "https://recap.app",
    siteName: "Recap",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recap | Analyse de l'engagement pédagogique",
    description:
      "Plateforme premium pour héberger vos tutoriels et comprendre l'engagement des étudiants.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
