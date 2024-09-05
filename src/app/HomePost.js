'use client'
import { faArrowLeft, faPause, faPlay, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";

export default function PostContent({ posts }) {

  const [audioBox, setaudioBox] = useState({ chaine: null });
  const [imagePostModal, setimagePostModal] = useState(
    source + "/images.php?w=720&h=720&zlonk=3733&zlink=160471339156947"
  );
  const [showThisPost, setshowThisPost] = useState();

  const getUrl = (embed) => {
    const start = embed.indexOf('src="') + 5;
    const end = embed.indexOf('"', start);
    const result = embed.substring(start, end);
    return result;
  };

  const getTitle = (embed) => {
    const start = embed.indexOf('title="') + 7;
    const end = embed.indexOf('"', start);
    const result = embed.substring(start, end);
    return result;
  };

  const showSinglePost = (post) => {
    setshowThisPost(post);
    setimagePostModal(
      source + "/images.php?w=420&h=420&zlonk=2733&zlink=" + post.link
    );
    if (post.type == "image/audio" && audioBox.chaine) {
      audioBox.chaine.src = source + "/audios.php?zlonk=1733&zlink=" + post.link;
      audioBox.chaine.load();
      audioBox.chaine.play();

      document.getElementById("iconPlay").style.display = "none";
      document.getElementById("iconPause").style.display = "inline-block";

      document.getElementById("audioControl").style.display = "flex";
    } else {
      document.getElementById("audioControl").style.display = "none";
    }
    setTimeout(() => {
      document.getElementById("modalSinglePost").style.display = "block";
    }, 100);
  };

  useEffect(() => {
    
    audioBox.chaine = document.getElementById("audioBox");

    audioBox.chaine.addEventListener("ended", () => {
      document.getElementById("iconPlay").style.display = "inline-block";
      document.getElementById("iconPause").style.display = "none";
    });
  }, [])
  

  return (
    <div>
      {posts.length > 0 &&
        posts.map((post, key) => (
          <div key={key} style={{ padding: 8, zIndex: 1 }}>
            <div
              className="w3-small w3-text-grey"
              style={{ paddingInline: 8, textAlign: "right", display: "none" }}
              id={"flashInfo" + key}
            >
              Texte copié...
            </div>
            <div className="w3-flex-column w3-overflow w3-card w3-round w3-pointer w3-white">
              <div
                data={"https://freelancer.mg/post/" + post.slug}
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
                    {parse(JSON.parse(post.info).description)}
                  </div>
                </div>
              </div>
              {(post.type == "image" || post.type == "image/audio") && (
                <div
                  onClick={() => showSinglePost(post)}
                  className="postMedia w3-display-container w3-light-grey post-image"
                  data={JSON.stringify(post)}
                  style={{ zIndex: 2 }}
                >
                  <Image
                    alt={"image" + key}
                    unoptimized
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    height={320}
                    width={520}
                    src={
                      source +
                      "/images.php?w=420&h=420&zlonk=2733&zlink=" +
                      post.link
                    }
                    style={{
                      objectPosition: "center",
                      objectFit: "cover",
                      zIndex: 1,
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
                <iframe
                  id={"videoPosts" + key}
                  className="videoPosts w3-block"
                  height="420"
                  src={getUrl(post.link)}
                  title={getTitle(post.link)}
                  frameBorder={0}
                  allowFullScreen
                ></iframe>
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

      {
        posts.length > 0 &&
        <>
          {/* modal single post */}
          <div
            id="modalSinglePost"
            className="w3-white w3-modal w3-noscrollbar"
            style={{ paddingInline: 16, paddingBlock: 68 }}
          >
            <audio id="audioBox" className="w3-hide"></audio>
            <div
              className="w3-light-grey w3-noscrollbar w3-round-large w3-content w3-overflow w3-height"
              style={{ minHeight: 320,maxWidth:486, padding: 0 }}
            >
              {/* Button control */}
              <div className="w3-top" style={{ paddingTop: 76, paddingLeft:8 }}>
                <div
                  onClick={() => {
                    if (audioBox) {
                      audioBox.chaine.pause();
                    }
                    document.getElementById("modalSinglePost").style.display =
                      "none";
                  }}
                  className="w3-white w3-card w3-round w3-pointer w3-border w3-border-black w3-flex w3-flex-center"
                  style={{ width: 32, height: 32 }}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ width: 16, height: 16 }}
                  />
                </div>
              </div>

              <div
                id="audioControl"
                className="w3-bottom w3-flex-row w3-flex"
                style={{ padding: 16, bottom: 46 }}
              >
                <div
                  onClick={() => {
                    audioBox.chaine.currentTime = 0;
                  }}
                  className="w3-white w3-card w3-circle w3-pointer w3-border w3-border-black w3-flex w3-flex-center"
                  style={{ width: 32, height: 32, marginRight: 12 }}
                >
                  <FontAwesomeIcon
                    icon={faRefresh}
                    style={{ width: 14, height: 14 }}
                  />
                </div>
                <div
                  onClick={() => {
                    if (
                      document.getElementById("iconPause").style.display == "none"
                    ) {
                      audioBox.chaine.play();
                      document.getElementById("iconPlay").style.display = "none";
                      document.getElementById("iconPause").style.display =
                        "inline-block";
                    } else {
                      audioBox.chaine.pause();
                      document.getElementById("iconPlay").style.display =
                        "inline-block";
                      document.getElementById("iconPause").style.display = "none";
                    }
                  }}
                  className="w3-white w3-card w3-circle w3-pointer w3-border w3-border-black w3-flex w3-flex-center"
                  style={{ width: 32, height: 32 }}
                >
                  <FontAwesomeIcon
                    id="iconPlay"
                    icon={faPlay}
                    style={{ width: 14, height: 14, marginLeft: 2 }}
                  />
                  <FontAwesomeIcon
                    id="iconPause"
                    icon={faPause}
                    style={{ width: 14, height: 14, display: "none" }}
                  />
                </div>
              </div>

              {/* End button control */}
              <div className="w3-height w3-overflow-scroll w3-noscrollbar">
                <div className="w3-height w3-black">
                  <div className="w3-red w3-height w3-black">
                    <Image
                      unoptimized
                      loading="lazy"
                      width={100}
                      height={320}
                      alt="post image"
                      style={{
                        objectFit: "contain",
                        objectPosition: "center",
                      }}
                      src={imagePostModal}
                      className="w3-overflow w3-black post-image w3-height"
                    />
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div>
                    <div className="w3-large w3-big">
                      {showThisPost != null ? showThisPost.title : ""}
                    </div>
                    <div>
                      {showThisPost != null
                        ? parse(JSON.parse(showThisPost.info).description)
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
}
