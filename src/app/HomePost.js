'use client'
import { faArrowLeft, faCrown, faPause, faPlay, faRefresh, faTag, faTags, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostContent({ posts }) {

  const [audioBox, setaudioBox] = useState({ chaine: null });
  const [imagePostModal, setimagePostModal] = useState(
    source + "/images.php?w=720&h=720&zlonk=3733&zlink=160471339156947"
  );
  const [showThisPost, setshowThisPost] = useState();

  const createPost = () => {
    if (window.innerWidth>992) {
      document.getElementById('createPostOnDesktop').style.display = 'block';
      document.getElementById('openPostListeButton').style.display = 'none';
    }else{
      window.location = '/post/create'
    }
  }
  // const showSinglePost = (post) => {
  //   setshowThisPost(post);
  //   setimagePostModal(
  //     source + "/images.php?w=420&h=420&zlonk=2733&zlink=" + post.link
  //   );
  //   if (post.type == "image/audio" && audioBox.chaine) {
  //     audioBox.chaine.src = source + "/audios.php?zlonk=1733&zlink=" + post.link;
  //     audioBox.chaine.load();
  //     audioBox.chaine.play();

  //     document.getElementById("iconPlay").style.display = "none";
  //     document.getElementById("iconPause").style.display = "inline-block";

  //     document.getElementById("audioControl").style.display = "flex";
  //   } else {
  //     document.getElementById("audioControl").style.display = "none";
  //   }
  //   setTimeout(() => {
  //     document.getElementById("modalSinglePost").style.display = "block";
  //     document.getElementById("homePostCore").style.display = 'none'
  //   }, 100);
  // };

  useEffect(() => {

    if (document.getElementById("audioBox")) {
      audioBox.chaine = document.getElementById("audioBox");
      audioBox.chaine.addEventListener("ended", () => {
        document.getElementById("iconPlay").style.display = "inline-block";
        document.getElementById("iconPause").style.display = "none";
      });
    }

  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div id="homePostCore">
        <div style={{ padding: 8 }}>
          <div onClick={createPost} className="w3-flex-row w3-flex-center-v w3-light-grey w3-round" style={{ padding: 16 }}>
            <div id="userPDP" className="w3-circle w3-overflow w3-white w3-margin-right" style={{ width: 42, height: 42, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
            <input
              className="w3-white w3-input w3-round-xxlarge w3-border-0 w3-flex-1"
              style={{ height: 42, paddingInline: 16, }}
              placeholder="Qu'est-ce que vous pensez!?"
            />
          </div>
        </div>
        {posts.length > 0 &&
          posts.map((post, key) => (
            <Link href={'/post/' + post.slug} key={key} style={{ padding: 8, zIndex: 1, width: '50%', display: 'inline-block' }}>
              <div className="w3-overflow w3-round w3-pointer w3-white">
                <div
                  className="w3-light-grey w3-big w3-small w3-flex-row w3-flex-center-v"
                  title={parse(post.title)}
                >
                  <div className="w3-nowrap w3-overflow w3-flex-1" style={{ padding: 8 }}>{parse(post.title)}</div>
                  {post.category == 'premium' &&
                    <div
                      title="Premium"
                      className="w3-yellow w3-circle"
                      style={{ width: 24, height: 24, marginRight: 4 }}
                    >
                      <div className="w3-block w3-height w3-flex w3-flex-center">
                        <FontAwesomeIcon
                          icon={faCrown}
                          style={{ height: 12, width: 12 }}
                        />
                      </div>
                    </div>
                  }
                  {post.category != 'premium' &&
                    <div
                      title="Free"
                      className="w3-green w3-circle"
                      style={{ width: 24, height: 24, marginRight: 4 }}
                    >
                      <div className="w3-block w3-height w3-flex w3-flex-center">
                        <FontAwesomeIcon
                          icon={faTags}
                          style={{ height: 12, width: 12 }}
                        />
                      </div>
                    </div>
                  }
                </div>

                <div
                  className="postMedia w3-display-container w3-light-grey post-image"
                  style={{ zIndex: 2 }}
                >
                  <Image
                    alt={"image" + key}
                    unoptimized
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    height={260}
                    width={260}
                    src={
                      source +
                      "/images.php?w=260&h2600&zlonk=2733&zlink=" +
                      post.link
                    }
                    style={{
                      objectPosition: "center",
                      objectFit: "cover",
                      zIndex: 1,
                      height: '65vw',
                      maxHeight: 260
                    }}
                    className="w3-overflow w3-light-grey post-image"
                  />
                  {/* {(post.type == "image/audio" || post.type == "video" || post.type == "image/video") && (
                    <div className="w3-black w3-opacity-max w3-block w3-height w3-padding w3-display-middle"></div>
                  )} */}
                  {post.type == "image/audio" && (
                    <div
                      className="w3-white w3-circle w3-display-middle"
                      style={{ width: 40, height: 40 }}
                    >
                      <div className="w3-block w3-height w3-flex w3-flex-center">
                        <FontAwesomeIcon
                          icon={faVolumeHigh}
                          style={{ height: 18, width: 18 }}
                        />
                      </div>
                    </div>
                  )}
                  {(post.type == "video" || post.type == "image/video") && (
                    <div
                      className="w3-white w3-circle w3-display-middle"
                      style={{ width: 40, height: 40 }}
                    >
                      <div className="w3-block w3-height w3-flex w3-flex-center">
                        <FontAwesomeIcon
                          icon={faPlay}
                          style={{ height: 18, width: 18, marginLeft: 4 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </Link>
          ))}
      </div>

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
            style={{ paddingInline: 8, position: 'absolute', height: 'calc(100vh - 120px)' }}
          >
            <audio id="audioBox" className="w3-hide"></audio>
            <div
              className="w3-light-grey w3-noscrollbar w3-round-large w3-content w3-overflow w3-height"
              style={{ minHeight: 320, maxWidth: 486, padding: 0 }}
            >
              {/* Button control */}
              <div className="w3-top" style={{ paddingTop: 64, paddingLeft: 16 }}>
                <div
                  onClick={() => {
                    if (audioBox) {
                      audioBox.chaine.pause();
                    }
                    document.getElementById("modalSinglePost").style.display = "none";
                    document.getElementById("homePostCore").style.display = "block";
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
                style={{ padding: 16, bottom: 52 }}
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
                    <div className="w3-medium">
                      {showThisPost != null
                        ? parse(JSON.parse(showThisPost.info).description)
                        : ""}
                    </div>
                    <div style={{ height: 32 }}></div>
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
