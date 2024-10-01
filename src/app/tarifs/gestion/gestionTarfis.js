'use client'
import { console_source as source } from '@/app/data';
import { faArrowRight, faCheckCircle, faMoneyBill1, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import React, { useEffect, useState } from 'react'


function gestionTarfis() {

    axios.defaults.withCredentials = true;

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
    const colors = [
        'w3-green',
        'w3-blue',
        'w3-amber',
        'w3-red',
        'w3-pink',
        'w3-purple',
    ]
    const [displayTarifs, setdisplayTarifs] = useState('')
    const [accesses, setaccesses] = useState([])
    const [tarifInfo, settarifInfo] = useState({
        id: null,
        name: '',
        tarif: '',
        access: null,
        rang: '_',
        info: '_',
    })
    const access = { text: '' }

    const addToAccess = (e) => {
        if (e.key == 'Enter') {
            if (access.text.length >= 3) {
                const list = [...accesses]
                list.push(access.text)
                document.getElementById('addAccessInput').value = ''
                setaccesses(list)
            }
        }
    }

    const removeFromAccess = (k) => {
        const list = [...accesses]
        list.splice(k, 1)
        setaccesses(list)
    }

    const reloadTarifs = (tarifs) => {

        var glitchTarif
        if (tarifs.length > 0) {
            glitchTarif = tarifs.map((tarif, key) => (
                <div key={key} className='w3-half' style={{ padding: 8 }}>
                    <div className='w3-light-grey w3-round'>
                        <div className={'w3-round w3-text-white ' + (tarifs.length <= 3 ? colors[key + 1] : colors[key])} style={{ paddingBlock: 16, paddingInline: 20 }}>
                            <div className='w3-big w3-medium'>
                                {tarif.name}
                            </div>
                            <div className='w3-medium w3-big'>
                                {tarif.tarif}
                            </div>
                        </div>
                        <div style={{ padding: 16 }}>
                            {
                                JSON.parse(tarif.access).map((acc, k) => (
                                    <div key={k} className={'w3-flex-row w3-flex-center-v ' + ((k >= JSON.parse(tarif.access).length - 1) ? '' : 'w3-border-bottom ')} style={{ paddingBlock: 10 }}>
                                        <FontAwesomeIcon className='w3-text-green' icon={faCheckCircle} style={{ marginRight: 6 }} /> {acc}
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>

            ))
        } else {
            glitchTarif = (<div style={{ padding: 8 }}>
                <div className="w3-border w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                    <div style={{ paddingInline: 16 }}>
                        Vous n'avez aucun tarif pour le moment...
                    </div>
                </div>
            </div>)
        }
        setdisplayTarifs(glitchTarif)
    }

    const saveTarif = async () => {
        if (tarifInfo.name.length > 3 && tarifInfo.tarif.length > 3 && accesses.length > 0) {
            document.getElementById('tarifPublicSpinner').style.display = 'inline-block'
            document.getElementById('tarifPublicIcon').style.display = 'none'
            tarifInfo.access = JSON.stringify(accesses)
            const xcode = localStorage.getItem('x-code')
            await setCSRFToken()
            await axios
                .post(source + "/_tarifs?xcode=" + xcode, tarifInfo)
                .then((res) => {
                    if (res.data.logedin) {
                        reloadTarifs(res.data.data)
                    } else {
                        if (document.getElementById('modalLogin')) {
                            document.getElementById('modalLogin').style.display = 'block'
                        }
                    }
                    document.getElementById('tarifPublicSpinner').style.display = 'none'
                    document.getElementById('tarifPublicIcon').style.display = 'inline-block'
                })
                .catch((e) => {
                    console.error("failure", e);
                    if (document.getElementById('modalLogin')) {
                        document.getElementById('modalLogin').style.display = 'block'
                    }

                    document.getElementById('tarifPublicSpinner').style.display = 'none'
                    document.getElementById('tarifPublicIcon').style.display = 'inline-block'
                });
        }
    }

    const supprimer = () => {

    }

    useEffect(() => {

        const xcode = localStorage.getItem('x-code');
        axios
            .get(source + "/_tarifs?xcode=" + xcode)
            .then((res) => {

                if (res.data.logedin) {
                    reloadTarifs(res.data.data)
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
            <div
                className="w3-medium w3-big w3-flex-row w3-flex-center-v"
                style={{ padding: 8 }}
            >
                <div className="w3-flex-row w3-flex-center-v w3-flex-1">
                    <FontAwesomeIcon
                        className="w3-margin-right"
                        icon={faMoneyBill1}
                        style={{ width: 24, height: 24 }}
                    />{" "}
                    Gérer vos tarifs
                </div>
            </div>
            <div style={{ padding: 8 }}>
                <input
                    onChange={(e) => tarifInfo.name = e.target.value}
                    id="tarifName"
                    className="w3-border-0 w3-flex-1 w3-block w3-input w3-light-grey w3-round"
                    type="text"
                    placeholder="Nom du tarif"
                    style={{
                        paddingInline: 12,
                        marginBottom: 16
                    }}
                />
                <input
                    onChange={(e) => tarifInfo.tarif = e.target.value}
                    id="tarifCore"
                    className="w3-border-0 w3-flex-1 w3-block w3-input w3-light-grey w3-round"
                    type="text"
                    placeholder="Tarif"
                    style={{
                        paddingInline: 12,
                        marginBottom: 16
                    }}
                />
                <div
                    className="w3-border-0 w3-block w3-light-grey w3-round"
                    style={{
                        marginBottom: 16
                    }}
                >
                    <div id='listOfAccess'>
                        {
                            accesses.map((accs, key) => (
                                <div onClick={() => removeFromAccess(key)} key={key} style={{ paddingTop: 8, paddingInline: 12 }}>
                                    <FontAwesomeIcon className='w3-text-green' style={{ marginRight: 6 }} icon={faCheckCircle} />{accs}
                                </div>
                            ))
                        }
                    </div>
                    <input
                        id="addAccessInput"
                        onKeyUp={(e) => addToAccess(e)}
                        onChange={(e) => access.text = e.target.value}
                        className="w3-border-0 w3-flex-1 w3-block w3-input w3-light-grey w3-round"
                        type="text"
                        placeholder="Ajouter les avantages ( Entrer pour ajouter )"
                        style={{
                            paddingInline: 12,
                            marginBottom: 16
                        }}
                    />
                </div>
                <div style={{ marginTop: 24, padding: 8 }}>
                    <button
                        onClick={saveTarif}
                        className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
                    >
                        Sauvegarder{" "}
                        <FontAwesomeIcon
                            id="tarifPublicIcon"
                            className="w3-margin-left"
                            icon={faArrowRight}
                            style={{ width: 16, height: 16 }}
                        />
                        <FontAwesomeIcon
                            id="tarifPublicSpinner"
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
                        Supprimer le tarif
                    </button>
                </div>
            </div>
            <div className='w3-container' style={{padding:0}}>
                {displayTarifs}
            </div>
        </div>
    )
}

export default gestionTarfis