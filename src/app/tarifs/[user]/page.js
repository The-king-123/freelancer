import { notFound } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import Tarifs from "../Tarifs";

export default async function page({ params }) {

  try {
    const tarifs = await axios
      .get(source + "/_forum/" + params.user)
      .then((res) => {
        return res.data.data;
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!tarifs) {
      notFound();
    }
    return <Home user={params.user} core={<Tarifs tarifs={tarifs} />} />;
  } catch (error) {
    console.error(`Error rendering tarif for user ${params.user}:`, error);
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the tarif. Please try again later.</p>
      </div>
    );
  }
}

export function metadata() {
  const meta = {
    title: app_name,
    description: 'Nos tarif pour des formations a petit prix.',
  };
  return meta;
}
