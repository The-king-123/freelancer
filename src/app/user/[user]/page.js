import { notFound } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import HomePost from '@/app/HomePost'

const source = "https://console.freelancer.mg";

var slug = "";

export default async function page({ params }) {
  const source = "https://console.freelancer.mg";
  // const source = "http://127.0.0.1:8000";

  slug = params.user;
  
  try {
    const post = await axios
      .get(source + "/_post/" + params.user + "?c=default")
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
  const response = await axios.get(`${source}/_accrocher/${slug}`);
  const post = response.data.data[0];

  const meta = {
    title: 'Freelancer',
    description: post.info.replace(
      /<\/?[^>]+(>|$)/g,
      ""
    ),
  };
  return meta;
}
