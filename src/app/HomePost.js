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
  const [displayPost, setdisplayPost] = useState('')

  const moneyMaker = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const extractDetails = (moduleTitle, title) => {
    let cleanTitle = moduleTitle.replace(title, "").trim();
    let parts = cleanTitle.split('|').map(part => part.trim());

    if (parts >= 3) {
      let secondPart = parts[1];
      let lastPart = parts[parts.length - 1];

      let middlePart = parts.slice(2, parts.length - 1).join(' ').replace(/\s+/g, ' ').trim();

      parts = [secondPart, middlePart, lastPart];
      parts[0] = parts[0].replace(/ /g, '');
      parts[2] = parts[2].replace(/[^\d]/g, '');
    }

    return parts
  }

  const makeMarqueeText = () => {
    const marquees = document.getElementsByClassName('marquee');

    for (let i = 0; i < marquees.length; i++) {
      const marquee = marquees[i].querySelector('span');
      marquee.style.animation = 'marquee ' + (marquee.innerText.length / 4.5) + 's linear infinite'
    }
  }

  const loadPost = (type) => {
    const glitchPost = posts.map((post, key) => (
      (type == 'premium' ? post.category == type : post.category != 'premium') &&
      <Link className="postCard" href={'/post/' + post.slug} key={key} style={{ padding: 8, zIndex: 1, width: '33.33%', display: 'inline-block' }}>
        <div className="w3-overflow w3-round w3-pointer w3-white">
          <div
            className="w3-light-grey w3-big w3-small w3-flex-row w3-flex-center-v"
            title={parse(post.title)}
          >
            {post.category != 'premium' &&
              <>
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
              </>
            }
            {post.category == 'premium' &&
              <>
                <div className="w3-nowrap w3-overflow w3-flex-1" style={{ padding: 8 }}>
                  {
                    extractDetails(post.title).length >= 3 &&
                    <div class="marquee">
                      <span>
                        {extractDetails(post.title)[0]} -
                        Module {extractDetails(post.title)[1]} :&nbsp;
                        {extractDetails(post.title)[2]}
                        &nbsp;({moneyMaker(extractDetails(post.title)[3])} Ar)
                      </span>
                    </div>
                  }
                  {
                    extractDetails(post.title).length < 3 &&
                    post.title.length > 36 &&

                    <div class="marquee">
                      <span>{parse(post.title)}</span>
                    </div>
                  }
                  {
                    extractDetails(post.title).length < 3 &&
                    post.title.length < 36 &&
                    <span>{parse(post.title)}</span>
                  }
                </div>
                <div
                  title="Premium"
                  className="w3-yellow w3-circle"
                  style={{ width: 26, height: 26, marginRight: 4 }}
                >
                  <div className="w3-block w3-height w3-flex w3-flex-center">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      style={{ height: 12, width: 12 }}
                    />
                  </div>
                </div>
              </>
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
    ))
    setdisplayPost(glitchPost)
    setTimeout(() => {
      makeMarqueeText();
    }, 200);
  }

  useEffect(() => {

    if (document.getElementById("audioBox")) {
      audioBox.chaine = document.getElementById("audioBox");
      audioBox.chaine.addEventListener("ended", () => {
        document.getElementById("iconPlay").style.display = "inline-block";
        document.getElementById("iconPause").style.display = "none";
      });
    }


    // side menu button
    const premiumfreeText = document.querySelector("#premiumfreeText");
    const main = document.querySelector(".main");

    const freeIcon = document.querySelector("#freeSwitch");
    const premiumIcon = document.querySelector("#premiumSwitch");

    // bottom menu switch button
    const premiumfreeText1 = document.querySelector("#premiumfreeText1");
    const main1 = document.querySelector(".main1");

    const freeIcon1 = document.querySelector("#freeSwitch1");
    const premiumIcon1 = document.querySelector("#premiumSwitch1");

    premiumfreeText.addEventListener("click", () => {

      if (premiumIcon.style.display == 'none') {

        freeIcon.style.display = 'none'
        premiumIcon.style.display = 'flex'
        main.className = "active3 w3-pointer"
        premiumfreeText.innerText = "Gratuit"
        premiumfreeText.className = "w3-text-green w3-small"

        freeIcon1.style.display = 'none'
        premiumIcon1.style.display = 'flex'
        main1.className = "active31 w3-pointer"
        premiumfreeText1.innerText = "Gratuit"
        premiumfreeText1.className = "w3-text-green w3-small"

        loadPost('free')
      } else {
        freeIcon.style.display = 'flex'
        premiumIcon.style.display = 'none'
        main.className = "main w3-pointer"
        premiumfreeText.innerText = "Premium"
        premiumfreeText.className = "w3-text-black w3-small"

        freeIcon1.style.display = 'flex'
        premiumIcon1.style.display = 'none'
        main1.className = "main1 w3-pointer"
        premiumfreeText1.innerText = "Premium"
        premiumfreeText1.className = "w3-text-black w3-small"

        loadPost('premium')
      }

    });


    premiumfreeText1.addEventListener("click", () => {

      if (premiumIcon1.style.display == 'none') {

        freeIcon.style.display = 'none'
        premiumIcon.style.display = 'flex'
        main.className = "active3 w3-pointer"
        premiumfreeText.innerText = "Gratuit"
        premiumfreeText.className = "w3-text-green"

        freeIcon1.style.display = 'none'
        premiumIcon1.style.display = 'flex'
        main1.className = "active31 w3-pointer"
        premiumfreeText1.innerText = "Gratuit"
        premiumfreeText1.className = "w3-text-green"

        loadPost('free')
      } else {
        freeIcon.style.display = 'flex'
        premiumIcon.style.display = 'none'
        main.className = "main w3-pointer"
        premiumfreeText.innerText = "Premium"
        premiumfreeText.className = "w3-text-black"

        freeIcon1.style.display = 'flex'
        premiumIcon1.style.display = 'none'
        main1.className = "main1 w3-pointer"
        premiumfreeText1.innerText = "Premium"
        premiumfreeText1.className = "w3-text-black"

        loadPost('premium')
      }

    });

    // end switch animation
    loadPost('premium')

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

        {displayPost}
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
