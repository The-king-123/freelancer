"use client";
import React, { useEffect } from "react";
import { console_source as source } from "../data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
  const save = async (state) => {

    forumInfos.state = state;
    forumInfos.slug = slugify(forumInfos.title, { lower: true });

    console.log(forumInfos);
    
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
        
        const response = await axios.post(source + '/_forum',data);
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
        .post(source + "/_forum",data)
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
    const code = localStorage.getItem("x-code");
    if (code) {
      axios
        .get(`${source}/_auth/${code}/edit`)
        .then((res) => {
          if (res.data.logedin) {
            localStorage.setItem("userInfos", JSON.stringify(res.data.user));
            forumInfos.ownerId = res.data.user.key;
            forumInfos.xcode = code;
          } else {
            document.location = `${source}/login?q=forum&c=${code}`;
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });
    } else {
      let randomNumber = "";
      for (let i = 0; i < 15; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }
      localStorage.setItem("x-code", randomNumber);
      document.location = source + "/login?q=forum&c=" + randomNumber;
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
    <>
      <div
        className="w3-medium w3-big w3-flex-row w3-flex-center-v"
        style={{ padding: 8 }}
      >
        <div className="w3-flex-row w3-flex-center-v w3-flex-1">
          <FontAwesomeIcon
            className="w3-margin-right"
            icon={faNewspaper}
            style={{ width: 16, height: 16 }}
          />{" "}
          Creer votre forum
        </div>
        <div>
          <div
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
          onChange={(e) => (forumInfos.title = e.target.value)}
          className="w3-input w3-border-0 w3-light-grey"
          type="text"
          maxLength={100}
          placeholder="Titre"
        />
        <textarea
          onChange={(e) => (forumInfos.content = e.target.value)}
          className="w3-input w3-border-0 w3-light-grey"
          placeholder="Qu'est-ce que vous pense ?"
          style={{
            minHeight: 120,
            maxHeight: 120,
            minWidth: "100%",
            marginTop: 16,
          }}
        />
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
    </>
  );
}

export default createForum;
