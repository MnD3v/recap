import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

// Force rebuild

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
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
    images: [
      {
        url: "https://i.ibb.co/Q7CF4bkN/Group-3-1.png",
        width: 1200,
        height: 630,
        alt: "Recap - Plateforme d'engagement pédagogique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recap | Analyse de l'engagement pédagogique",
    description:
      "Plateforme premium pour héberger vos tutoriels et comprendre l'engagement des étudiants.",
    images: ["https://i.ibb.co/Q7CF4bkN/Group-3-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${montserratAlternates.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
