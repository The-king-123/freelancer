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
  faCalculator,
  faChevronCircleUp,
  faCode,
  faCrown,
  faDollarSign,
  faDoorOpen,
  faGear,
  faGift,
  faHammer,
  faHome,
  faICursor,
  faIdBadge,
  faImages,
  faKey,
  faListDots,
  faMoneyBill1,
  faNewspaper,
  faPager,
  faPaperPlane,
  faPause,
  faPhone,
  faPlay,
  faPlus,
  faRefresh,
  faRobot,
  faSearch,
  faShieldAlt,
  faSpinner,
  faStore,
  faTimesCircle,
  faUser,
  faUserCircle,
  faUserMd,
  faUserPlus,
  faUsers,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import "cloudinary-video-player/cld-video-player.min.css";
import Link from "next/link";
import slugify from "slugify";
import {
  faFacebookMessenger,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { console_source as source } from "@/app/data";
import HomePost from "@/app/HomePost";
import CreatePost from '../post/create/PostCreate'
import CreateForum from '../forum/create/createForum'

export default function Home(props) {
  axios.defaults.withCredentials = true;

  const admCr = [
    {
      title: 'Multiuser registre',
      link: '/multiuserregistre',
      icon: <FontAwesomeIcon className="w3-margin-right" icon={faUserCircle} />
    },
    {
      title: 'Récrutement Manager',
      link: '/recrutement',
      icon: <FontAwesomeIcon className="w3-margin-right" icon={faUserPlus} />
    }
  ]

  const [adminCore, setadminCore] = useState('')
  const [fullPath, setfullPath] = useState({ path: "" });
  const [imagePDP, setimagePDP] = useState(null);
  const [contact, setcontact] = useState({
    phone: null,
    whatsapp: null,
    messenger: null,
  });

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
  const [core, setcore] = useState("");
  const [designationData, setdesignationData] = useState([]);
  const [killer, setkiller] = useState({ starter: null });
  const [topicData, settopicData] = useState([]);
  const [stepper, setstepper] = useState({
    key: 0,
    scrollHeight: 0,
    intervalTyper: null,
  });

  const signinAuthElement = {
    email: "",
    password: "",
    type: "login",
  };

  const [userInfo, setuserInfo] = useState({
    id: null,
    email: "",
    newemail: "",
    telephone: "",
    whatsapp: "",
    messenger: "",
    fullname: "",
    password: "",
    designation: "",
    key: "",
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
          <div
            key={key}
            onClick={() => thisChoice(topic, type)}
            style={{ marginInline: 8, maxWidth: 320, marginBlock: 8, paddingBlock: 8 }}
            className="w3-pointer chat-black w3-round"
          >
            {topic.name}
          </div>
        ) : (
          <div
            key={key}
            onClick={() => thisChoice(topic, type)}
            style={{ marginInline: 8, maxWidth: 320, marginBlock: 8, paddingBlock: 8 }}
            className="w3-pointer chat-black w3-round"
          >
            {topic.name}
          </div>
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

  const showUser = async (data, key) => {

    closeAllPanel();
    var users = data;
    var userInfos = null;
    if (users) {
      userInfos = users.find((obj) => obj.key == key);
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
        localStorage.setItem("topic", JSON.stringify(res.data.data));
        reloadChoice("topic", res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });
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

  const openDropdown = (ID, IDW) => {
    const allDropContent = document.getElementsByClassName('w3-dropdown-content')
    const dropButton = document.getElementsByClassName('dropButton')
    for (let i = 0; i < allDropContent.length; i++) {
      if (allDropContent[i].id != ID) {
        allDropContent[i].className = allDropContent[i].className.replace(" w3-show", "");
        dropButton[i].className = dropButton[i].className.replace("w3-black", "w3-white");
      }
    }
    if (document.getElementById(ID)) {
      var x = document.getElementById(ID);
      if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        if (document.getElementById(ID + 'Wrapper')) {
          document.getElementById(ID + 'Wrapper').className = document.getElementById(ID + 'Wrapper').className.replace("w3-white", "w3-black")
        }
      } else {
        x.className = x.className.replace(" w3-show", "");
        if (document.getElementById(ID + 'Wrapper')) {
          document.getElementById(ID + 'Wrapper').className = document.getElementById(ID + 'Wrapper').className.replace("w3-black", "w3-white")
        }
      }
    }

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
    var highestIntervalId = window.setInterval(() => { }, 1);
    for (var i = 0; i < highestIntervalId; i++) {
      window.clearInterval(i);
    }

    var highestTimeoutId = window.setTimeout(() => { }, 1);
    for (var i = 0; i < highestTimeoutId; i++) {
      window.clearTimeout(i);
    }
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

  const userForum = () => {
    var user = localStorage.getItem("user");
    if (user) {
      if (user == "160471339156947" || user == "undefined") {
        window.location = "/forum";
      } else {
        window.location = "/forum/" + user;
      }
    } else {
      window.location = "/forum";
    }
  };

  const userTarifs = () => {
    var user = localStorage.getItem("user");
    if (user) {
      if (user == "160471339156947" || user == "undefined") {
        window.location = "/tarifs";
      } else {
        window.location = "/tarifs/" + user;
      }
    } else {
      window.location = "/tarifs";
    }
  };

  const userPremiumArea = () => {
    var user = localStorage.getItem("user");
    if (user) {
      if (user == "160471339156947" || user == "undefined") {
        window.location = "/premiumarea";
      } else {
        window.location = "/premiumarea/" + user;
      }
    } else {
      window.location = "/premiumarea";
    }
  }

  const emailRegister = (element) => {
    signinAuthElement.email = element.target.value;
  };

  const passwordRegister = (element) => {
    signinAuthElement.password = element.target.value;
  };

  async function setCSRFToken() {
    try {
      // Fetch CSRF token from the server
      const response = await axios.get(source + "/csrf-token");
      // Set CSRF token as a default header for all future requests
      axios.defaults.headers.common["X-CSRF-TOKEN"] = response.data.csrfToken;
    } catch (error) {
      console.error("CSRF token fetch failed:", error);
    }
  }

  const login = async () => {
    if (
      signinAuthElement.email.length > 3 &&
      signinAuthElement.password.length > 8
    ) {
      document.getElementById("spinner").style.display = "inline-block";

      let randomNumber = "";
      for (let i = 0; i < 15; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }

      await setCSRFToken();
      await axios
        .patch(source + "/_auth/login?xcode=" + randomNumber, signinAuthElement)
        .then((res) => {
          if (res.data.logedin) {

            localStorage.setItem("x-code", res.data.xcode);
            localStorage.setItem("x-user", res.data.user.key);

            userInfo.email = res.data.user.email;
            userInfo.fullname = res.data.user.fullname;
            userInfo.id = res.data.user.id;
            userInfo.key = res.data.user.key;
            userInfo.telephone =
              res.data.user.contact.length > 12
                ? JSON.parse(res.data.user.contact).telephone
                : res.data.user.contact;
            userInfo.whatsapp =
              res.data.user.contact.length > 12
                ? JSON.parse(res.data.user.contact).whatsapp
                : "";
            userInfo.messenger =
              res.data.user.contact.length > 12
                ? JSON.parse(res.data.user.contact).messenger
                : "";
            userInfo.designation = res.data.user.designation;

            window.location.reload()
          } else {
            document.getElementById("alert_connexion").className =
              "w3-text-red w3-center";
            document.getElementById("spinner").style.display = "none";
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });
    }
  };

  const closeModalLogin = () => {
    document.getElementById("mail").value = "";
    document.getElementById("password").value = "";
    signinAuthElement.email = "";
    signinAuthElement.password = "";
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

  const logout = async () => {

    const xcode = localStorage.getItem('x-code');

    document.getElementById("logoutIcon").style.display = "none";
    document.getElementById("logoutSpinner").style.display = "inline-block";

    await axios
      .patch(source + "/_auth/logout?xcode=" + xcode, userInfo)
      .then((res) => {
        if (res.data.logedout) {
          openDropdown("setting");
          localStorage.removeItem('x-code');
          localStorage.removeItem('x-user');
          document.location = "/";
        } else {
          document.getElementById("logoutSpinner").style.display =
            "none";
          document.getElementById("logoutIcon").style.display =
            "inline-block";
          openDropdown("setting");
        }
      })
      .catch((e) => {
        console.error("failure", e);
      });
  };

  useEffect(() => {
    const localHosts = ["localhost", "127.0.0.1", "::1"];
    stopAllIntervalAndTimeout();
    if (typeof window !== "undefined") {
      fullPath.path = window.location.pathname;
    }

    if (document.getElementById("coreMain")) {

      if (
        !localHosts.includes(location.hostname) &&
        location.protocol === "http:"
      ) {
        location.href =
          "https://" + location.hostname + location.pathname + location.search;
      } else {
        document.getElementById("coreMain").style.display = "block";
      }

      var times = 0;

      const videoPostInterval = setInterval(() => {
        const videoPosts = document.getElementsByClassName("videoPosts");
        if (videoPosts.length > 0) {
          clearInterval(videoPostInterval);
          for (let i = 0; i < videoPosts.length; i++) {
            videoPosts[i].style.height =
              (videoPosts[i].clientWidth * 16) / 9 + "px";
          }
        } else {
          if (times >= 10) {
            clearInterval(videoPostInterval);
          } else {
            times++;
          }
        }
      }, 500);

      setTimeout(() => {

        const postCore = document.getElementsByClassName("postCore");
        for (let i = 0; i < postCore.length; i++) {
          console.log('post core here');

          postCore[i].addEventListener("click", () => {
            if (document.getElementById("post" + i).className == "_expand_") {
              document.getElementById("post" + i).className =
                "w3-overflow w3-nowrap-multiline";
            } else {
              document.getElementById("post" + i).className = "_expand_";
            }
          });
        }

        const forumCore = document.getElementsByClassName("forumCore");
        for (let i = 0; i < forumCore.length; i++) {
          forumCore[i].addEventListener("click", () => {
            if (document.getElementById("forum" + i).className == "_expand_") {
              document.getElementById("forum" + i).className =
                "w3-overflow w3-nowrap-multiline";
            } else {
              document.getElementById("forum" + i).className = "_expand_";
            }
          });
        }

        const forumComent = document.getElementsByClassName("forumComent");
        for (let i = 0; i < forumComent.length; i++) {
          forumComent[i].addEventListener("click", () => {
            if (document.getElementById(forumComent[i].getAttribute("data")).className == "_expand_") {
              document.getElementById(forumComent[i].getAttribute("data")).className =
                "w3-overflow w3-nowrap-multiline";
            } else {
              document.getElementById(forumComent[i].getAttribute("data")).className = "_expand_";
            }
          });
        }

      }, 1000);

      if (document.getElementById('lienInvalideButton')) {
        document.getElementById('lienInvalideButton').addEventListener('click', () => {
          if (window.history.length > 0) {
            window.history.back()
          } else {
            window.location = '/'
          }
        })
      }

      const postsTitle = document.getElementsByClassName("postTitle");
      for (let i = 0; i < postsTitle.length; i++) {
        postsTitle[i].addEventListener("click", () => {
          const post = postsTitle[i].getAttribute("data");
          copyToClipboard(post);
          document.getElementById("flashInfo" + i).innerText =
            "Le lien a été copié...";
          document.getElementById("flashInfo" + i).style.display = "block";
          setTimeout(() => {
            document.getElementById("flashInfo" + i).style.display = "none";
          }, 2000);
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
      const xcode = localStorage.getItem('x-code');
      axios
        .get(source + "/_auth?xcode=" + xcode)
        .then((res) => {
          if (res.data.logedin) {
            document.getElementById('userPDP').style.backgroundImage = "url(" + source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + res.data.user.key + ")";
            if (res.data.user.designation == 'Admin') {
              const glitchCr = admCr.map((adm, key) => (
                <Link
                  href={adm.link}
                  className="w3-bar-item w3-button"
                >
                  {adm.icon}
                  {adm.title}
                </Link>
              ))
              setadminCore(glitchCr)
            }
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });

      axios
        .get(source + "/_auth/users")
        .then((res) => {
          reloadDesignation(res.data.data);
          if (document.getElementById('userPDP')) {
            document.getElementById('userPDP').style.backgroundImage = source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + res.data.data
          }

          var user = localStorage.getItem("user");
          if (props.user) {
            if (props.user == user) {
              showUser(res.data.data, user);
            } else {
              localStorage.setItem("user", props.user);
              showUser(res.data.data, props.user);
            }
          } else {
            if (user) {
              showUser(res.data.data, user == 'undefined' ? "160471339156947" : user);
            } else {
              localStorage.setItem("user", "160471339156947");
              showUser(res.data.data, "160471339156947");
            }
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });



      if (!props.core) {
        axios
          .get(source + "/_post/default?c=all")
          .then((res) => {
            setcore(<HomePost posts={res.data.data} />);
            setTimeout(() => {
              const postCore = document.getElementsByClassName("postCore");
              for (let i = 0; i < postCore.length; i++) {
                postCore[i].addEventListener("click", () => {
                  if (
                    document.getElementById("post" + i).className == "_expand_"
                  ) {
                    document.getElementById("post" + i).className =
                      "w3-overflow w3-nowrap-multiline";
                  } else {
                    document.getElementById("post" + i).className = "_expand_";
                  }
                });
              }
            }, 100);
          })
          .catch((e) => {
            console.error("failure", e);
          });
      }

      document.onkeyup = async (e) => {
        if (e.key == "Enter") {
          login();
        }
      };

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
        if (document.getElementById("coreMain")) {
          document.getElementById("coreMain").style.userSelect = "none";
          if (window.innerWidth <= 993) {
            document.getElementsByClassName("mobileHeight")[0].style.height =
              window.innerHeight - 52 + "px !important";
            const panels = document.getElementsByClassName("mobileHeightPanel");
            for (let i = 0; i < panels.length; i++) {
              panels[i].style.height = window.innerHeight - 68 + "px !important";
            }
          }
        }

      }, 500);

      const updateHeight = () => {
        setHeight(window.innerHeight - 80 - (window.innerWidth > 992 ? 0 : 20));
      };

      // Set the initial height
      updateHeight();

      // Update height on window resize
      window.addEventListener("resize", updateHeight);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }

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
          overflow: 'visible'
        }}
        id="sidebarMenu"
      >
        <div className="w3-container w3-display-container">
          <div
            className="w3-pointer w3-center w3-flex-row w3-flex-center w3-large"
          >
            {/* ///-------------------- */}
            <div className="w3-flex-column">
              <div className="btn3_container" style={{ marginInline: 'auto' }}>
                <span className="main w3-pointer">
                  <div id="freeSwitch" className="btn w3-green w3-text-white w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36 }}>
                    <FontAwesomeIcon icon={faGift} />
                  </div>
                  <div id="premiumSwitch" className="btn w3-yellow w3-text-black w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36, display: 'none' }}>
                    <FontAwesomeIcon icon={faDollarSign} />
                  </div>
                </span>
              </div>
              <div id="premiumfreeText" className="w3-text-green" style={{marginTop:-60, zIndex:1,paddingBlock:8, fontSize: '16px'}}>
                Gratuit
              </div>
            </div>
            {/* ///-------------------- */}
          </div>
        </div>
        <div
          className="w3-large w3-text-grey"
          style={{ paddingInline: 16 }}
        >
          {/* menu desktop */}
          <div
            className="w3-block w3-flex w3-flex-column"
            style={{ paddingBlock: 8, zIndex: 9999 }}
          >
            {/* <div style={{ height: 40, marginBottom: 4 }}>
              <div
                className="w3-dropdown-click w3-hover-light-grey"
              >
                <div
                  onClick={userPremiumArea}
                  className="w3-flex-row w3-flex-center-v w3-round w3-black w3-text-yellow"
                  style={{ height: 40, paddingInline: 16, marginBlock: 4 }}
                >
                  <FontAwesomeIcon
                    icon={faCrown}
                    width={20}
                    height={20}
                  />
                  <div className="w3-margin-left w3-medium">Contenu payant</div>
                </div>

              </div>
            </div> */}

            <Link
              onClick={() => localStorage.setItem("user", "160471339156947")}
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"/"}
            >
              <FontAwesomeIcon
                icon={faHome}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Travail en ligne</div>
            </Link>

            <Link
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"/store/all"}
            >
              <FontAwesomeIcon
                icon={faStore}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Boutique</div>
            </Link>

            <div
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round w3-pointer"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              onClick={userForum}
            >
              <FontAwesomeIcon
                icon={faNewspaper}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Forums</div>
            </div>

            {/* <Link
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"/post/create"}
            >
              <FontAwesomeIcon
                icon={faImages}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Gérer votre post</div>
            </Link> */}

            {/* <Link
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"/forum/create"}
            >
              <FontAwesomeIcon
                icon={faPager}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Gérer votre forum</div>
            </Link> */}

            <Link
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"/talent"}
            >
              <FontAwesomeIcon
                icon={faUsers}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Catégorie</div>
            </Link>

            <Link
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"/user/336302677822455"}
            >
              <FontAwesomeIcon
                icon={faCode}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Dev web</div>
            </Link>

            <Link
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"/recrutement/postule"}
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Recrutement</div>
            </Link>

            <div
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round w3-pointer"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              onClick={userTarifs}
            >
              <FontAwesomeIcon
                icon={faMoneyBill1}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">Tarifs</div>
            </div>

            <Link
              className="w3-flex-row w3-flex-center-v w3-overflow w3-light-grey w3-round"
              style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
              href={"https://pos.freelancer.mg"}
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faCalculator}
                width={20}
                height={20}
              />
              <div className="w3-margin-left w3-medium">POS</div>
            </Link>

            <div style={{ height: 40 }}>
              <div
                className="w3-dropdown-click w3-hover-light-grey"
              >

                <div
                  id="setting"
                  className="w3-dropdown-content w3-bar-block w3-card w3-round w3-medium"
                  style={{ left: 234, bottom: 4, minWidth: 260 }}
                >
                  <div className="w3-flex-row">
                    {/* / arrow marker / */}
                    <div className="w3-display-container" style={{ width: 0, zIndex: 1 }}>
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="rotate180 w3-text-white w3-right w3-display-bottomleft"
                        style={{ marginLeft: -8, marginBottom: 12 }}
                      />
                    </div>
                    {/* / arrow marker / */}
                    <div className="w3-flex-1 w3-overflow w3-round" style={{ zIndex: 2 }}>
                      <Link className="w3-bar-item w3-button" href={'/profile'}>
                        <FontAwesomeIcon
                          className="w3-margin-right"
                          icon={faUser}
                        />
                        Votre profil
                      </Link>
                      <Link className="w3-bar-item w3-button" href={'/chatbotmaker'}>
                        <FontAwesomeIcon
                          className="w3-margin-right"
                          icon={faRobot}
                        />
                        Gérez votre chatbot
                      </Link>
                      {/* <Link className="w3-bar-item w3-button" href={'/settings'}>
                      <FontAwesomeIcon
                        className="w3-margin-right"
                        icon={faClock}
                      />
                      Paramètres
                    </Link> */}
                      <Link
                        href={'/security'}
                        className="w3-bar-item w3-button"
                      >
                        <FontAwesomeIcon
                          className="w3-margin-right"
                          icon={faShieldAlt}
                        />
                        Sécurité
                      </Link>
                      <Link
                        href={'/tarifs/gestion'}
                        className="w3-bar-item w3-button"
                      >
                        <FontAwesomeIcon
                          className="w3-margin-right"
                          icon={faMoneyBill1}
                        />
                        Gestion de Tarifs
                      </Link>
                      {adminCore}
                      <div
                        onClick={logout}
                        className="w3-bar-item w3-button"
                      >
                        <FontAwesomeIcon
                          id="logoutIcon"
                          className="w3-margin-right"
                          icon={faDoorOpen}
                        />
                        <FontAwesomeIcon
                          id="logoutSpinner"
                          style={{ display: "none" }}
                          className="w3-margin-right w3-spin"
                          icon={faSpinner}
                        />
                        Déconnexion
                      </div>
                    </div>
                  </div>
                </div>


                <div
                  id="settingWrapper"
                  onClick={(e) => openDropdown("setting")}
                  className="dropButton w3-flex-row w3-flex-center-v w3-round w3-white"
                  style={{ height: 40, paddingInline: 16, marginBlock: 4 }}
                >
                  <FontAwesomeIcon
                    icon={faGear}
                    width={20}
                    height={20}
                  />
                  <div className="w3-margin-left w3-medium">Paramètres</div>
                </div>

              </div>
            </div>

          </div>
          {/* end menu desktop */}
        </div>
      </nav>

      <main
        id="mainCore"
        className="mobileHeight w3-main w3-100vh w3-overflow-scroll w3-noscrollbar "
        style={{ marginLeft: 250, marginRight: 320, padding: 8, position: 'relative' }}
      >
        <div
          id="coreContainerMain"
          className="w3-container"
          style={{ padding: 0, maxWidth: 620, margin: "auto" }} // >1086:33.33% 620, <1086:50% 480
        >
          <div className="w3-text-white w3-hide-large" style={{ height: 54 }}>
            freelancer.mg
          </div>
          {props.core ? props.core : core}
        </div>
        {/* modal warning */}
        <div id="modalWarning" className="white-opacity w3-modal w3-round" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
          <div
            className="w3-modal-content w3-card-4 w3-animate-top w3-round w3-overflow"
            style={{ width: 320, marginTop: '20vh' }}
          >
            <div style={{ padding: 24 }}>
              <FontAwesomeIcon
                icon={faWarning}
                className="w3-text-red w3-large w3-opacity-min"
              />
              <div id="textWarning">
                Voulez vous vraiment supprimer ce Topic avec son
                contenu ...
              </div>
            </div>
            <div className="w3-container w3-light-grey w3-padding">
              <button
                id="confirmWarning"
                className="w3-button w3-right w3-round w3-border w3-red"
              >
                <FontAwesomeIcon
                  id="confirmSpinner"
                  style={{ display: "none" }}
                  className="w3-medium w3-spin w3-margin-right"
                  icon={faSpinner}
                />
                Supprimer
              </button>
              <button
                id="cancelWarning"
                className="w3-button w3-right w3-round w3-white w3-border w3-margin-right"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
        {/* end modal warning */}
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
                    className={
                      !imagePDP.includes("160471339156947") ? "w3-circle" : "w3-round"
                    }
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
                        window.open("tel:" + contact.phone, "_blank")
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
                        window.open(contact.messenger, "_blank")
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

            <div id="chatCore">
              {displayChat}
            </div>

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
        style={{ paddingBlock: 8, paddingInline: 16, zIndex: 3 }}
      >
        <div className="w3-flex-1">
          <div className="w3-pointer w3-flex-row">
            {/* ///-------------------- */}
            <div className="w3-flex-column">
              <div className="btn3_container1" style={{ marginInline: 'auto' }}>
                <span className="main1 w3-pointer">
                  <div id="freeSwitch1" className="btn w3-green w3-text-white w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36 }}>
                    <FontAwesomeIcon icon={faGift} />
                  </div>
                  <div id="premiumSwitch1" className="btn w3-yellow w3-text-black w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36, display: 'none' }}>
                    <FontAwesomeIcon icon={faDollarSign} />
                  </div>
                </span>
              </div>
              <div id="premiumfreeText1" className="w3-text-green w3-small" style={{marginTop:-62, zIndex:1,paddingBlock:8, fontSize: '16px'}}>
                Gratuit
              </div>
            </div>
            {/* ///-------------------- */}
          </div>
        </div>

        <div style={{ width: 36, height: 36 }}>
          <div
            className="w3-dropdown-click w3-hover-white"
          >
            <div
              id="settingMobileWrapper"
              onClick={(e) => openDropdown("settingMobile")}
              className="dropButton w3-flex w3-flex-center w3-card w3-round w3-white"
              style={{ width: 36, height: 36, marginInline: "auto" }}
            >
              <FontAwesomeIcon
                icon={faBars}
                width={20}
                height={20}
              />
            </div>
            <div
              id="settingMobile"
              className="w3-dropdown-content w3-bar-block w3-card w3-round"
              style={{ right: 0, minWidth: 260, marginTop: 8, paddingBottom: 4 }}
            >
              {/* / arrow marker / */}
              <div style={{ height: 2 }}>
                <FontAwesomeIcon
                  icon={faPlay}
                  className="rotate-90 w3-text-white w3-right"
                  style={{ marginTop: -9, marginRight: 13 }}
                />
              </div>
              {/* / arrow marker / */}
              <Link className="w3-bar-item w3-button" href={'/profile'}>
                <FontAwesomeIcon
                  className="w3-margin-right"
                  icon={faUser}
                />
                Votre profil
              </Link>
              <Link className="w3-bar-item w3-button" href={'/chatbotmaker'}>
                <FontAwesomeIcon
                  className="w3-margin-right"
                  icon={faRobot}
                />
                Gérez votre chatbot
              </Link>

              <Link className="w3-bar-item w3-button" href={'/post/create'}>
                <FontAwesomeIcon
                  className="w3-margin-right"
                  icon={faImages}
                />
                Gérez votre post
              </Link>
              <Link className="w3-bar-item w3-button" href={'/forum/create'}>
                <FontAwesomeIcon
                  className="w3-margin-right"
                  icon={faPager}
                />
                Gérez votre forum
              </Link>
              {/* <Link className="w3-bar-item w3-button" href={'/settings'}>
                <FontAwesomeIcon
                  className="w3-margin-right"
                  icon={faClock}
                />
                Paramètres
              </Link> */}
              <Link
                href={'/security'}
                className="w3-bar-item w3-button"
              >
                <FontAwesomeIcon
                  className="w3-margin-right"
                  icon={faShieldAlt}
                />
                Sécurité
              </Link>
              <Link
                href={'/tarif'}
                className="w3-bar-item w3-button"
              >
                <FontAwesomeIcon
                  className="w3-margin-right"
                  icon={faMoneyBill1}
                />
                Gestion de Tarifs
              </Link>
              {adminCore}
              <div
                onClick={logout}
                className="w3-bar-item w3-button"
              >
                <FontAwesomeIcon
                  id="logoutIcon"
                  className="w3-margin-right"
                  icon={faDoorOpen}
                />
                <FontAwesomeIcon
                  id="logoutSpinner"
                  style={{ display: "none" }}
                  className="w3-margin-right w3-spin"
                  icon={faSpinner}
                />
                Déconnexion
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // bottom menu */}
      <div
        className="w3-bottom w3-block w3-card w3-white w3-flex w3-flex-row w3-flex-center-v w3-hide-large"
        style={{ paddingBlock: 8, zIndex: 9999 }}
      >

        <div className="w3-flex-1" style={{ width: 36, height: 36 }}>
          <Link
            className="w3-flex w3-flex-center w3-overflow w3-light-grey w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
            onClick={() => {
              localStorage.removeItem("user");
              if (fullPath.path.length > 0) {
                stopAllIntervalAndTimeout();
              }
            }}
            href={"/"}
          >
            <FontAwesomeIcon
              icon={faHome}
              width={20}
              height={20}
            />
          </Link>
        </div>

        <Link
          href={'/talent'}
          className="w3-flex-1"
          style={{ width: 36, height: 36 }}
        >
          <div
            className="w3-flex w3-flex-center w3-overflow w3-light-grey w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              icon={faUsers}
              width={20}
              height={20}
            />
          </div>
        </Link>

        <div
          onClick={userForum}
          className="w3-flex-1"
          style={{ width: 36, height: 36 }}
        >
          <div
            className="w3-flex w3-flex-center w3-overflow w3-light-grey w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              icon={faNewspaper}
              width={20}
              height={20}
            />
          </div>
        </div>

        <div
          onClick={userPremiumArea}
          className="w3-flex-1"
          style={{ width: 36, height: 36 }}
        >
          <div
            className="w3-flex w3-flex-center w3-overflow w3-round w3-black w3-text-yellow"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              icon={faCrown}
              width={20}
              height={20}
            />
          </div>
        </div>

        <div className="w3-flex-1" style={{ width: 36, height: 36 }}>
          <div
            className="w3-flex w3-flex-center w3-overflow w3-light-grey w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
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
            className="w3-flex w3-flex-center w3-overflow w3-light-grey w3-round"
            style={{ width: 36, height: 36, marginInline: "auto" }}
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>

      {/* modal logedin */}
      <div
        id="modalLogin"
        className="w3-modal w3-noscrollbar"
        style={{ padding: 24, zIndex: 999999 }}
      >
        <div
          className="w3-white w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
          style={{
            minHeight: 320,
            paddingBlock: 8,
            paddingInline: 0,
            maxWidth: 320,
          }}
        >
          <div
            className="w3-container"
            style={{ paddingBlock: 0, paddingInline: 8 }}
          >
            <div
              onClick={closeModalLogin}
              className="w3-pointer w3-right w3-flex w3-flex-center"
              style={{ width: 32, height: 32 }}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                style={{ width: 20, height: 20 }}
              />
            </div>
          </div>
          <div className="w3-block w3-flex-column w3-flex-center">
            <div className="w3-center w3-flex w3-flex-center">
              <span className="w3-padding-small w3-overflow w3-flex w3-flex-center">
                <Image
                  id="imagePDP"
                  unoptimized
                  loading="lazy"
                  width={60}
                  height={60}
                  alt="App profile"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  src={
                    source +
                    "/images.php?w=720&h=720&zlonk=3733&zlink=160471339156947"
                  }
                />
              </span>
              <span className="w3-text-black w3-padding w3-large">
                Connexion
              </span>
            </div>
            <div className="w3-block">
              <div id="alert_connexion" className="w3-hide">
                mail ou mot de passe incorrect...
              </div>
              <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                <input
                  onChange={(e) => emailRegister(e)}
                  type="text"
                  className="input w3-light-grey w3-round-xxlarge w3-block w3-text-grey w3-medium"
                  placeholder="Adresse e-mail"
                  id="mail"
                  name="user_email"
                  required
                />
                <div
                  className="w3-black input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                  style={{ marginRight: 20 }}
                >
                  <span className="w3-text-white">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
              </div>
              <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                <input
                  onChange={(e) => passwordRegister(e)}
                  type="password"
                  className="input w3-light-grey w3-round-xxlarge w3-block w3-text-grey w3-medium"
                  placeholder="Mot de passe"
                  id="password"
                  name="user_password"
                  required
                />

                <div
                  className="w3-black input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                  style={{ marginRight: 20 }}
                >
                  <span className="w3-text-white">
                    <FontAwesomeIcon icon={faKey} />
                  </span>
                </div>
              </div>
              <div className="w3-center w3-white w3-flex w3-flex-center">
                <div className="w3-margin w3-col l8 m8 s8">
                  <button
                    id="buttonConnexion"
                    disabled={false}
                    onClick={() => login()}
                    className="transition w3-medium w3-block w3-button w3-round-xxlarge w3-text-white w3-black"
                  >
                    Se connecter
                    <span
                      className="w3-spin w3-margin-left"
                      style={{ display: "none" }}
                      id="spinner"
                    >
                      <FontAwesomeIcon icon={faSpinner} />
                    </span>
                  </button>
                </div>
              </div>
              <div className="w3-center w3-white w3-flex w3-flex-center">
                <div
                  className="w3-col l8 m8 s8"
                  style={{ marginInline: 16, marginBottom: 24 }}
                >
                  <button
                    id="buttonSignup"
                    onClick={() =>
                      (window.location = "/signup")
                    }
                    className="transition w3-medium w3-block w3-button w3-round-xxlarge w3-text-black w3-yellow"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*end modal logedin */}

      {/* modal createPostOnDesktop */}
      <div
        id="createPostOnDesktop"
        className="w3-modal w3-noscrollbar"
        style={{ padding: 24, zIndex: 9999 }}
      >
        <div
          className="w3-white w3-overflow w3-display-middle w3-block w3-round-large w3-content"
          style={{
            height: 520,
            maxWidth: 520,
          }}
        >
          <div
            className="w3-container w3-light-grey"
            style={{ paddingBlock: 0, padding: 16 }}
          >


            <div className="w3-flex-row w3-flex-center-v">
              <div className="w3-flex-1">
                <div
                  onClick={() => document.getElementById('createPostOnDesktop').style.display = 'none'}
                  className="w3-pointer w3-flex w3-flex-center w3-black w3-circle"
                  style={{ width: 32, height: 32, }}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ width: 16, height: 16 }}
                  />
                </div>
              </div>
              <div>
                <Link
                  href={'/post/create'}
                  className="w3-black w3-circle w3-flex w3-flex-center"
                  style={{ width: 32, height: 32 }}
                >
                  <FontAwesomeIcon
                    icon={faListDots}
                    style={{ width: 16, height: 16 }}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="w3-block w3-noscrollbar w3-overflow-scroll" style={{ paddingInline: 8, paddingTop: 8, height: 450 }}>
            <CreatePost fromHome={true} />
          </div>
        </div>
      </div>
      {/*end modal createPostOnDesktop */}

      {/* modal create Forum OnDesktop */}
      <div
        id="createForumOnDesktop"
        className="w3-modal w3-noscrollbar"
        style={{ padding: 24, zIndex: 9999 }}
      >
        <div
          className="w3-white w3-overflow w3-display-middle w3-block w3-round-large w3-content"
          style={{
            height: 520,
            maxWidth: 520,
          }}
        >
          <div
            className="w3-container w3-light-grey"
            style={{ paddingBlock: 0, padding: 16 }}
          >
            <div className="w3-flex-row w3-flex-center-v">
              <div className="w3-flex-1">
                <div
                  onClick={() => document.getElementById('createForumOnDesktop').style.display = 'none'}
                  className="w3-pointer w3-flex w3-flex-center w3-black w3-circle"
                  style={{ width: 32, height: 32, }}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ width: 16, height: 16 }}
                  />
                </div>
              </div>
              <div>
                <Link
                  href={'/forum/create'}
                  className="w3-black w3-circle w3-flex w3-flex-center"
                  style={{ width: 32, height: 32 }}
                >
                  <FontAwesomeIcon
                    icon={faListDots}
                    style={{ width: 16, height: 16 }}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="w3-block w3-noscrollbar w3-overflow-scroll" style={{ paddingInline: 8, paddingTop: 8, height: 450 }}>
            <CreateForum fromHome={true} />
          </div>
        </div>
      </div>
      {/*end modal createPostOnDesktop */}

    </div>
  );
}
