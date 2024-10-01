'use client'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

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

    const [accesses, setaccesses] = useState([])
    const [accessInfo, setaccessInfo] = useState({
        id: null,
        name: '',
        tarif: '',
        access: null,
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

    const saveTarif = async () => {
        accessInfo.access = JSON.stringify(accesses) 
        console.log(accessInfo);
        const xcode = localStorage.getItem('x-code')
        await setCSRFToken()
        await axios
            .post(source + "/_tarifs?xcode=" + xcode, accessInfo)
            .then((res) => {
                if (res.data.saved) {
                    document.getElementById("user_password").value = "";
                    userInfo.password = "";
                    document.getElementById("spinnerSave").style.display = "none";
                    document.getElementById("info_text").className = "w3-hide";
                    document.getElementById("saved_text").className = "w3-xlarge w3-big w3-animate-top";
                    setTimeout(() => {
                        document.getElementById("info_text").className = "w3-xlarge w3-big w3-animate-top";
                        document.getElementById("saved_text").className = "w3-hide";
                    }, 3000);

                    document.getElementById('password_alert').className = 'w3-hide'
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

    return (
        <div style={{ padding: 8 }}>
            <input
                id="postVideo"
                className="w3-border-0 w3-flex-1 w3-block w3-input w3-light-grey w3-round"
                type="text"
                placeholder="Name du tarif"
                style={{
                    paddingInline: 12,
                    marginBottom: 16
                }}
            />
            <input
                id="postVideo"
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
                <button onClick={saveTarif} className='w3-button w3-black w3-round w3-right'>Sauvegarder le tarif</button>
            </div>
        </div>
    )
}

export default gestionTarfis