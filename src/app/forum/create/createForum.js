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

  const [inputImage, setinputImage] = useState(null)

  const [forumListe, setforumListe] = useState('')

  const [forumInfos, setforumInfos] = useState({
    id: null,
    title: "",
    content: "",
    image: null,
    type: "text",
    state: "",
    slug: "",
    action_key: "update",
  });

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
          <div onClick={() => showThisForum(forum)} className="w3-light-grey w3-round w3-padding w3-nowrap w3-overflow">
            <div>{forum.title}</div>
            <div className="w3-small w3-text-grey">{forum.state == 'public' ? 'Publique' : 'Brouillon'}{JSON.parse(forum.response).length > 0 ? " - " + JSON.parse(forum.response).length + " Commentaire" + (JSON.parse(forum.response).length == 1 ? '' : 's') : ''}</div>
          </div>
        </div>
      ))
    } else {
      //
      <div style={{ padding: 8 }}>
        <div className="w3-border w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
          <div style={{ paddingInline: 16 }}>
            Vous n'avez aucun forum pour le moment...
          </div>
        </div>
      </div>
    }
    setforumListe(glitchForum)
  }

  const showThisForum = (data) => {

    if (JSON.parse(data.response).length <= 0) {
      forumInfos.title = data.title
      forumInfos.content = data.content
      forumInfos.id = data.id

      document.getElementById('forumTitle').value = data.title
      document.getElementById('forumContent').innerHTML = data.content

      if (data.type == 'image') {
        document.getElementById("showImage").src = source + "/images.php?w=120&h=120&zlonk=4733&zlink=" + data.link;
        document.getElementById("showImageWrapper").style.display = "block";
        document.getElementById("inputImage").style.display = "none";
      }

      document.getElementById('deleteButton').style.display = 'block';
      document.getElementById('modalForumListe').style.display = 'none';
    } else {
      window.location = '/forum/preview/' + data.slug
    }

  }

  const save = async (state) => {

    const xcode = localStorage.getItem("x-code");

    forumInfos.state = state;
    forumInfos.slug = slugify(forumInfos.title, { lower: true });

    forumInfos.content = document.getElementById('forumContent').innerHTML;

    if (forumInfos.title.length > 0 && forumInfos.content.length > 0) {
      if (state == 'public') {
        document.getElementById("forumPublicSpinner").style.display = "inline-block";
        document.getElementById("forumPublicIcon").style.display = "none";
      } else if (state == 'draft') {
        document.getElementById("forumDraftSpinner").style.display = "inline-block";
      }
      var data;
      if (forumInfos.image) {
        data = forumInfos.image;

        data.append("title", forumInfos.title);
        data.append("slug", forumInfos.slug);
        data.append("content", forumInfos.content);
        data.append("type", forumInfos.type);
        data.append("state", forumInfos.state);
        data.append("action",forumInfos.action_key)
        if (forumInfos.id) {
          data.append("id",forumInfos.id)
        }

      } else {
        data = {
          title: forumInfos.title,
          content: forumInfos.content,
          type: forumInfos.type,
          slug: forumInfos.slug,
          state: forumInfos.state,
          action: forumInfos.action_key,
        };
      }

      try {
        await setCSRFToken();
        if (!forumInfos.image && forumInfos.id) {
          await axios
            .patch(source + "/_forum/" + forumInfos.id + "?xcode=" + xcode, data)
            .then((res) => {
              if (res.data.logedin) {
                if (state == 'public') {
                  document.getElementById("forumPublicSpinner").style.display = "none";
                  document.getElementById("forumPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("forumDraftSpinner").style.display = "none";

                }
                reloadForums(res.data.data.reverse());
                document.getElementById('modalForumListe').style.display = 'block'
                document.getElementById('forumTitle').value = ''
                document.getElementById('forumContent').innerHTML = 'Que pensez-vous ?'
                cancelImageInsertion()
                document.getElementById('deleteButton').style.display = 'none';
              } else {
                if (document.getElementById('modalLogin')) {
                  document.getElementById('modalLogin').style.display = 'block'
                }
                if (state == 'public') {
                  document.getElementById("forumPublicSpinner").style.display = "none";
                  document.getElementById("forumPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("forumDraftSpinner").style.display = "none";
                }
              }

            })
            .catch((e) => {
              if (state == 'public') {
                document.getElementById("forumPublicSpinner").style.display = "none";
                document.getElementById("forumPublicIcon").style.display = "inline-block";
              } else if (state == 'draft') {
                document.getElementById("forumDraftSpinner").style.display = "none";
              }
              if (e.response && e.response.status === 419) {
                console.error('CSRF token missing or incorrect');
              } else {
                console.error('Request failed:', error);
              }
            });
        } else {
          await axios
            .post(source + "/_forum?xcode=" + xcode, data)
            .then((res) => {
              if (res.data.logedin) {
                if (state == 'public') {
                  document.getElementById("forumPublicSpinner").style.display = "none";
                  document.getElementById("forumPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("forumDraftSpinner").style.display = "none";

                }
                reloadForums(res.data.data.reverse());
                document.getElementById('modalForumListe').style.display = 'block'
                document.getElementById('forumTitle').value = ''
                document.getElementById('forumContent').innerHTML = 'Que pensez-vous ?'
                cancelImageInsertion()
              } else {
                if (document.getElementById('modalLogin')) {
                  document.getElementById('modalLogin').style.display = 'block'
                }
                if (state == 'public') {
                  document.getElementById("forumPublicSpinner").style.display = "none";
                  document.getElementById("forumPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("forumDraftSpinner").style.display = "none";
                }
              }

            })
            .catch((e) => {
              if (state == 'public') {
                document.getElementById("forumPublicSpinner").style.display = "none";
                document.getElementById("forumPublicIcon").style.display = "inline-block";
              } else if (state == 'draft') {
                document.getElementById("forumDraftSpinner").style.display = "none";
              }
              if (e.response && e.response.status === 419) {
                console.error('CSRF token missing or incorrect');
              } else {
                console.error('Request failed:', error);
              }
            });
        }
      } catch (error) {
        if (state == 'public') {
          document.getElementById("forumPublicSpinner").style.display = "none";
          document.getElementById("forumPublicIcon").style.display = "inline-block";
        } else if (state == 'draft') {
          document.getElementById("forumDraftSpinner").style.display = "none";
        }

        if (error.response && error.response.status === 419) {
          console.error('CSRF token missing or incorrect');
        } else {
          console.error('Request failed:', error);
        }
      }

    }
  };

  const supprimer = async () => {
    const xcode = localStorage.getItem("x-code");
    if (forumInfos.id) {
      document.getElementById("modalWarning").style.display = "block";
      document.getElementById("textWarning").innerText =
        "Voulez vous vraiment supprimer ce Forum ...";

      const deleteHandler = async () => {
        document.getElementById("confirmSpinner").style.display =
          "inline-block";
        await setCSRFToken();
        await axios
          .delete(source + "/_forum/" + forumInfos.id + '?xcode=' + xcode)
          .then((res) => {
            if (res.data.logedin) {
              document.getElementById("confirmSpinner").style.display = "none";
              document.getElementById("modalWarning").style.display = "none";

              document
                .getElementById("confirmWarning")
                .removeEventListener("click", deleteHandler);
              document
                .getElementById("cancelWarning")
                .removeEventListener("click", cancelHandler);

              reloadForums(res.data.data.reverse());
              document.getElementById('modalForumListe').style.display = 'block'
              document.getElementById('forumTitle').value = ''
              document.getElementById('forumContent').innerHTML = 'Que pensez-vous ?'
              cancelImageInsertion()
              document.getElementById('deleteButton').style.display = 'none';
            } else {
              if (document.getElementById('modalLogin')) {
                document.getElementById('modalLogin').style.display = 'block'
              }
              document.getElementById("confirmSpinner").style.display = "none";
              document.getElementById("modalWarning").style.display = "none";
            }

          })
          .catch((e) => {
            console.error("failure", e);
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
    } else {
      document.getElementById('modalShowTopic').style.display = 'none';
      document.getElementById('topicTitle').value = '';
      document.getElementById('topicContent').innerHTML = '';
    }
  }

  const cancelImageInsertion = () => {
    forumInfos.image = null;
    forumInfos.type = "text";

    document.getElementById("showImage").src = '';
    document.getElementById("showImageWrapper").style.display = "none";
    document.getElementById("inputImage").style.display = "flex";
  }

  useEffect(() => {

    const xcode = localStorage.getItem("x-code");
    if (xcode) {
      axios
        .get(`${source}/_forum?xcode=${xcode}`)
        .then((res) => {
          if (res.data.logedin) {
            document.getElementById('forumCore').style.display = 'block';
            reloadForums(res.data.data.reverse())
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
    var imageSelector = document.createElement("input");
    imageSelector.type = "file";
    imageSelector.accept = "image/*";

    imageSelector.onchange = (e) => {
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
    setinputImage(imageSelector)
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
          maxLength={200}
          placeholder="Titre"
        />
        <div
          id="forumContent"
          contentEditable={true}
          className="w3-input w3-border-0 w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar"
          style={{
            height: 160,
            minWidth: "100%",
            marginTop: 16,
          }}
        >Que pensez-vous?</div>
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
                  onClick={cancelImageInsertion}
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
            onClick={() => save("public")}
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
            className="w3-button w3-hover-black w3-border w3-border-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
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
          <button
            id="deleteButton"
            onClick={supprimer}
            className="w3-button w3-hover-red w3-border w3-border-red w3-text-red w3-round-xxlarge w3-block w3-flex w3-flex-center"
            style={{ marginTop: 16, display: 'none' }}
          >
            Supprimer le forum
          </button>
        </div>
      </div>

      {/* modal forum liste */}
      <div id="modalForumListe" className="w3-modal">
        <div
          className="w3-modal-content w3-card w3-round w3-overflow"
          style={{ maxWidth: 420, top: 32 }}
        >

          <div onClick={() => document.getElementById('modalForumListe').style.display = 'none'} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>

          <div style={{ paddingInline: 16, paddingBlock: 16 }}>
            <input
              id="searchInput"
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
