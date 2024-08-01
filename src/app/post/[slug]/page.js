// app/post/[slug]/page.js
import { notFound } from "next/navigation";
import PostContent from "../../../components/PostContent";
import axios from "axios";

export default async function PostPage({ params }) {
  const source = "https://console.freelancer.mg";
  // const source = "http://127.0.0.1:8000";
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
    return (
      <div className="w3-block w3-100vh w3-light-grey">
        <PostContent content={post} />
      </div>
    );
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
