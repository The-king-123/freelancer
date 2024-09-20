'use client'
import { console_source as source } from '@/app/data';
import { faArrowRight, faKey, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function ToPremium(props) {

    axios.defaults.withCredentials = true;

    const [premiumInfo, setpremiumInfo] = useState({
        password: null,
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

    const confirm = async () => {

        document.getElementById('iconConfirmPremium').style.display = 'none'
        document.getElementById('spinnerPremium').style.display = 'inline-block'

        const xcode = localStorage.getItem('x-code')
        await setCSRFToken();
        await axios
            .get(source + "/_links/" + props.slug + "?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    if (res.data.linkexist) {
                            window.location = '/post/premium/' + res.data.newlink
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
                document.getElementById('iconConfirmPremium').style.display = 'inline-block'
                document.getElementById('spinnerPremium').style.display = 'none'
            })
            .catch((e) => {
                console.error("failure", e);
                document.getElementById('iconConfirmPremium').style.display = 'inline-block'
                document.getElementById('spinnerPremium').style.display = 'none'
            });
    }

    useEffect(() => {
        console.log(props.slug);

        const xcode = localStorage.getItem('x-code')
        axios
            .get(source + "/_links/" + props.slug + "?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    if (res.data.linkexist) {
                            window.location = '/post/premium/' + res.data.newlink
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
                document.getElementById('iconConfirmPremium').style.display = 'inline-block'
                document.getElementById('spinnerPremium').style.display = 'none'
            })
            .catch((e) => {
                console.error("failure", e);
                if (document.getElementById('modalLogin')) {
                    document.getElementById('modalLogin').style.display = 'block'
                }
            });

        // document.location = '/post/premium/' + slug;
    }, [])

    return (
        <div>

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
                            onClick={() => document.getElementById('modalNotPremiumMembers').style.display = 'none'}
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
                            <div style={{ padding: 24 }}>
                                Vous n'êtes pas éligible pour accéder à ce contenu.
                            </div>
                            <div className="w3-center w3-white w3-flex w3-flex-center">
                                <div className="w3-margin">
                                    <button
                                        disabled={false}
                                        onClick={() => window.history.back()}
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