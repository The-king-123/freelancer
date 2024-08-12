import { notFound } from "next/navigation";
import axios from "axios";
import Home from "./Home/page";
import HomePost from "./HomePost"

export default async function page() {
  const source = "https://console.freelancer.mg";
  // const source = "http://127.0.0.1:8000";

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

    return <Home core={<HomePost posts={posts} />} />;

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