"use client";

import {
  faArrowLeft,
  faPause,
  faPlay,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import axios from "axios";

export default function Premium({ content, owner, slug }) {

  const [audioBox, setaudioBox] = useState({ chaine: null });
  const [singlePostInfo, setsinglePostInfo] = useState(null)

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
  const displayContent = (contentAuthority) => {
    setsinglePostInfo({
      category: contentAuthority.category,
      description: JSON.parse(contentAuthority.info).description,
      slug: contentAuthority.slug,
      title: contentAuthority.title,
      type: contentAuthority.type,
      link: contentAuthority.link,
      updated_at: contentAuthority.updated_at,
      created_at: contentAuthority.created_at,
      videoUrl: JSON.parse(contentAuthority.info).videoUrl ? JSON.parse(contentAuthority.info).videoUrl : contentAuthority.link,
    });

    audioBox.chaine = document.getElementById("audioBox");
    audioBox.chaine.src = source + "/audios.php?zlonk=1733&zlink=" + contentAuthority.link;
    audioBox.chaine.load();
    audioBox.chaine.addEventListener("ended", () => {
      document.getElementById("iconPlay").style.display = "inline-block";
      document.getElementById("iconPause").style.display = "none";
    });

    if (document.getElementById("postImageMedia")) {
      document.getElementById("postImageMedia").style.transition = "1s";
      document.getElementById("postImageMedia").style.height = "auto";
    }

    if (document.getElementById('backButtonPremiumPost')) {
      document.getElementById('backButtonPremiumPost').addEventListener('click', () => {
        if (window.history.length > 0) {
          window.history.back();
        } else {
          window.location = '/'
        }
      })

    }
  }

  useEffect(() => {

    if (document.getElementById('backButtonPremiumPost')) {
      document.getElementById('backButtonPremiumPost').addEventListener('click', () => {
        if (window.history.length > 0) {
          window.history.back();
        } else {
          window.location = '/'
        }
      })
    }

    if (!content) {
      const xcode = localStorage.getItem('x-code')
      axios
        .get(source + "/_links?link=" + slug + "&xcode=" + xcode)
        .then((res) => {

          if (res.data.linkexist && res.data.unused) {

            displayContent(res.data.data[0])


          } else {
            if (owner) {
              if (owner == '160471339156947') {
                window.location = '/premiumarea'
              } else {
                window.location = '/premiumarea/' + owner
              }

            } else {
              window.location = '/'
            }
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });

    } else {

      setsinglePostInfo({
        category: content.category,
        description: JSON.parse(content.info).description,
        slug: content.slug,
        title: content.title,
        type: content.type,
        link: content.link,
        updated_at: content.updated_at,
        created_at: content.created_at,
        videoUrl: JSON.parse(content.info).videoUrl ? JSON.parse(content.info).videoUrl : content.link,
      });

      audioBox.chaine = document.getElementById("audioBox");
      audioBox.chaine.src = source + "/audios.php?zlonk=1733&zlink=" + content.link;
      audioBox.chaine.load();
      audioBox.chaine.addEventListener("ended", () => {
        document.getElementById("iconPlay").style.display = "inline-block";
        document.getElementById("iconPause").style.display = "none";
      });

      if (document.getElementById("postImageMedia")) {
        document.getElementById("postImageMedia").style.transition = "1s";
        document.getElementById("postImageMedia").style.height = "auto";
      }
    }

    const backButtonInterval = setInterval(() => {
      if (document.getElementById('backButtonPremiumPost')) {
        document.getElementById('backButtonPremiumPost').addEventListener('click', () => {
          if (window.history.length > 0) {
            window.history.back();
          } else {
            window.location = '/'
          }
        })
        clearInterval(backButtonInterval)
      }
    }, 500);

  }, []);

  return (

    singlePostInfo &&

    <div>
      <h3 className="w3-wide w3-flex-row w3-flex-center-v w3-large">
        <div id="backButtonPremiumPost" className="w3-wide w3-pointer w3-flex-row w3-flex-center-v w3-large" style={{ paddingInline: 4 }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ width: 24 }}
          />
        </div>

        <audio id="audioBox" className="w3-hide"></audio>

        {singlePostInfo.type == "image/audio" && (
          <div id="audioControl" className="w3-margin-left w3-flex-row w3-flex">
            <div
              onClick={() => {
                audioBox.chaine.currentTime = 0;
              }}
              className="w3-dark-grey w3-card w3-circle w3-pointer w3-border w3-border-black w3-flex w3-flex-center"
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
              className="w3-dark-grey w3-card w3-circle w3-pointer w3-border w3-border-black w3-flex w3-flex-center"
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
        )}
      </h3>
      <div className="w3-container singlePostFlex" style={{ padding: 8 }}>
        <div
          id="chatCoreWrapper"
          className="w3-overflow-scroll w3-noscrollbar"
          style={{
            maxWidth: 520,
            marginInline: "auto",
          }}
        >
          <div className="w3-overflow w3-black w3-round-large">
            {(singlePostInfo.type == "image" ||
              singlePostInfo.type == "image/audio") && (
                <Image
                  id="postImageMedia"
                  alt={singlePostInfo.title}
                  unoptimized
                  loading="lazy"
                  height={420}
                  width={520}
                  src={
                    source +
                    "/images.php?w=720&h=720&zlonk=2733&zlink=" +
                    singlePostInfo.link
                  }
                  style={{
                    objectPosition: "center",
                    objectFit: "cover",
                  }}
                  className="w3-black post-image"
                />
              )}
            {!singlePostInfo.videoUrl.includes('<iframe') && (singlePostInfo.type == "image/video" || singlePostInfo.type == "video") && (
              <video
                style={{
                  objectPosition: "center",
                }}
                className="w3-overflow w3-block w3-light-grey"
                controls
              >
                <source
                  src={singlePostInfo.videoUrl}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
            {singlePostInfo.videoUrl.includes('<iframe') && singlePostInfo.videoUrl.includes('src=') && (singlePostInfo.type == "image/video" || singlePostInfo.type == "video") &&
              <iframe
                id={"videoPosts"}
                className="w3-block" //videoPosts
                height="420"
                src={getUrl(singlePostInfo.videoUrl)}
                title={getTitle(singlePostInfo.videoUrl)}
                frameBorder={0}
                allowFullScreen
              ></iframe>
            }
          </div>
          {
            extractDetails(singlePostInfo.title).length >= 3 &&
            <div style={{ marginTop: 8 }}>
              <div className="w3-medium w3-text-grey">{extractDetails(singlePostInfo.title)[0]} - Module {extractDetails(singlePostInfo.title)[1]} :</div>
              <div className="w3-large w3-big">
                {extractDetails(singlePostInfo.title)[2]}
              </div>
            </div>
          }

          {
            extractDetails(singlePostInfo.title).length < 3 &&
            <div className="w3-large w3-big" style={{ marginTop: 8 }}>
              {parse(singlePostInfo.title)}
            </div>
          }
          <div>{parse(singlePostInfo.description)}</div>
        </div>
      </div>
    </div>

  );
}
