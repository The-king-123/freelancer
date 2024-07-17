"use client";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { faChevronCircleUp, faICursor, faPaperPlane, faSpinner, faTimes, faUsers } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  
  // const source = "https://console.freelancer.mg";
  const source = "http://127.0.0.1:8000";

  const [imagePDP, setimagePDP] = useState(source + "/images.php?zlonk=3733&zlink=160471339156947")
  const [height, setHeight] = useState(0);
  const [displayChoice, setdisplayChoice] = useState("");
  const [displayUsers, setdisplayUsers] = useState("");
  const [displayChat, setdisplayChat] = useState("");
  const [displayPosts, setdisplayPosts] = useState("");
  const [chatData, setchatData] = useState([]);
  const [killer, setkiller] = useState({ starter: null});

  const [topicData, settopicData] = useState([]);

  const [stepper, setstepper] = useState({
    key: 0,
    scrollHeight: 0,
    intervalTyper: null,
  });

  const reloadChat = (data) => {
    clearInterval(stepper.intervalTyper);

    const glitchChat = data.map((chat, key) => (
      <div key={key}>
        <div className="w3-center" style={{ paddingBlock: 16 }}>
          <button
            style={{
              marginInline: 16,
              maxWidth: 320,
              marginBlock: 8,
            }}
            className="w3-button chat-yellow w3-hover-amber w3-round"
          >
            {chat.choice}
          </button>
        </div>
        <div className="w3-flex-row" style={{ paddingBlock: 16 }}>
          <div className="w3-overflow" id={"typing" + key}>
            {key == data.length - 1
              ? ""
              : parse(chat.response.replace(/\n/g, "<br/>"))}
          </div>
        </div>
      </div>
    ));

    document.getElementById("chatLoaderCursor").style.display = "none";
    expand();

    setdisplayChat(glitchChat);

    const typerInterval = setInterval(() => {
      if (document.getElementById("typing" + (data.length - 1))) {
        clearInterval(typerInterval);

        if (data[data.length - 1].response.length > 0) {
          document.getElementById("typing" + (data.length - 1)).innerHTML = "";

          const semiPlainText = data[data.length - 1].response
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
                  document.getElementById(
                    "typing" + (data.length - 1)
                  ).innerHTML =
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
                  document.getElementById(
                    "typing" + (data.length - 1)
                  ).innerHTML =
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
                  document.getElementById(
                    "typing" + (data.length - 1)
                  ).innerHTML =
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
              document.getElementById("typing" + (data.length - 1)).innerHTML =
                document.getElementById("typing" + (data.length - 1))
                  .innerHTML + testingChar;
            }

            if (charCounter == plainText.length - 1) {
              clearInterval(stepper.intervalTyper);
              document.getElementById("typing" + (data.length - 1)).innerHTML =
                data[data.length - 1].response;
            }
            const chatElement = document.getElementById("chatCoreWrapper");
            if (chatElement.scrollHeight > stepper.scrollHeight) {
              chatElement.scrollTop = chatElement.scrollHeight;
              stepper.scrollHeight = chatElement.scrollHeight;
            }

            charCounter++;
            //
          }, 20);
        }
      }
    }, 10);
  };

  const thisChoice = async (data, type) => {
    document.getElementById("chatLoaderCursor").style.display = "flex";

    chatData.push({
      choice: data.name,
      response: JSON.parse(data.info).description,
    });

    reloadChat(chatData);

    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };

  const reloadChoice = (type, data) => {
    var glitchTopic = "";
    if (data.length > 0) {
      glitchTopic = data.map((topic, key) =>
        type == "topic" ? (
          <button
            key={key}
            onClick={() => thisChoice(topic, type)}
            style={{ marginInline: 8, maxWidth: 320, marginBlock: 8 }}
            className="w3-button chat-black w3-round"
          >
            {topic.name}
          </button>
        ) : (
          <button
            key={key}
            onClick={() => thisChoice(topic, type)}
            style={{ marginInline: 8, maxWidth: 320, marginBlock: 8 }}
            className="w3-button chat-black w3-round"
          >
            {topic.name}
          </button>
        )
      );
    } else {
      glitchTopic = (
        <div style={{ paddingInline: 16 }}>
          <div
            className="w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            No topics created yet...
          </div>
        </div>
      );
    }
    setdisplayChoice(glitchTopic);
  };

  const reloadStarter = (data) => {
    clearInterval(killer.starter);

    document.getElementById("loaderCursor").style.display = "none";

    const typerInterval = setInterval(() => {
      if (document.getElementById("starterWrapper")) {
        clearInterval(typerInterval);

        if (data.info.length > 0) {
          document.getElementById("starterWrapper").innerHTML = "";

          const semiPlainText = data.info
            .replace(/<br\s*\/?>|\n/g, "~")
            .replace(/<\/li>/g, "^")
            .replace(/<\/p>/g, "`");
          const plainText = semiPlainText.replace(/<[^>]*>/g, "");
          const convertedPlainText = plainText.split("");

          var charCounter = 0;
          var lineCounter = 0;
          var paragrapheCounter = 0;
          var listeCounter = 0;

          killer.starter = setInterval(() => {
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
                  document.getElementById("starterWrapper").innerHTML =
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
                  document.getElementById("starterWrapper").innerHTML =
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
                  document.getElementById("starterWrapper").innerHTML =
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
              document.getElementById("starterWrapper").innerHTML =
                document.getElementById("starterWrapper").innerHTML +
                testingChar;
            }

            if (charCounter == plainText.length - 1) {
              clearInterval(killer.starter);
              killer.starter = null;
            }
            if (document.body.scrollHeight > stepper.scrollHeight) {
              window.scrollTo(0, document.body.scrollHeight);
              stepper.scrollHeight = document.body.scrollHeight;
            }

            charCounter++;
            //
          }, 20);
        }
      }
    }, 10);
  };

  const reloadPost = (data) => {
    var glitchPost = "";
    if (data.length > 0) {
      glitchPost = data.map((post, key) => (
        <div key={key} style={{ padding: 8 }}>
          <div
            className="w3-flex-column w3-overflow w3-border w3-round w3-pointer w3-white"
          >
            <Link
              className="w3-nowrap w3-overflow w3-light-grey w3-big w3-border-bottom"
              style={{ paddingBlock: 8, paddingInline: 16 }}
              href={"/post/"+post.slug}
            >
              {parse(post.title)}
            </Link>
            <div className="w3-border-bottom">
              <div
                onClick={() => {
                  if (document.getElementById('post'+key).className == '_expand_') {
                    document.getElementById('post'+key).className = 'w3-overflow w3-nowrap-multiline'
                  } else {
                    document.getElementById('post'+key).className = '_expand_'
                  }
                  
                }}
                id={"post"+key}
                className="w3-overflow w3-nowrap-multiline"
                style={{ marginInline: 16,marginBlock:8 }}
              >
                {parse(JSON.parse(post.info).description)}
              </div>
            </div>
            {post.type == "image" && (
              <Image
                alt={"image" + key}
                unoptimized
                loading="lazy"
                height={ window.innerWidth <= 420 ? 280 : 320 }
                width={520}
                src={source + "/images.php?zlonk=2733&zlink=" + post.link}
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
                className="w3-overflow w3-light-grey post-image"
              />
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
      ));
    } else {
      glitchPost = (
        <div>
          <div
            className="w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            No more post found...
          </div>
        </div>
      );
    }
    setdisplayPosts(glitchPost);
  };

  const showUser = async (key) => {
    closeUsers();
    setimagePDP(source + "/images.php?zlonk=3733&zlink=" + key);

    chatData.splice(0, chatData.length);
    if (document.getElementById("chatChoice").clientHeight != 60) {
      document.getElementById("chatChoice").style.overflow = "hidden";
      document.getElementById("chatChoice").style.transition = "0.4s";
      document.getElementById("chatChoice").style.height = "60px";

      document.getElementById("expandIcon").style.transition = "0.4s";
      document.getElementById("expandIcon").style.transform = "rotate(0deg)";
    }
    const loader = (
      <div className="w3-flex w3-flex-center" style={{ padding: 24 }}>
        <span className="w3-spin">
          <FontAwesomeIcon icon={faSpinner} />
        </span>
      </div>
    );
    setdisplayChat("");
    setdisplayChoice("");
    setdisplayPosts(loader);
    await axios
      .get(source + "/_accrocher/" + key)
      .then((res) => {
        reloadStarter(res.data.data[0]);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    await axios
      .get(source + "/_topic/" + key)
      .then((res) => {
        res.data.data.forEach((tpc) => {
          topicData.push(tpc);
        });
        openChat();
        reloadChoice("topic", res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    await axios
      .get(source + "/_post/" + key + "?c=default")
      .then((res) => {
        reloadPost(res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });
  };

  const showDefault = async () => {
    closeUsers();
    setimagePDP(source + "/images.php?zlonk=3733&zlink=160471339156947");

    chatData.splice(0, chatData.length);

    if (document.getElementById("chatChoice").clientHeight != 60) {
      document.getElementById("chatChoice").style.overflow = "hidden";
      document.getElementById("chatChoice").style.transition = "0.4s";
      document.getElementById("chatChoice").style.height = "60px";

      document.getElementById("expandIcon").style.transition = "0.4s";
      document.getElementById("expandIcon").style.transform = "rotate(0deg)";
    }

    const loader = (
      <div className="w3-flex w3-flex-center" style={{ padding: 24 }}>
        <span className="w3-spin">
          <FontAwesomeIcon icon={faSpinner} />
        </span>
      </div>
    );
    setdisplayChat("");
    setdisplayChoice("");
    setdisplayPosts(loader);
    await axios
      .get(source + "/_accrocher/default")
      .then((res) => {
        reloadStarter(res.data.data[0]);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    await axios
      .get(source + "/_topic/default")
      .then((res) => {
        res.data.data.forEach((tpc) => {
          topicData.push(tpc);
        });
        reloadChoice("topic", res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    await axios
      .get(source + "/_post/default?c=default")
      .then((res) => {
        reloadPost(res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });
  };

  const reloadUsers = (data) => {
    var glitchUsers = "";
    if (data.length > 1) {
      glitchUsers = data.map(
        (user, key) =>
          key > 0 && (
            <div
              onClick={() => showUser(user.key)}
              key={key}
              className="w3-white w3-pointer w3-flex-row w3-flex-center-v w3-round w3-block"
              style={{ marginBlock: 16, padding: 8 }}
            >
              <Image
                loading="lazy"
                unoptimized
                width={40}
                height={40}
                src={source + "/images.php?zlonk=3733&zlink=" + user.key}
                className="w3-circle w3-margin-right"
                alt={user.fullname}
                style={{objectFit:'cover',objectPosition:'center'}}
              />
              <div
                className="w3-small w3-big w3-nowrap w3-overflow"
                style={{ width: 196 }}
              >
                {user.fullname}
              </div>
            </div>
          )
      );
    } else {
      glitchUsers = (
        <div>
          <div
            className="w3-text-black w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            You will find here all users
          </div>
        </div>
      );
    }
    setdisplayUsers(glitchUsers);
  };

  const expand = () => {
    if (document.getElementById("chatChoice").clientHeight == 60) {
      document.getElementById("chatChoice").style.overflow = "auto";
      document.getElementById("chatChoice").style.transition = "1s";
      document.getElementById("chatChoice").style.height =
        window.innerHeight + "px";

      document.getElementById("expandIcon").style.transition = "1s";
      document.getElementById("expandIcon").style.transform = "rotate(180deg)";
    } else {
      document.getElementById("chatChoice").style.overflow = "hidden";
      document.getElementById("chatChoice").style.transition = "0.4s";
      document.getElementById("chatChoice").style.height = "60px";

      document.getElementById("expandIcon").style.transition = "0.4s";
      document.getElementById("expandIcon").style.transform = "rotate(0deg)";
    }
  };

  const openChat = () => {
    document.getElementById("sidebarMenu").style.display = "none";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("sidebarChat").style.display = "block";
  };

  const closeChat = () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("sidebarChat").style.display = "none";
  };

  const openUsers = () => {
    document.getElementById("sidebarChat").style.display = "none";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("sidebarMenu").style.display = "block";

    document.getElementById("usersCloseButton").style.display = "block";
    document.getElementById("usersOpenButton").style.display = "none";
    document.getElementById("chatOpenButton").style.display = "none";
  };

  const closeUsers = () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("sidebarMenu").style.display = "none";

    document.getElementById("usersCloseButton").style.display = "none";
    document.getElementById("usersOpenButton").style.display = "block";
    document.getElementById("chatOpenButton").style.display = "block";
  };
  
  useEffect(() => {

    const localHosts = ["localhost", "127.0.0.1", "::1"];
  
    if (
      !localHosts.includes(location.hostname) &&
      location.protocol === "http:"
    ) {
      location.href =
        "https://" + location.hostname + location.pathname + location.search;
    }else{
      document.getElementById("coreMain").style.display = 'block'
    }

    axios
      .get(source + "/_accrocher/default")
      .then((res) => {
        reloadStarter(res.data.data[0]);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    axios
      .get(source + "/_topic/default")
      .then((res) => {
        res.data.data.forEach((tpc) => {
          topicData.push(tpc);
        });
        reloadChoice("topic", res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    axios
      .get(source + "/_post/default?c=default")
      .then((res) => {
        reloadPost(res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    axios
      .get(source + "/_auth/users")
      .then((res) => {
        reloadUsers(res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });

    window.addEventListener("scroll", function () {
      // Calculate the scrollable height
      const chatElement = document.getElementById("chatCoreWrapper");
      const totalHeight = chatElement.scrollHeight;
      const viewportHeight = chatElement.clientHeight;

      // Determine the current scroll position
      const currentScroll = chatElement.scrollTop;

      // Check if the current scroll position is less than the maximum scrollable height minus the viewport height
      if (currentScroll + viewportHeight < totalHeight) {
        stepper.scrolling = true;
      } else {
        stepper.scrolling = false;
      }
    });
    setInterval(() => {
      document.getElementById("coreMain").style.userSelect = "none";
    }, 1000);

    const updateHeight = () => {
      setHeight(window.innerHeight - 80);
    };

    // Set the initial height
    updateHeight();

    // Update height on window resize
    window.addEventListener("resize", updateHeight);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div id="coreMain" className="container " style={{ userSelect: "none",display:'none' }}>
      <div
        id="overlay"
        style={{ width: "100vw", height: "100vh" }}
        className="w3-display-middle w3-hide-large"
      ></div>
      <nav
        className="w3-animate-left w3-sidebar w3-bar-block w3-light-grey w3-collapse w3-top"
        style={{ zIndex: 3, width: 250 }}
        id="sidebarMenu"
      >
        <div className="w3-container w3-display-container w3-padding-16">
          <h3
            onClick={showDefault}
            className="w3-wide w3-pointer w3-center w3-flex-row w3-flex-center w3-large"
          >
            <b>FREELANCER</b>
          </h3>
        </div>
        <div
          className="w3-padding-32 w3-large w3-text-grey"
          style={{ paddingInline: 16 }}
        >
          {displayUsers}
        </div>
      </nav>

      <main
        className="w3-main w3-100vh w3-overflow-scroll w3-noscrollbar"
        style={{ marginLeft: 250, marginRight: 320, padding: 8 }}
      >
        <div
          className="w3-container"
          style={{ padding: 0, maxWidth: 480, margin: "auto" }}
        >
          {displayPosts}
        </div>
      </main>

      <nav
        className="w3-animate-right w3-sidebar w3-bar-block w3-light-grey w3-collapse w3-top"
        style={{ zIndex: 3, width: 320, right: 0 }}
        id="sidebarChat"
      >
        <div
          id="chatCoreWrapper"
          className=" w3-overflow-scroll-v w3-noscrollbar"
          style={{ padding: 16, height: height }}
        >
          <div style={{ marginInline: "auto" }}>
            <div>
              <Image
                id="imagePDP"
                unoptimized
                loading="lazy"
                className="w3-circle"
                width={100}
                height={100}
                alt="App profile"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={imagePDP}
              />
            </div>

            <div className="w3-flex-row" style={{ paddingBlock: 16 }}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                <FontAwesomeIcon
                  id="loaderCursor"
                  className="w3-text-grey clignote"
                  icon={faICursor}
                />
                <div id="starterWrapper"></div>
              </div>
            </div>

            <div id="chatCore">{displayChat}</div>

            <div
              id="chatLoaderCursor"
              className="w3-flex-row"
              style={{ paddingBlock: 16, display: "none" }}
            >
              <div className="w3-flex-end-v">
                <Image
                  className="w3-flex-end-v w3-circle"
                  unoptimized
                  loading="lazy"
                  width={8}
                  height={8}
                  alt="App profile chat"
                  style={{
                    marginRight: 8,
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  src={"/images/user.jpg"}
                />
              </div>
              <div className="w3-overflow">
                <FontAwesomeIcon
                  className="w3-text-grey clignote"
                  icon={faICursor}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          id="chatChoice"
          className="w3-main w3-center w3-display-bottommiddle w3-block w3-overflow"
          style={{
            height: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div className="w3-white" style={{ display: "block" }}>
            {displayChoice}
          </div>
          <div
            className="w3-light-grey"
            style={{ paddingInline: 16, paddingBottom: 10 }}
          >
            <div className="w3-flex-row w3-flex-center-v">
              <div
                onClick={() => expand()}
                className="w3-button w3-hover-black w3-black w3-flex-1 w3-round-xxlarge w3-flex-row w3-flex-center-v"
                style={{ marginTop: 12 }}
              >
                <span className="w3-center w3-flex-1">Des questions !?</span>{" "}
                <FontAwesomeIcon id="expandIcon" icon={faChevronCircleUp} />
              </div>
              <div
                onClick={closeChat}
                className="w3-hide-large w3-text-black w3-hover-black w3-yellow w3-flex-center w3-flex w3-round-xxlarge"
                style={{ width: 38, height: 38, marginTop: 12 }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ width: 18, height: 18 }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        id="usersCloseButton"
        onClick={closeUsers}
        className="w3-yellow w3-overflow w3-circle w3-card w3-bottom w3-right"
        style={{
          width: 40,
          height: 40,
          right: 16,
          bottom: 56,
          padding: 0,
          display: "none",
        }}
      >
        <div
          className="w3-flex w3-flex-center"
          style={{ width: 40, height: 40 }}
        >
          <FontAwesomeIcon
            className="w3-text-black"
            icon={faTimes}
            width={20}
            height={20}
          />
        </div>
      </div>

      <div
        id="usersOpenButton"
        onClick={openUsers}
        className="w3-yellow w3-overflow w3-circle w3-card w3-bottom w3-right"
        style={{ width: 40, height: 40, right: 16, bottom: 56, padding: 0 }}
      >
        <div
          className="w3-flex w3-flex-center"
          style={{ width: 40, height: 40 }}
        >
          <FontAwesomeIcon
            className="w3-text-black"
            icon={faUsers}
            width={20}
            height={20}
          />
        </div>
      </div>

      <div
        id="chatOpenButton"
        onClick={openChat}
        className="w3-yellow w3-overflow w3-circle w3-card w3-bottom w3-right"
        style={{ width: 40, height: 40, right: 16, bottom: 8, padding: 0 }}
      >
        <div
          className="w3-flex w3-flex-center"
          style={{ width: 40, height: 40 }}
        >
          <FontAwesomeIcon
            className="w3-text-black"
            icon={faPaperPlane}
            width={20}
            height={20}
          />
        </div>
      </div>
    </div>
  );
}