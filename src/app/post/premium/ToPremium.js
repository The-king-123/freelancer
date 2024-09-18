'use client'
import { console_source as source } from '@/app/data';
import { faArrowRight, faKey, faSpinner, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import slugify from 'slugify';

function ToPremium({ slug }) {

    const [premiumInfo, setpremiumInfo] = useState({
        password: null,
    })

    const confirm = async () => {

        const xcode = localStorage.getItem('x-code')
        await setCSRFToken();
        await axios
            .patch(source + "/_links?xcode=" + xcode, premiumInfo)
            .then((res) => {
                if (res.data.logedin) {
                    if (res.data.linkexist) {
                        if (codematch) {
                            window.location = '/post/premium/' + res.data.newlink
                        } else {
                            document.getElementById('alert_code').className = 'w3-text-red w3-opacity-min'
                        }
                    } else {
                        if (document.getElementById('modalNotPremiumMembers')) {
                            document.getElementById('modalNotPremiumMembers').style.display = 'block'
                        }
                    }
                } else {
                    if (document.getElementById('modalLogin')) {
                        document.getElementById('modalLogin').style.display = 'block'
                    }
                }
            })
            .catch((e) => {
                console.error("failure", e);
            });
    }

    useEffect(() => {
        const xcode = localStorage.getItem('x-code')
        axios
            .get(source + "/_auth?xcode=" + xcode)
            .then(async (res) => {
                if (res.data.logedin) {
                    document.getElementById('modalCodePremium').style.display = 'block'
                } else {
                    if (document.getElementById('modalLogin')) {
                        document.getElementById('modalLogin').style.display = 'block'
                    }
                }
            })
            .catch((e) => {
                console.error("failure", e);
                if (document.getElementById('modalLogin')) {
                    document.getElementById('modalLogin').style.display = 'block'
                }
                document.getElementById('profilCore').innerHTML = '';
            });
        // document.location = '/post/premium/' + slug;
    }, [])

    return (
        <div>
            {/* modal logedin */}
            <div
                id="modalCodePremium"
                className="w3-modal w3-noscrollbar"
                style={{ padding: 24, zIndex: 999999 }}
            >
                <div
                    className="w3-white w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
                    style={{
                        minHeight: 240,
                        paddingBlock: 8,
                        paddingInline: 0,
                        maxWidth: 320,
                    }}
                >
                    <div
                        className="w3-container"
                        style={{ paddingBlock: 0, paddingInline: 8 }}
                    >
                        <div
                            onClick={() => document.getElementById('modalCodePremium').style.display = 'none'}
                            className="w3-pointer w3-right w3-flex w3-flex-center"
                            style={{ width: 32, height: 32 }}
                        >
                            <FontAwesomeIcon
                                className='w3-text-light-grey w3-hover-text-black'
                                icon={faTimesCircle}
                                style={{ width: 20, height: 20 }}
                            />
                        </div>
                    </div>
                    <div className="w3-block w3-flex-column w3-flex-center">
                        <div className="w3-block">
                            <div id="alert_code" className="w3-hide">
                                Votre code est incorrect...
                            </div>
                            <div className="w3-padding w3-padding-bottom-0 w3-padding-top-0 w3-display-container w3-margin">
                                <input
                                    onChange={(e) => premiumInfo.password = e.target.value}
                                    type="password"
                                    className="input w3-light-grey w3-round-xxlarge w3-block w3-text-grey w3-medium"
                                    placeholder="Code premium"
                                    id="password"
                                    name="user_password"
                                    required
                                />

                                <div
                                    className="w3-black input-icon w3-display-right w3-circle w3-flex w3-flex-center"
                                    style={{ marginRight: 20 }}
                                >
                                    <span className="w3-text-yellow">
                                        <FontAwesomeIcon icon={faKey} />
                                    </span>
                                </div>
                            </div>
                            <div className="w3-center w3-white w3-flex w3-flex-center">
                                <div className="w3-margin w3-col l8 m8 s8">
                                    <button
                                        id="buttonConnexion"
                                        disabled={false}
                                        onClick={() => confirm()}
                                        className="transition w3-medium w3-text-yellow w3-block w3-button w3-round-xxlarge w3-black"
                                    >
                                        Confirmer
                                        <span
                                            className="w3-margin-left"
                                            id="iconConfirmPremium"
                                        >
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </span>
                                        <span
                                            className="w3-spin w3-margin-left"
                                            style={{ display: "none" }}
                                            id="spinnerPremium"
                                        >
                                            <FontAwesomeIcon icon={faSpinner} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*end modal code premium */}

            {/* modal not registered */}
            <div
                id="modalNotPremiumMembers"
                className="w3-modal w3-noscrollbar"
                style={{ padding: 24, zIndex: 999999 }}
            >
                <div
                    className="w3-white w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
                    style={{
                        minHeight: 240,
                        paddingBlock: 8,
                        paddingInline: 0,
                        maxWidth: 320,
                    }}
                >
                    <div
                        className="w3-container"
                        style={{ paddingBlock: 0, paddingInline: 8 }}
                    >
                        <div
                            onClick={() => document.getElementById('modalNotPremium').style.display = 'none'}
                            className="w3-pointer w3-right w3-flex w3-flex-center"
                            style={{ width: 32, height: 32 }}
                        >
                            <FontAwesomeIcon
                                className='w3-text-light-grey w3-hover-text-black'
                                icon={faTimesCircle}
                                style={{ width: 20, height: 20 }}
                            />
                        </div>
                    </div>
                    <div className="w3-block w3-flex-column w3-flex-center">
                        <div className="w3-block">
                            <div>
                                Vous n'êtes pas éligible pour accéder à ce contenu.
                            </div>
                            <div className="w3-center w3-white w3-flex w3-flex-center">
                                <div className="w3-margin w3-col l8 m8 s8">
                                    <button
                                        id="buttonConnexion"
                                        disabled={false}
                                        onClick={() => confirm()}
                                        className="transition w3-medium w3-text-yellow w3-block w3-button w3-round-xxlarge w3-black"
                                    >
                                        Revenir sur la page precedente ?

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*end modal logedin */}
        </div>
    )
}
export default ToPremium