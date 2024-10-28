import { notFound } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import HomePost from '@/app/HomePost'
import {app_name, console_source as source} from "@/app/data";

var slug = "";

export default async function page({ params }) {

  slug = params.user;
  
  try {
    const post = await axios
      .get(source + "/_post/" + params.user + "?c=all")
      .then((res) => {
        return res.data.data;
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!post) {
      notFound();
    }
    return <Home user={params.user} core={<HomePost posts={post} />} />;
  } catch (error) {
    console.error(`Error rendering page for user ${params.user}:`, error);
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the post. Please try again later.</p>
      </div>
    );
  }
}

export async function metadata() {
  const response = await axios.get(`${source}/_accrocher/${slug}`);
  const post = response.data.data[0];

  const meta = {
    title: app_name,
    description: post.info.replace(
      /<\/?[^>]+(>|$)/g,
      ""
    ),
  };
  return meta;
}
