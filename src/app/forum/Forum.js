'use client'
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Forum(props) {

  const [displayForum, setdisplayForum] = useState('')
  const [comments, setcomments] = useState([])

  const [commentInfo, setcommentInfo] = useState({
    comment: '',
    userpseudo: '',
    usekey: '',
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

  const isUserLogedin = async () => {
    const xcode = localStorage.getItem('x-code')
    await axios
      .get(source + "/_auth?xcode=" + xcode)
      .then((res) => {
        if (res.data.logedin) {
          console.log(res.data.user);
          commentInfo.usekey = res.data.user.key;
          commentInfo.userpseudo = res.data.user.key;
        } else {
          return false;
        }
      })
      .catch((e) => {
        console.error("failure", e);
      });
  }

  const comment = async (data) => {

    const response  = JSON.parse(data.response)
    response.push(commentInfo);
    console.log(response);
    await setCSRFToken();
    await axios
            .patch(source + "/_forum/" + data.id + "?xcode=" + xcode, response)
            .then((res) => {
              
            })
            .catch((e) => {
              if (e.response && e.response.status === 419) {
                console.error('CSRF token missing or incorrect');
              } else {
                console.error('Request failed:', error);
              }
            });
    
  }

  const reloadForums = (forums) => {
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
          <div className="w3-flex-column w3-overflow w3-card w3-round w3-pointer w3-white">
            <div
              data={"https://freelancer.mg/forum/" + forum.slug}
              className="forumTitle w3-nowrap w3-overflow w3-light-grey w3-big"
              style={{ paddingBlock: 8, paddingInline: 16 }}
              title="Click to copy forum link"
            >
              {parse(forum.title)}
            </div>
            <div>
              <div className="forumCore">
                <div
                  id={"forum" + key}
                  className="w3-overflow w3-nowrap-multiline"
                  style={{ marginInline: 16, marginBlock: 8 }}
                >
                  {parse(forum.content)}
                </div>
              </div>
            </div>
            {forum.type == "image" && (
              <div
                className="forumMedia w3-display-container w3-light-grey forum-image"
                data={JSON.stringify(forum)}
                style={{ zIndex: 2 }}
              >
                <Image
                  alt={"image" + key}
                  unoptimized
                  loading="lazy"
                  // onContextMenu={(e) => e.preventDefault()}
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
                  className="w3-overflow w3-light-grey forum-image"
                />
              </div>
            )}
            <div style={{ padding: 16 }} className="w3-light-grey">
              <div>
                {
                  JSON.parse(forum.response).length > 0 &&
                  JSON.parse(forum.response).map((response, k) => (
                    <div key={k} className="w3-border-left" style={{ paddingBlock: 4, paddingInline: 8, marginBlock: 4 }}>
                      <div className="w3-small forumComent" data={"forum" + key + "Coment" + k}>
                        <div
                          className="w3-overflow w3-nowrap-multiline"
                          id={"forum" + key + "Coment" + k}
                        >
                          {response} Culpa aute esse sunt consectetur nulla officia. Voluptate qui aliqua Lorem reprehenderit nulla voluptate aliqua Lorem ad culpa enim elit ullamco.Deserunt ut fugiat velit culpa aute ut ex mollit amet. Adipisicing dolor pariatur labore eiusmod mollit fugiat sint et incididunt ex voluptate nostrud. Nisi ex consequat tempor est.
                        </div>
                      </div>
                      <div className="w3-text-grey w3-tiny">3829837498</div>
                    </div>
                  ))
                }
              </div>
              {
                JSON.parse(forum.response).length > 3 &&
                <div className="w3-small w3-text-grey" style={{ marginTop: 8 }}>
                  <u>Voire tout les commentaires</u>
                </div>
              }
              {
                JSON.parse(forum.response).length > 0 &&
                <hr className="w3-border-bottom" />
              }
              <div className="w3-white w3-round-xxlarge w3-overflow w3-flex-row">
                <input
                  onChange={(e) => commentInfo.comment = e.target.value}
                  className="input w3-input w3-border-0 w3-white w3-block w3-flex-1"
                  style={{ borderBottomLeftRadius: 32, borderTopLeftRadius: 32 }}
                  placeholder="Laisser un commentaire"
                />
                <button onClick={() => comment(forum)} className="w3-bitton w3-border-0 w3-black w3-pointer" style={{ paddingInline: 16 }}>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
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

  useEffect(() => {
    isUserLogedin()
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


  }, [])


  return (
    <div>
      {displayForum}
    </div>
  );
}
