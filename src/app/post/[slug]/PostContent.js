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
import Link from "next/link";
import { console_source as source } from "@/app/data";

export default function PostContent({ content }) {

  const [audioBox, setaudioBox] = useState({ chaine: null });
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
      source + "/audios.php?zlonk=1733&zlink=" + content.link;
    audioBox.chaine.load();
    audioBox.chaine.addEventListener("ended", () => {
      document.getElementById("iconPlay").style.display = "inline-block";
      document.getElementById("iconPause").style.display = "none";
    });

    if (document.getElementById("postImageMedia")) {
      document.getElementById("postImageMedia").style.transition = "1s";
      document.getElementById("postImageMedia").style.height = "auto";
    }
    typer(singlePostInfo.description);

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
            {(singlePostInfo.type == "image/video" || singlePostInfo.type == "video") && (
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
          <div className="w3-large w3-big" style={{ marginTop: 8 }}>
            {parse(singlePostInfo.title)}
          </div>
          <div>{parse(singlePostInfo.description)}</div>
        </div>
      </div>
    </div>
  );
}
