import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import GestionVersion from "./GestionVersion";

export default async function page() {

  try {
    return <Home core={<GestionVersion />} />;
  } catch (error) {
    console.error('Error rendering forum for default user ', error);
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
    description: '',
  };
  return meta;
}
