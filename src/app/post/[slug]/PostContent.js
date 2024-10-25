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
import Link from "next/link";

export default function PostContent({ content }) {


  const [audioBox, setaudioBox] = useState({ chaine: null });
  const [stepper, setstepper] = useState({
    key: 0,
    scrollHeight: 0,
    intervalTyper: null,
    fielTester: null,
  });

  const singlePostInfo = {
    category: content.data.category,
    description: JSON.parse(content.data.info).description,
    slug: content.data.slug,
    title: content.data.title,
    type: content.data.type,
    link: content.data.link,
    updated_at: content.data.updated_at,
    created_at: content.data.created_at,
    videoUrl: JSON.parse(content.data.info).videoUrl ? JSON.parse(content.data.info).videoUrl : content.data.link,
  };

  const moneyMaker = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const extractDetails = (moduleTitle, title) => {
    let cleanTitle = moduleTitle.replace(title, "").trim();
    let parts = cleanTitle.split('|').map(part => part.trim());

    let firstPart = parts[0];
    let secondPart = parts[1];
    let lastPart = parts[parts.length - 1];

    let middlePart = parts.slice(2, parts.length - 1).join(' ').replace(/\s+/g, ' ').trim();

    parts = [secondPart, middlePart, lastPart];
    parts[0] = parts[0].replace(/ /g, '');
    parts[2] = parts[2].replace(/[^\d]/g, '');

    return parts
  }

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

  useEffect(() => {

    audioBox.chaine = document.getElementById("audioBox");
    audioBox.chaine.src =
      source + "/audios.php?zlonk=1733&zlink=" + content.data.link;
    audioBox.chaine.load();
    audioBox.chaine.addEventListener("ended", () => {
      document.getElementById("iconPlay").style.display = "inline-block";
      document.getElementById("iconPause").style.display = "none";
    });

    if (document.getElementById("postImageMedia")) {
      document.getElementById("postImageMedia").style.transition = "1s";
      document.getElementById("postImageMedia").style.height = "auto";
    }

    document.getElementById('backButton').addEventListener('click', () => {
      if (window.history.length > 0) {
        window.history.back();
      }
    })
  }, []);

  return (
    <div>
      <h3 className="w3-wide w3-flex-row w3-flex-center-v w3-large">
        <div id="backButton" className="w3-wide w3-pointer w3-flex-row w3-flex-center-v w3-large" style={{ paddingInline: 4 }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ width: 24 }}
          />
        </div>

        <audio id="audioBox" className="w3-hide"></audio>
        {content.data.type == "image/audio" && (
          <div id="audioControl" className="w3-margin-left w3-flex-row w3-flex">
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
          <div className="w3-overflow w3-light-grey w3-round-large">
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
                  className="w3-light-grey post-image"
                />
              )}
            {!singlePostInfo.videoUrl.includes('<iframe') && (singlePostInfo.type == "image/video" || singlePostInfo.type == "video") && (
              <video
                style={{
                  objectPosition: "center",
                }}
                className="w3-overflow w3-block w3-black"
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
          <div className="w3-large w3-big" style={{ marginTop: 8 }}>
            {parse(singlePostInfo.title)}
          </div>
          <div>{parse(singlePostInfo.description)}</div>
          <div className="w3-margin-top">
            {
              content.features.map((feature, key) => (
                <div key={key} style={{ paddingBlock: 8 }}>
                  <Link href={'/post/' + feature.slug} className="w3-pointer w3-light-grey w3-round w3-flex-row w3-flex-center-v " style={{ padding: 8 }}>
                    <Image
                      alt={feature.title}
                      unoptimized
                      loading="lazy"
                      height={64}
                      width={64}
                      src={
                        source +
                        "/images.php?w=720&h=720&zlonk=2733&zlink=" +
                        feature.link
                      }
                      style={{
                        objectPosition: "center",
                        objectFit: "cover",
                      }}
                      className="w3-white w3-round"
                    />
                    <div className="w3-flex-1 w3-overflow w3-nowrap" style={{ paddingInline: 16 }}>
                      <div className="w3-big w3-medium ">{extractDetails(feature.title)[1]}</div>
                      <div className="w3-tiny w3-text-grey">Module {extractDetails(feature.title)[0]}</div>
                    </div>
                    <div style={{ minWidth: 96, textAlign: "right", marginInline: 8 }}>
                      {moneyMaker(extractDetails(feature.title)[2])} Ar
                    </div>
                  </Link>
                </div>
              ))
            }

          </div>
        </div>
      </div>
    </div>
  );
}
