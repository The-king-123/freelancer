'use client'
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Forum(props) {

  const [displayForum, setdisplayForum] = useState('')

  const reloadForums = (forums) => {
    var glitchForum = ''
    if (forums.length > 0) {
      glitchForum = forums.map((post, key) => (
        <div key={key} style={{ padding: 8, zIndex: 1 }}>
          <div
            className="w3-small w3-text-grey"
            style={{ paddingInline: 8, textAlign: "right", display: "none" }}
            id={"flashInfo" + key}
          >
            Lien copié...
          </div>
          <div className="w3-flex-column w3-overflow w3-card w3-round w3-pointer w3-white">
            <div
              data={"https://freelancer.mg/forum/" + post.slug}
              className="postTitle w3-nowrap w3-overflow w3-light-grey w3-big"
              style={{ paddingBlock: 8, paddingInline: 16 }}
              title="Click to copy post link"
            >
              {parse(post.title)}
            </div>
            <div>
              <div className="postCore">
                <div
                  id={"post" + key}
                  className="w3-overflow w3-nowrap-multiline"
                  style={{ marginInline: 16, marginBlock: 8 }}
                >
                  {parse(post.content)}
                </div>
              </div>
            </div>
            {post.type == "image" && (
              <div
                className="postMedia w3-display-container w3-light-grey post-image"
                data={JSON.stringify(post)}
                style={{ zIndex: 2 }}
              >
                <Image
                  alt={"image" + key}
                  unoptimized
                  loading="lazy"
                  // onContextMenu={(e) => e.preventDefault()}
                  height={320}
                  width={520}
                  src={
                    source +
                    "/images.php?w=420&h=420&zlonk=4733&zlink=" +
                    post.link
                  }
                  style={{
                    objectPosition: "center",
                    objectFit: "cover",
                    zIndex: 1,
                  }}
                  className="w3-overflow w3-light-grey post-image"
                />
              </div>
            )}
          </div>
        </div>
      ))
    } else {
      glitchForum = (
        <div style={{ paddingInline: 8 }}>
          <div
            className="w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            Nous n'avons trouves aucun forums ...
          </div>
        </div>)
    }
    setdisplayForum(glitchForum)
  }

  useEffect(() => {
    if (props.forums) {
      reloadForums(props.forums)
    } else {
      axios
        .get(source + "/_forum/default")
        .then((res) => {
          reloadForums(res.data.data);
        })
        .catch((e) => {
          console.error("failure", e);
        });
    }


  }, [])


  return (
    <div>
      {displayForum}
    </div>
  );
}
