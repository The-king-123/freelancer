'use client'
import { faCubes, faMuseum, faPlus, faStickyNote } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Link from 'next/link'
import parse from "html-react-parser";
import React, { useEffect, useState } from 'react'
import { console_source as source } from '../data'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { getDatabase, ref, set, push, onValue } from "firebase/database";

function Notion() {

    // Firebase configuration
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    // Firebase configuration

    const [notionData, setnotionData] = useState([])

    const elementList = {
        p: `<p id='elementNumber00' class='placeholder w3-margin-bottom' data-placeholder='Écrivez votre texte ici...' contentEditable='true' style='min-height:24px'></p>`,
        div: `<div id='elementNumber00' class='placeholder w3-margin-bottom' data-placeholder='Ajoutez du contenu ici...' contentEditable='true' style='min-height:24px'></div>`,
        ul: `<div id='elementNumber00' class='w3-margin-bottom' style='padding-inline:16px'><ul id='listeNumber00'><li class='placeholder' data-placeholder='Élément de liste 1...' id='listeNumber00Child0' contentEditable='true' style='min-height:24px'></li></ul></div>`,
        ol: `<div id='elementNumber00' class='w3-margin-bottom' style='padding-inline:16px'><ol id='listeNumber00'><li class='placeholder' data-placeholder='Élément numéroté 1...' id='listeNumber00Child0' contentEditable='true' style='min-height:24px'></li></ol></div>`,
        h1: `<h1 id='elementNumber00' class='placeholder w3-margin-bottom' data-placeholder='Titre principal...' contentEditable='true' style='min-height:24px'></h1>`,
        h2: `<h2 id='elementNumber00' class='placeholder w3-margin-bottom' data-placeholder='Sous-titre...' contentEditable='true' style='min-height:24px'></h2>`,
        h3: `<h3 id='elementNumber00' class='placeholder w3-margin-bottom' data-placeholder='Sous-titre secondaire...' contentEditable='true' style='min-height:24px'></h3>`,
        h4: `<h4 id='elementNumber00' class='placeholder w3-margin-bottom' data-placeholder='Petit titre...' contentEditable='true' style='min-height:24px'></h4>`,
    }

    const [keeper, setkeeper] = useState(
        {
            nextListe: {
                blockKey: null,
                subBlockKey: null,
                state: false,
            },
            pageHashing: '',
            intervalIDPageSaving: '',
            pageID: null,
            lockAddNewPage: false,
        }
    )

    const [pageData, setpageData] = useState({
        pageName: 'Nouvelle page',
        lastModification: null,
        bloque: [],
        lock: false,
    })

    const [userInfo, setuserInfo] = useState({
        id: null,
        fullname: "",
        designation: "",
        key: "",
        acceptEditable: false,
        notionToLoad: null,
    });

    const [displayNotion, setdisplayNotion] = useState('')
    const [displayBloques, setdisplayBloques] = useState('')

    const openDropdown = (ID, IDW) => {
        const allDropContent = document.getElementsByClassName('w3-dropdown-content')
        const dropButton = document.getElementsByClassName('dropButton')
        for (let i = 0; i < allDropContent.length; i++) {
            if (allDropContent[i].id != ID) {
                allDropContent[i].className = allDropContent[i].className.replace(" w3-show", "");
                if (dropButton[i]) {
                    dropButton[i].className = dropButton[i].className.replace("w3-light-grey", "w3-dark-grey");
                }
            }
        }
        if (document.getElementById(ID)) {
            var x = document.getElementById(ID);
            if (x.className.indexOf("w3-show") == -1) {
                x.className += " w3-show";
                if (document.getElementById(ID + 'Wrapper')) {
                    document.getElementById(ID + 'Wrapper').className = document.getElementById(ID + 'Wrapper').className.replace("w3-dark-grey", "w3-light-grey")
                }
            } else {
                x.className = x.className.replace(" w3-show", "");
                if (document.getElementById(ID + 'Wrapper')) {
                    document.getElementById(ID + 'Wrapper').className = document.getElementById(ID + 'Wrapper').className.replace("w3-light-grey", "w3-dark-grey")
                }
            }
        }

    };

    const addNewListe = (key, blockKey, subBlockKey) => {
        if (key == 'Enter') {
            if (keeper.nextListe.blockKey == blockKey) {
                if (keeper.nextListe.state) {
                    pageData.bloque[blockKey].subElement.push(
                        {
                            content: '',
                        }
                    )
                    keeper.nextListe.blockKey = null;
                    keeper.nextListe.subBlockKey = null;
                    keeper.nextListe.state = false;
                    reloadElement()
                    setTimeout(() => {
                        if (document.getElementById('listeNumber' + blockKey + 'Child' + subBlockKey)) {
                            document.getElementById('listeNumber' + blockKey + 'Child' + subBlockKey).innerHTML = document.getElementById('listeNumber' + blockKey + 'Child' + subBlockKey).innerHTML.replace(/<br\s*\/?>/g, '').replace(/\n+$/g, '');
                        }
                        if (document.getElementById('listeNumber' + blockKey + 'Child' + (subBlockKey + 1))) {
                            document.getElementById('listeNumber' + blockKey + 'Child' + (subBlockKey + 1)).focus()
                        }
                    }, 100);
                } else {
                    keeper.nextListe.blockKey = blockKey
                    keeper.nextListe.subBlockKey = subBlockKey
                    keeper.nextListe.state = true
                }
            } else {
                keeper.nextListe.blockKey = blockKey
                keeper.nextListe.subBlockKey = subBlockKey
                keeper.nextListe.state = true
            }
        } else {
            keeper.nextListe.blockKey = null;
            keeper.nextListe.subBlockKey = null;
            keeper.nextListe.state = false;
        }
    }

    const deleteBlock = (key) => {
        pageData.bloque.splice(key, 1);
        openDropdown("bloqueNumber" + key)
        reloadElement()
    }

    const moveBlock = (key) => {

    }

    const blockValueTaker = (key) => {
        pageData.bloque[key].content = document.getElementById('elementNumber' + key).innerText;
    }
    const suBlockValueTaker = (key, k) => {
        pageData.bloque[key].subElement[k].content = document.getElementById('listeNumber' + key + 'Child' + k).innerText;
    }

    const reloadElement = () => {
        const themeLight = localStorage.getItem('theme') != 'dark' ? true : false
        const glitchBloque = pageData.bloque.map((bloque, key) => (
            <div
                key={key}
                className="w3-dropdown-click w3-block"
            >
                <div onContextMenu={(e) => { e.preventDefault(); openDropdown("bloqueNumber" + key); }} className='w3-margin-bottom'>
                    {/* elementEditable */}
                    {bloque.element == 'p' &&
                        <p id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Écrivez votre texte ici...' contentEditable='true' style={{ minHeight: 24 }}>
                            {bloque.content}
                        </p>
                    }
                    {bloque.element == 'div' &&
                        <div id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Ajoutez du contenu ici...' contentEditable='true' style={{ minHeight: 24 }}>
                            {bloque.content}
                        </div>
                    }
                    {bloque.element == 'h1' &&
                        <h1 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Titre principal...' contentEditable='true' style={{ minHeight: 24 }}>
                            {bloque.content}
                        </h1>
                    }
                    {bloque.element == 'h2' &&
                        <h2 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Sous-titre...' contentEditable='true' style={{ minHeight: 24 }}>
                            {bloque.content}
                        </h2>
                    }
                    {bloque.element == 'h3' &&
                        <h3 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Sous-titre secondaire...' contentEditable='true' style={{ minHeight: 24 }}>
                            {bloque.content}
                        </h3>
                    }
                    {bloque.element == 'h4' &&
                        <h4 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Petit titre...' contentEditable='true' style={{ minHeight: 24 }}>
                            {bloque.content}
                        </h4>
                    }
                    {bloque.element == 'ul' &&
                        <ul id={'elementNumber' + key} style={{ paddingInline: 24 }}>
                            {
                                bloque.subElement.map((subBloque, k) => (
                                    <li onKeyUp={() => suBlockValueTaker(key, k)} onKeyDown={(e) => addNewListe(e.key, key, k)} key={k} className='placeholder' data-placeholder={'Élément de liste ' + k + '...'} id={'listeNumber' + key + 'Child' + k} contentEditable='true' style={{ minHeight: 24 }}>
                                        {subBloque.content}
                                    </li>
                                ))
                            }

                        </ul>
                    }
                    {bloque.element == 'ol' &&
                        <ol id={'elementNumber' + key} style={{ paddingInline: 24 }}>
                            {
                                bloque.subElement.map((subBloque, k) => (
                                    <li onKeyUp={() => suBlockValueTaker(key, k)} onKeyDown={(e) => addNewListe(e.key, key, k)} key={k} className='placeholder' data-placeholder={'Élément numéroté ' + k + '...'} id={'listeNumber' + key + 'Child' + k} contentEditable='true' style={{ minHeight: 24 }}>
                                        {subBloque.content}
                                    </li>
                                ))
                            }

                        </ol>
                    }

                </div>
                <div
                    id={"bloqueNumber" + key}
                    className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-round w3-overflow-scroll w3-noscrollbar w3-container"}
                    style={{ minWidth: 360, padding: 8, marginTop: -16 }}
                >
                    {/* liste des options */}
                    <div onClick={() => deleteBlock(key)} className="w3-button w3-round" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div>Supprimer</div>
                        </div>
                    </div>
                    <div onClick={() => moveBlock(key)} className="w3-button w3-round" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div>Deplacer</div>
                        </div>
                    </div>
                </div>
            </div>
        ))

        setdisplayBloques(glitchBloque)
    }

    const addThisElement = (element) => {

        pageData.bloque.push(
            {
                element: element,
                content: '',
                subElement: (element == 'ol' || element == 'ul') ? [{
                    content: '',
                }] : null,
            }
        )
        reloadElement()
    }

    const removeLinks = (text) => {
        let step1 = text.replace(/<a[^>]*><u>/g, '').replace(/<a[^>]*>/g, '');
        let step2 = step1.replace(/<\/u><\/a>/g, '').replace(/<\/a>/g, '');
        return step2;
    };

    const convertLinks = (text) => {

        const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(?:\.[a-z]{2,})?(?:\/[^\s]*)?/g;
        return text.replace(urlRegex, (url) => {
            let href = url.startsWith('http') ? url : `https://${url}`;
            return `<a style="cursor:pointer" href="${href}" target="_blank"><u>${url}</u></a>`;
        });

    };

    const showOption = (id) => {
        console.log(id);
    }

    const generateRandomKey = (length, existingKeys) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let result = '';
        let isUnique = false;

        while (!isUnique) {
            result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            isUnique = !existingKeys.some(item => item.pageKey === result);
        }

        return result;
    }

    const savePage = () => {
        const chatRef = ref(database, 'notion/' + userInfo.key);
        const chatPush = push(chatRef)

        pageData.lastModification = Date.now();
        set(chatPush, pageData)
            .then(() => {

            })

            .catch((error) => {
                console.error('Error writing data:', error);
            });
    }

    const hashArray = async (array) => {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(array));

        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }


    const openPage = (page) => {

        onValue(ref(database, 'notion/' + page.pageID), (snapshot) => {

            if (snapshot.exists()) {
                const notion = snapshot.val();
                pageData.pageName = notion.pageName;
                pageData.bloque = notion.bloque ? notion.bloque : [];
                pageData.lock = notion.lock ? notion.lock : false;
                pageData.lastModification = notion.lastModification ? notion.lastModification : null,

                keeper.pageID = page.pageID

                // hashing content
                hashArray(pageData).then(hash => {
                    keeper.pageHashing = hash
                });

                document.getElementById('myPageTitle').innerText = notion.pageName;
                openDropdown("notionList")
                reloadElement()
            }
        }, (error) => {
            console.error("Error reading data:", error);
        });

    }

    const reloadNotionsList = (data) => {
        var glitchNotion
        if (data.length > 0) {
            glitchNotion = data.map((notion, key) => (
                <div key={key} onClick={() => openPage(notion)} className="w3-button w3-round w3-block w3-left-align w3-overflow w3-nowrap">
                    {notion.pageCore.pageName}
                </div>
            ))
        } else {
            glitchNotion = (
                <div style={{ padding: 8 }}>
                    <div className="w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                        <div style={{ paddingInline: 16 }}>
                            Vous n'avez créé aucune page.
                        </div>
                    </div>
                </div>
            )
        }
        setdisplayNotion(glitchNotion)

    }

    const fetchNotionListe = () => {

        onValue(ref(database, 'notion/'), (snapshot) => {

            if (snapshot.exists()) {
                const pages = []
                const notions = snapshot.val();

                notionData.splice(1, notionData.length);
                const sortedNotions = Object.entries(notions).sort(([, a], [, b]) => b.lastModification - a.lastModification)

                sortedNotions.map(([index, notion]) => {
                    pages.push({
                        pageID: index,
                        pageCore: notion,
                    });
                    notionData.push({
                        pageID: index,
                        pageCore: notion,
                    })
                });
                reloadNotionsList(pages)

            } else {
                reloadNotionsList([])
            }
        }, (error) => {
            console.error("Error reading data:", error);
        });
    }

    const autoSave = () => {
        keeper.intervalIDPageSaving = setInterval(() => {
            if (keeper.pageHashing != hashArray(pageData)) {
                
            }
        }, 3000);
    }

    useEffect(() => {

        if (localStorage.getItem('theme') != 'dark') {

            const elementGrey = document.getElementsByClassName('w3-black').length
            const elementWhite = document.getElementsByClassName('w3-dark-grey').length
            const backTransparent = document.getElementsByClassName('black-opacity').length
            for (let i = 0; i < elementGrey; i++) {
                const element = document.getElementsByClassName('w3-black')[0];
                if (element) {
                    element.className = element.className.replace('w3-black', 'w3-light-grey')
                }

            }
            for (let i = 0; i < elementWhite; i++) {
                const element = document.getElementsByClassName('w3-dark-grey')[0];
                if (element) {
                    element.className = element.className.replace('w3-dark-grey', 'w3-white')
                }

            }
            for (let i = 0; i < backTransparent; i++) {
                const element = document.getElementsByClassName('black-opacity')[0];
                if (element) {
                    element.className = element.className.replace('black-opacity', 'white-opacity')
                }

            }

            document.getElementById('htmlCore').style.display = 'block'
        }

        document.addEventListener('input', (event) => {
            const element = event.target;
            if (element.textContent.trim() === '') {
                element.innerHTML = ''; // Clean up artifacts
            }
        });

        document.addEventListener('keyup', (e) => {
            console.log(e.key);
            if (e.key == 'Alt') {
                openDropdown("notionList")
            }
        })

        const xcode = localStorage.getItem('x-code');
        axios
            .get(source + "/_auth?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {

                    userInfo.designation = res.data.user.designation;
                    userInfo.fullname = res.data.user.fullname;
                    userInfo.id = res.data.user.id;
                    userInfo.key = res.data.user.key;

                    if (res.data.user.key == "160471339156947" || res.data.user.key == "336302677822455") {
                        userInfo.acceptEditable = true;
                        userInfo.notionToLoad = res.data.user.key == "160471339156947" ? "160471339156947" : "336302677822455"
                    } else {
                        userInfo.notionToLoad = "160471339156947"
                        userInfo.acceptEditable = false;
                    }
                    fetchNotionListe()
                    document.getElementById('notionCore').style.display = 'block';
                } else {
                    userInfo.notionToLoad = "160471339156947"
                    userInfo.acceptEditable = false;
                    fetchNotionListe();
                }
            })
            .catch((e) => {
                console.error("failure", e);
                userInfo.notionToLoad = "160471339156947"
                userInfo.acceptEditable = false;
            });

    }, [])


    return (
        <div id='notionCore' style={{ position: 'relative', padding: 8 }}>
            {/* Button list des pages */}
            <div className='w3-flex-row w3-flex-center-v'>
                <div
                    className="w3-dropdown-click"
                >
                    <div onClick={() => openDropdown("notionList")} style={{ width: 32, height: 32 }} className='w3-yellow w3-round w3-hover-grey w3-flex w3-flex-center'>
                        <FontAwesomeIcon icon={faCubes} />
                    </div>
                    <div
                        id="notionList"
                        className="w3-dropdown-content w3-bar-block w3-card w3-round w3-overflow-scroll w3-noscrollbar"
                        style={{ left: 0, minWidth: 224, marginTop: 8, padding: 4, height: 'calc(100vh - 96px)' }}
                    >
                        {/* liste des pages */}
                        <div className="w3-button w3-hover-grey w3-round w3-block w3-yellow w3-margin-bottom">
                            <FontAwesomeIcon
                                className="w3-margin-right"
                                icon={faStickyNote}
                            />
                            Créer une page
                        </div>
                        {displayNotion}
                    </div>
                </div>
                <div id='myPageTitle' data-placeholder='Nouvelle page' className='w3-big w3-margin-left w3-flex-1 placeholder' contentEditable='true' style={{ minHeight: 24 }}>
                </div>
            </div>

            {/* Editable notion core */}
            <div className='w3-margin-top' id='editableNotionCore'>
                {displayBloques}
            </div>

            {/* add notion element */}
            <div style={{ marginTop: 64 }}>
                <div className='w3-black w3-round' style={{ padding: 6 }}>
                    <div
                        className="w3-dropdown-click"
                    >
                        <div onClick={() => openDropdown("elementList")} style={{ width: 28, height: 28 }} className='w3-dark-grey w3-round w3-flex w3-flex-center'>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div
                            id="elementList"
                            className="w3-dropdown-content w3-bar-block w3-black w3-round w3-overflow-scroll w3-noscrollbar w3-container"
                            style={{ left: -6, minWidth: 360, marginTop: 12, padding: 8 }}
                        >
                            {/* liste des elements */}
                            <div onClick={() => addThisElement('p')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        P
                                    </div>
                                    <div>Paragraphe</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('div')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        div
                                    </div>
                                    <div>Conteneur</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('ul')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        UL
                                    </div>
                                    <div>Liste a puce</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('ol')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        OL
                                    </div>
                                    <div>Liste numerote</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h1')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        H1
                                    </div>
                                    <div>Titre niveau 1</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h2')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        H2
                                    </div>
                                    <div>Titre niveau 2</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h3')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        H3
                                    </div>
                                    <div>Titre niveau 3</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h4')} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        H4
                                    </div>
                                    <div>Titre niveau 4</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div style={{ height: 200 }}>

                </div>
            </div>
        </div>
    )
}

export default Notion