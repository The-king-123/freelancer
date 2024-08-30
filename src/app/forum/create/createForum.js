"use client";
import React, { useEffect, useState } from "react";
import { console_source as source } from "@/app/data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faImage,
  faListDots,
  faNewspaper,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import slugify from "slugify";

function createForum() {
  axios.defaults.withCredentials = true;
  var inputImage = "";

  const [forumListe, setforumListe] = useState('')
  const forumInfos = {
    ownerId: null,
    title: "",
    content: "",
    image: null,
    type: "text",
    state: "",
    slug: "",
    xcode: null,
  };
  const [userInfo, setuserInfo] = useState({
    id: null,
    email: "",
    key: "",
  });

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

  const reloadForums = (data) => {
    var glitchForum
    if (data.length > 0) {
      glitchForum = data.map((forum, key) => (
        <div key={key} style={{ padding: 4 }}>
          <div className="w3-light-grey w3-round w3-padding w3-nowrap w3-overflow">
            {forum.title}
          </div>
        </div>
      ))
    } else {
      //
    }
    setforumListe(glitchForum)
  }

  const save = async (state) => {

    forumInfos.state = state;
    forumInfos.slug = slugify(forumInfos.title, { lower: true });

    forumInfos.content = document.getElementById('forumContent').innerHTML;

    if (forumInfos.title.length > 0 && forumInfos.content.length > 0) {
      document.getElementById("forumPublicSpinner").style.display =
        "inline-block";
      document.getElementById("forumPublicIcon").style.display = "none";
      var data;
      if (forumInfos.image) {
        data = forumInfos.image;

        data.append("title", forumInfos.title);
        data.append("slug", forumInfos.slug);
        data.append("ownerId", forumInfos.ownerId);
        data.append("content", forumInfos.content);
        data.append("type", forumInfos.type);
        data.append("state", forumInfos.state);
        data.append("xcode", forumInfos.xcode);
      } else {
        data = {
          ownerId: forumInfos.ownerId,
          title: forumInfos.title,
          content: forumInfos.content,
          type: forumInfos.type,
          slug: forumInfos.slug,
          state: forumInfos.state,
          xcode: forumInfos.xcode,
        };
      }

      try {
        await setCSRFToken();

        const response = await axios.post(source + '/_forum', data);
        document.getElementById('forumPublicSpinner').style.display = 'inline-block';
        document.getElementById('forumPublicIcon').style.display = 'none';
        closeModalPost();
        reloadPost(response.data.data);
      } catch (error) {
        document.getElementById('forumPublicSpinner').style.display = 'inline-block';
        document.getElementById('forumPublicIcon').style.display = 'none';

        if (error.response && error.response.status === 419) {
          console.error('CSRF token missing or incorrect');
        } else {
          console.error('Request failed:', error);
        }
      }

      await axios
        .post(source + "/_forum", data)
        .then((res) => {
          document.getElementById("forumPublicSpinner").style.display =
            "inline-block";
          document.getElementById("forumPublicIcon").style.display = "none";
          closeModalPost();
          reloadPost(res.data.data);
        })
        .catch((e) => {
          document.getElementById("forumPublicSpinner").style.display =
            "inline-block";
          document.getElementById("forumPublicIcon").style.display = "none";
          if (e.response && e.response.status === 419) {
            console.error('CSRF token missing or incorrect');
          } else {
            console.error('Request failed:', error);
          }
        });

    }
  };

  useEffect(() => {

    const xcode = localStorage.getItem("x-code");
    if (xcode) {
      axios
        .get(`${source}/_forum?xcode=${xcode}`)
        .then((res) => {
          if (res.data.logedin) {
            document.getElementById('forumCore').style.display = 'block';
            reloadForums(res.data.data)
          } else {
            if (document.getElementById('modalLogin')) {
              document.getElementById('modalLogin').style.display = 'block'
            }
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });
    } else {
      if (document.getElementById('modalLogin')) {
        document.getElementById('modalLogin').style.display = 'block'
      }
    }

    // Upload Image
    inputImage = document.createElement("input");
    inputImage.type = "file";
    inputImage.accept = "image/*";

    inputImage.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      reader.onload = (readerEvent) => {
        var content = readerEvent.target.result;

        document.getElementById("showImage").src = content;
        document.getElementById("showImageWrapper").style.display = "block";
        document.getElementById("inputImage").style.display = "none";

        forumInfos.image = formData;
        forumInfos.type = "image";
      };
    };
  }, []);

  return (
    <div id="forumCore" style={{ display: 'none' }}>
      <div
        className="w3-medium w3-big w3-flex-row w3-flex-center-v"
        style={{ padding: 8 }}
      >
        <div className="w3-flex-row w3-flex-center-v w3-flex-1">
          <FontAwesomeIcon
            className="w3-margin-right"
            icon={faNewspaper}
            style={{ width: 24, height: 24 }}
          />{" "}
          Créer votre forum
        </div>
        <div>
          <div
            onClick={() => document.getElementById('modalForumListe').style.display = 'block'}
            className="w3-light-grey w3-circle w3-flex w3-flex-center"
            style={{ width: 32, height: 32 }}
          >
            <FontAwesomeIcon
              icon={faListDots}
              style={{ width: 16, height: 16 }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: 8 }}>
        <input
          id="forumTitle"
          onChange={(e) => (forumInfos.title = e.target.value)}
          className="w3-input w3-border-0 w3-light-grey w3-round"
          type="text"
          maxLength={100}
          placeholder="Titre"
        />
        <div
          id="forumContent"
          contentEditable={true}
          className="w3-input w3-border-0 w3-light-grey w3-round"
          style={{
            height: 160,
            minWidth: "100%",
            marginTop: 16,
          }}
        >Qu'est-ce que vous pense ?</div>
        <div className="w3-container" style={{ padding: 0 }}>
          <div
            id="inputImage"
            onClick={() => inputImage.click()}
            className="w3-right w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center"
            style={{ height: 40, width: 40, marginTop: 16 }}
          >
            <FontAwesomeIcon icon={faImage} style={{ width: 16, height: 16 }} />
          </div>

          <div className="w3-right " style={{ padding: 0, marginTop: 16 }}>
            <div
              className="w3-display-container"
              id="showImageWrapper"
              style={{ display: "none", height: 120, width: 120 }}
            >
              <Image
                id="showImage"
                src={''}
                className="w3-display-middle w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center w3-overflow"
                height={120}
                width={120}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="w3-display-topright" style={{ padding: 4 }}>
                <div
                  className="w3-circle w3-card w3-white w3-flex w3-flex-center"
                  style={{ width: 24, height: 24 }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ width: 16, height: 16 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => save("pubic")}
            className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
          >
            Publier votre forum{" "}
            <FontAwesomeIcon
              id="forumPublicIcon"
              className="w3-margin-left"
              icon={faArrowRight}
              style={{ width: 16, height: 16 }}
            />
            <FontAwesomeIcon
              id="forumPublicSpinner"
              className="w3-spin w3-margin-left"
              icon={faSpinner}
              style={{ width: 16, height: 16, display: "none" }}
            />
          </button>
          <button
            onClick={() => save("draft")}
            className="w3-button w3-border w3-border-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
            style={{ marginTop: 16 }}
          >
            Enregistrer comme brouillon
            <FontAwesomeIcon
              id="forumDraftSpinner"
              className="w3-spin w3-margin-left"
              icon={faSpinner}
              style={{ width: 16, height: 16, display: "none" }}
            />
          </button>
        </div>
      </div>

      {/* modal forum liste */}
      <div id="modalForumListe" className="w3-modal">
        <div
          className="w3-modal-content w3-card w3-round w3-overflow"
          style={{ maxWidth: 420, top: 32 }}
        >

          <div onClick={()=>document.getElementById('modalForumListe').style.display = 'none'} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>

          <div style={{ paddingInline: 16, paddingBlock: 16 }}>
            <input
              id="categoryTitle"
              className="input w3-border-0 w3-input w3-border w3-round-xxlarge"
              placeholder="Chercher un forum"
              type="text"
            />
          </div>
          <div style={{ height: '50vh', paddingInline: 12, marginBottom: 16 }} className="w3-overflow-scroll w3-noscrollbar">
            {
              forumListe
            }
          </div>

        </div>
      </div>
      {/* end modal forum liste */}
    </div>
  );
}

export default createForum;
