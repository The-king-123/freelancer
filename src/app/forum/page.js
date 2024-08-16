import { notFound } from "next/navigation";
import Home from "@/app/Home/page";
import CreateForum from "./createForum";
import {app_name, console_source as source} from "../data";

export default async function page({ params }) {

  return <Home core={<CreateForum />} />;
}

export async function metadata() {

  const meta = {
    title: "Forum - " + app_name,
    description:
      "Rejoignez notre forum pour échanger, partager et discuter avec une communauté passionnée. Trouvez des réponses, posez vos questions, et participez à des discussions enrichissantes sur divers sujets.",
  };
  return meta;
}
