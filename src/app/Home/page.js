"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faArrowLeft,
  faListDots,
  faSpinner,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import "cloudinary-video-player/cld-video-player.min.css";
import Link from "next/link";
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

  function toggleNotionListe(id, iconId, action) {
    const showmoreCore = document.getElementById(id);
    const optionMenu = document.getElementById('optionMenu');
    if (showmoreCore) {
      if (action == 'open') {
        showmoreCore.className += " w3-show";
        document.getElementById(iconId).style.display = 'flex';
        document.getElementById(iconId).style.transform = 'rotate(-180deg)';
        document.getElementById('beastWrapper').style.display = 'none';
        document.getElementById('optionMenuWrapper').style.height = 'calc(100vh - 86px)';
        optionMenu.className = optionMenu.className.replace(/ w3-show/g, "");
      } else {
        showmoreCore.className = showmoreCore.className.replace(/ w3-show/g, "");
        document.getElementById(iconId).style.transform = 'rotate(0deg)';
        document.getElementById(iconId).style.display = 'none';
        document.getElementById('beastWrapper').style.display = 'flex';
        document.getElementById('optionMenuWrapper').style.height = 'calc(100vh - 140px)';
        optionMenu.className += " w3-show";
      }
    }
  }

  useEffect(() => {

    localStorage.setItem('freePremiumListened', 'not')

    const allMenuListe = document.getElementsByClassName('menuItem')
    const allBottomMenuListe = document.getElementsByClassName('menuItemBottom')
    for (let i = 0; i < allMenuListe.length; i++) {
      const element = allMenuListe[i];
      element.className = element.className.replace('w3-yellow w3-hover-yellow', (localStorage.getItem('theme') != 'dark' ? 'w3-light-grey' : 'w3-black'))
    }

    for (let i = 0; i < allBottomMenuListe.length; i++) {
      const element = allBottomMenuListe[i];
      element.className = element.className.replace('w3-text-yellow', 'whiteBlackYellow')
    }

    const firstPath = location.pathname.split('/')[1]
    if (document.getElementById(firstPath + 'Page')) {
      document.getElementById(firstPath + 'Page').className = document.getElementById(firstPath + 'Page').className.replace((localStorage.getItem('theme') != 'dark' ? 'w3-light-grey' : 'w3-black'), 'w3-yellow w3-hover-yellow')
      if (firstPath == 'notion') {
        toggleNotionListe('notionMenu', 'notionMenuIcon', 'open')
      } else {
        toggleNotionListe('notionMenu', 'notionMenuIcon', 'close')
      }
    }
    if (document.getElementById(firstPath + 'Screen')) {
      document.getElementById(firstPath + 'Screen').className = document.getElementById(firstPath + 'Screen').className.replace('whiteBlackYellow', 'w3-text-yellow')
    }

    //----------------

    const localHosts = ["localhost", "127.0.0.1", "::1"];
    if (typeof window !== "undefined") {
      fullPath.path = window.location.pathname;
    }

    if (document.getElementById("coreMain")) {

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

        if (document.getElementsByClassName("forumCore")) {
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
        }


        if (document.getElementsByClassName("forumComent")) {

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
        }

      }, 1000);

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

      window.addEventListener("scroll", function () {
        const chatElement = document.getElementById("chatCoreWrapper");
        const totalHeight = chatElement.scrollHeight;
        const viewportHeight = chatElement.clientHeight;
        const currentScroll = chatElement.scrollTop;
        if (currentScroll + viewportHeight < totalHeight) {
          stepper.scrolling = true;
        } else {
          stepper.scrolling = false;
        }
      });

      document.getElementById("mainCore").style.display = "block";

    }

    const updateHeight = () => {
      setHeight(window.innerHeight - 80 - (window.innerWidth > 992 ? 0 : 20));
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };

  }, []);

  return (
    <div
      id="coreMain"
      style={{ userSelect: "none", paddingBlock: 8 }}
    >
      <main
        className="w3-main"
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

      {/* modal createPostOnDesktop */}
      <div
        id="createPostOnDesktop"
        className="w3-modal w3-noscrollbar"
        style={{ padding: 24, zIndex: 9999 }}
      >
        <div
          className="w3-dark-grey w3-overflow w3-display-middle w3-block w3-round-large w3-content"
          style={{
            height: 520,
            maxWidth: 520,
          }}
        >
          <div
            className="w3-container w3-black"
            style={{ paddingBlock: 0, padding: 16 }}
          >


            <div className="w3-flex-row w3-flex-center-v">
              <div className="w3-flex-1">
                <div
                  onClick={() => document.getElementById('createPostOnDesktop').style.display = 'none'}
                  className="w3-pointer w3-flex w3-flex-center w3-light-grey w3-circle"
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
                  className="w3-light-grey w3-circle w3-flex w3-flex-center"
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
          className="w3-dark-grey w3-overflow w3-display-middle w3-block w3-round-large w3-content"
          style={{
            height: 520,
            maxWidth: 520,
          }}
        >
          <div
            className="w3-container w3-black"
            style={{ paddingBlock: 0, padding: 16 }}
          >
            <div className="w3-flex-row w3-flex-center-v">
              <div className="w3-flex-1">
                <div
                  onClick={() => document.getElementById('createForumOnDesktop').style.display = 'none'}
                  className="w3-pointer w3-flex w3-flex-center w3-light-grey w3-circle"
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
                  className="w3-light-grey w3-circle w3-flex w3-flex-center"
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
