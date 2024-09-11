import { notFound } from "next/navigation";
import TalentsListe from "./talentsListe";
import Home from "@/app/Home/page";
import { app_name } from "@/app/data";

export default async function page() {

  try {
    return <Home core={<TalentsListe />} />;
  } catch (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the post. Please try again later.</p>
      </div>
    );
  }
}

export async function metadata() {

  const meta = {
    title: "Decouvrez nos talents - " + app_name,
    description: 'Vous trouverez ici ce que vous voulez',
  };
  return meta;
}
