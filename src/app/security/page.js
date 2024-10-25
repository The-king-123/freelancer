import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import Security from "./Security";

export default async function page() {

    return (
        <Home core={<Security />} />
    );
  
}

export function metadata() {
  const meta = {
    title: app_name,
    description: 'Security',
  };
  return meta;
}
