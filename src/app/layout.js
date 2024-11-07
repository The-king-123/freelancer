'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import "./app.css";
import { app_name, console_source as source } from "@/app/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCalculator, faCheck, faChevronCircleUp, faCode, faComment, faComments, faDollarSign, faDoorOpen, faExclamationCircle, faGear, faGift, faHome, faICursor, faImages, faKey, faMoneyBill1, faMoon, faNewspaper, faPager, faPaperPlane, faPhone, faPlay, faRobot, faShieldAlt, faSpinner, faStore, faSun, faTimesCircle, faUser, faUserCircle, faUserPlus, faUsers, faWarning } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { faFacebookMessenger, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import parse from "html-react-parser";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  axios.defaults.withCredentials = true;
  const [freeLink, setfreeLink] = useState(<Link id="freeLink" style={{ display: 'none' }} href={"/forum"} >freeLink</Link>)

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
    },
    {
      title: 'Gestion des produits',
      link: '/store/gestion',
      icon: <FontAwesomeIcon className="w3-margin-right" icon={faStore} />
    },
    {
      title: 'Gestion des membres',
      link: '/user/gestion',
      icon: <FontAwesomeIcon className="w3-margin-right" icon={faUsers} />
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
  const [displayChat, setdisplayChat] = useState(
    <div className="w3-flex w3-flex-center" style={{ padding: 24 }}>
      <span className="w3-spin">
        <FontAwesomeIcon icon={faSpinner} />
      </span>
    </div>
  );
  const [displayChoice, setdisplayChoice] = useState("");
  const [chatData, setchatData] = useState([]);

  const [dataUsers, setdataUsers] = useState([]);
  const [killer, setkiller] = useState({ starter: null, beastUser: false });
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

  const ActiveLightMode = () => {

    if (document.getElementById('lightModeCheck')) {
      if (document.getElementById('lightModeCheck').style.display == 'none') {
        document.getElementById('lightModeCheckTop').style.display = 'inline-block';
        document.getElementById('lightModeCheck').style.display = 'inline-block';
        localStorage.setItem('theme', 'light');
        window.location.reload()
      } else {
        document.getElementById('lightModeCheck').style.display = 'none';
        document.getElementById('lightModeCheckTop').style.display = 'none';
        localStorage.setItem('theme', 'dark');
        window.location.reload()
      }
    }
  }

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
            {choiceTitleExtractor(chat.choice).text}
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

  const choiceTitleExtractor = (title) => {
    const str = title;
    const regex = /(.*?)\s*\[(.*?)\]/;

    // Check if the string contains brackets with text inside
    if (/\[.*?\]/.test(str)) {
      const match = str.match(regex);

      if (match) {
        const text = match[1]; // the text before the brackets
        const code = match[2]; // the text inside the brackets
        return { text, code, brackets: true }; // Return the extracted text, code, and brackets true
      }
    }

    return { text: str, brackets: false }; // Return the full title and brackets false if no brackets found
  }

  const reloadChoice = (type, data) => {
    var glitchTopic = "";
    if (data.length > 0) {
      glitchTopic = data.map((topic, key) =>
        type == "topic" ? (
          <div
            key={key}
            onClick={() => thisChoice(topic, type)}
            style={{ marginInline: 8, maxWidth: 320 }}
          >
            <div
              id={choiceTitleExtractor(topic.name).brackets ? choiceTitleExtractor(topic.name).code : 'choiceTitle' + key}
              style={{ paddingBlock: 6 }}
              className="w3-pointer"
            >
              {choiceTitleExtractor(topic.name).text}
            </div>

          </div>
        ) : (
          <div
            key={key}
            onClick={() => thisChoice(topic, type)}
            style={{ marginInline: 8, maxWidth: 320, marginBlock: 8, paddingBlock: 8 }}
            className="w3-pointer"
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

  const openDropdown = (ID, IDW) => {
    const allDropContent = document.getElementsByClassName('w3-dropdown-content')
    const dropButton = document.getElementsByClassName('dropButton')
    for (let i = 0; i < allDropContent.length; i++) {
      if (allDropContent[i].id != ID) {
        allDropContent[i].className = allDropContent[i].className.replace(" w3-show", "");
        if (dropButton[i]) {
          dropButton[i].className = dropButton[i].className.replace("w3-light-grey", "w3-dark-grey");
        }
      }
    }
    if (document.getElementById(ID)) {
      var x = document.getElementById(ID);
      if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        if (document.getElementById(ID + 'Wrapper')) {
          document.getElementById(ID + 'Wrapper').className = document.getElementById(ID + 'Wrapper').className.replace("w3-dark-grey", "w3-light-grey")
        }
      } else {
        x.className = x.className.replace(" w3-show", "");
        if (document.getElementById(ID + 'Wrapper')) {
          document.getElementById(ID + 'Wrapper').className = document.getElementById(ID + 'Wrapper').className.replace("w3-light-grey", "w3-dark-grey")
        }
      }
    }

  };

  const toggleChat = () => {

    const themeLight = localStorage.getItem('theme') == 'light' ? true : false

    if (document.getElementById("sidebarChat").style.display != "block") {
      closeAllPanel();
      document.getElementById("overlay").style.display = "block";
      document.getElementById("sidebarChat").className =
        "mobileHeightPanel panel w3-sidebar w3-bar-block w3-collapse w3-top w3-animate-right " + (themeLight ? "w3-light-grey" : "w3-black");
      document.getElementById("sidebarChat").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
      document.getElementById("sidebarChat").style.display = "none";
    }
  };

  const closeAllPanel = () => {
    const allPanel = document.getElementsByClassName("panel");
    for (let i = 0; i < allPanel.length; i++) {
      allPanel[i].style.display = "none";
    }
    document.getElementById("overlay").style.display = "none";
  };

  const stopAllIntervalAndTimeout = () => {
    if (stepper.intervalTyper) {
      clearInterval(stepper.intervalTyper);
    }
    if (killer.starter) {
      clearInterval(killer.starter);
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

  const userForum = () => {
    var user = localStorage.getItem("user");
    if (user) {
      if (user == "160471339156947" || user == "undefined") {
        setfreeLink(<Link id="freeLink" style={{ display: 'none' }} href={"/forum"} >freeLink</Link>)
        setTimeout(() => {
          document.getElementById('freeLink').click()
        }, 100);
      } else {
        setfreeLink(<Link id="freeLink" style={{ display: 'none' }} href={"/forum/" + user} >freeLink</Link>)
        setTimeout(() => {
          document.getElementById('freeLink').click()
        }, 100);
      }
    } else {
      setfreeLink(<Link id="freeLink" style={{ display: 'none' }} href={"/forum"} >freeLink</Link>)
      setTimeout(() => {
        document.getElementById('freeLink').click()
      }, 100);
    }
  };

  const userTarifs = () => {
    var user = localStorage.getItem("user");
    if (user) {
      if (user == "160471339156947" || user == "undefined") {
        setfreeLink(<Link id="freeLink" style={{ display: 'none' }} href={"/tarifs"} >freeLink</Link>)
        setTimeout(() => {
          document.getElementById('freeLink').click()
        }, 100);
      } else {
        setfreeLink(<Link id="freeLink" style={{ display: 'none' }} href={"/tarifs/" + user} >freeLink</Link>)
        setTimeout(() => {
          document.getElementById('freeLink').click()
        }, 100);
      }
    } else {
      setfreeLink(<Link id="freeLink" style={{ display: 'none' }} href={"/tarifs"} >freeLink</Link>)
      setTimeout(() => {
        document.getElementById('freeLink').click()
      }, 100);
    }
  };

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
    document.getElementById("mailLogin").value = "";
    document.getElementById("passwordLogin").value = "";
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

  const removePannelFirstPassed = () => {
    localStorage.setItem('firstPassed', true)
    openDropdown("switchPannel")
  }

  useEffect(() => {

    if (localStorage.getItem('theme') == 'light') {

      document.getElementById('lightModeCheck').style.display = 'inline-block'
      document.getElementById('lightModeCheckTop').style.display = 'inline-block';

      const elementGrey = document.getElementsByClassName('w3-black').length
      const elementWhite = document.getElementsByClassName('w3-dark-grey').length
      const borderWhite = document.getElementsByClassName('w3-border-dark-grey').length
      for (let i = 0; i < elementGrey; i++) {
        const element = document.getElementsByClassName('w3-black')[0];
        element.className = element.className.replace('w3-black', 'w3-light-grey')
      }
      for (let i = 0; i < elementWhite; i++) {
        const element = document.getElementsByClassName('w3-dark-grey')[0];
        element.className = element.className.replace('w3-dark-grey', 'w3-white')
      }
      for (let i = 0; i < borderWhite; i++) {
        const element = document.getElementsByClassName('w3-border-dark-grey')[0];
        element.className = element.className.replace('w3-border-dark-grey', 'w3-border-white')
      }

      document.getElementById('htmlCore').style.display = 'block'
    } else {
      document.getElementById('htmlCore').style.display = 'block'
    }

    setInterval(() => {
      if (document.getElementById("appCore")) {
        document.getElementById("appCore").style.userSelect = "none";
        if (window.innerWidth < 992) {
          const panels = document.getElementsByClassName("mobileHeightPanel");
          for (let i = 0; i < panels.length; i++) {
            panels[i].style.height = window.innerHeight - 72 + "px !important";
          }
        }
      }
    }, 500);

    const firstPath = location.pathname.split('/')[1]
    if (document.getElementById(firstPath + 'Page')) {
      document.getElementById(firstPath + 'Page').className = document.getElementById(firstPath + 'Page').className.replace((localStorage.getItem('theme') == 'light' ? 'w3-light-grey' : 'w3-black'), 'w3-yellow')
    }
    if (document.getElementById(firstPath + 'Screen')) {
      document.getElementById(firstPath + 'Screen').className = document.getElementById(firstPath + 'Screen').className.replace('whiteBlackYellow', 'w3-text-yellow')
    }


    document.getElementById('passwordLogin').addEventListener('keydown', function (event) {
      if (event.key == 'Enter') {
        login()
      }
    });

    document.getElementById('mailLogin').addEventListener('keydown', function (event) {
      if (event.key == 'Enter') {
        login()
      }
    });

    // end theme changer

    if (localStorage.getItem('firstPassed') == null) {
      openDropdown("switchPannel");
      setTimeout(() => {
        openDropdown("switchPannel");
      }, 3000);
    }

    const localHosts = ["localhost", "127.0.0.1", "::1"];
    stopAllIntervalAndTimeout();
    if (typeof window !== "undefined") {
      fullPath.path = window.location.pathname;
    }

    if (document.getElementById("appCore")) {

      if (
        !localHosts.includes(location.hostname) &&
        location.protocol === "http:"
      ) {
        location.href =
          "https://" + location.hostname + location.pathname + location.search;
      } else {
        document.getElementById("appCore").style.display = "block";
      }

      const xcode = localStorage.getItem('x-code');
      axios
        .get(source + "/_auth?xcode=" + xcode)
        .then((res) => {
          if (res.data.logedin) {
            if (document.getElementById('userPDP')) {
              document.getElementById('userPDP').style.backgroundImage = "url(" + source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + res.data.user.key + ")";
            }

            if (res.data.user.designation == 'Admin') {
              const glitchCr = admCr.map((adm, key) => (
                <Link
                  key={key}
                  href={adm.link}
                  className="w3-bar-item w3-button"
                >
                  {adm.icon}{adm.title}
                </Link>
              ))
              setTimeout(() => {
                setadminCore(glitchCr);
              }, 2000);

            }
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });

      axios
        .get(source + "/_auth/users")
        .then((res) => {
          if (document.getElementById('userPDP')) {
            document.getElementById('userPDP').style.backgroundImage = source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + res.data.data
          }

          res.data.data.forEach(user => {
            dataUsers.push(user);
          });

          if (document.getElementsByClassName('userKey')) {
            const user = document.getElementsByClassName('userKey')
            for (let i = 0; i < user.length; i++) {
              const element = user[i];
              element.addEventListener('click', () => {
                const key = element.getAttribute("data-key");
                if (location.pathname.split('/')[1] == 'user') {
                  if (location.pathname.split('/')[2] != key) {
                    stopAllIntervalAndTimeout()
                    showUser(res.data.data, key)
                  }
                } else {
                  if (key != '160471339156947') {
                    stopAllIntervalAndTimeout()
                    showUser(res.data.data, key)
                  }
                }

              })
            }
          }

          var user = localStorage.getItem("user");
          if (user) {
            if (location.pathname.split('/')[1] == 'user') {
              showUser(res.data.data, location.pathname.split('/')[2]);
            } else {
              showUser(res.data.data, user == 'undefined' ? "160471339156947" : user);
            }
          } else {
            if (location.pathname.split('/')[1] == 'user') {
              localStorage.setItem("user", location.pathname.split('/')[2]);
              showUser(res.data.data, location.pathname.split('/')[2]);
            } else {
              localStorage.setItem("user", "160471339156947");
              showUser(res.data.data, "160471339156947");
            }

          }
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

        if (location.pathname.split('/')[1] == 'talent') {
          if (location.pathname.split('/')[2]) {
            if (!killer.beastUser) {
              const user = document.getElementsByClassName('beastUser')
              for (let i = 0; i < user.length; i++) {
                const element = user[i];
                element.addEventListener('click', () => {
                  const key = element.getAttribute("data-key");
                  stopAllIntervalAndTimeout()
                  showUser(dataUsers, key)
                })
              }
              killer.beastUser = true
            }
          } else {
            killer.beastUser = false
          }
        }

        if (document.getElementById("mainCore")) {
          if (window.innerWidth <= 993) {
            document.getElementById("mainCore").style.height = (window.innerHeight - 52) + "px";
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
    <html id="htmlCore" style={{ display: 'none' }} content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" className="w3-dark-grey" lang="en">
      <body id="appCore" className={inter.className}>

        <div
          onClick={() => closeAllPanel()}
          id="overlay"
          style={{ width: "100vw", height: "100vh", zIndex: 4 }}
          className="w3-display-middle w3-hide-large"
        ></div>
        {freeLink}
        <nav
          className="mobileHeightPanel panel w3-sidebar w3-bar-block w3-black w3-collapse w3-top"
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
              <div id="beastWrapper" className="w3-flex-column">
                <div className="btn3_container w3-dark-grey w3-border-dark-grey" style={{ marginInline: 'auto' }}>
                  <span className="main w3-pointer">
                    <div id="freeSwitch" className="btn w3-yellow w3-text-black w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36 }}>
                      <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                    <div id="premiumSwitch" className="btn w3-green w3-text-white w3-circle w3-flex w3-flex-center" style={{ height: 36, width: 36, display: 'none' }}>
                      <FontAwesomeIcon icon={faGift} />
                    </div>
                  </span>
                </div>
                <div id="premiumfreeText" style={{ marginTop: -60, zIndex: 1, paddingBlock: 8, fontSize: '16px' }}>
                  Premium
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
              <Link
                data-key="160471339156947"
                id="Page"
                onClick={() => localStorage.setItem("user", "160471339156947")}
                className="userKey menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round"
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
                id="storePage"
                className="menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round"
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
                id="forumPage"
                className="menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round w3-pointer"
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

              <Link
                id="talentPage"
                className="menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round"
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
                data-key="336302677822455"
                id="userPage"
                className="userKey menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round"
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
                id="recrutementPage"
                className="menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round"
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
                id="tarifsPage"
                className="menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round w3-pointer"
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
                className="menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round"
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

              <Link
                id="chatPage"
                onClick={() => {
                  if (location.pathname.split('/')[1] == 'chat') {
                    if (document.getElementById('modalChatListe')) {
                      document.getElementById('modalChatListe').style.display = 'block'
                    }
                  }
                }}
                className="menuItem w3-flex-row w3-flex-center-v w3-overflow w3-black w3-round"
                style={{ height: 40, paddingInline: 16, marginBlock: 2 }}
                href={"/chat"}
              >
                <FontAwesomeIcon
                  icon={faComments}
                  width={20}
                  height={20}
                />
                <div className="w3-margin-left w3-medium">Message</div>
              </Link>

              <div style={{ height: 40 }}>
                <div
                  className="w3-dropdown-click"
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

                        <div onClick={() => ActiveLightMode()} className="w3-bar-item w3-button">
                          <div className="w3-flex-row w3-flex-center-v">
                            <div className="w3-flex-1">
                              <FontAwesomeIcon
                                className="w3-margin-right"
                                icon={faSun}
                              />
                              Light mode
                            </div>
                            <FontAwesomeIcon icon={faCheck} id="lightModeCheck" style={{ display: 'none' }} />
                          </div>
                        </div>

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
                        <Link
                          href={'/versioncontrole'}
                          className="w3-bar-item w3-button"
                        >
                          <FontAwesomeIcon
                            className="w3-margin-right"
                            icon={faExclamationCircle}
                          />
                          À-propos
                        </Link>
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
                    className="dropButton w3-flex-row w3-flex-center-v w3-round w3-dark-grey"
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
          className="w3-main w3-overflow-scroll w3-noscrollbar w3-100vh w3-display-contenair"
          style={{ marginLeft: 250, marginRight: 320, padding: 8, position: 'relative' }}
        >
          <div
            id="coreContainerMain"
            className="w3-container"
            style={{ padding: 0, maxWidth: 620, margin: "auto" }}
          >
            <div className="w3-hide-large" style={{ height: 44, opacity: 0 }}>
              freelancer.mg
            </div>
            {children}
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
              <div className="w3-container w3-black w3-padding">
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
                  className="w3-button w3-right w3-round w3-dark-grey w3-border w3-margin-right"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
          {/* end modal warning */}
        </main>

        <nav
          className="mobileHeightPanel panel w3-sidebar w3-bar-block w3-black w3-collapse w3-top"
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
                  className="w3-black w3-flex w3-flex-row w3-flex-center-v"
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
              className="w3-black w3-card"
              style={{ display: "block", paddingTop: 12 }}
            >
              {displayChoice}
            </div>
            <div
              className="w3-black"
              style={{ paddingInline: 16, paddingBottom: 10 }}
            >
              <div className="w3-flex-row w3-flex-center-v">
                <div
                  onClick={() => expand()}
                  className="w3-button w3-hover-grey w3-yellow w3-flex-1 w3-round-xxlarge w3-flex-row w3-flex-center-v"
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
          className="w3-top w3-block w3-card w3-dark-grey w3-flex w3-flex-row w3-flex-center-v w3-hide-large"
          style={{ paddingBlock: 8, paddingInline: 16, zIndex: 3 }}
        >
          <div className="w3-flex-1">
            <div className="w3-pointer w3-flex-row" onClick={() => window.location = '/'}>
              {/* Header text here */} FREELANCER
            </div>
          </div>

          <div
            onClick={toggleChat}
            style={{ width: 36, height: 36, marginRight: 16 }}
          >
            <div
              className="w3-flex w3-flex-center w3-overflow w3-dark-grey w3-card w3-round"
              style={{ width: 36, height: 36 }}
            >
              <FontAwesomeIcon
                icon={faRobot}
                width={20}
                height={20}
              />
            </div>
          </div>
          <div style={{ width: 36, height: 36 }}>
            <div
              className="w3-dropdown-click w3-hover-white"
            >
              <div
                id="settingMobileWrapper"
                onClick={(e) => openDropdown("settingMobile")}
                className="dropButton w3-flex w3-flex-center w3-card w3-round w3-dark-grey"
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
                <div onClick={() => ActiveLightMode()} className="w3-bar-item w3-button">
                  <div className="w3-flex-row w3-flex-center-v">
                    <div className="w3-flex-1">
                      <FontAwesomeIcon
                        className="w3-margin-right"
                        icon={faSun}
                      />
                      Light mode
                    </div>
                    <FontAwesomeIcon icon={faCheck} id="lightModeCheckTop" style={{ display: 'none' }} />
                  </div>
                </div>

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
          className="w3-bottom w3-block w3-card w3-dark-grey w3-flex w3-flex-row w3-flex-center-v w3-hide-large"
          style={{ paddingBlock: 8, zIndex: 9999 }}
        >

          <Link
            href={'/talent'}
            className="w3-flex-1"
            style={{ width: 36, height: 36 }}
          >
            <div
              id="talentScreen"
              className="menuItemBottom w3-flex w3-flex-center w3-overflow w3-black w3-round whiteBlackYellow"
              style={{ width: 36, height: 36, marginInline: "auto" }}
            >
              <FontAwesomeIcon
                icon={faUsers}
                width={20}
                height={20}
              />
            </div>
          </Link>

          <Link
            href={'/recrutement/postule'}
            className="w3-flex-1"
            style={{ width: 36, height: 36 }}
          >
            <div
              id="recrutementScreen"
              className="menuItemBottom w3-flex w3-flex-center w3-overflow w3-black w3-round whiteBlackYellow"
              style={{ width: 36, height: 36, marginInline: "auto" }}
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                width={20}
                height={20}
              />
            </div>
          </Link>

          {/* // Switch free premium with inital panel */}
          <div>
            <div
              className="w3-dropdown-click"
            >

              <div
                id="switchPannel"
                onClick={() => removePannelFirstPassed()}
                className="w3-dropdown-content w3-bar-block w3-card w3-round"
                style={{ right: -16, minWidth: 230, marginTop: 8, paddingBottom: 4, bottom: 42 }}
              ><div className="dropButton"></div>

                <div
                  className="w3-bar-item w3-button"
                  style={{ marginTop: 4, fontSize: 12.5 }}
                >
                  Cliquer sur le bouton ci-dessous pour intervertir les contenus gratuit et premium.
                </div>
                {/* / arrow marker / */}
                <div style={{ height: 2 }}>
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="rotate90 w3-text-white w3-right"
                    style={{ marginBottom: -12, marginRight: 54 }}
                  />
                </div>
                {/* / arrow marker / */}
              </div>

              <div
                id="settingMobileWrapper"
                className="w3-flex-column"
              >
                <div className="btn3_container1 w3-black w3-border-dark-grey" onClick={() => {
                  if (location.pathname.split('/')[1] != '' && location.pathname.split('/')[1] != 'user') {
                    document.location = '/'
                  }
                }} style={{ marginInline: 'auto', zIndex: 1 }}>
                  <span className="main1 w3-pointer">
                    <div id="freeSwitch1" className="btn1 w3-yellow w3-circle w3-flex w3-flex-center" style={{ height: 28, width: 28 }}>
                      <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                    <div id="premiumSwitch1" className="btn1 w3-green w3-circle w3-flex w3-flex-center" style={{ height: 28, width: 28, display: 'none' }}>
                      <FontAwesomeIcon icon={faGift} />
                    </div>
                  </span>
                </div>
                <div id="premiumfreeText1" onClick={() => {
                  if (location.pathname.split('/')[1] != '' && location.pathname.split('/')[1] != 'user') {
                    stopAllIntervalAndTimeout();
                    document.location = '/';
                  }
                }} className="w3-small" style={{ marginTop: -34, zIndex: 2, paddingBlock: 8, fontSize: '16px', paddingInline: 10, textAlign: 'right' }}>
                  Premium
                </div>
              </div>
            </div>
          </div>
          {/* // End Switch free premium with inital panel */}

          <Link
            href={'/store/all'}
            className="w3-flex-1"
            style={{ width: 36, height: 36 }}
          >
            <div
              id="storeScreen"
              className="menuItemBottom w3-flex w3-flex-center w3-overflow w3-black w3-round whiteBlackYellow"
              style={{ width: 36, height: 36, marginInline: "auto" }}
            >
              <FontAwesomeIcon
                icon={faStore}
                width={20}
                height={20}
              />
            </div>
          </Link>

          <Link
            onClick={() => {
              if (location.pathname.split('/')[1] == 'chat') {
                if (document.getElementById('modalChatListe')) {
                  document.getElementById('modalChatListe').style.display = 'block'
                }
              }
            }}
            href={'/chat'}
            className="w3-flex-1"
            style={{ width: 36, height: 36 }}
          >
            <div
              id="chatScreen"
              className="menuItemBottom w3-flex w3-flex-center w3-overflow w3-black w3-round whiteBlackYellow"
              style={{ width: 36, height: 36, marginInline: "auto" }}
            >
              <FontAwesomeIcon
                icon={faComments}
                width={20}
                height={20}
              />
            </div>
          </Link>
        </div>

        {/* modal logedin */}
        <div
          id="modalLogin"
          className="w3-modal w3-noscrollbar"
          style={{ padding: 24, zIndex: 999999 }}
        >
          <div
            className="w3-dark-grey w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
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
                    className="w3-round w3-overflow"
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
                <span className="w3-padding w3-large ">
                  Connexion
                </span>
              </div>
              <div className="w3-block" style={{ marginTop: 32, paddingInline: 8 }}>
                <div id="alert_connexion" className="w3-hide">
                  mail ou mot de passe incorrect...
                </div>
                <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container">
                  <input
                    onChange={(e) => emailRegister(e)}
                    type="text"
                    className="input w3-black w3-round-xxlarge w3-block w3-medium w3-border-0"
                    placeholder="Adresse e-mail"
                    id="mailLogin"
                    name="user_email"
                    required
                  />
                  <div
                    className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                    style={{ marginRight: 20 }}
                  >
                    <span>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                  </div>
                </div>
                <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container">
                  <input
                    onChange={(e) => passwordRegister(e)}
                    type="password"
                    className="input w3-black w3-round-xxlarge w3-block w3-medium w3-border-0"
                    placeholder="Mot de passe"
                    id="passwordLogin"
                    name="user_password"
                    required
                  />

                  <div
                    className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                    style={{ marginRight: 20 }}
                  >
                    <span>
                      <FontAwesomeIcon icon={faKey} />
                    </span>
                  </div>
                </div>
                <div className="w3-center w3-dark-grey w3-flex w3-flex-center">
                  <div className="w3-margin w3-col l8 m8 s8">
                    <button
                      id="buttonConnexion"
                      disabled={false}
                      onClick={() => login()}
                      className="transition w3-medium w3-block w3-button w3-round-xxlarge w3-yellow"
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
                <div className="w3-center w3-dark-grey w3-flex w3-flex-center">
                  <div
                    className="w3-col l8 m8 s8"
                    style={{ marginInline: 16, marginBottom: 24 }}
                  >
                    <div
                      id="buttonSignup"
                      onClick={() => window.location = "/signup"}
                      className="w3-small w3-center w3-pointer"
                    >
                      Vous n'avez pas de comptre: <u>S'inscrire</u>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
