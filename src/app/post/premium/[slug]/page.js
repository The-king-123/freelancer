import { notFound, redirect } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import { app_name, console_source as source } from "@/app/data";
import Premium from "./Premium";

var slug = ''

export default async function page({ params }) {

  const xcode  = localStorage.getItem('x-code')
  slug = params.slug

  try {
    return <Home core={<Premium content={post} />} />
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

  const response = await axios.get(`${source}/_links/${slug}/edit`);

  if (response.data.linkexist && response.data.unused) {
    const post = response.data.data[0];
    const meta = {
      title: post.title + " - " + app_name,
      description: JSON.parse(post.info).description.replace(/<\/?[^>]+(>|$)/g, ""),
    };
    return meta
  }

};