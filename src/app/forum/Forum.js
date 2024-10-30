'use client'
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Forum(props) {

  axios.defaults.withCredentials = true;

  const [displayForum, setdisplayForum] = useState(
    <div style={{ padding: 24 }} className='w3-center'>
      <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
    </div>
  )

  const [commentInfo, setcommentInfo] = useState({
    comment: '',
    forum_owner: '',
    forum_id: '',
  })

  async function setCSRFToken() {
    try {
      // Fetch CSRF token from the server
      const response = await axios.get(source + '/csrf-token');
      // Set CSRF token as a default header for all future requests
      axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
    }
  }

  const comment = async (data, key) => {

    if (commentInfo.comment.trim().length > 0) {

      document.getElementById('comentTextSpinner' + key).style.display = 'none';
      document.getElementById('comentButtonSpinner' + key).style.display = 'inline-block';

      commentInfo.forum_owner = data.owner_key
      commentInfo.forum_id = data.id

      const xcode = localStorage.getItem('x-code')
      await setCSRFToken();
      await axios
        .post(source + "/_forumcoment?xcode=" + xcode, commentInfo)
        .then((res) => {
          if (res.data.logedin) {
            const commentaire = "<div class='w3-border-left' style='padding-block: 4px; padding-inline: 8px; margin-block: 4px'><div class='w3-text-grey w3-tiny'>¬vous</div><div class='w3-small forumComent'><div>" + commentInfo.comment + "</div></div></div>";
            document.getElementById('forumUserNewComent' + key).innerHTML = document.getElementById('forumUserNewComent' + key).innerHTML + commentaire;

            commentInfo.comment = '';
            document.getElementById('inputForumComent' + key).value = '';
          } else {
            if (document.getElementById('modalLogin')) {
              document.getElementById('modalLogin').style.display = 'block'
            }
          }

          document.getElementById('comentTextSpinner' + key).style.display = 'inline-block';
          document.getElementById('comentButtonSpinner' + key).style.display = 'none';

        })
        .catch((e) => {

          document.getElementById('comentButtonSpinner' + key).style.display = 'none';
          document.getElementById('comentTextSpinner' + key).style.display = 'inline-block';

          if (e.response && e.response.status === 419) {
            console.error('CSRF token missing or incorrect');
          } else {
            console.error('Request failed:', error);
          }
        });
    }


  }

  const supprimer = async (id, key) => {
    const xcode = localStorage.getItem('x-code')
    document.getElementById("modalWarning").style.display = "block";
    document.getElementById("textWarning").innerText =
      "Voulez vous vraiment supprimer ce commentaire ...";

    const deleteHandler = async () => {
      document.getElementById("confirmSpinner").style.display =
        "inline-block";
      await setCSRFToken();
      await axios
        .delete(source + "/_forumcoment/" + id + "?xcode=" + xcode)
        .then((res) => {
          if (res.data.logedin) {
            if (res.data.deleted) {
              document.getElementById("coment" + key + "_" + id).style.display = 'none';
              document.getElementById("confirmSpinner").style.display = "none";
              document.getElementById("modalWarning").style.display = "none";

              document
                .getElementById("confirmWarning")
                .removeEventListener("click", deleteHandler);
              document
                .getElementById("cancelWarning")
                .removeEventListener("click", cancelHandler);
            } else {
              document.getElementById("confirmSpinner").style.display = "none";
            }
          } else {
            if (document.getElementById('modalLogin')) {
              document.getElementById('modalLogin').style.display = 'block'
            }
            document.getElementById("confirmSpinner").style.display = "none";
            document.getElementById("modalWarning").style.display = "none";
          }

        })
        .catch((e) => {
          document.getElementById("confirmSpinner").style.display = "none";
          if (e.response && e.response.status === 419) {
            console.error('CSRF token missing or incorrect');
          } else {
            console.error('Request failed:', error);
          }
        });
    };
    const cancelHandler = async () => {
      document.getElementById("modalWarning").style.display = "none";

      document
        .getElementById("confirmWarning")
        .removeEventListener("click", deleteHandler);
      document
        .getElementById("cancelWarning")
        .removeEventListener("click", cancelHandler);
    };

    document
      .getElementById("confirmWarning")
      .addEventListener("click", deleteHandler);
    document
      .getElementById("cancelWarning")
      .addEventListener("click", cancelHandler);

    //---------------------------------

  }

  const reloadForums = (forums) => {
    const xuser = localStorage.getItem('x-user');
    const themeLight = localStorage.getItem('theme') == 'light' ? true : false
    var glitchForum = ''
    if (forums.length > 0) {
      glitchForum = forums.map((forum, key) => (
        <div key={key} style={{ padding: 8, zIndex: 1 }}>
          <div
            className="w3-small w3-text-grey"
            style={{ paddingInline: 8, textAlign: "right", display: "none" }}
            id={"flashInfo" + key}
          >
            Lien copié...
          </div>
          <div className={"w3-flex-column w3-overflow w3-card w3-round "+ (themeLight ? 'w3-white' : 'w3-dark-grey')}>
            <Link
              href={'/forum/preview/' + forum.slug}
              data={"https://freelancer.mg/forum/" + forum.slug}
              className={"forumTitle w3-nowrap w3-overflow w3-big w3-pointer " + (themeLight ? 'w3-light-grey' : 'w3-black')}
              style={{ paddingBlock: 8, paddingInline: 16 }}
              title="Ouvrir le forum"
            >
              {parse(forum.title)}
            </Link>
            <div>
              <div className="forumCore">
                <div
                  id={"forum" + key}
                  className="w3-overflow w3-nowrap-multiline w3-pointer"
                  style={{ marginInline: 16, marginBlock: 8 }}
                >
                  {parse(forum.content)}
                </div>
              </div>
            </div>
            {forum.type == "image" && (
              <Link
                href={'/forum/preview/' + forum.slug}
                className="forumMedia w3-display-container w3-black forum-image w3-pointer"
                data={JSON.stringify(forum)}
                style={{ zIndex: 2 }}
              >
                <Image
                  alt={"image" + key}
                  unoptimized
                  loading="lazy"
                  height={320}
                  width={520}
                  src={
                    source +
                    "/images.php?w=420&h=420&zlonk=4733&zlink=" +
                    forum.link
                  }
                  style={{
                    objectPosition: "center",
                    objectFit: "cover",
                    zIndex: 1,
                  }}
                  className={"w3-overflow forum-image w3-block " + (themeLight ? 'w3-light-grey' : 'w3-black')}
                />
              </Link>
            )}
            <div
              style={{ padding: 16 }}
              className={(themeLight ? 'w3-light-grey' : 'w3-black')}
            >
              <div>
                <div id={"forumUserNewComent" + key}></div>
                {
                  forum.response.length > 0 &&
                  forum.response.map((response, k) => (
                    k < 3 &&
                    <div id={"coment" + key + "_" + response.id} key={k} className="w3-border-left" style={{ paddingBlock: 4, paddingInline: 8, marginBlock: 4 }}>
                      <div className="w3-text-grey w3-tiny">{response.user_key == xuser ? <div>¬vous<span onClick={() => supprimer(response.id, key)} className="w3-margin-left w3-text-red w3-opacity w3-pointer">supprimer</span></div> : response.user_key}</div>
                      <div className="w3-small forumComent" data={"forum" + key + "Coment" + k}>
                        <div
                          className="w3-overflow w3-nowrap-multiline"
                          id={"forum" + key + "Coment" + k}
                        >
                          {response.comment}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              {
                forum.response.length > 3 &&
                <Link href={'/forum/preview/' + forum.slug} className="w3-small w3-text-grey" style={{ marginTop: 8 }}>
                  <u>Voir tous les commentaires</u>
                </Link>
              }
              <div className={"w3-round-xxlarge w3-overflow w3-flex-row " + (forum.response.length > 0 ? 'w3-margin-top ' : '') + (themeLight ? 'w3-white' : 'w3-dark-grey')}>
                <input
                  type='text'
                  id={"inputForumComent" + key}
                  onChange={(e) => commentInfo.comment = e.target.value}
                  className={"input w3-input w3-border-0 w3-block w3-flex-1 "+ (themeLight ? 'w3-white' : 'w3-dark-grey')}
                  style={{ borderBottomLeftRadius: 32, borderTopLeftRadius: 32 }}
                  placeholder="Laisser un commentaire"
                />
                <button onClick={() => comment(forum, key)} className={"w3-bitton w3-border-0 w3-pointer w3-yellow"} style={{ minWidth: 80 }}>
                  <span id={"comentTextSpinner" + key}>Envoyer</span>
                  <FontAwesomeIcon id={"comentButtonSpinner" + key} icon={faSpinner} className="w3-spin" style={{ display: 'none' }} />
                </button>
              </div>
            </div>
          </div>
        </div >
      ))
    } else {
      glitchForum = (
        <div style={{ paddingInline: 8 }}>
          <div
            className="w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            Nous n'avons trouves aucun forums ...
          </div>
        </div>)
    }
    setdisplayForum(glitchForum)
  }

  const createForum = () => {
    if (window.innerWidth > 992) {
      document.getElementById('createForumOnDesktop').style.display = 'block';
      document.getElementById('openForumListeButton').style.display = 'none';
    } else {
      window.location = '/post/forum'
    }
  }

  useEffect(() => {

    if (props.forums) {
      reloadForums(props.forums)
    } else {
      axios
        .get(source + "/_forum/default")
        .then((res) => {
          reloadForums(res.data.data);
        })
        .catch((e) => {
          console.error("failure", e);
        });
    }

    setTimeout(() => {
      
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

  }, [])


  return (
    <div>
      {displayForum}
    </div>
  );
}
