'use client'
import { console_source as source } from '@/app/data';
import { faArrowRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect } from 'react'

function ToPremium(props) {

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const xcode = localStorage.getItem('x-code')
        axios
            .get(source + "/_links/" + props.slug + "/edit" + "?xcode=" + xcode)
            .then((res) => {
                console.log(res.data);

                if (res.data.logedin) {
                    if (res.data.linkexist) {
                        window.location = '/post/premium/' + res.data.link
                    } else {
                        if (document.getElementById('modalNotPremiumMembers')) {
                            document.getElementById('modalNotPremiumMembers').style.display = 'block'

                            document.getElementById('versMonTarifs').addEventListener('click', () => {
                                window.location = '/tarifs/' + res.data.owner
                            })
                            document.getElementById('closeButtonContactOwner').addEventListener('click', () => {
                                if (window.history.length > 0) {
                                    window.history.back()
                                } else {
                                    window.location = '/user/' + res.data.owner
                                }
                            })
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
                    className="w3-dark-grey w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
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
                            id='closeButtonContactOwner'
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
                            <div style={{ padding: 24 }} id='cardNotPremiumText'>
                            Ce contenu est payant. Pour y accéder, il est nécessaire de souscrire à une offre.
                            </div>
                            <div className="w3-center w3-dark-grey w3-flex w3-flex-center">
                                <div className="w3-margin w3-block" style={{paddingInline:16}}>
                                    <div
                                        id='versMonTarifs'
                                        className="transition w3-medium w3-text-yellow w3-button w3-block w3-round-xxlarge w3-light-grey"
                                    >
                                        <span id='buttonContactText'>Nos Tarifs</span>
                                        <FontAwesomeIcon className='w3-margin-left' icon={faArrowRight} />
                                    </div>
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