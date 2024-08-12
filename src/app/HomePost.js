"use client";

import {
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import parse from "html-react-parser";

export default function PostContent({ posts }) {
  const source = "https://console.freelancer.mg";
  // const source = "http://127.0.0.1:8000";  

  return (
    <div>
      {posts.length > 0 &&
        posts.map((post, key) => (
          <div key={key} style={{ padding: 8 }}>
            <div
              className="w3-small w3-text-grey"
              style={{ paddingInline: 8, textAlign: "right", display: "none" }}
              id={"flashInfo" + key}
            >
              Texte copié...
            </div>
            <div className="w3-flex-column w3-overflow w3-border w3-round w3-pointer w3-white">
              <div
                data={"https://freelancer.mg/post/" + post.slug}
                onClick={() => {
                  document.getElementById("flashInfo" + key).innerText =
                    "Le lien a été copié...";
                  document.getElementById("flashInfo" + key).style.display =
                    "block";
                  setTimeout(() => {
                    document.getElementById("flashInfo" + key).style.display =
                      "none";
                  }, 2000);
                }}
                className="postTitle w3-nowrap w3-overflow w3-light-grey w3-big w3-border-bottom"
                style={{ paddingBlock: 8, paddingInline: 16 }}
                title="Click to copy post link"
              >
                {parse(post.title)}
              </div>
              <div className="w3-border-bottom">
                <div
                  onClick={() => {
                    if (
                      document.getElementById("post" + key).className ==
                      "_expand_"
                    ) {
                      document.getElementById("post" + key).className =
                        "w3-overflow w3-nowrap-multiline";
                    } else {
                      document.getElementById("post" + key).className =
                        "_expand_";
                    }
                  }}
                  id={"post" + key}
                  className="w3-overflow w3-nowrap-multiline"
                  style={{ marginInline: 16, marginBlock: 8 }}
                >
                  {parse(JSON.parse(post.info).description)}
                </div>
              </div>
              {(post.type == "image" || post.type == "image/audio") && (
                <div
                  className="postMedia w3-display-container w3-light-grey post-image"
                  data={JSON.stringify(post)}
                >
                  <Image
                    alt={"image" + key}
                    unoptimized
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    height={300}
                    width={520}
                    src={
                      source +
                      "/images.php?w=420&h=420&zlonk=2733&zlink=" +
                      post.link
                    }
                    style={{
                      objectPosition: "center",
                      objectFit: "cover",
                    }}
                    className="w3-overflow w3-light-grey post-image"
                  />
                  {post.type == "image/audio" && (
                    <div className="w3-black w3-opacity w3-block w3-height w3-padding w3-display-middle"></div>
                  )}
                  {post.type == "image/audio" && (
                    <div
                      className="w3-white w3-circle w3-display-middle"
                      style={{ width: 60, height: 60 }}
                    >
                      <div className="w3-block w3-height w3-flex w3-flex-center">
                        <FontAwesomeIcon
                          icon={faPlay}
                          style={{ height: 24, width: 24, marginLeft: 4 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {post.type == "video" && (
                <VideoPlayer source={source} videolink={post.link} />
              )}
            </div>
          </div>
        ))}

      {posts.length <= 0 && (
        <div style={{ paddingInline: 8 }}>
          <div
            className="w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            No more post found...
          </div>
        </div>
      )}
    </div>
  );
}
