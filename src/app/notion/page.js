import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import Notion from "./Notion";

export default async function page() {

    return (
        <Home core={<Notion />} />
    );
  
}

export function metadata() {
  const meta = {
    title: app_name,
    description: 'Notion',
  };
  return meta;
}
