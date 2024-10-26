"use client";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faArrowLeft,
  faListDots,
  faSpinner,
  faStore,
  faUserCircle,
  faUserPlus,
  faUsers,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import "cloudinary-video-player/cld-video-player.min.css";
import Link from "next/link";
import slugify from "slugify";
import { console_source as source } from "@/app/data";
import HomePost from "@/app/HomePost";
import CreatePost from '../post/create/PostCreate'
import CreateForum from '../forum/create/createForum'

export default function Home(props) {
  axios.defaults.withCredentials = true;

  const [fullPath, setfullPath] = useState({ path: "" });

  const [height, setHeight] = useState(0);

  const [core, setcore] = useState(
    <div style={{ padding: 24 }} className='w3-center'>
      <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
    </div>
  );
  const [stepper, setstepper] = useState({
    key: 0,
    scrollHeight: 0,
    intervalTyper: null,
  });


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

  useEffect(() => {

    const allMenuListe = document.getElementsByClassName('menuItem')
    for (let i = 0; i < allMenuListe.length; i++) {
      const element = allMenuListe[i];
      element.className = element.className.replace('w3-yellow', (localStorage.getItem('theme') == 'dark' ? 'w3-black' : 'w3-light-grey'))
    }

    const firstPath = location.pathname.split('/')[1]
    if (document.getElementById(firstPath + 'Page')) {
      document.getElementById(firstPath + 'Page').className = document.getElementById(firstPath + 'Page').className.replace((localStorage.getItem('theme') == 'dark' ? 'w3-black' : 'w3-light-grey'), 'w3-yellow')
    }

    if (localStorage.getItem('firstPassed') == null) {
      openDropdown("switchPannel");
      setTimeout(() => {
        openDropdown("switchPannel");
      }, 3000);
    }

    //----------------

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
    //----------------


  }, []);

  return (
    <div
      id="coreMain"
      style={{ userSelect: "none", display: "none" }}
    >

      <main
        id="mainCore"
        className="mobileHeight w3-main w3-100vh w3-overflow-scroll w3-noscrollbar "
      >
        <div
          id="coreContainerMain"
          className="w3-container"
          style={{ padding: 0, maxWidth: 620, margin: "auto" }} // >1086:33.33% 620, <1086:50% 480
        >
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
