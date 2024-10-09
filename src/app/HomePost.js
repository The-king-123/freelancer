'use client'
import { faArrowLeft, faCrown, faDollarSign, faGift, faPause, faPlay, faRefresh, faTag, faTags, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
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
    if (window.innerWidth > 992) {
      document.getElementById('createPostOnDesktop').style.display = 'block';
      document.getElementById('openPostListeButton').style.display = 'none';
    } else {
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

    // switch animatin

    const btn3_ctn = document.querySelector(".btn3_container");
    const main = document.querySelector(".main");

    const freeIcon = document.querySelector("#freeSwitch");
    const premiumIcon = document.querySelector("#premiumSwitch");

    btn3_ctn.addEventListener("click", () => {
      console.log(premiumIcon.style.display);
      
      if (premiumIcon.style.display == 'none') {
        freeIcon.style.display = 'none'
        premiumIcon.style.display = 'flex'
        main.className = "active3 w3-pointer"
      } else {
        freeIcon.style.display = 'flex'
        premiumIcon.style.display = 'none'
        main.className = "main w3-pointer"
      }

    });

    // end switch animation

  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div id="homePostCore">
        {/* <div style={{ padding: 8 }}>
          <div onClick={createPost} className="w3-flex-row w3-flex-center-v w3-light-grey w3-round" style={{ padding: 16 }}>
            <div id="userPDP" className="w3-circle w3-overflow w3-white w3-margin-right" style={{ width: 42, height: 42, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
            <input
              className="w3-white w3-input w3-round-xxlarge w3-border-0 w3-flex-1"
              style={{ height: 42, paddingInline: 16, }}
              placeholder="Qu'est-ce que vous pensez!?"
            />
          </div>
        </div> */}
        {/* ///-------------------- */}
        <div>
          <div className="btn3_container">
            <span className="main w3-pointer">
              <div id="freeSwitch" className="btn w3-green w3-text-white w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36 }}>
                <FontAwesomeIcon icon={faGift} />
              </div>
              <div id="premiumSwitch" className="btn w3-yellow w3-text-black w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36, display: 'none' }}>
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
            </span>
          </div>
        </div>
        {/* ///-------------------- */}
        {posts.length > 0 &&
          posts.map((post, key) => (
            <Link className="postCard" href={'/post/' + post.slug} key={key} style={{ padding: 8, zIndex: 1, width: '33.33%', display: 'inline-block' }}>
              <div className="w3-overflow w3-round w3-pointer w3-white">
                <div
                  className="w3-light-grey w3-big w3-small w3-flex-row w3-flex-center-v"
                  title={parse(post.title)}
                >
                  <div className="w3-nowrap w3-overflow w3-flex-1" style={{ padding: 8 }}>{parse(post.title)}</div>

                  <div
                    title="Gratuit"
                    className="w3-green w3-circle"
                    style={{ width: 24, height: 24, marginRight: 4 }}
                  >
                    <div className="w3-block w3-height w3-flex w3-flex-center">
                      <FontAwesomeIcon
                        icon={faGift}
                        style={{ height: 12, width: 12 }}
                      />
                    </div>
                  </div>
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
                      "/images.php?w=260&h=260&zlonk=2733&zlink=" +
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
                      className="w3-white w3-circle w3-display-middle w3-card"
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
                      className="w3-white w3-circle w3-display-middle w3-card"
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

    </div>
  );
}
