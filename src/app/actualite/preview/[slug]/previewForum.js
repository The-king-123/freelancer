'use client'
import { console_source as source } from '@/app/data';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import parse from "html-react-parser";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


function previewForum({ forum }) {

  axios.defaults.withCredentials = true;

  const xuser = localStorage.getItem('x-user')

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

  const comment = async (data, key) => {

    if (commentInfo.forum_owner) {

    }
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
            const commentaire = "<div class='w3-border-left' style='padding-block: 4px; padding-inline: 8px; margin-block: 4px'><div class='w3-text-grey w3-tiny'>*vous</div><div class='w3-small forumComent'><div>" + commentInfo.comment + "</div></div></div>";
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

  useEffect(() => {
    if (localStorage.getItem('theme') != 'dark') {

      const elementGrey = document.getElementsByClassName('w3-black').length
      const elementWhite = document.getElementsByClassName('w3-dark-grey').length
      const backTransparent = document.getElementsByClassName('black-opacity').length
      for (let i = 0; i < elementGrey; i++) {
          const element = document.getElementsByClassName('w3-black')[0];
          if (element) {
              element.className = element.className.replace('w3-black', 'w3-light-grey')
          }

      }
      for (let i = 0; i < elementWhite; i++) {
          const element = document.getElementsByClassName('w3-dark-grey')[0];
          if (element) {
              element.className = element.className.replace('w3-dark-grey', 'w3-white')
          }

      }
      for (let i = 0; i < backTransparent; i++) {
          const element = document.getElementsByClassName('black-opacity')[0];
          if (element) {
              element.className = element.className.replace('black-opacity', 'white-opacity')
          }

      }

      document.getElementById('htmlCore').style.display = 'block'
  }
  }, [])
  

  return (
    <div>
      <div style={{ padding: 16 }}>
        {forum.type == "image" &&
          <Image
            id="postImageMedia"
            alt={forum.title}
            unoptimized
            loading="lazy"
            height={420}
            width={520}
            src={
              source +
              "/images.php?w=720&h=720&zlonk=4733&zlink=" +
              forum.link
            }
            style={{
              objectPosition: "center",
              objectFit: "cover",
            }}
            className="w3-black post-image w3-round w3-overflow"
          />
        }
        <div className='w3-big w3-large w3-margin-top'>
          {parse(forum.title)}
        </div>
        <div className='postCore'>
          <div id='post0' style={{ marginBlock: 16 }}>
            {parse(forum.content)}
          </div>
        </div>
        {
          forum.response.length > 0 &&
          forum.response.map((response, k) => (
            <div id={"coment0_" + response.id} key={k} className="w3-border-left" style={{ paddingBlock: 4, paddingInline: 8, marginBlock: 4 }}>
              <div className="w3-text-grey w3-tiny">{response.user_key == xuser ? <div>¬vous<span onClick={() => supprimer(response.id, 0)} className="w3-margin-left w3-text-red w3-opacity w3-pointer">supprimer</span></div> : response.user_key}</div>
              <div className="w3-small forumComent" data={"forum0Coment" + k}>
                <div
                  className="w3-overflow w3-nowrap-multiline"
                  id={"forum0Coment" + k}
                >
                  {response.comment}
                </div>
              </div>
            </div>
          ))
        }
        <div id={"forumUserNewComent0"}></div>
        {
          forum.response.length > 0 &&
          <hr />
        }
        <div className="w3-dark-grey w3-round-xxlarge w3-overflow w3-flex-row">
          <input
            type='text'
            id={"inputForumComent0"}
            onChange={(e) => commentInfo.comment = e.target.value}
            className="input w3-input w3-border-0 w3-black w3-block w3-flex-1"
            style={{ borderBottomLeftRadius: 32, borderTopLeftRadius: 32 }}
            placeholder="Laisser un commentaire"
          />
          <button onClick={() => comment(forum, 0)} className="w3-button w3-border-0 w3-yellow w3-hover-yellow w3-pointer" style={{ minWidth: 80 }}>
            <span id={"comentTextSpinner0"}>Envoyer</span>
            <FontAwesomeIcon id={"comentButtonSpinner0"} icon={faSpinner} className="w3-spin" style={{ display: 'none' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default previewForum