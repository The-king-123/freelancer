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
  faPager,
  faPaperclip,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import slugify from "slugify";

function postuleRecrutement(props) {
  axios.defaults.withCredentials = true;

  const [inputImage, setinputImage] = useState(null)
  const [inputCV, setinputCV] = useState(null)

  const [withcmInfo, setwithcmInfo] = useState({
    id: null,
    slug: '',
  })

  const jobListe = [
    'Graphisme et Design',
    'Rédaction ',
    'Traduction ',
    'Marketing Digital ',
    'Développement Web',
    'Support Administratif ',
    'Assistance Virtuelle ',
    'Consulting et Coaching ',
    'Vidéo et Animation ',
    'Formation et Éducation ',
    'Musique et Audio ',
    'Photographie ',
    'Opération de saisie',
  ]

  const [recrutementListe, setrecrutementListe] = useState('')

  const [recrutementInfos, setrecrutementInfos] = useState({
    id: null,
    content: "",
    image: null,
    cv: null,
    link: '',
    dactylot: false,
    adresse: "",
    contact: "",
    fullname: "",
    psalarial: "",
    jobTitle: '',
    slug: '',
    niveauLangue: {
      fr: '',
      en: '',
      autre: '',
    }
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

  const showThisRecrutement = (data) => {

    if (data.response.length <= 0) {
      recrutementInfos.title = data.title
      recrutementInfos.content = data.content
      recrutementInfos.id = data.id

      document.getElementById('recrutementTitle').value = data.title
      document.getElementById('recrutementContent').innerHTML = data.content

      if (data.type == 'image') {
        document.getElementById("showImage").src = source + "/images.php?w=120&h=120&zlonk=4733&zlink=" + data.link;
        document.getElementById("showImageWrapper").style.display = "block";
        document.getElementById("inputImage").style.display = "none";
      }

      document.getElementById('deleteButton').style.display = 'block';
      document.getElementById('modalRecrutementListe').style.display = 'none';
    } else {
      document.getElementById('modalOptionRecrutement').style.display = 'block'
      withcmInfo.id = data.id
      withcmInfo.slug = data.slug
      // window.location = '/recrutement/preview/' + data.slug
    }

  }

  const reloadRecrutements = (data) => {
    var glitchRecrutement
    if (data.length > 0) {
      glitchRecrutement = data.map((recrutement, key) => (
        <div key={key} style={{ padding: 4 }}>
          <div onClick={() => showThisRecrutement(recrutement)} className="w3-light-grey w3-round w3-padding w3-nowrap w3-overflow">
            <div>{recrutement.title}</div>
            <div className="w3-small w3-text-grey">{recrutement.state == 'public' ? 'Publique' : 'Brouillon'}{recrutement.response.length > 0 ? " - " + recrutement.response.length + " Commentaire" + (recrutement.response.length == 1 ? '' : 's') : ''}</div>
          </div>
        </div>
      ))
    } else {
      //
      <div style={{ padding: 8 }}>
        <div className="w3-border w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
          <div style={{ paddingInline: 16 }}>
            Vous n'avez aucun recrutement pour le moment...
          </div>
        </div>
      </div>
    }
    setrecrutementListe(glitchRecrutement)
  }

  const save = async (state) => {

    // const xcode = localStorage.getItem("x-code");

    recrutementInfos.state = state;
    recrutementInfos.slug = slugify(recrutementInfos.fullname, { lower: true });

    recrutementInfos.content = document.getElementById('recrutementContent').innerHTML;


    if (recrutementInfos.image ||
      recrutementInfos.cv &&
      recrutementInfos.jobTitle.length > 0 &&
      recrutementInfos.content.length > 0 &&
      recrutementInfos.fullname.length > 0 &&
      recrutementInfos.adresse.length > 0 &&
      recrutementInfos.psalarial.length > 0 &&
      recrutementInfos.contact.length > 0 &&
      recrutementInfos.niveauLangue.fr.length > 0) {

      if (state == 'public') {
        document.getElementById("recrutementPublicSpinner").style.display = "inline-block";
        document.getElementById("recrutementPublicIcon").style.display = "none";
      } else if (state == 'draft') {
        document.getElementById("recrutementDraftSpinner").style.display = "inline-block";
      }

      console.log(recrutementInfos);

      var data;
      // if (recrutementInfos.image) {
      data = recrutementInfos.image ? recrutementInfos.image : recrutementInfos.cv;
      data.append("title", recrutementInfos.jobTitle);
      data.append("slug", recrutementInfos.slug);
      data.append("content", recrutementInfos.content);
      data.append("adresse", recrutementInfos.adresse);
      data.append("contact", recrutementInfos.contact);
      data.append("fullname", recrutementInfos.fullname);
      data.append("niveauLangue", JSON.stringify(recrutementInfos.niveauLangue));
      data.append("dactylot", recrutementInfos.dactylot);
      data.append("psalarial", recrutementInfos.psalarial);

      if (recrutementInfos.id) {
        data.append("id", recrutementInfos.id)
      }

      // } else {
      //   data = {
      //     title: recrutementInfos.jobTitle,
      //     content: recrutementInfos.content,
      //     adresse: recrutementInfos.adresse,
      //     slug: recrutementInfos.slug,
      //     contact: recrutementInfos.contact,
      //     psalarial: recrutementInfos.psalarial,
      //     contact: recrutementInfos.contact,
      //     fullname: recrutementInfos.fullname,
      //     niveauLangue: JSON.stringify(recrutementInfos.niveauLangue) ,
      //     dactylot: recrutementInfos.dactylot,
      //   };
      // }

      try {
        await setCSRFToken();
        if (!recrutementInfos.image && recrutementInfos.id) {
          await axios
            .patch(source + "/_recrutement/" + recrutementInfos.id + "?xcode=" + xcode, data)
            .then((res) => {
              if (res.data.logedin) {
                if (state == 'public') {
                  document.getElementById("recrutementPublicSpinner").style.display = "none";
                  document.getElementById("recrutementPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("recrutementDraftSpinner").style.display = "none";

                }
                reloadRecrutements(res.data.data.reverse());
                document.getElementById('modalRecrutementListe').style.display = 'block'
                document.getElementById('recrutementTitle').value = ''
                document.getElementById('recrutementContent').innerHTML = 'Que pensez-vous ?'
                cancelImageInsertion()
                document.getElementById('deleteButton').style.display = 'none';
              } else {
                if (document.getElementById('modalLogin')) {
                  document.getElementById('modalLogin').style.display = 'block'
                }
                if (state == 'public') {
                  document.getElementById("recrutementPublicSpinner").style.display = "none";
                  document.getElementById("recrutementPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("recrutementDraftSpinner").style.display = "none";
                }
              }

            })
            .catch((e) => {
              if (state == 'public') {
                document.getElementById("recrutementPublicSpinner").style.display = "none";
                document.getElementById("recrutementPublicIcon").style.display = "inline-block";
              } else if (state == 'draft') {
                document.getElementById("recrutementDraftSpinner").style.display = "none";
              }
              if (e.response && e.response.status === 419) {
                console.error('CSRF token missing or incorrect');
              } else {
                console.error('Request failed:', error);
              }
            });
        } else {
          await axios
            .post(source + "/_recrutement", data)
            .then((res) => {
              if (res.data.logedin) {
                if (state == 'public') {
                  document.getElementById("recrutementPublicSpinner").style.display = "none";
                  document.getElementById("recrutementPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("recrutementDraftSpinner").style.display = "none";

                }
                reloadRecrutements(res.data.data.reverse());
                document.getElementById('modalRecrutementListe').style.display = 'block'
                document.getElementById('recrutementTitle').value = ''
                document.getElementById('recrutementContent').innerHTML = 'Que pensez-vous ?'
                cancelImageInsertion()
              } else {
                if (document.getElementById('modalLogin')) {
                  document.getElementById('modalLogin').style.display = 'block'
                }
                if (state == 'public') {
                  document.getElementById("recrutementPublicSpinner").style.display = "none";
                  document.getElementById("recrutementPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                  document.getElementById("recrutementDraftSpinner").style.display = "none";
                }
              }

            })
            .catch((e) => {
              if (state == 'public') {
                document.getElementById("recrutementPublicSpinner").style.display = "none";
                document.getElementById("recrutementPublicIcon").style.display = "inline-block";
              } else if (state == 'draft') {
                document.getElementById("recrutementDraftSpinner").style.display = "none";
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
          document.getElementById("recrutementPublicSpinner").style.display = "none";
          document.getElementById("recrutementPublicIcon").style.display = "inline-block";
        } else if (state == 'draft') {
          document.getElementById("recrutementDraftSpinner").style.display = "none";
        }

        if (error.response && error.response.status === 419) {
          console.error('CSRF token missing or incorrect');
        } else {
          console.error('Request failed:', error);
        }
      }

    }
  };

  const supprimer = async (cm) => {
    const xcode = localStorage.getItem("x-code");
    if (recrutementInfos.id || withcmInfo.id) {
      document.getElementById("modalWarning").style.display = "block";
      document.getElementById("textWarning").innerText =
        "Voulez vous vraiment supprimer ce Recrutement ...";

      const deleteHandler = async () => {
        document.getElementById("confirmSpinner").style.display =
          "inline-block";
        await setCSRFToken();
        await axios
          .delete(source + "/_recrutement/" + (cm <= 0 ? recrutementInfos.id : withcmInfo.id) + '?xcode=' + xcode)
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

              reloadRecrutements(res.data.data.reverse());
              document.getElementById('modalRecrutementListe').style.display = 'block'
              document.getElementById('recrutementTitle').value = ''
              document.getElementById('recrutementContent').innerHTML = 'Que pensez-vous ?'
              cancelImageInsertion()
              document.getElementById('deleteButton').style.display = 'none';
              if (cm > 0) {
                document.getElementById('modalOptionRecrutement').style.display = 'none';
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
    }

  }

  const cancelImageInsertion = () => {
    recrutementInfos.image = null;
    recrutementInfos.type = "text";

    document.getElementById("showImage").src = '';
    document.getElementById("showImageWrapper").style.display = "none";
    document.getElementById("inputImage").style.display = "flex";
  }
  const cancelCVInsertion = () => {
    recrutementInfos.cv = null;

    document.getElementById("showCV").src = '';
    document.getElementById("showCVWrapper").style.display = "none";
    document.getElementById("inputCV").style.display = "flex";
  }
  const closeModalOptionRecrutement = () => {
    document.getElementById('modalOptionRecrutement').style.display = 'none'
    withcmInfo.id = null;
    withcmInfo.slug = '';
  }

  const afficher = () => {
    window.location = '/recrutement/preview/' + withcmInfo.slug
  }

  useEffect(() => {

    // if (!props.fromHome) {
    //   document.getElementById('modalRecrutementListe').style.display = 'block'
    // }

    const xcode = localStorage.getItem("x-code");
    if (xcode) {
      axios
        .get(`${source}/_recrutement?xcode=${xcode}`)
        .then((res) => {
          if (res.data.logedin) {
            document.getElementById('recrutementCore').style.display = 'block';
            reloadRecrutements(res.data.data.reverse())
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });
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
      if (recrutementInfos.cv) {
        recrutementInfos.image.append("image", file);
      } else {
        formData.append("image", file);
      }

      reader.onload = (readerEvent) => {
        var content = readerEvent.target.result;

        document.getElementById("showImage").src = content;
        document.getElementById("showImageWrapper").style.display = "block";
        document.getElementById("inputImage").style.display = "none";

        if (!recrutementInfos.cv) {
          recrutementInfos.image = formData;
        }
      };
    };
    setinputImage(imageSelector)

    // Upload CV
    var cvSelector = document.createElement("input");
    cvSelector.type = "file";
    cvSelector.accept = "image/*";

    cvSelector.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const formData = new FormData();
      if (recrutementInfos.image) {
        recrutementInfos.image.append("cv", file);
      } else {
        formData.append("cv", file);
      }
      reader.onload = (readerEvent) => {
        var content = readerEvent.target.result;

        document.getElementById("showCV").src = content;
        document.getElementById("showCVWrapper").style.display = "block";
        document.getElementById("inputCV").style.display = "none";
        if (!recrutementInfos.image) {
          recrutementInfos.cv = formData;
        }
      };
    };
    setinputCV(cvSelector)
  }, []);

  return (
    <div id="recrutementCore" style={{ position: 'relative' }}>
      <div
        className="w3-medium w3-big w3-flex-row w3-flex-center-v"
        style={{ padding: 8 }}
      >
        <div className="w3-flex-row w3-flex-center-v w3-flex-1">
          <FontAwesomeIcon
            className="w3-margin-right"
            icon={faPager}
            style={{ width: 24, height: 24 }}
          />{" "}
          Créer un recrutement
        </div>
        {/* <div id="openRecrutementListeButton">
          <div
            onClick={() => document.getElementById('modalRecrutementListe').style.display = 'block'}
            className="w3-light-grey w3-circle w3-flex w3-flex-center"
            style={{ width: 32, height: 32 }}
          >
            <FontAwesomeIcon
              icon={faListDots}
              style={{ width: 16, height: 16 }}
            />
          </div>
        </div> */}
      </div>

      <div style={{ padding: 8 }}>
        <select
          onChange={(e) => recrutementInfos.jobTitle = e.target.value}
          id="designation"
          className="input w3-block  w3-light-grey w3-round w3-block w3-text-black w3-medium  w3-border-0 w3-margin-bottom"
          style={{ paddingBlock: 8 }}
          defaultValue={'default'}
        >
          <option value={'default'} disabled={true}>
            Postuler pour le poste de :
          </option>
          {
            jobListe.map((job, key) => (
              <option key={key} value={job}>
                {job}
              </option>

            ))
          }
        </select>
        <input
          id="recrutementTitle"
          onChange={(e) => (recrutementInfos.fullname = e.target.value)}
          className="w3-input w3-border-0 w3-light-grey w3-round w3-margin-bottom"
          type="text"
          maxLength={200}
          placeholder="Nom et prenom"
        />

        <input
          id="recrutementTitle"
          onChange={(e) => (recrutementInfos.contact = e.target.value)}
          className="w3-input w3-border-0 w3-light-grey w3-round w3-margin-bottom"
          type="text"
          maxLength={200}
          placeholder="Contact"
        />
        <input
          id="recrutementTitle"
          onChange={(e) => (recrutementInfos.adresse = e.target.value)}
          className="w3-input w3-border-0 w3-light-grey w3-round w3-margin-bottom"
          type="text"
          maxLength={200}
          placeholder="Adresse"
        />
        <input
          id="recrutementTitle"
          onChange={(e) => (recrutementInfos.psalarial = e.target.value)}
          className="w3-input w3-border-0 w3-light-grey w3-round w3-margin-bottom"
          type="text"
          maxLength={200}
          placeholder="Prétention salariale"
        />
        <select
          onChange={(e) => recrutementInfos.niveauLangue.fr = e.target.value}
          className="input w3-block  w3-light-grey w3-round w3-block w3-text-black w3-medium  w3-border-0 w3-margin-bottom"
          style={{ paddingBlock: 8 }}
          defaultValue={'default'}
        >
          <option value={'default'} disabled={true}>
            Votre niveau de Français :
          </option>
          <option value={1}>
            1 sur 6 = A1 (Débutant)
          </option>
          <option value={2}>
            2 sur 6 = A2 (Intermédiaire)
          </option>
          <option value={3}>
            3 sur 6 = B1 (Pré-intermédiaire)
          </option>
          <option value={4}>
            4 sur 6 = B2 (Intermédiaire avancé)
          </option>
          <option value={5}>
            5 sur 6 = C1 (Avancé)
          </option>
          <option value={5}>
            5 sur 6 = C2 (Maîtrise)
          </option>
        </select>
        <input onChange={(e) => recrutementInfos.dactylot = e.target.value} type="checkbox" id="dactylo" name="dactylo" value={true} className="w3-margin-right" />
        <label for="dactylo">Je sais taper sans regarder le clavier</label>
        <div
          id="recrutementContent"
          contentEditable={true}
          className="w3-input w3-border-0 w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar"
          style={{
            height: 160,
            minWidth: "100%",
            marginTop: 16,
          }}
        >Parlez-nous de vos compétences et de vos expériences :</div>
        <div className="w3-container" style={{ padding: 0 }}>
          <div
            id="inputImage"
            onClick={() => inputImage.click()}
            className="w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center-v"
            style={{ height: 40, marginTop: 16, paddingInline: 24 }}
          >
            <FontAwesomeIcon className="w3-margin-right" icon={faImage} style={{ width: 16, height: 16 }} />
            ¬ Importer votre photo de CIN
          </div>

          <div style={{ padding: 0 }}>
            <div
              className="w3-display-container"
              id="showImageWrapper"
              style={{ display: "none", height: 120, width: 200 }}
            >
              <Image
                id="showImage"
                src={''}
                className="w3-display-middle w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center w3-overflow"
                height={120}
                width={200}
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
        <div className="w3-container" style={{ padding: 0 }}>
          <div
            id="inputCV"
            onClick={() => inputCV.click()}
            className="w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center-v"
            style={{ height: 40, marginTop: 16, paddingInline: 24 }}
          >
            <FontAwesomeIcon className="w3-margin-right" icon={faPaperclip} style={{ width: 16, height: 16 }} />
            ¬ Importer votre CV
          </div>

          <div style={{ padding: 0, marginTop: 16 }}>
            <div
              className="w3-display-container"
              id="showCVWrapper"
              style={{ display: "none", height: 200, width: 140 }}
            >
              <Image
                id="showCV"
                src={''}
                className="w3-display-middle w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center w3-overflow"
                height={200}
                width={140}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="w3-display-topright" style={{ padding: 4 }}>
                <div
                  onClick={cancelCVInsertion}
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
        {/* //pdf reader */}
        {/* <PdfReader /> */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => save("public")}
            className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
          >
            Postuler votre condidature{" "}
            <FontAwesomeIcon
              id="recrutementPublicIcon"
              className="w3-margin-left"
              icon={faArrowRight}
              style={{ width: 16, height: 16 }}
            />
            <FontAwesomeIcon
              id="recrutementPublicSpinner"
              className="w3-spin w3-margin-left"
              icon={faSpinner}
              style={{ width: 16, height: 16, display: "none" }}
            />
          </button>
          {/* <button
            onClick={() => save("draft")}
            className="w3-button w3-hover-black w3-border w3-border-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
            style={{ marginTop: 16 }}
          >
            Enregistrer comme brouillon
            <FontAwesomeIcon
              id="recrutementDraftSpinner"
              className="w3-spin w3-margin-left"
              icon={faSpinner}
              style={{ width: 16, height: 16, display: "none" }}
            />
          </button>
          <button
            id="deleteButton"
            onClick={() => supprimer(0)}
            className="w3-button w3-hover-red w3-border w3-border-red w3-text-red w3-round-xxlarge w3-block w3-flex w3-flex-center"
            style={{ marginTop: 16, display: 'none' }}
          >
            Supprimer le recrutement
          </button> */}
        </div>
      </div>

      {/* modal recrutement liste */}
      <div id="modalRecrutementListe" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
        <div
          className="w3-modal-content w3-card w3-round w3-overflow"
          style={{ maxWidth: 420, top: 32 }}
        >

          <div onClick={() => document.getElementById('modalRecrutementListe').style.display = 'none'} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>

          <div style={{ paddingInline: 16, paddingBlock: 16 }}>
            <input
              id="searchInput"
              className="input w3-border-0 w3-input w3-border w3-round-xxlarge"
              placeholder="Chercher un recrutement"
              type="text"
            />
          </div>
          <div style={{ height: '50vh', paddingInline: 12, marginBottom: 16 }} className="w3-overflow-scroll w3-noscrollbar">
            {
              recrutementListe
            }
          </div>

        </div>
      </div>
      {/* end modal recrutement liste */}

      {/* modal option */}
      <div id="modalOptionRecrutement" className="white-opacity w3-modal w3-round" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
        <div
          className="w3-modal-content w3-card-4 w3-animate-top w3-round w3-overflow"
          style={{ width: 320, marginTop: '20vh', paddingBlock: 8 }}
        >
          <div className="w3-flex-row w3-flex-center-v w3-padding">
            <button
              onClick={closeModalOptionRecrutement}
              style={{ paddingInline: 16, paddingBlock: 8 }}
              className="w3-round-xxlarge w3-border-0 w3-black w3-margin-right"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              onClick={afficher}
              style={{ paddingInline: 16, paddingBlock: 8 }}
              className="w3-round-xxlarge w3-black w3-border-0 w3-margin-right w3-flex-1"
            >
              Afficher
            </button>
            <button
              onClick={() => supprimer(1)}
              style={{ paddingInline: 16, paddingBlock: 8 }}
              className="w3-round-xxlarge w3-border-0 w3-red w3-flex-1"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
      {/* end modal warning */}
    </div>
  );
}

export default postuleRecrutement;
