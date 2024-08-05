"use client";

import {
  faArrowLeft,
  faPause,
  faPlay,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import parse from "html-react-parser";

export default function PostContent({ content }) {
  const require = content.owner_key;

  const source = "https://console.freelancer.mg";
  // const source = "http://127.0.0.1:8000";

  const [displayRelated, setDisplayRelated] = useState("");
  const [audioBox, setaudioBox] = useState({chaine:null});
  const [stepper, setstepper] = useState({
    key: 0,
    scrollHeight: 0,
    intervalTyper: null,
    fielTester: null,
  });

  const singlePostInfo = {
    category: content.category,
    description: JSON.parse(content.info).description,
    slug: content.slug,
    title: content.title,
    type: content.type,
    link: content.link,
    updated_at: content.updated_at,
    created_at: content.created_at,
  };

  const typer = (text) => {
    if (stepper.fielTester == null) {
      stepper.fielTester = setInterval(() => {
        if (document.getElementById("typingField")) {
          clearInterval(stepper.fielTester);
          stepper.fielTester = null;

          if (text.length > 0) {
            document.getElementById("typingField").innerHTML = "";

            const semiPlainText = text
              .replace(/<br\s*\/?>|\n/g, "~")
              .replace(/<\/li>/g, "^")
              .replace(/<\/p>/g, "`");
            const plainText = semiPlainText.replace(/<[^>]*>/g, "");
            const convertedPlainText = plainText.split("");

            var charCounter = 0;
            var lineCounter = 0;
            var paragrapheCounter = 0;
            var listeCounter = 0;

            stepper.intervalTyper = setInterval(() => {
              let testingChar = convertedPlainText[charCounter];

              if (["~", "^", "`"].includes(convertedPlainText[charCounter])) {
                var lineCounterSemiPlainText = 0;
                var paragrapheCounterSemiPlainText = 0;
                var listeCounterSemiPlainText = 0;

                for (let i = 0; i < semiPlainText.length; i++) {
                  let currentChar = semiPlainText[i];
                  // Current character in the loop

                  // Perform actions based on character and counter comparisons
                  if (
                    testingChar === "^" &&
                    currentChar === "^" &&
                    listeCounterSemiPlainText === listeCounter
                  ) {
                    document.getElementById("typingField").innerHTML =
                      semiPlainText
                        .substring(0, i)
                        .replace(/\^/g, "</li>")
                        .replace(/`/g, "</p>")
                        .replace(/~/g, "<br/>") + "</li>";
                  }
                  if (
                    testingChar === "~" &&
                    currentChar === "~" &&
                    lineCounterSemiPlainText === lineCounter
                  ) {
                    document.getElementById("typingField").innerHTML =
                      semiPlainText
                        .substring(0, i)
                        .replace(/\^/g, "</li>")
                        .replace(/`/g, "</p>")
                        .replace(/~/g, "<br/>") + "<br/>";
                  }
                  if (
                    testingChar === "`" &&
                    currentChar === "`" &&
                    paragrapheCounterSemiPlainText === paragrapheCounter
                  ) {
                    document.getElementById("typingField").innerHTML =
                      semiPlainText
                        .substring(0, i)
                        .replace(/\^/g, "</li>")
                        .replace(/`/g, "</p>")
                        .replace(/~/g, "<br/>") + "</p>";
                  }

                  // Increment counters based on the character
                  if (testingChar == "~" && currentChar == "~") {
                    lineCounterSemiPlainText++;
                  }
                  if (testingChar == "`" && currentChar == "`") {
                    paragrapheCounterSemiPlainText++;
                  }
                  if (testingChar == "^" && currentChar == "^") {
                    listeCounterSemiPlainText++;
                  }
                }

                if (convertedPlainText[charCounter] == "~") {
                  lineCounter++;
                }
                if (convertedPlainText[charCounter] == "^") {
                  listeCounter++;
                }
                if (convertedPlainText[charCounter] == "`") {
                  paragrapheCounter++;
                }
              } else {
                document.getElementById("typingField").innerHTML =
                  document.getElementById("typingField").innerHTML +
                  testingChar;
              }

              if (charCounter == plainText.length - 1) {
                clearInterval(stepper.intervalTyper);
                document.getElementById("typingField").innerHTML = text;
              }
              const chatElement = document.getElementById("chatCoreWrapper");
              if (chatElement.scrollHeight > stepper.scrollHeight) {
                chatElement.scrollTop = chatElement.scrollHeight;
                stepper.scrollHeight = chatElement.scrollHeight;
              }

              charCounter++;
              //
            }, 30);
          }
        }
      }, 10);
    }
  };

  const reloadRelatedPost = (data) => {
    var glitchPost = "";
    if (data.length > 0) {
      glitchPost = data.map(
        (post, key) =>
          singlePostInfo.slug != post.slug && (
            <div key={key} style={{ padding: 8 }}>
              <div
                onClick={() => (document.location = "/post/" + post.slug)}
                className="w3-flex-column w3-overflow w3-border w3-round w3-pointer w3-white"
              >
                <div
                  className="w3-nowrap w3-overflow w3-light-grey w3-big w3-border-bottom"
                  style={{ paddingBlock: 8, paddingInline: 16 }}
                >
                  {parse(post.title)}
                </div>
                <div className="w3-border-bottom">
                  <div
                    id={"post" + key}
                    className="w3-overflow w3-nowrap-multiline"
                    style={{ marginInline: 16, marginBlock: 8 }}
                  >
                    {parse(JSON.parse(post.info).description)}
                  </div>
                </div>
                {(post.type == "image" || post.type == "image/audio") && (
                  <div
                    className="w3-display-container w3-light-grey post-image"
                    height={200}
                  >
                    <Image
                      alt={"image" + key}
                      unoptimized
                      loading="lazy"
                      onContextMenu={(e) => e.preventDefault()}
                      height={200}
                      width={280}
                      src={
                        source +
                        "/images.php?w=280&h=280&zlonk=2733&zlink=" +
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
                  <video
                    style={{
                      objectPosition: "center",
                    }}
                    className="w3-overflow w3-block w3-black"
                    controls
                  >
                    <source
                      src={source + "/videos.php?zlonk=1733&zlink=" + post.link}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )
      );
    } else {
      glitchPost = (
        <div>
          <div
            className="w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            No post related ...
          </div>
        </div>
      );
    }
    setDisplayRelated(glitchPost);
  };

  useEffect(() => {

    audioBox.chaine = document.getElementById("audioBox");
    audioBox.chaine.src = source + "/audios.php?zlonk=1733&zlink=" + content.link;
    audioBox.chaine.load();
    audioBox.chaine.addEventListener('ended',()=>{
      document.getElementById('iconPlay').style.display = "inline-block"
      document.getElementById('iconPause').style.display = "none"
    })

    axios
      .get(source + "/_post/" + require + "?c=default")
      .then((res) => {
        reloadRelatedPost(res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    document.getElementById("postImageMedia").style.transition = "1s";
    document.getElementById("postImageMedia").style.height = "auto";
    document.getElementById("coreMain").style.display = "block";
    typer(singlePostInfo.description);
  }, []);

  return (
    <div
      id="coreMain"
      style={{
        maxWidth: 1024,
        marginInline: "auto",
        padding: 24,
        display: "none",
      }}
    >
      <h3
        className="w3-wide w3-pointer w3-flex-row w3-flex-center-v w3-large"
      ><div onClick={() => (document.location = "/")} className="w3-wide w3-pointer w3-flex-row w3-flex-center-v w3-large" >
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{ width: 24 }}
          className="w3-marginn-right"
        />
        <b>FREELANCER</b>
      </div>
        
        <audio id="audioBox" className="w3-hide"></audio>
        {content.type == "image/audio" && (
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
      <div className="w3-container singlePostFlex w3-white w3-flex w3-flex-row w3-round-large">
        <div
          id="chatCoreWrapper"
          className="w3-flex-1 w3-overflow-scroll w3-noscrollbar"
          style={{
            maxWidth: 520,
            marginInline: "auto",
            padding: 24,
            height: "90vh",
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
            {singlePostInfo.type == "video" && (
              <video
                style={{
                  objectPosition: "center",
                }}
                className="w3-overflow w3-block w3-black"
                controls
              >
                <source
                  src={
                    source +
                    "/videos.php?zlonk=1733&zlink=" +
                    singlePostInfo.link
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="w3-large w3-big" style={{ marginTop: 24 }}>
            {singlePostInfo.title}
          </div>
          <div id="typingField" style={{ marginTop: 24 }}></div>
        </div>
        <div
          className="w3-overflow-scroll w3-noscrollbar"
          style={{ minWidth: 320, width: 320, height: "90vh" }}
        >
          <div style={{ paddingInline: 16, paddingBlock: 24 }}>
            <div className="w3-big">D'autres articles:</div>
            <div style={{ marginTop: 24 }}>{displayRelated}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
