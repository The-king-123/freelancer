import { notFound, redirect } from "next/navigation";
import PostContent from "./ProductContent";
import axios from "axios";
import Home from "@/app/Home/page";
import { app_name, console_source as source } from "@/app/data";
import ProductContent from "./ProductContent";

var slug = ''

export default async function page({ params }) {

  slug = params.slug
  try {
    
    const store = await axios
      .get(source + "/_store/" + params.slug + "/edit")
      .then((res) => {
          return {data:res.data.data[0], features:res.data.features}
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!store) {
      notFound();
    }

      return <Home core={<ProductContent content={store} />} />

  } catch (error) {
    console.error(`Error rendering page for slug ${params.slug}:`, error);
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the post. Please try again later.</p>
      </div>
    );
  }
}


export async function metadata() {

  const response = await axios.get(`${source}/_store/${slug}/edit`);

  if (!response.data.premium) {
    const post = response.data.data[0];
    const meta = {
      title: post.name + " - " + app_name,
      description: post.description.replace(/<\/?[^>]+(>|$)/g, ""),
    };
    return meta
  }

};