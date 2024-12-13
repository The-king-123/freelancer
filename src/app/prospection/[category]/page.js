import { notFound } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import Prospection from "../Prospection";

export default async function page({ params }) {

  try {
    // var products = ''
    const products = await axios
      .get(source + "/_store/" + params.category+'?where=prospection')
      .then((res) => {
        return res.data.data;
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!products) {
      notFound();
    }
    return <Home core={<Prospection products={products} />} />;
  } catch (error) {
    console.error(`Error rendering products for user ${params.category}:`, error);
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the products. Please try again later.</p>
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
