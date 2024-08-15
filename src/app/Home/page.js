"use client";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import axios from "axios";
import {
  faArrowLeft,
  faBars,
  faBell,
  faChevronCircleUp,
  faHome,
  faICursor,
  faList,
  faPaperPlane,
  faPause,
  faPhone,
  faPlay,
  faPlus,
  faRefresh,
  faSpinner,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "cloudinary-video-player/cld-video-player.min.css";
import Link from "next/link";
import slugify from "slugify";
import {
  faFacebookMessenger,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

export default function Home(props) {
  const source = "https://console.freelancer.mg";
  // const source = "http://127.0.0.1:8000";

  const [fullPath, setfullPath] = useState({ path: "" });
  const [imagePDP, setimagePDP] = useState(null);
  const [imagePostModal, setimagePostModal] = useState(
    source + "/images.php?w=720&h=720&zlonk=3733&zlink=160471339156947"
  );
  const [contact, setcontact] = useState({
    phone: null,
    whatsapp: null,
    messenger: null,
  });

  const [audioBox, setaudioBox] = useState({ chaine: null });
  const [showThisPost, setshowThisPost] = useState();
  const [height, setHeight] = useState(0);
  const [displayDesignations, setdisplayDesignations] = useState("");
  const [displayChat, setdisplayChat] = useState(
    <div className="w3-flex w3-flex-center" style={{ padding: 24 }}>
      <span className="w3-spin">
        <FontAwesomeIcon icon={faSpinner} />
      </span>
    </div>
  );
  const [displayChoice, setdisplayChoice] = useState("");
  const [chatData, setchatData] = useState([]);
  const [usersData, setusersData] = useState([]);
  const [designationData, setdesignationData] = useState([]);
  const [killer, setkiller] = useState({ starter: null });
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
          }, 40);
        }
      }
    }, 10);
  };

  const thisChoice = async (data) => {
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
              const chatElement = document.getElementById("chatCoreWrapper");
              if (chatElement.scrollHeight > stepper.scrollHeight) {
                chatElement.scrollTop = chatElement.scrollHeight;
                stepper.scrollHeight = chatElement.scrollHeight;
              }
            }
            charCounter++;
            //
          }, 40);
        }
      }
    }, 10);
  };

  const showUser = async (key, others) => {
    closeAllPanel();
    var users = localStorage.getItem("users");
    var userInfos = null;
    console.log(users);
    
    if (users) {
      userInfos = JSON.parse(users).find((obj) => obj.key == key);
    }
    if (userInfos) {
      if (userInfos.contact.includes("whatsapp")) {
        setcontact({
          phone:
            JSON.parse(userInfos.contact).telephone.length > 3
              ? JSON.parse(userInfos.contact).telephone
              : null,
          whatsapp:
            JSON.parse(userInfos.contact).whatsapp.length > 3
              ? JSON.parse(userInfos.contact).whatsapp
              : null,
          messenger:
            JSON.parse(userInfos.contact).messenger.length > 3
              ? JSON.parse(userInfos.contact).messenger
              : null,
        });
      } else {
        setcontact({
          phone: userInfos.contact.length > 3 ? userInfos.contact : null,
          whatsapp: null,
          messenger: null,
        });
      }
    }

    setimagePDP(
      source +
        "/images.php?w=100&h=100&zlonk=3733&zlink=" +
        (key == "default" ? "160471339156947" : key)
    );

    chatData.splice(0, chatData.length);
    if (document.getElementById("chatChoice").clientHeight != 60) {
      document.getElementById("chatChoice").style.overflow = "hidden";
      document.getElementById("chatChoice").style.transition = "0.4s";
      document.getElementById("chatChoice").style.height = "60px";

      document.getElementById("expandIcon").style.transition = "0.4s";
      document.getElementById("expandIcon").style.transform = "rotate(0deg)";
    }

    setdisplayChat("");
    setdisplayChoice("");

    if (others) {
      await axios
        .get(source + "/_accrocher/" + key)
        .then((res) => {
          localStorage.setItem("accrocher", JSON.stringify(res.data.data[0]));
          reloadStarter(res.data.data[0]);
          console.log(res.data.data[0]);
          
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
          localStorage.setItem("topic", JSON.stringify(res.data.data));
          reloadChoice("topic", res.data.data);
        })
        .catch((e) => {
          console.error("failure", e);
        });
    } else {
      var accrocher = localStorage.getItem("accrocher");
      var topic = localStorage.getItem("topic");

      reloadStarter(JSON.parse(accrocher));
      reloadChoice("topic", JSON.parse(topic));
    }
  };

  const reloadDesignation = (data) => {
    data.forEach((user) => {
      if (
        !designationData.includes(user.designation) &&
        user.designation != "Admin"
      ) {
        designationData.push(user.designation);
      }
    });
    var glitchDesignations = "";
    if (designationData.length > 0) {
      glitchDesignations = designationData.map((designation, key) => (
        <Link
          onClick={() => {
            if (
              !fullPath.path.includes(
                "/talent/" + slugify(designation, { lower: true })
              )
            ) {
              stopAllIntervalAndTimeout();
            }
          }}
          href={"/talent/" + slugify(designation, { lower: true })}
          key={key}
          className="w3-white w3-pointer w3-flex-row w3-flex-center-v w3-round w3-block"
          style={{ marginBlock: 16, padding: 8 }}
        >
          <div
            className="w3-medium w3-big w3-nowrap w3-overflow"
            style={{ width: 196 }}
          >
            {designation}
          </div>
        </Link>
      ));
    } else {
      glitchDesignations = (
        <div>
          <div
            className="w3-text-black w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            You will find categories here...
          </div>
        </div>
      );
    }
    setdisplayDesignations(glitchDesignations);
  };

  const toggleChat = () => {
    if (document.getElementById("sidebarChat").style.display != "block") {
      closeAllPanel();
      document.getElementById("overlay").style.display = "block";
      document.getElementById("sidebarChat").className =
        "mobileHeightPanel panel w3-sidebar w3-bar-block w3-light-grey w3-collapse w3-top w3-animate-right";
      document.getElementById("sidebarChat").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
      document.getElementById("sidebarChat").style.display = "none";
    }
  };

  const toggleUsers = () => {
    if (document.getElementById("sidebarMenu").style.display != "block") {
      closeAllPanel();
      document.getElementById("overlay").style.display = "block";
      document.getElementById("sidebarMenu").className =
        "mobileHeightPanel panel w3-sidebar w3-bar-block w3-light-grey w3-collapse w3-top w3-animate-left";
      document.getElementById("sidebarMenu").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
      document.getElementById("sidebarMenu").style.display = "none";
    }
  };

  const closeAllPanel = () => {
    const allPanel = document.getElementsByClassName("panel");
    for (let i = 0; i < allPanel.length; i++) {
      allPanel[i].style.display = "none";
    }
    document.getElementById("overlay").style.display = "none";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        console.log("Text copied to clipboard");
      })
      .catch(function (err) {
        console.error("Could not copy text: ", err);
      });
  };

  const shareOnFacebook = (link) => {
    const url = link;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;

    window.open(
      facebookShareUrl,
      "facebook-share-dialog",
      "width=800,height=600"
    );
  };

  const stopAllIntervalAndTimeout = () => {
    var highestIntervalId = window.setInterval(() => {}, 1);
    for (var i = 0; i < highestIntervalId; i++) {
      window.clearInterval(i);
    }

    var highestTimeoutId = window.setTimeout(() => {}, 1);
    for (var i = 0; i < highestTimeoutId; i++) {
      window.clearTimeout(i);
    }
  };

  const showSinglePost = (post) => {
    setshowThisPost(post);
    setimagePostModal(
      source + "/images.php?w=420&h=420&zlonk=2733&zlink=" + post.link
    );
    if (post.type == "image/audio" && audioBox.chaine) {
      audioBox.chaine.src =
        source + "/audios.php?zlonk=1733&zlink=" + post.link;
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

  const Home = () => {
    var user = localStorage.getItem("user");
    if (user) {
      if (user == "160471339156947") {
        window.location = "/";
      } else {
        window.location = "/user/" + user;
      }
    } else {
      window.location = "/";
    }
  };

  useEffect(() => {
    const localHosts = ["localhost", "127.0.0.1", "::1"];

    stopAllIntervalAndTimeout();
    if (typeof window !== "undefined") {
      fullPath.path = window.location.pathname;
    }

    if (
      !localHosts.includes(location.hostname) &&
      location.protocol === "http:"
    ) {
      location.href =
        "https://" + location.hostname + location.pathname + location.search;
    } else {
      document.getElementById("coreMain").style.display = "block";
    }

    const posts = document.getElementsByClassName("postMedia");
    for (let i = 0; i < posts.length; i++) {
      posts[i].addEventListener("click", () => {
        const post = posts[i].getAttribute("data");
        showSinglePost(JSON.parse(post));
      });
    }

    const postsTitle = document.getElementsByClassName("postTitle");
    for (let i = 0; i < postsTitle.length; i++) {
      postsTitle[i].addEventListener("click", () => {
        const post = postsTitle[i].getAttribute("data");
        copyToClipboard(post);
      });
    }

    const talentsList = document.getElementsByClassName("talentsList");
    for (let i = 0; i < talentsList.length; i++) {
      talentsList[i].addEventListener("click", () => {
        stopAllIntervalAndTimeout();
      });
    }

    const categoryUser = document.getElementsByClassName("categoryUser");
    for (let i = 0; i < categoryUser.length; i++) {
      categoryUser[i].addEventListener("click", () => {
        stopAllIntervalAndTimeout();
      });
    }

    var users = localStorage.getItem("users");
    if (users) {
      reloadDesignation(JSON.parse(users));
    } else {
      axios
        .get(source + "/_auth/users")
        .then((res) => {
          localStorage.setItem("users", JSON.stringify(res.data.data));
          reloadDesignation(res.data.data);
        })
        .catch((e) => {
          console.error("failure", e);
        });
    }

    var user = localStorage.getItem("user");
    if (props.user) {
      if (props.user == user) {
        showUser(user, false);
      } else {
        localStorage.setItem("user", props.user);
        showUser(props.user, true);
      }
    } else {
      if (user) {
        showUser(user, false);
      } else {
        showUser("160471339156947", true);
      }
    }

    audioBox.chaine = document.getElementById("audioBox");

    audioBox.chaine.addEventListener("ended", () => {
      document.getElementById("iconPlay").style.display = "inline-block";
      document.getElementById("iconPause").style.display = "none";
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
      setHeight(window.innerHeight - 80 - (window.innerWidth>992?0:20));
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
    <div
      id="coreMain"
      className="container "
      style={{ userSelect: "none", display: "none" }}
    >
      <div
        onClick={() => closeAllPanel()}
        id="overlay"
        style={{ width: "100vw", height: "100vh", zIndex: 4 }}
        className="w3-display-middle w3-hide-large"
      ></div>

      <nav
        className="mobileHeightPanel panel w3-sidebar w3-bar-block w3-light-grey w3-collapse w3-top"
        style={{
          zIndex: 5,
          width: 250,
          top: 8,
          borderRadius: "0px 8px 8px 0px",
        }}
        id="sidebarMenu"
      >
        <div className="w3-container w3-display-container w3-padding-16">
          <Link
            onClick={() => {
              localStorage.removeItem("user");
              if (fullPath.path.length > 0) {
                stopAllIntervalAndTimeout();
              }
            }}
            href={"/"}
            className="w3-wide w3-pointer w3-center w3-flex-row w3-flex-center w3-large"
          >
            <b>FREELANCER</b>
          </Link>
        </div>
        <div
          className="w3-padding-32 w3-large w3-text-grey"
          style={{ paddingInline: 16 }}
        >
          {displayDesignations}
          {/* <div className="w3-flex w3-flex-row w3-flex-center-v">
            <Link
              onClick={() => {
                if (fullPath.path != "/talent/" && fullPath.path != "/talent") {
                  stopAllIntervalAndTimeout();
                  closeAllPanel();
                }
              }}
              className="w3-small w3-text-grey w3-padding w3-white"
              href={"/talent"}
            >
              Voir plus
            </Link>
          </div> */}
        </div>
      </nav>

      <main
        id="mainCore"
        className="mobileHeight w3-main w3-100vh w3-overflow-scroll w3-noscrollbar"
        style={{ marginLeft: 250, marginRight: 320, padding: 8 }}
      >
        <div
          className="w3-container"
          style={{ padding: 0, maxWidth: 480, margin: "auto" }}
        >
          <div className="w3-hide-large" style={{height:54}}>hui</div>
          {props.core}
        </div>
      </main>

      <nav
        className="mobileHeightPanel panel w3-sidebar w3-bar-block w3-light-grey w3-collapse w3-top"
        style={{
          zIndex: 5,
          width: 320,
          right: 0,
          top: 8,
          borderRadius: "8px 0px 0px 8px",
        }}
        id="sidebarChat"
      >
        <div
          id="chatCoreWrapper"
          className=" w3-overflow-scroll-v w3-noscrollbar"
          style={{ padding: 16, height: height }}
        >
          <div style={{ marginInline: "auto" }}>
            <div>
              <div
                className="w3-circle w3-light-grey w3-flex w3-flex-row w3-flex-center-v"
                style={{ minWidth: 80, minHeight: 80 }}
              >
                {imagePDP && (
                  <Image
                    id="imagePDP"
                    unoptimized
                    loading="lazy"
                    className={!imagePDP.includes('160471339156947')?"w3-circle":''}
                    width={80}
                    height={80}
                    alt="App profile"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    src={imagePDP}
                  />
                )}

                <div className="w3-padding w3-flex-1 w3-flex-row w3-flex-center-v">
                  {contact.phone && (
                    <div
                      onClick={() =>
                        window.open("tel:" + contact.phone, "_blank").focus()
                      }
                      className="w3-circle w3-border w3-flex-center w3-flex"
                      style={{ height: 36, width: 36, margin: 4 }}
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                  )}
                  {contact.whatsapp && (
                    <div
                      onClick={() =>
                        window
                          .open("https://wa.me/" + contact.whatsapp, "_blank")
                          .focus()
                      }
                      className="w3-circle w3-border w3-flex-center w3-flex"
                      style={{ height: 36, width: 36, margin: 4 }}
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </div>
                  )}
                  {contact.messenger && (
                    <div
                      onClick={() =>
                        window.open(contact.messenger, "_blank").focus()
                      }
                      className="w3-circle w3-border w3-flex-center w3-flex"
                      style={{ height: 36, width: 36, margin: 4 }}
                    >
                      <FontAwesomeIcon icon={faFacebookMessenger} />
                    </div>
                  )}
                </div>
              </div>
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
          <div
            className="w3-light-grey w3-card"
            style={{ display: "block", paddingTop: 12 }}
          >
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
            </div>
          </div>
        </div>
      </nav>
      {/* // Top bar menu */}
      <div
        className="w3-top w3-block w3-card w3-white w3-flex w3-flex-row w3-flex-center-v w3-hide-large"
        style={{ paddingBlock: 8, paddingInline:16, zIndex: 3 }}
      >
        <div className="w3-flex-1">
          <Link
            onClick={() => {
              localStorage.removeItem("user");
              if (fullPath.path.length > 0) {
                stopAllIntervalAndTimeout();
              }
            }}
            href={"/"}
            className="w3-wide w3-pointer w3-flex-row w3-large"
          >
            <b>FREELANCER</b>
          </Link>
        </div>

        <div
          style={{ width: 36, height: 36 }}
        >
          <div
            className="w3-flex w3-flex-center w3-overflow w3-card w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              className="w3-text-black"
              icon={faBars}
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>

      {/* // bottom menu */}
      <div
        className="w3-bottom w3-block w3-card w3-white w3-flex w3-flex-row w3-flex-center-v w3-hide-large"
        style={{ paddingBlock: 8, zIndex: 9999 }}
      >
        <div className="w3-flex-1" style={{ width: 36, height: 36 }}>
          <div
            className="w3-flex w3-flex-center w3-overflow w3-card w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
            onClick={Home}
          >
            <FontAwesomeIcon
              className="w3-text-black"
              icon={faHome}
              width={20}
              height={20}
            />
          </div>
        </div>

        <div
          onClick={toggleUsers}
          className="w3-flex-1"
          style={{ width: 36, height: 36 }}
        >
          <div
            className="w3-flex w3-flex-center w3-overflow w3-card w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              className="w3-text-black"
              icon={faUsers}
              width={20}
              height={20}
            />
          </div>
        </div>

        <div className="w3-flex-1" style={{ width: 36, height: 36 }}>
          <div
            className="w3-flex w3-flex-center w3-overflow w3-card w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              className="w3-text-black"
              icon={faPlus}
              width={20}
              height={20}
            />
          </div>
        </div>

        <div className="w3-flex-1" style={{ width: 36, height: 36 }}>
          <div
            className="w3-flex w3-flex-center w3-overflow w3-card w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              className="w3-text-black"
              icon={faBell}
              width={20}
              height={20}
            />
          </div>
        </div>

        <div
          onClick={toggleChat}
          className="w3-flex-1"
          style={{ width: 36, height: 36 }}
        >
          <div
            className="w3-flex w3-flex-center w3-overflow w3-card w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
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

      {/* modal sigle post */}
      <div
        id="modalSinglePost"
        className="mobileHeight w3-light-grey w3-modal w3-noscrollbar"
        style={{ width: "100vw", padding: 24 }}
      >
        <audio id="audioBox" className="w3-hide"></audio>
        <div
          className="w3-white w3-noscrollbar w3-container w3-round-large w3-content w3-overflow w3-height"
          style={{ minHeight: 320, padding: 0 }}
        >
          {/* Button control */}
          <div className="w3-top" style={{ padding: 16 }}>
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
            <div className="w3-half w3-height w3-black">
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
            <div className="w3-half" style={{ padding: 24 }}>
              <div>
                <div className="w3-large w3-big w3-padding">
                  {showThisPost != null ? showThisPost.title : ""}
                </div>
                <div className="w3-padding">
                  {showThisPost != null
                    ? parse(JSON.parse(showThisPost.info).description)
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
