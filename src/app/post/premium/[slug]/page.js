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
      .get(source + "/_links/" + params.slug + "/edit")
      .then((res) => {
        if (res.data.linkexist && res.data.unused) {
          return res.data.data[0]
        } else {
          return 'nonvalable'
        }
      })
      .catch((e) => {
        console.error("failure", e);
      });
    if (!post) {
      notFound();
    }
    if (post != 'nonvalable') {
      return <Home core={<Premium content={post} />} />
    } else {
      return <Home core={
        <div
          className="w3-modal w3-noscrollbar w3-show"
          style={{ padding: 24, zIndex: 999999 }}
        >
          <div
            className="w3-white w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
            style={{
              minHeight: 240,
              paddingBlock: 8,
              paddingInline: 0,
              maxWidth: 320,
            }}
          >
            <div className="w3-block w3-flex-column w3-flex-center">
              <div className="w3-block">
                <div style={{ padding: 24 }}>
                  Le lien que vous tentez d'accéder n'est plus valide.
                </div>
                <div className="w3-center w3-white w3-flex w3-flex-center">
                  <div className="w3-margin">
                    <button
                      id="lienInvalideButton"
                      className="transition w3-medium w3-text-yellow w3-block w3-button w3-round-xxlarge w3-black"
                    >
                      Revenir sur la page d'actualité ?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>} />

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