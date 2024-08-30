import { Inter } from "next/font/google";
import "./globals.css";
import "./app.css";
import { app_name } from "@/app/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faWarning } from "@fortawesome/free-solid-svg-icons";

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
      {/* modal warning */}
      <div id="modalWarning" className="w3-modal">
        <div
          className="w3-modal-content w3-card-4 w3-animate-top w3-round w3-overflow"
          style={{ width: 320 }}
        >
          <div style={{ padding: 24 }}>
            <FontAwesomeIcon
              icon={faWarning}
              className="w3-text-red w3-large w3-opacity-min"
            />
            <div id="textWarning">
              Voulez vous vraiment supprimer ce Topic avec son
              contenu ...
            </div>
          </div>
          <div className="w3-container w3-light-grey w3-padding">
            <button
              id="confirmWarning"
              className="w3-button w3-right w3-round w3-border w3-red"
            >
              <FontAwesomeIcon
                id="confirmSpinner"
                style={{ display: "none" }}
                className="w3-medium w3-spin w3-margin-right"
                icon={faSpinner}
              />
              Supprimer
            </button>
            <button
              id="cancelWarning"
              className="w3-button w3-right w3-round w3-white w3-border w3-margin-right"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
      {/* end modal warning */}
    </html>
  );
}
