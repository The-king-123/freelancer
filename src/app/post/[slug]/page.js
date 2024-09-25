import { notFound, redirect } from "next/navigation";
import PostContent from "./PostContent";
import axios from "axios";
import Home from "@/app/Home/page";
import { app_name, console_source as source } from "@/app/data";
import ToPremium from "../premium/ToPremium";

var slug = ''

export default async function page({ params }) {

  slug = params.slug
  try {
    
    const post = await axios
      .get(source + "/_post/" + params.slug + "/edit")
      .then((res) => {
        if (!res.data.premium) {
          return {data:res.data.data[0], features:res.data.features}
        } else {
          return 'premium'
        }
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!post) {
      notFound();
    }
    if (post != 'premium') {
      return <Home core={<PostContent content={post} />} />
    } else {
      return <Home core={<ToPremium slug={params.slug} />} />
    }

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

  if (!response.data.premium) {
    const post = response.data.data[0];
    const meta = {
      title: post.title + " - " + app_name,
      description: JSON.parse(post.info).description.replace(/<\/?[^>]+(>|$)/g, ""),
    };
    return meta
  }

};