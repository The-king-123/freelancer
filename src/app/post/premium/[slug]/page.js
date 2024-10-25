import { notFound, redirect } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import { app_name, console_source as source } from "@/app/data";
import Premium from "./Premium";

var slug = ''

export default async function page({ params }) {

  slug = params.slug

  try {

    const post = await axios
      .get(source + "/_links?xcode=ghest&link=" + params.slug)
      .then((res) => {
        if (res.data.linkexist && res.data.unused) {
          return res.data.data[0]
        }else{
          if (res.data.linkexist) {
            return {state : 'linkused', owner : res.data.owner}
          } else {
            return {state : 'linknotexiste'}
          }
          
        }
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!post) {
      notFound();
    }
    if (post.state != 'linkused' && post.state != 'linknotexiste') {
      return <Home core={<Premium content={post} />} />
    } else {
      if (post.state == 'linkused') {
        return <Home core={<Premium content={false} slug={params.slug} owner={post.owner} />} />
      } else {
        return <Home core={<Premium content={false} slug={params.slug} owner={false} />} />
      }
      
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


// export async function metadata() {

//   const response = await axios.get(`${source}/_links?link=${slug}`);

//   if (response.data.linkexist && response.data.unused) {
//     const post = response.data.data[0];
//     const meta = {
//       title: post.title + " - " + app_name,
//       description: JSON.parse(post.info).description.replace(/<\/?[^>]+(>|$)/g, ""),
//     };
//     return meta
//   }

// };