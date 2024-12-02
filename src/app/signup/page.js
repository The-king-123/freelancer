'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckDouble,
    faEnvelope,
    faKey,
    faPhoneAlt,
    faSpinner,
    faTags,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import axios from "axios";
import { console_source as source } from "../data";
import Image from "next/image";
import Link from "next/link";

function page() {

    axios.defaults.withCredentials = true;

    const signupAuthElement = {
        fullname: "",
        email: "",
        password: "",
        contact: "",
        confirmed: false,
        designation: "acheteur",
        type: "signup",
        clicked: false
    };

    const fullnameRegister = (element) => {
        signupAuthElement.fullname = element.target.value;
        if (signupAuthElement.fullname.length > 3) {
            document.getElementById("fullnameAlert").className = "";
        } else {
            document.getElementById("fullnameAlert").className = "w3-text-red";
        }
    };
    const emailRegister = (element) => {
        signupAuthElement.email = element.target.value;
        if (signupAuthElement.email.includes("@")) {
            document.getElementById("emailAlert").className = "";
        } else {
            document.getElementById("emailAlert").className = "w3-text-red";
        }
    };
    const contactRegister = (element) => {
        signupAuthElement.contact = element.target.value;
        if (signupAuthElement.contact.length > 8) {
            document.getElementById("numberAlert").className = "";
        } else {
            document.getElementById("numberAlert").className = "w3-text-red";
        }
    };
    const passwordRegister = (element) => {
        signupAuthElement.password = element.target.value;
        if (signupAuthElement.password.length > 8) {
            document.getElementById("passwordAlert").className = "";
        } else {
            document.getElementById("passwordAlert").className = "w3-text-red";
        }
    };
    const designationRegister = (element) => {
        signupAuthElement.designation = element.target.value;
    };
    const passwordconfirm = (element) => {
        if (signupAuthElement.password == element.target.value) {
            signupAuthElement.confirmed = true;
        } else {
            signupAuthElement.confirmed = false;
        }
        if (signupAuthElement.confirmed) {
            document.getElementById("confirmAlert").className = "";
        } else {
            document.getElementById("confirmAlert").className = "w3-text-red";
        }
    };
    const createStarter = async (key) => {
        const request = {
            name: "_accrocher_",
            info:
                "Bonjour ! Je suis " +
                signupAuthElement.fullname +
                ", Que puis-je faire pour vous!?",
            key: key,
        };
        await setCSRFToken()
        await axios
            .post(source + "/_topic?xcode=_accrocher_", request)
            .then((res) => {
                console.log("Accrocher created successfully.");
                document.getElementById('freeLinkProfile').click()
            })
            .catch((e) => {
                console.error("failure", e);
            });
    };
    const generateRandomNumber = (length) => {
        let randomNumber = "";
        for (let i = 0; i < length; i++) {
            randomNumber += Math.floor(Math.random() * 10);
        }
        return randomNumber;
    };
    async function setCSRFToken() {
        try {
            // Fetch CSRF token from the server
            const response = await axios.get(source + "/csrf-token");
            // Set CSRF token as a default header for all future requests
            axios.defaults.headers.common["X-CSRF-TOKEN"] = response.data.csrfToken;
        } catch (error) {
            console.error("CSRF token fetch failed:", error);
        }
    }
    const signup = async () => {
        if (!signupAuthElement.clicked &&
            signupAuthElement.fullname.length > 3 &&
            signupAuthElement.email.includes("@") &&
            signupAuthElement.contact.length > 8 &&
            signupAuthElement.confirmed &&
            signupAuthElement.password.length > 8
        ) {
            signupAuthElement.clicked = true
            const key = generateRandomNumber(15);
            document.getElementById("spinner").style.display = "inline-block";
            await setCSRFToken()
            await axios
                .post(source + "/_auth", {
                    fullname: signupAuthElement.fullname,
                    email: signupAuthElement.email,
                    password: signupAuthElement.password,
                    contact: signupAuthElement.contact,
                    designation: signupAuthElement.designation,
                    key: key,
                    state: "loged_in",
                })
                .then(async (res) => {
                    if (res.data.exist) {
                        window.alert('Votre compte existe déjà, veuillez vous connecter.')
                        document.getElementById('freeLinkProfile').click()
                    } else {
                        if (res.data.key) {
                            await createStarter(res.data.key);
                        } else {
                            window.alert("Une erreur s'est produite, veuillez réessayer s'il vous plaît.")
                        }
                    }
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        }
    };

    useEffect(() => {

        if (document.getElementById('headerPageTitle')) {
            document.getElementById('headerPageTitle').innerText = ('Signup').toUpperCase()
          }

        document.onkeyup = async (e) => {
            if (e.key == "Enter") {
                signup();
            }
        };
        axios
            .get("/_auth")
            .then((res) => {
                if (res.data.logedin) {
                    document.location = "/";
                }
            })
            .catch((e) => {
                console.error("failure", e);
            });

    });
    return (
        <div className="w3-100vh w3-block" style={{ paddingTop: 42 }}>

            <Link href={'/profile'} style={{ display: 'none' }} id="freeLinkProfile" ></Link>
            <div className="w3-card w3-round w3-overflow w3-dark-grey" style={{ maxWidth: 420, marginInline: 'auto' }}>
                <div style={{ paddingBlock: 24 }} className="w3-center w3-flex w3-flex-center">
                    <span className="w3-padding-small w3-overflow w3-flex w3-flex-center">
                        <Image
                            className="w3-round"
                            id="imagePDP"
                            unoptimized
                            loading="lazy"
                            width={60}
                            height={60}
                            alt="App profile"
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                            src={
                                source +
                                "/images.php?w=720&h=720&zlonk=3733&zlink=160471339156947"
                            }
                        />
                    </span>
                    <span className="w3-padding w3-large">
                        S'inscrire
                    </span>
                </div>
                <div className="w3-block">
                    <div id="alert_connexion" className="w3-hide">
                        Adresse e-mail ou mot de passe incorrect...
                    </div>
                    <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                        <input
                            onChange={(e) => fullnameRegister(e)}
                            type="text"
                            className="input w3-black w3-round-xxlarge w3-block w3-medium w3-border-0"
                            placeholder="Nom complet"
                            id="fullname"
                            name="user_fullname"
                            required
                        />

                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 20 }}
                        >
                            <span
                                id="fullnameAlert"
                                
                            >
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                        <input
                            onChange={(e) => emailRegister(e)}
                            type="text"
                            className="input w3-black w3-round-xxlarge w3-block w3-medium  w3-border-0"
                            placeholder="Adresse e-mail"
                            id="email"
                            name="user_email"
                            required
                        />
                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 20 }}
                        >
                            <span id="emailAlert" >
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                        <input
                            onChange={(e) => contactRegister(e)}
                            type="number"
                            min={300000000}
                            max={399999999}
                            className="input w3-black w3-round-xxlarge w3-block w3-medium  w3-border-0"
                            placeholder="Numéro de téléphone"
                            id="number"
                            name="user_number"
                            required
                        />

                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 20 }}
                        >
                            <span
                                id="numberAlert"
                                
                            >
                                <FontAwesomeIcon icon={faPhoneAlt} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                        <select
                            onChange={(e) => designationRegister(e)}
                            id="designation"
                            className="input w3-block  w3-black w3-round-xxlarge w3-block w3-medium  w3-border-0"
                            style={{ paddingBlock: 8 }}
                        >
                            <option value="Acheteur">Acheteur</option>
                            <option value="Rédaction">Rédaction</option>
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
                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 20 }}
                        >
                            <span
                                id="numberAlert"
                                
                            >
                                <FontAwesomeIcon icon={faTags} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                        <input
                            onChange={(e) => passwordRegister(e)}
                            type="password"
                            className="input w3-black w3-round-xxlarge w3-block w3-medium  w3-border-0"
                            placeholder="Mot de passe"
                            id="password"
                            name="user_password"
                            required
                        />

                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 20 }}
                        >
                            <span
                                id="passwordAlert"
                                
                            >
                                <FontAwesomeIcon icon={faKey} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                        <input
                            onChange={(e) => passwordconfirm(e)}
                            type="password"
                            className="input w3-black w3-round-xxlarge w3-block w3-medium  w3-border-0"
                            placeholder="Confirmer"
                            id="confirm"
                            name="user_confirm"
                            required
                        />

                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 20 }}
                        >
                            <span
                                id="confirmAlert"
                                
                            >
                                <FontAwesomeIcon icon={faCheckDouble} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-center w3-dark-grey w3-flex w3-flex-center">
                        <div className="w3-margin w3-col l8 m8 s8">
                            <button
                                disabled={false}
                                onClick={signup}
                                className="transition w3-medium w3-block w3-button w3-round-xxlarge w3-yellow w3-hover-yellow"
                            >
                                Créer mon compte
                                <span
                                    className="w3-spin w3-margin-left"
                                    style={{ display: "none" }}
                                    id="spinner"
                                >
                                    <FontAwesomeIcon icon={faSpinner} />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;
