'use client'
import { faCubes, faLock, faLockOpen, faMuseum, faPlus, faSpinner, faStickyNote, faTags, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Link from 'next/link'
import parse from "html-react-parser";
import React, { useEffect, useState } from 'react'
import { console_source as source } from '../data'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";

function Notion() {

    axios.defaults.withCredentials = true;

    // Firebase configuration
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    // Firebase configuration

    const elementList = [
        {
            id: 'p',
            name: 'P',
            Title: 'Paragraphe',
        },
        {
            id: 'div',
            name: 'div',
            Title: 'Conteneur',
        },
        {
            id: 'ul',
            name: 'UL',
            Title: 'Liste à puce',
        },
        {
            id: 'il',
            name: 'LS',
            Title: 'Liste sans puce',
        },
        {
            id: 'ol',
            name: 'OL',
            Title: 'Liste numeroté',
        },
        {
            id: 'h1',
            name: 'H1',
            Title: 'Titre niveau 1',
        },
        {
            id: 'h2',
            name: 'H2',
            Title: 'Titre niveau 2',
        },
        {
            id: 'h3',
            name: 'H3',
            Title: 'Titre niveau 3',
        },
        {
            id: 'h4',
            name: 'H4',
            Title: 'Titre niveau 4',
        }
    ]

    const [singleCategoryInfo, setsingleCategoryInfo] = useState({
        id: null,
        name: null,
        type: "notion",
        state: "publique",
        info: {
            description: "_",
        },
    });
    const [notionData, setnotionData] = useState([])

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
            lockAutoSave: false,
            lockDelete: false,
        }
    )

    const [categoryListe, setcategoryListe] = useState(
        <div style={{ padding: 24 }} className='w3-center'>
            <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
        </div>
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
        selectedCategory: 'default',
    });

    const categoryInfo = {
        name: null,
        type: "notion",
        state: "publique",
        info: {
            description: "_",
        },
    };

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

    const addRemoveNewListe = (e, blockKey, subBlockKey) => {
        if (e.key == 'Enter') {
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
        } else if ((e.key == 'Delete' || e.key == 'Backspace') && e.target.innerText.trim() == "") {
            if (keeper.nextListe.blockKey == blockKey) {
                if (keeper.nextListe.state) {
                    pageData.bloque[blockKey].subElement.splice(keeper.nextListe.subBlockKey, 1)
                    if (pageData.bloque[blockKey].subElement.length <= 0) {
                        pageData.bloque.splice(blockKey, 1)
                    }
                    keeper.nextListe.blockKey = null;
                    keeper.nextListe.subBlockKey = null;
                    keeper.nextListe.state = false;
                    reloadElement()
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
        pageData.bloque[key].content = document.getElementById('elementNumber' + key).innerHTML;
    }

    const suBlockValueTaker = (key, k) => {
        pageData.bloque[key].subElement[k].content = document.getElementById('listeNumber' + key + 'Child' + k).innerHTML;
    }

    const reloadElement = () => {

        setdisplayBloques('')
        document.getElementById('myPageTitle').innerText = pageData.pageName;
        document.getElementById('myPageTitle').contentEditable = !pageData.lock && userInfo.acceptEditable

        const themeLight = localStorage.getItem('theme') != 'dark' ? true : false
        const glitchBloque = pageData.bloque.map((bloque, key) => (
            <div
                key={key}
                className="w3-dropdown-click w3-block"
            >
                <div onContextMenu={(e) => { e.preventDefault(); openDropdown("bloqueNumber" + key); }} className='w3-margin-bottom'>
                    {/* elementEditable */}
                    {bloque.element == 'p' &&
                        <p id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Écrivez votre texte ici...' contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                            {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(bloque.content))}
                        </p>
                    }
                    {bloque.element == 'div' &&
                        <div id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Ajoutez du contenu ici...' contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                            {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(bloque.content))}
                        </div>
                    }
                    {bloque.element == 'h1' &&
                        <h1 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Titre principal...' contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                            {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(bloque.content))}
                        </h1>
                    }
                    {bloque.element == 'h2' &&
                        <h2 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Sous-titre...' contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                            {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(bloque.content))}
                        </h2>
                    }
                    {bloque.element == 'h3' &&
                        <h3 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Sous-titre secondaire...' contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                            {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(bloque.content))}
                        </h3>
                    }
                    {bloque.element == 'h4' &&
                        <h4 id={'elementNumber' + key} onKeyUp={() => blockValueTaker(key)} className='placeholder' data-placeholder='Petit titre...' contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                            {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(bloque.content))}
                        </h4>
                    }
                    {bloque.element == 'ul' &&
                        <ul id={'elementNumber' + key} style={{ paddingInline: 24 }}>
                            {
                                bloque.subElement.map((subBloque, k) => (
                                    <li onKeyUp={() => suBlockValueTaker(key, k)} onKeyDown={(e) => addRemoveNewListe(e, key, k)} key={k} className='placeholder' data-placeholder={'Élément de liste ' + k + '...'} id={'listeNumber' + key + 'Child' + k} contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                                        {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(subBloque.content))}
                                    </li>
                                ))
                            }

                        </ul>
                    }
                    {bloque.element == 'il' &&
                        <ul id={'elementNumber' + key} style={{ paddingInline: 24, listStyleType: 'none' }}>
                            {
                                bloque.subElement.map((subBloque, k) => (
                                    <li onKeyUp={() => suBlockValueTaker(key, k)} onKeyDown={(e) => addRemoveNewListe(e, key, k)} key={k} className='placeholder' data-placeholder={'Élément de liste ' + k + '...'} id={'listeNumber' + key + 'Child' + k} contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                                        {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(subBloque.content))}
                                    </li>
                                ))
                            }

                        </ul>
                    }
                    {bloque.element == 'ol' &&
                        <ol id={'elementNumber' + key} style={{ paddingInline: 24 }}>
                            {
                                bloque.subElement.map((subBloque, k) => (
                                    <li onKeyUp={() => suBlockValueTaker(key, k)} onKeyDown={(e) => addRemoveNewListe(e, key, k)} key={k} className='placeholder' data-placeholder={'Élément numéroté ' + k + '...'} id={'listeNumber' + key + 'Child' + k} contentEditable={!pageData.lock && userInfo.acceptEditable} style={{ minHeight: 24 }}>
                                        {userInfo.acceptEditable && !pageData.lock ? parse(bloque.content) : parse(convertLinks(subBloque.content))}
                                    </li>
                                ))
                            }
                        </ol>
                    }

                </div>
                <div
                    id={"bloqueNumber" + key}
                    className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-round w3-overflow-scroll w3-noscrollbar w3-container"}
                    style={{ minWidth: 360, padding: 4, marginTop: -16 }}
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

        setTimeout(() => {
            const element = document.getElementById('editableNotionCore');

            if (element) {
                const tempTextArea = document.createElement("textarea");
                tempTextArea.value = element.innerText;

                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand("copy");
                document.body.removeChild(tempTextArea);
                console.log("Content copied to clipboard!");
            }
        }, 500);
        setTimeout(() => {
            setdisplayBloques(glitchBloque)
        }, 1);


    };

    const addThisElement = (element) => {

        pageData.bloque.push(
            {
                element: element,
                content: '',
                subElement: (element == 'ol' || element == 'ul' || element == 'il') ? [{
                    content: '',
                }] : null,
            }
        )
        reloadElement()
    };

    const convertLinks = (text) => {

        const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(?:\.[a-z]{2,})?(?:\/[^\s]*)?/g;
        return text.replace(urlRegex, (url) => {
            let href = url.startsWith('http') ? url : `https://${url}`;
            return `<a style="cursor:pointer" href="${href}" target="_blank"><u>${url}</u></a>`;
        });

    };

    const addNewPage = async () => {

        if (keeper.lockAddNewPage) return;

        keeper.lockAddNewPage = true;

        if (keeper.pageID && keeper.pageHashing != hashArray(pageData)) {
            await savePage();
        }

        const pageRef = ref(database, 'notion/' + userInfo.notionToLoad);
        const pagePush = push(pageRef)

        const newPage = {
            pageName: 'Nouvelle page',
            lastModification: Date.now(),
            bloque: [],
            lock: false,
        }

        await set(pagePush, newPage)
            .then(() => {
                pageData.bloque = newPage.bloque;
                pageData.pageName = newPage.pageName;
                pageData.lock = newPage.lock;
                pageData.lastModification = newPage.lastModification;

                keeper.pageID = pagePush.key;
                keeper.lockAddNewPage = false;

                reloadElement()
            })
            .catch((error) => {
                console.error('Error writing data:', error);
                keeper.lockAddNewPage = false;
            });
    };

    const hashArray = async (array) => {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(array));

        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

        return hashHex;
    };

    const savePage = async () => {
        pageData.lastModification = Date.now();
        await set(ref(database, 'notion/' + userInfo.notionToLoad + '/' + userInfo.selectedCategory + '/' + keeper.pageID), pageData).then(async () => {
            const newHash = await hashArray(pageData);
            keeper.pageHashing = newHash;
            keeper.lockAutoSave = false;
        });
    };

    const openPage = async (page) => {

        const newHash = await hashArray(pageData);

        if (keeper.pageID && keeper.pageHashing != newHash) await savePage();

        const pageRef = ref(database, 'notion/' + userInfo.notionToLoad + '/' + userInfo.selectedCategory + '/' + page.pageID);

        if (keeper.intervalIDPageSaving) {
            clearInterval(keeper.intervalIDPageSaving);
            keeper.intervalIDPageSaving = null;
        }

        setTimeout(() => {
            get(pageRef).then(async (snapshot) => {

                if (snapshot.exists() && !keeper.intervalIDPageSaving) {

                    const notion = snapshot.val();

                    pageData.pageName = notion.pageName.length > 0 ? notion.pageName : 'Nouvelle page';
                    pageData.bloque = notion.bloque ? notion.bloque : [];
                    pageData.lock = notion.lock ? notion.lock : false;
                    pageData.lastModification = notion.lastModification ? notion.lastModification : null;

                    if (userInfo.acceptEditable) {
                        if (pageData.lock) {
                            document.getElementById('iconLockPage').style.display = 'inline-block'
                            document.getElementById('iconOpenPage').style.display = 'none'
                            document.getElementById('addNotionElement').style.display = 'none'
                        } else {
                            document.getElementById('iconLockPage').style.display = 'none'
                            document.getElementById('iconOpenPage').style.display = 'inline-block'
                            document.getElementById('addNotionElement').style.display = 'block'
                        }
                    } else {
                        document.getElementById('iconLockPage').style.display = 'inline-block'
                        document.getElementById('iconOpenPage').style.display = 'none'
                        document.getElementById('addNotionElement').style.display = 'none'
                    }


                    if (keeper.pageID && window.innerWidth < 992) openDropdown("notionList");
                    keeper.pageID = page.pageID

                    // hashing content
                    await hashArray(pageData).then(async hash => {
                        keeper.pageHashing = hash;
                        if (!keeper.intervalIDPageSaving && userInfo.acceptEditable && !pageData.lock) await autoSave();
                    });
                    reloadElement();
                }
            }, (error) => {
                console.error("Error reading data:", error);
            });
        }, 500);


    };

    const openOption = (key) => {
        if (!userInfo.acceptEditable) return;
        const allNotionOption = document.getElementsByClassName('optionAllNotion');
        for (let i = 0; i < allNotionOption.length; i++) {
            const element = allNotionOption[i];

            if (element.id != ('notion#' + key + 'Option')) {
                element.style.display = 'none';
            }
        }
        if (document.getElementById('notion#' + key + 'Option')) {
            if (document.getElementById('notion#' + key + 'Option').style.display == 'none') {
                document.getElementById('notion#' + key + 'Option').style.display = 'flex';
            } else {
                document.getElementById('notion#' + key + 'Option').style.display = 'none';
            }
        }

    };

    const deleteNotion = (notion) => {
        document.getElementById("modalWarning").style.display = "block";
        document.getElementById("textWarning").innerText = "Voulez vous vraiment supprimer cette page ...";

        document
            .getElementById("confirmWarning")
            .addEventListener("click", deleteHandler.bind(null, { key: notion.key, notionID: notion.notionID }));
        document
            .getElementById("cancelWarning")
            .addEventListener("click", cancelHandler);
    };

    const deleteHandler = async (params) => {
        if (params.notionID == keeper.pageID) keeper.pageID = null;
        openOption(null);
        await set(ref(database, 'notion/' + userInfo.notionToLoad + '/' + userInfo.selectedCategory + '/' + params.notionID), null).then(async () => {
            cancelHandler();
        });
    };

    const cancelHandler = async () => {


        document.getElementById("modalWarning").style.display = "none";

        document
            .getElementById("confirmWarning")
            .removeEventListener("click", deleteHandler);
        document
            .getElementById("cancelWarning")
            .removeEventListener("click", cancelHandler);

    };

    const reloadNotionsList = (data) => {
        if (window.innerWidth > 992) {
            setTimeout(() => {
                data.map((notion, key) => {
                    if (document.getElementById('notion#' + notion.pageID)) {
                        document.getElementById('notion#' + notion.pageID).removeEventListener('click', openPage)
                        document.getElementById('notion#' + notion.pageID).addEventListener('click', openPage.bind(null, notion))
                    }
                })
            }, 500);
        } else {
            var glitchNotion
            if (data.length > 0) {
                glitchNotion = data.map((notion, key) => (
                    <div key={key} className='w3-flex-row w3-flex-center-v' style={{ maxWidth: 216 }}>
                        <div id={'notion#' + notion.pageID} onContextMenu={(e) => { e.preventDefault(); openOption(notion.pageID); }} onClick={() => openPage(notion)} className="w3-button w3-round w3-block w3-left-align w3-overflow w3-nowrap">
                            <di>{notion.pageCore.pageName}</di>
                        </div>
                        <div id={'notion#' + notion.pageID + 'Option'} onClick={() => deleteNotion(key, notion.pageID)} style={{ width: 32, height: 32, minWidth: 32, display: 'none' }} className='optionAllNotion w3-opacity-min w3-pointer w3-overflow w3-red w3-flex w3-flex-center w3-circle'><FontAwesomeIcon icon={faTrash} /></div>
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
    };

    const fetchNotionListe = () => {

        userInfo.selectedCategory = localStorage.getItem('notionCategory') ? localStorage.getItem('notionCategory') : 'default';
        onValue(ref(database, 'notion/' + userInfo.notionToLoad + '/' + userInfo.selectedCategory), (snapshot) => {
            if (snapshot.exists()) {
                const pages = []
                const notions = snapshot.val();

                notionData.splice(0, notionData.length);
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
                setTimeout(() => {
                    reloadNotionsList(pages)
                }, 500);
                if (!keeper.pageID) openPage(pages[0]);
                document.getElementById('addFirstNotion').style.display = 'none'
                document.getElementById('noPagesFound').style.display = 'none'
                document.getElementById('displayNotionWrapper').style.display = 'block'

            } else {
                if (userInfo.acceptEditable) {
                    document.getElementById('addFirstNotion').style.display = 'block'
                    document.getElementById('displayNotionWrapper').style.display = 'none'
                    document.getElementById('noPagesFound').style.display = 'none'
                } else {

                    document.getElementById('addFirstNotion').style.display = 'none'
                    document.getElementById('displayNotionWrapper').style.display = 'none'
                    document.getElementById('noPagesFound').style.display = 'block'
                }
            }
        }, (error) => {
            console.error("Error reading data:", error);
        });
    };

    const autoSave = async () => {

        keeper.intervalIDPageSaving = setInterval(async () => {
            if (document.getElementById('editableNotionCore')) {
                if (document.getElementById('myPageTitle')) {
                    pageData.pageName = document.getElementById('myPageTitle').innerText;
                }
                if (!keeper.lockAutoSave) {
                    keeper.lockAutoSave = true;
                    const newHash = await hashArray(pageData);
                    if (keeper.pageHashing != newHash) {
                        savePage();
                    } else {
                        keeper.lockAutoSave = false;
                    }
                }
            } else {
                clearInterval(keeper.intervalIDPageSaving);
            }

        }, 500);
    };

    const toggleLockPage = () => {
        if (userInfo.acceptEditable) {
            if (document.getElementById('iconLockPage').style.display == 'none') {
                document.getElementById('iconLockPage').style.display = 'inline-block'
                document.getElementById('iconOpenPage').style.display = 'none'
                document.getElementById('addNotionElement').style.display = 'none'
                pageData.lock = true;
                clearInterval(keeper.intervalIDPageSaving);
                reloadElement();
            } else {
                document.getElementById('iconLockPage').style.display = 'none'
                document.getElementById('iconOpenPage').style.display = 'inline-block'
                document.getElementById('addNotionElement').style.display = 'block'
                pageData.lock = false;
                autoSave();
                reloadElement();
            }
        }

    };

    const closeModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitleNotion").value = "";
        document.getElementById("modalCategoryNotion").style.display = "none";
    };

    const openModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitleNotion").value = "";
        document.getElementById("modalCategoryNotion").style.display = "block";
    };

    const reloadCategory = (data) => {
        const themeLight = localStorage.getItem('theme') != 'dark' ? true : false
        const glitchCategory = data.map((element, key) => (
            <div key={key} className={(themeLight ? 'w3-light-grey' : 'w3-dark') + " w3-flex-row w3-round w3-overflow w3-flex-center-v"} style={{ marginBlock: 4 }}>
                <div
                    className="w3-nowrap w3-flex-1 w3-overflow"
                    style={{ paddingInline: 8 }}
                >
                    {element.name}
                </div>
                <div
                    onClick={() => deleteCategory(element.id)}
                    className="w3-red w3-button w3-flex-center topicdelete"
                >
                    <FontAwesomeIcon className="w3-medium" icon={faTrash} />
                </div>
            </div>
        ));
        document.getElementById("categoryTitleNotion").value = "";
        setcategoryListe(glitchCategory);
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
    };

    const saveCategory = async () => {
        const xcode = localStorage.getItem('x-code')
        const request = {
            name: categoryInfo.name,
            type: categoryInfo.type + userInfo.notionToLoad,
            state: categoryInfo.state,
            info: JSON.stringify({
                description: categoryInfo.info.description.replace(
                    /\n/g,
                    "<br/>"
                ),
            }),
        };
        if (categoryInfo.name.length >= 3) {
            await setCSRFToken();
            await axios
                .post(source + "/_category?xcode=" + xcode, request)
                .then((res) => {
                    reloadCategory(res.data.data.reverse());
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        }

    };

    const deleteCategory = async (id) => {
        document.getElementById("modalWarning").style.display = "block";
        document.getElementById("textWarning").innerText = "Voulez vous vraiment supprimer cette categorie avec ses elements ...";

        const xcode = localStorage.getItem('x-code');
        const deleteHandler = async () => {
            document.getElementById("confirmSpinner").style.display = "inline-block";
            await axios
                .delete(source + "/_category/" + id + "?xcode=" + xcode)
                .then(async (res) => {
                    document.getElementById("confirmSpinner").style.display =
                        "none";
                    document.getElementById("modalWarning").style.display =
                        "none";

                    document
                        .getElementById("confirmWarning")
                        .removeEventListener("click", deleteHandler);
                    document
                        .getElementById("cancelWarning")
                        .removeEventListener("click", cancelHandler);


                    await set(ref(database, 'notion/' + userInfo.notionToLoad + '/' + userInfo.selectedCategory), null)
                    reloadCategory(res.data.data.reverse());
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        };

        const cancelHandler = () => {
            document.getElementById("modalWarning").style.display = "none";

            document
                .getElementById("confirmWarning")
                .removeEventListener("click", deleteHandler);
            document
                .getElementById("cancelWarning")
                .removeEventListener("click", cancelHandler);
        };

        document
            .getElementById("confirmWarning")
            .addEventListener("click", deleteHandler);
        document
            .getElementById("cancelWarning")
            .addEventListener("click", cancelHandler);
    };

    useEffect(() => {

        if (document.getElementById('headerPageTitle')) {
            document.getElementById('headerPageTitle').innerText = ('Notion').toUpperCase()
        }

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
            if (e.key == 'a') {
                if (e.altKey) {
                    openDropdown("notionList")
                }
            }
        })


        if (window.innerWidth < 992) {
            //ato ary eee
            document.getElementById('displayNotionListeWrapper').style.display = 'block';
        }

        document.getElementById('notionCategory').addEventListener('change', () => {
            setTimeout(() => {
                keeper.pageID = null;
                fetchNotionListe()
            }, 500);
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
                        document.getElementById('createManageButton').style.display = 'block';
                        userInfo.notionToLoad = res.data.user.key == "160471339156947" ? "160471339156947" : "336302677822455"
                    } else {
                        userInfo.notionToLoad = "160471339156947"
                        userInfo.acceptEditable = false;
                        document.getElementById('addNotionElement').innerHTML = ''
                    }

                    axios
                        .get(`${source}/_category/notion${userInfo.notionToLoad}?xcode=${xcode}`)
                        .then((res) => {
                            if (res.data.logedin) {
                                fetchNotionListe()
                                document.getElementById('notionCore').style.display = 'block';
                                reloadCategory(res.data.data.reverse())
                            }
                        })
                        .catch((e) => {
                            console.error("failure", e);
                        });

                } else {
                    userInfo.notionToLoad = "160471339156947"
                    userInfo.acceptEditable = false;
                    document.getElementById('addNotionElement').innerHTML = ''
                    fetchNotionListe();
                }
            })
            .catch((e) => {
                console.error("failure", e);
                userInfo.notionToLoad = "160471339156947"
                userInfo.acceptEditable = false;
                document.getElementById('addNotionElement').innerHTML = ''
            });

        const notionListeWrapper = document.getElementById('notionListeWrapper');
        const notionListe = document.getElementById('notionList');
        document.addEventListener('click', (event) => {
            if (!notionListeWrapper.contains(event.target)) {
                notionListe.className = notionListe.className.replace('w3-show', '');
            }
        })

    }, [])


    return (
        <div id='notionCore' style={{ position: 'relative', padding: 8 }}>
            {/* Button list des pages */}
            <div onClick={() => reloadNotionsList(notionData)} id='simulatorNotionReloader'></div>
            <div id='noPagesFound' style={{ display: 'none' }}>
                <div style={{ padding: 12 }} className="w3-round w3-block w3-black w3-margin-bottom">
                    Aucune page trouvée, veuillez revenir plus tard pour en consulter.
                </div>
            </div>

            <div id='addFirstNotion' style={{ display: 'none' }}>
                <div onClick={addNewPage} className="w3-button w3-hover-grey w3-round w3-block w3-yellow w3-margin-bottom">
                    <FontAwesomeIcon
                        className="w3-margin-right"
                        icon={faStickyNote}
                    />
                    Créer votre première page
                </div>
            </div>

            <div id='displayNotionWrapper' style={{ display: 'none' }}>
                <div className='w3-flex-row w3-flex-center-v'>
                    <div
                        id='notionListeWrapper'
                        className="w3-dropdown-click"
                    >
                        <div onClick={() => {
                            if (!userInfo.acceptEditable && window.innerWidth > 992) return;
                            if (!userInfo.acceptEditable && window.innerWidth < 992) document.getElementById('createManageButton').style.display = 'none';
                            openDropdown("notionList")
                        }}
                            style={{ width: 32, height: 32 }} className='w3-yellow w3-round w3-hover-grey w3-flex w3-flex-center'>
                            <FontAwesomeIcon icon={faCubes} />
                        </div>
                        <div
                            id="notionList"
                            className="w3-dropdown-content w3-bar-block w3-card w3-round w3-overflow-scroll w3-noscrollbar"
                            style={{ left: 0, minWidth: 224, marginTop: 8, padding: 4 }}
                        >
                            <div id='createManageButton' style={{ display: 'none' }}>
                                <div onClick={openModalCategory} style={{ marginBottom: 4 }} className="w3-left-align w3-button w3-hover-grey w3-round w3-block w3-yellow">
                                    <FontAwesomeIcon
                                        className="w3-margin-right"
                                        icon={faTags}
                                    />
                                    Gérer les catégories
                                </div>

                                <div onClick={addNewPage} className="w3-left-align w3-button w3-hover-grey w3-round w3-block w3-yellow">
                                    <FontAwesomeIcon
                                        className="w3-margin-right"
                                        icon={faStickyNote}
                                    />
                                    Créer une page
                                </div>
                            </div>
                            {/* liste des pages */}
                            <div id='displayNotionListeWrapper' className='w3-margin-bottom' style={{ display: 'none' }}>
                                {displayNotion}
                            </div>
                        </div>
                    </div>
                    <div id='myPageTitle' data-placeholder='Nouvelle page' className='w3-big w3-margin-left w3-flex-1 placeholder' contentEditable='true' style={{ minHeight: 24 }}>
                    </div>
                    <div onClick={() => toggleLockPage()} style={{ width: 32, height: 32 }} className='w3-pointer w3-border w3-round w3-flex w3-flex-center'>
                        <FontAwesomeIcon id='iconLockPage' className='w3-opacity' style={{ display: 'none' }} icon={faLock} />
                        <FontAwesomeIcon id='iconOpenPage' className='w3-text-yellow' icon={faLockOpen} />
                    </div>
                </div>

                {/* Editable notion core */}
                <div className='w3-margin-top w3-overflow-scroll w3-noscrollbar' id='editableNotionCore'>
                    {displayBloques}
                </div>

                {/* add notion element */}
                <div id='addNotionElement' style={{ marginTop: 64, display: 'none' }}>
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
                                {
                                    elementList.map((element, key) => (
                                        <div key={key} onClick={() => addThisElement(element.id)} className="w3-button w3-round w3-half" style={{ padding: 8 }}>
                                            <div className='w3-flex-row w3-flex-center-v'>
                                                <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                                    {element.name}
                                                </div>
                                                <div>{element.Title}</div>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                    <div style={{ height: 200 }}>

                    </div>
                </div>
            </div>
            {/* modal add new category */}
            <div id="modalCategoryNotion" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 48 }}
                >

                    <div onClick={closeModalCategory} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 32, height: 32, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <div className="w3-flex-row w3-flex-center-v" style={{ paddingInline: 16, paddingBlock: 24 }}>
                        <input
                            id="categoryTitleNotion"
                            onChange={(e) => categoryInfo.name = e.target.value}
                            className="w3-border-0 w3-input w3-border w3-round"
                            placeholder="Nom de la catégorie"
                            type="text"
                        />
                        <button
                            onClick={saveCategory}
                            className="w3-button w3-margin-left w3-round w3-dark-grey w3-light-grey w3-flex w3-flex-center"
                            style={{ height: 40 }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>

                    <div className="w3-padding w3-overflow-scroll w3-noscrollbar" style={{ height: '50vh' }}>
                        {categoryListe}
                    </div>
                </div>
            </div>
            {/* end modal add new category */}
        </div>
    )
}

export default Notion