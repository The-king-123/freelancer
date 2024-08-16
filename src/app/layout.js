import { Inter } from "next/font/google";
import "./globals.css";
import "./app.css";
import {app_name} from "@/app/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: app_name,
  description:
    "Découvrez notre plateforme dédiée aux freelances, offrant une gamme complète de formations professionnelles pour réussir dans le monde du freelance. Apprenez les compétences essentielles, des stratégies de marketing aux outils de gestion de projet, et développez votre carrière en toute confiance",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
