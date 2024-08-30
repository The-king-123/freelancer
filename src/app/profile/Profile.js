import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React from 'react'
import { console_source as source } from '../data';

function Profile() {
  return (
    <div>
      <div
        style={{ padding: 8 }}
      >
        <div
          id="pdpWrapper"
          style={{
            width: 100,
            height: 100,
          }}
          className="w3-overflow w3-display-container w3-circle"
        >
          <Image
            // onClick={() => inputImage.click()}
            id="imagePDP"
            width={100}
            height={100}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="w3-display-middle"
            src={source + "/images.php?w=100&h=100&zlonk=3733&zlink=160471339156947"}
          />
          <div
            id="imagePDPSpinner"
            className="w3-display-middle w3-black-semitransparent w3-flex w3-flex-center"
            style={{
              width: 100,
              height: 100,
              display: "none",
            }}
          >
            <FontAwesomeIcon
              className="w3-spin w3-text-white"
              icon={faSpinner}
              style={{ width: 32, height: 32 }}
            />
          </div>
        </div>
        <div style={{ paddingBlock: 24 }}>
          <div id="saved_text" className="w3-hide">
            Modification sauvegardées.
          </div>
          <div
            id="info_text"
            className="w3-xlarge w3-big text-violet"
          >
            Information personnelle
          </div>
          <div
            className={
              "w3-round-xlarge content-bar bg-violet"
            }
          >
            {" "}
          </div>
          <div className="w3-medium w3-text-grey w3-margin-top">
            Mettez à jour vos informations afin que les
            autres utilisateurs puissent vous identifier
            et vous contacter facilement.
          </div>
        </div>
        <form className="w3-block" id="ui_form">
          <div style={{ paddingInline: 16 }}>
            <div style={{ paddingInline: 16 }}>
              <div
                id="fn_alert"
                className="w3-hide"
                style={{
                  marginLeft: 8,
                  marginTop: -8,
                  marginBottom: -16,
                }}
              >
                Votre nom ne peut contenir que les
                lettres A-Z et un espace.
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: 8 }}
          >
            <input
              type="text"
              className="w3-input w3-light-grey w3-round w3-text-grey w3-block w3-border-0"
              placeholder="Nom complet"
              id="fullname"
              name="user_fn"
              required
            />
          </div>
          <div style={{ paddingInline: 16 }}>
            <div style={{ paddingInline: 16 }}>
              <div
                id="email_alert"
                className="w3-hide"
                style={{
                  marginLeft: 8,
                  marginTop: -8,
                  marginBottom: -16,
                }}
              >
                Votre adresse e-mail est invalide.
                Veuillez vérifier...
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: 8 }}
          >
            <input
              type="email"
              className="w3-input w3-light-grey w3-round w3-text-grey w3-block w3-border-0"
              placeholder="Adresse e-mail"
              id="email"
              name="user_email"
              required
            />
          </div>
          <div style={{ paddingInline: 16 }}>
            <div style={{ paddingInline: 16 }}>
              <div
                id="number_alert"
                className="w3-hide"
                style={{
                  marginLeft: 8,
                  marginTop: -8,
                  marginBottom: -16,
                }}
              >
                Le numéro de téléphone doit
                comporter au moins 10 chiffres.
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: 8 }}
          >
            <input
              type="number"
              className="w3-input w3-light-grey w3-round w3-text-grey w3-block w3-border-0"
              placeholder="Numéro de téléphone"
              id="number"
              name="user_number"
              required
            />
          </div>

          <div style={{ paddingInline: 16 }}>
            <div style={{ paddingInline: 16 }}>
              <div
                id="whatsapp_alert"
                className="w3-hide"
                style={{
                  marginLeft: 8,
                  marginTop: -8,
                  marginBottom: -16,
                }}
              >
                Le numéro Whatsapp doit comporter au
                moins 10 chiffres.
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: 8 }}
          >
            <input
              type="number"
              className="w3-input w3-light-grey w3-round w3-text-grey w3-block w3-border-0"
              placeholder="Numéro Whatsapp"
              id="whatsapp"
              name="user_whatsapp"
              required
            />
          </div>
          <div style={{ paddingInline: 16 }}>
            <div style={{ paddingInline: 16 }}>
              <div
                id="messenger_alert"
                className="w3-hide"
                style={{
                  marginLeft: 8,
                  marginTop: -8,
                  marginBottom: -16,
                }}
              >
                Votre lien est trop court, veuillez
                vérifier.
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: 8 }}
          >
            <input
              type="text"
              className="w3-input w3-light-grey w3-round w3-text-grey w3-block w3-border-0"
              placeholder="Lien Messenger"
              id="messenger"
              name="user_messenger"
              required
            />
          </div>
          <div
            style={{ marginTop: 8 }}
          >
            <select
              id="designation"
              className="w3-input w3-light-grey w3-round w3-text-grey w3-block w3-border-0"
              style={{ paddingBlock: 8 }}
            >
              <option value="Acheteur">
                Acheteur
              </option>
              <option value="Rédaction">
                Rédaction
              </option>
              <option value="Graphisme & Design">
                Graphisme & Design
              </option>
              <option value="Marketing Digital">
                Marketing Digital
              </option>
              <option value="Développement Web & Tech">
                Développement Web & Tech
              </option>
              <option value="Vidéo & Animation">
                Vidéo & Animation
              </option>
              <option value="Traduction & Transcription">
                Traduction & Transcription
              </option>
              <option value="Consulting & Coaching">
                Consulting & Coaching
              </option>
              <option value="Services Administratifs">
                Services Administratifs
              </option>
              <option value="Audio & Musique">
                Audio & Musique
              </option>
            </select>
          </div>
        </form>
      </div>

      <div style={{padding:8}}>
        <div
          id="password_alert"
          className="w3-hide"
          style={{
            marginLeft: 8,
            marginTop: -8,
            marginBottom: -16,
          }}
        >
          Veuillez vérifier votre mot
          de passe.
        </div>
        <div style={{ paddingBlock: 16 }}>
          <input
            type="password"
            className="input w3-white w3-round-xxlarge w3-block w3-text-grey w3-medium"
            placeholder="Entrer votre mot de passe"
            id="user_password"
            name="password"
            required
          />
        </div>
        <div
          className="w3-block transition w3-medium w3-button w3-round-xxlarge w3-text-white w3-black w3-margin-bottom"
        >
          Sauvegarder
          <span
            className="w3-spin-flash w3-margin-left"
            style={{ display: "none" }}
            id="spinnerSave"
          >
            <FontAwesomeIcon icon={faSpinner} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default Profile