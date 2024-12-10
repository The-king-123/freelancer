import { notFound } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import Forum from "../Forum";

export default async function page({ params }) {

  try {
    const forums = await axios
      .get(source + "/_forum/" + params.user)
      .then((res) => {
        return res.data.data;
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!forums) {
      notFound();
    }
    return <Home user={params.user} core={<Forum forums={forums} />} />;
  } catch (error) {
    console.error(`Error rendering forum for user ${params.user}:`, error);
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the post. Please try again later.</p>
      </div>
    );
  }
}

export function metadata() {
  const meta = {
    title: app_name,
    description: 'Nos forums pour vous aider a resoudre tout les problemes du monde.',
  };
  return meta;
}
