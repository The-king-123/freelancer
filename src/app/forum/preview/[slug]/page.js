import { notFound } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import PreviewForum from "./previewForum";

export default async function page({params}) {

  try {
    const forum = await axios
      .get(source + `/_forum/${params.slug}/edit`)
      .then((res) => {
        return res.data.data[0];
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!forum) {
      notFound();
    }
    return <Home core={<PreviewForum forum={forum} />} />;
  } catch (error) {
    console.error('Error rendering forum from this link', error);
    return (
      <div>
        <h1>Error</h1>
        <p>This forum is no longer available.</p>
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
