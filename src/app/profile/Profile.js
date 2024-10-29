'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { console_source as source } from '../data';
import axios from 'axios';

function Profile() {
  axios.defaults.withCredentials = true;

  const [imagePDProfil, setimagePDProfil] = useState(source + "/images.php?w=100&h=100&zlonk=3733&zlink=160471339156947");
  const [inputImage, setinputImage] = useState(null)
  const [userInfo, setuserInfo] = useState({
    id: null,
    email: "",
    newemail: "",
    telephone: "",
    whatsapp: "",
    messenger: "",
    fullname: "",
    password: "",
    designation: "",
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

  const updateUserinfo = async () => {
    console.log(userInfo);
    
    if (userInfo.fullname.length < 3) {
      document.getElementById("fn_alert").className =
        "w3-text-red w3-small";
    } else if (
      userInfo.newemail != userInfo.email &&
      (!userInfo.newemail.includes("@") || userInfo.newemail.length < 7)
    ) {
      document.getElementById("email_alert").className = "w3-show";
      document.getElementById("email_alert").className =
        "w3-text-red w3-small";
    } else if (userInfo.telephone.length < 10) {
      document.getElementById("number_alert").className = "w3-show";
      document.getElementById("number_alert").className =
        "w3-text-red w3-small";
    } else if (
      userInfo.whatsapp.length < 10 && userInfo.whatsapp.length > 0 && userInfo.whatsapp != '_'
    ) {
      document.getElementById("whatsapp_alert").className = "w3-show";
      document.getElementById("whatsapp_alert").className =
        "w3-text-red w3-small";
    } else if (
      userInfo.messenger.length < 15 && userInfo.messenger.length > 0 && userInfo.messenger != '_'
    ) {
      document.getElementById("messenger_alert").className = "w3-show";
      document.getElementById("messenger_alert").className =
        "w3-text-red w3-small";
    } else if (userInfo.password.length < 8) {
      document.getElementById("password_alert").className = "w3-show";
      document.getElementById("password_alert").className =
        "w3-text-red w3-small";
    } else {
      document.getElementById("spinnerSave").style.display =
        "inline-block";

      userInfo.whatsapp = userInfo.whatsapp ? userInfo.whatsapp : '_'
      userInfo.messenger = userInfo.messenger ? userInfo.messenger : '_'
      userInfo.telephone = userInfo.telephone ? userInfo.telephone : '_'

      const xcode = localStorage.getItem('x-code')
      await setCSRFToken()
      await axios
        .patch(source + "/_contact/userinformation?xcode=" + xcode, userInfo)
        .then((res) => {
          if (res.data.saved) {
            document.getElementById("user_password").value = "";
            userInfo.password = "";
            document.getElementById("spinnerSave").style.display = "none";
            document.getElementById("info_text").className = "w3-hide w3-small";
            document.getElementById("saved_text").className = "w3-xlarge w3-big w3-animate-top";
            document.getElementById('notificationSuccess').style.display = 'block'
            setTimeout(() => {
              document.getElementById("info_text").className = "w3-xlarge w3-big w3-animate-top";
              document.getElementById("saved_text").className = "w3-hide w3-small";
              document.getElementById('notificationSuccess').style.display = 'none'
            }, 3000);

            document.getElementById('password_alert').className = 'w3-hide w3-small'
          } else if (!res.data.password) {
            document.getElementById("password_alert").className = "w3-show";
            document.getElementById("password_alert").className = "w3-text-red w3-small";
            document.getElementById("spinnerSave").style.display = "none";
          } else {
            alert(
              "Une erreur s'est produite. Veuillez réessayer ultérieurement."
            );
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });
    }
  };

  useEffect(() => {

    const xcode = localStorage.getItem('x-code');
    axios
      .get(source + "/_auth?xcode=" + xcode)
      .then((res) => {
        if (res.data.logedin) {

          userInfo.email = res.data.user.email;
          userInfo.fullname = res.data.user.fullname;
          userInfo.id = res.data.user.id;
          userInfo.key = res.data.user.key;
          userInfo.newemail = res.data.user.email;
          userInfo.telephone =
            res.data.user.contact.length > 12
              ? JSON.parse(res.data.user.contact).telephone
              : res.data.user.contact;
          userInfo.whatsapp =
            res.data.user.contact.length > 12
              ? JSON.parse(res.data.user.contact).whatsapp
              : "";
          userInfo.messenger =
            res.data.user.contact.length > 12
              ? JSON.parse(res.data.user.contact).messenger
              : "";
          userInfo.designation = res.data.user.designation;

          document.getElementById("fullname").value =
            userInfo.fullname;
          document.getElementById("email").value = userInfo.email;
          document.getElementById("number").value =
            userInfo.telephone.length > 3 ? userInfo.telephone : '';
          document.getElementById("whatsapp").value =
            userInfo.whatsapp.length > 3 ? userInfo.whatsapp : '';
          document.getElementById("messenger").value =
            userInfo.messenger.length > 3 ? userInfo.messenger : '';
          document.getElementById("designation").value =
            userInfo.designation;

          setimagePDProfil(source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + res.data.user.key);

          if (res.data.user.key == "160471339156947") {
            document.getElementById('designationWrapper').innerHTML = ''
            document.getElementById("imagePDProfil").className =
              "w3-overflow w3-display-container";
          }

          document.getElementById('profilCore').style.display = 'block';
        } else {
          if (document.getElementById('modalLogin')) {
            document.getElementById('modalLogin').style.display = 'block'
          }
          document.getElementById('profilCore').innerHTML = '';

        }
      })
      .catch((e) => {
        console.error("failure", e);
        if (document.getElementById('modalLogin')) {
          document.getElementById('modalLogin').style.display = 'block'
        }
        document.getElementById('profilCore').innerHTML = '';
      });

    var inputimagePDProfil = document.createElement("input");
    inputimagePDProfil.type = "file";
    inputimagePDProfil.accept = "image/*";

    inputimagePDProfil.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("media", file);

      reader.onload = async (readerEvent) => {
        document.getElementById("imagePDProfilSpinner").style.display = "flex";
        var content = readerEvent.target.result;
        setimagePDProfil(content);


        await setCSRFToken()
        await axios
          .post(source + "/_auth?xcode=" + xcode, formData)
          .then((res) => {
            if (res.data.logedin) {
              if (res.data.uploaded) {
                document.getElementById(
                  "imagePDProfilSpinner"
                ).style.display = "none";
              } else {
                setimagePDProfil(source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + userInfo.key)
                window.alert(
                  "Profile picture not changed, something want wrong..."
                );
              }
            } else {
              if (document.getElementById('modalLogin')) {
                document.getElementById('modalLogin').style.display = 'block'
              }
              document.getElementById('profilCore').innerHTML = '';
            }
          })
          .catch((e) => {
            console.error("failure", e);
            setimagePDProfil(source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + userInfo.key)
            document.getElementById(
              "imagePDProfilSpinner"
            ).style.display = "none";
            window.alert(
              "Profile picture not changed, something want wrong..."
            );
          });
      };
    };
    setinputImage(inputimagePDProfil)
  }, [])

  return (
    <div id='profilCore' style={{ display: 'none' }}>
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
            alt='user PDP'
            onClick={() => inputImage.click()}
            id="imagePDProfil"
            width={100}
            height={100}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="w3-display-middle"
            src={imagePDProfil}
          />
          <div
            id="imagePDProfilSpinner"
            className="w3-display-middle w3-light-grey-semitransparent w3-flex w3-flex-center"
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
          <div id="saved_text" className="w3-hide w3-small">
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
                className="w3-hide w3-small"
                style={{
                  marginLeft: 8,
                  marginBottom: -8,
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
              onChange={(e) => userInfo.fullname = e.target.value}
              type="text"
              className="w3-input w3-black w3-round w3-text-grey w3-block w3-border-0"
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
                className="w3-hide w3-small"
                style={{
                  marginLeft: 8,
                  marginBottom: -8,
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
              onChange={(e) => userInfo.newemail = e.target.value}
              type="email"
              className="w3-input w3-black w3-round w3-text-grey w3-block w3-border-0"
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
                className="w3-hide w3-small"
                style={{
                  marginLeft: 8,
                  marginBottom: -8,
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
              onChange={(e) => userInfo.telephone = e.target.value}
              type="number"
              className="w3-input w3-black w3-round w3-text-grey w3-block w3-border-0"
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
                className="w3-hide w3-small"
                style={{
                  marginLeft: 8,
                  marginBottom: -8,
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
              onChange={(e) => userInfo.whatsapp = e.target.value}
              type="number"
              className="w3-input w3-black w3-round w3-text-grey w3-block w3-border-0"
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
                className="w3-hide w3-small"
                style={{
                  marginLeft: 8,
                  marginBottom: -8,
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
              onChange={(e) => userInfo.messenger = e.target.value}
              type="text"
              className="w3-input w3-black w3-round w3-text-grey w3-block w3-border-0"
              placeholder="Lien Messenger"
              id="messenger"
              name="user_messenger"
              required
            />
          </div>

          <div
            id='designationWrapper'
            style={{ marginTop: 8 }}
          >
            <select
              onChange={(e) => userInfo.designation = e.target.value}
              id="designation"
              className="w3-input w3-black w3-round w3-text-grey w3-block w3-border-0"
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

      <div style={{ padding: 8 }}>
        <div
          id="password_alert"
          className="w3-hide w3-small"
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
            onChange={(e) => {
              userInfo.password = e.target.value
              document.getElementById('password_alert').className = 'w3-hide w3-small'
            }}
            type="password"
            className="input w3-round-xxlarge w3-block w3-text-grey w3-medium w3-border-0"
            placeholder="Entrer votre mot de passe"
            id="user_password"
            name="password"
            required
          />
        </div>
        <div id='notificationSuccess' style={{display:"none"}} className=''>
          Les modifications sont sauvegarder avec succès
        </div>
        <div
          onClick={updateUserinfo}
          className="w3-block transition w3-medium w3-button w3-round-xxlarge w3-yellow w3-margin-bottom"
        >
          Sauvegarder
          <span
            className="w3-spin-flash w3-margin-left"
            style={{ display: "none" }}
            id="spinnerSave"
          >
            <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default Profile