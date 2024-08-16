import { notFound } from "next/navigation";
import axios from "axios";
import Home from "./Home/page";
import HomePost from "./HomePost"
import {console_source as source} from "@/app/data";

export default async function page() {

  try {
    const posts = await axios
      .get(source + "/_post/default?c=default")
      .then((res) => {
        return res.data.data;
      })
      .catch((e) => {
        console.error("failure", e);
      });
    
    if (!posts) {
      notFound();
    }

    return <Home user="default" core={<HomePost posts={posts} />} />;

  } catch (error) {
      console.error(error)
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the post. Please try again later.</p>
      </div>
    );
  }
}