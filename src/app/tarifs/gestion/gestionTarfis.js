'use client'
import { console_source as source } from '@/app/data';
import { faArrowCircleUp, faArrowRight, faCheckCircle, faEdit, faEraser, faMoneyBill1, faSpinner } from '@fortawesome/free-solid-svg-icons'
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
    const [tarifsData, settarifsData] = useState([])
    const [displayTarifs, setdisplayTarifs] = useState('')
    const [accesses, setaccesses] = useState([])
    const [tarifInfo, settarifInfo] = useState({
        id: null,
        name: '',
        tarif: '',
        access: null,
        rang: 0,
        info: '_',
    })
    const access = { text: '', blocker: false }

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

    const opeAccordionTarif = (key) => {
        if (document.getElementById('accordionTarif' + key).style.display == 'none') {
            document.getElementById('accordionTarif' + key).style.display = 'block'
        } else {
            document.getElementById('accordionTarif' + key).style.display = 'none'
        }
    }

    const reloadTarifs = (tarifs) => {

        const filteredTarifs = tarifs.sort((a, b) => a.rang - b.rang).reverse()

        tarifsData.splice(0, tarifsData.length)

        filteredTarifs.forEach(element => {
            tarifsData.push(element)
        });

        var glitchTarif
        if (filteredTarifs.length > 0) {
            glitchTarif = filteredTarifs.map((tarif, key) => (
                <div id={'thisTarif' + key} key={key} className='w3-half' style={{ padding: 8 }}>
                    <div>
                        <div style={{ width: 20, height: 20, borderRadius: '10px 10px 10px 4px', marginBottom: 2 }} className={"w3-flex w3-flex-center w3-text-white w3-circle " + (tarifs.length <= 3 ? colors[key + 1] : colors[key])}>
                            {key + 1}
                        </div>
                    </div>
                    <div className='w3-light-grey w3-round'>
                        <div className={'w3-round w3-text-white ' + (tarifs.length <= 3 ? colors[key + 1] : colors[key])} style={{ paddingBlock: 12, paddingInline: 20 }}>
                            <div className='w3-big w3-medium w3-flex-row w3-flex-center-v'>
                                <div className='w3-flex-1 w3-pointer' onClick={() => opeAccordionTarif(key)}>{tarif.name}</div>
                                <div><FontAwesomeIcon className='w3-large w3-pointer' style={{ marginRight: 8 }} onClick={() => editTarif(tarif)} icon={faEdit} /> </div>
                                <div><FontAwesomeIcon className='w3-large w3-pointer' style={{ marginRight: -8 }} onClick={() => upRang(tarif, key)} icon={faArrowCircleUp} /> </div>
                            </div>
                            <div className='w3-medium w3-big w3-pointer' onClick={() => opeAccordionTarif(key)}>
                                {tarif.tarif}
                            </div>
                        </div>
                        <div id={'accordionTarif' + key} className='accordionTarif' style={{ padding: 16, display: 'none' }}>
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

    const emptyForme = () => {
        document.getElementById('tarifName').value = ''
        document.getElementById('tarifCore').value = ''
        document.getElementById('addAccessInput').value = ''

        tarifInfo.info = "_"
        tarifInfo.id = null
        tarifInfo.name = ''
        tarifInfo.tarif = ''
        tarifInfo.rang = 0
        tarifInfo.access = null
        access.text = ''

        document.getElementById('deleteButton').style.display = 'none'
        setaccesses([])
    }

    const saveTarif = async () => {
        if (tarifInfo.name.length > 3 && tarifInfo.tarif.length > 3 && accesses.length > 0) {

            if (tarifsData.length > 0) {
                if (!tarifInfo.id) {
                    tarifInfo.rang = tarifsData.sort((a, b) => a.rang - b.rang).reverse()[0].rang * 1 + 1
                }
            } else {
                tarifInfo.rang = 0
            }

            document.getElementById('tarifPublicSpinner').style.display = 'inline-block'
            document.getElementById('tarifPublicIcon').style.display = 'none'
            tarifInfo.access = JSON.stringify(accesses)
            const xcode = localStorage.getItem('x-code')
            if (tarifInfo.id) {
                await setCSRFToken()
                await axios
                    .patch(source + "/_tarifs/" + tarifInfo.id + "?xcode=" + xcode, tarifInfo)
                    .then((res) => {
                        if (res.data.logedin) {
                            emptyForme()
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

                        document.getElementById('tarifPublicSpinner').style.display = 'none'
                        document.getElementById('tarifPublicIcon').style.display = 'inline-block'
                    });

            } else {
                await setCSRFToken()
                await axios
                    .post(source + "/_tarifs?xcode=" + xcode, tarifInfo)
                    .then((res) => {
                        if (res.data.logedin) {
                            emptyForme()
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
            await setCSRFToken()
            await axios
                .post(source + "/_tarifs?xcode=" + xcode, tarifInfo)
                .then((res) => {
                    if (res.data.logedin) {
                        emptyForme()
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

    const upRang = async (data, key) => {

        const filteredTarifs = tarifsData.sort((a, b) => a.rang - b.rang).reverse()

        if (filteredTarifs[0].rang * 1 > data.rang * 1 && !access.blocker) {

            access.blocker = true
            document.getElementById('thisTarif' + key).className = 'w3-half w3-animate-fading'

            var targetData
            for (let i = 0; i < filteredTarifs.length; i++) {
                if (filteredTarifs[i].id == data.id) {
                    targetData = filteredTarifs[i - 1]
                }
            };

            const request = {
                name: data.name,
                tarif: data.tarif,
                access: data.access,
                rang: data.rang * 1 + 1,
                info: '_',
            }
            const targetRequest = {
                name: targetData.name,
                tarif: targetData.tarif,
                access: targetData.access,
                rang: data.rang * 1,
                info: '_',
            }

            const xcode = localStorage.getItem('x-code')
            await setCSRFToken()
            await axios
                .patch(source + "/_tarifs/" + data.id + "?xcode=" + xcode, request)
                .then(async (res) => {
                    if (res.data.logedin) {

                        await setCSRFToken()
                        await axios
                            .patch(source + "/_tarifs/" + targetData.id + "?xcode=" + xcode, targetRequest)
                            .then((res) => {
                                if (res.data.logedin) {
                                    reloadTarifs(res.data.data)
                                } else {
                                    if (document.getElementById('modalLogin')) {
                                        document.getElementById('modalLogin').style.display = 'block'
                                    }
                                }
                                access.blocker = false
                                document.getElementById('thisTarif' + key).className = 'w3-half'
                            })
                            .catch((e) => {
                                console.error("failure", e);
                                if (document.getElementById('modalLogin')) {
                                    document.getElementById('modalLogin').style.display = 'block'
                                }
                                document.getElementById('tarifPublicSpinner').style.display = 'none'
                                document.getElementById('tarifPublicIcon').style.display = 'inline-block'
                            });
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

    const editTarif = (data) => {
        tarifInfo.id = data.id
        tarifInfo.name = data.name
        tarifInfo.tarif = data.tarif
        tarifInfo.access = null
        tarifInfo.rang = data.rang * 1

        document.getElementById('tarifName').value = data.name
        document.getElementById('tarifCore').value = data.tarif
        document.getElementById('addAccessInput').value = ''

        access.text = ''
        setaccesses(JSON.parse(data.access))

        document.getElementById('deleteButton').style.display = 'block'

    }

    const deleteHandler = async () => {

        const xcode = localStorage.getItem("x-code");
        document.getElementById("confirmSpinner").style.display = "inline-block";
        await setCSRFToken();
        await axios
            .delete(source + "/_tarifs/" + tarifInfo.id + '?xcode=' + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    cancelHandler()
                    emptyForme()
                    reloadTarifs(res.data.data)
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
        document.getElementById("confirmSpinner").style.display = "none";
        document.getElementById("modalWarning").style.display = "none";
        document
            .getElementById("confirmWarning")
            .removeEventListener("click", deleteHandler);
        document
            .getElementById("cancelWarning")
            .removeEventListener("click", cancelHandler);
    };

    const supprimer = async () => {
        if (tarifInfo.id) {
            document.getElementById("modalWarning").style.display = "block";
            document.getElementById("textWarning").innerText = "Voulez vous vraiment supprimer ce Tarif ...";

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
                    document.getElementById('tarifMainCore').style.display = 'none'
                }
            })
            .catch((e) => {
                console.error("failure", e);
            });

    }, [])


    return (
        <div id='tarifMainCore'>
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
                <div className='w3-container' style={{ padding: 0 }}>
                    <div onClick={emptyForme} className='w3-right w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center' style={{ width: 26, height: 26 }}>
                        <FontAwesomeIcon icon={faEraser} />
                    </div>
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
            <div className='w3-container' style={{ padding: 0 }}>
                {displayTarifs}
            </div>
        </div>
    )
}

export default gestionTarfis