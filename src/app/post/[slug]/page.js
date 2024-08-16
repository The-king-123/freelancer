import { notFound } from "next/navigation";
import PostContent from "./PostContent";
import axios from "axios";
import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";

var slug = ''

export default async function page({ params }) {

  slug = params.slug

  try {
    const post = await axios
      .get(source + "/_post/" + params.slug + "/edit")
      .then((res) => {
        return res.data.data[0];
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!post) {
      notFound();
    }
    return <Home core={<PostContent content={post} />} />;
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

  const response = await axios.get(`${source}/_post/${slug}/edit`);
  const post = response.data.data[0];

  const meta = {
    title: post.title + " - " + app_name,
    description: JSON.parse(post.info).description.replace(/<\/?[^>]+(>|$)/g, ""),
  };
  return meta
};