import Home from "./Home/page";

export const metadata = {
  title: "Freelancer",
  description:
    "Découvrez notre plateforme dédiée aux freelances, offrant une gamme complète de formations professionnelles pour réussir dans le monde du freelance. Apprenez les compétences essentielles, des stratégies de marketing aux outils de gestion de projet, et développez votre carrière en toute confiance",
};
export default function page() {
  return (
    <div>
      <Home user={'default'} core={'main'}/>
    </div>
  );
}
