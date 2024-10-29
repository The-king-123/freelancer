'use client'
import { faCheck, faKey, faShieldAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import React, { useEffect } from 'react'
import { console_source as source } from '../data';

function Security() {

    axios.defaults.withCredentials = true;

    const updateAuthElement = {
        email: "",
        cpassword: "",
        npassword: "",
        rpassword: "",
        type: "updatepassword",
    };

    const cpasswordRegister = (element) => {
        updateAuthElement.cpassword = element.target.value;
    };
    const npasswordRegister = (element) => {
        updateAuthElement.npassword = element.target.value;
    };
    const rpasswordRegister = (element) => {
        updateAuthElement.rpassword = element.target.value;
    };
    const updatePassword = async () => {
        if (updateAuthElement.npassword.length < 8) {
            document.getElementById("npw_alert").className =
                "w3-text-red w3-small";
        } else if (updateAuthElement.rpassword != updateAuthElement.npassword) {
            document.getElementById("npw_alert").className = "w3-hide";
            document.getElementById("rpw_alert").className =
                "w3-text-red w3-small";
        } else {
            document.getElementById("npw_alert").className = "w3-hide";
            document.getElementById("rpw_alert").className = "w3-hide";
            document.getElementById("spinnerUpdate").style.display =
                "inline-block";

            const xcode = localStorage.getItem('x-code')
            await axios
                .patch(source + "/_auth/updatepassword?xcode=" + xcode, updateAuthElement)
                .then((res) => {
                    if (res.data.updated) {
                        document.getElementById("spinnerUpdate").style.display =
                            "none";
                        window.location.reload()
                    } else if (res.data.cause == "notmutch") {
                        document.getElementById("spinner").style.display =
                            "none";
                        document.getElementById("cpw_alert").className =
                            "w3-text-red w3-small";
                    }
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        }
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

    useEffect(() => {

        const xcode = localStorage.getItem('x-code');
        axios
            .get(source + "/_auth?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    updateAuthElement.email = res.data.user.email
                    document.getElementById('securityCore').style.display = 'block';
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

    }, [])

    return (
        <div id='securityCore' style={{ display: 'none' }}>
            <div
                style={{ padding: 8 }}
            >

                <div style={{ paddingBlock: 24 }}>
                    <div id="pass_text" className="w3-hide">
                        Mot de passe modifié !
                    </div>
                    <div
                        id="auth_text"
                        className="w3-xlarge w3-big text-violet"
                    >
                        Paramètre d'authentification
                    </div>
                    <div
                        className={
                            "w3-round-xlarge content-bar bg-violet"
                        }
                    >
                        {" "}
                    </div>
                    <div className="w3-medium w3-text-grey w3-margin-top">
                        Pensez a changer regulierement votre mot de
                        passe des que vous trouveriez quelque chose
                        d'anormal
                    </div>
                </div>
                <form className="w3-block" id="cp_form">
                    <div style={{ paddingInline: 16 }}>
                        <div id="cpw_alert" className="w3-hide">
                            Une erreur s'est produite, veuillez vérifier votre mot de passe actuel...
                        </div>
                    </div>
                    <div
                        className="w3-display-container"
                        style={{ paddingBlock: 0 }}
                    >
                        <input
                            onChange={(e) => cpasswordRegister(e)}
                            type="password"
                            className="w3-border-0 w3-input input w3-black w3-round-xxlarge w3-block w3-text-grey w3-medium"
                            placeholder="Mot de passe actuel"
                            id="cpassword"
                            name="user_cp"
                            required
                        />
                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 3 }}
                        >
                            <span className="w3-text-white">
                                <FontAwesomeIcon icon={faKey} />
                            </span>
                        </div>
                    </div>
                    <div style={{ paddingInline: 16 }}>
                        <div style={{ paddingInline: 16 }}>
                            <div
                                id="npw_alert"
                                className="w3-hide"
                                style={{
                                    marginLeft: 8,
                                    marginBottom: -8,
                                }}
                            >
                                Le nouveau mot de passe doit contenir au moins 8 caractères...
                            </div>
                        </div>
                    </div>
                    <div
                        className="w3-display-container w3-margin-top"
                        style={{ paddingBlock: 0 }}
                    >
                        <input
                            onChange={(e) => npasswordRegister(e)}
                            type="password"
                            className="w3-border-0 w3-input input w3-black w3-round-xxlarge w3-block w3-text-grey w3-medium"
                            placeholder="Nouveau mot de passe"
                            id="npassword"
                            name="user_np"
                            required
                        />
                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 3 }}
                        >
                            <span className="w3-text-white">
                                <FontAwesomeIcon
                                    icon={faShieldAlt}
                                />
                            </span>
                        </div>
                    </div>
                    <div style={{ paddingInline: 16 }}>
                        <div style={{ paddingInline: 16 }}>
                            <div
                                id="rpw_alert"
                                className="w3-hide"
                                style={{
                                    marginLeft: 8,
                                    marginBottom: -8,
                                }}
                            >
                                Les deux mots de passe ne sont pas identiques...
                            </div>
                        </div>
                    </div>
                    <div
                        className="w3-display-container w3-margin-top"
                        style={{ paddingBlock: 0 }}
                    >
                        <input
                            onChange={(e) => rpasswordRegister(e)}
                            type="password"
                            className="w3-border-0 w3-input input w3-black w3-round-xxlarge w3-block w3-text-grey w3-medium"
                            placeholder="Confirmer le nouveau mot de passe"
                            id="rpassword"
                            name="user_rp"
                            required
                        />
                        <div
                            className="w3-light-grey input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                            style={{ marginRight: 3 }}
                        >
                            <span className="w3-text-white">
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                        </div>
                    </div>
                    <div className="w3-center w3-dark-grey w3-flex w3-flex-center">
                        <div className="w3-margin">
                            <div
                                style={{ paddingInline: 32 }}
                                onClick={() => updatePassword()}
                                className="transition w3-medium w3-button w3-round-xxlarge w3-text-white w3-light-grey w3-margin-bottom"
                            >
                                Changer le mot de passe

                                <FontAwesomeIcon
                                    id='spinnerUpdate'
                                    style={{ display: "none" }}
                                    className='w3-spin w3-margin-left'
                                    icon={faSpinner}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Security