'use client'
import { faCubes, faMuseum, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function Notion() {

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
            }
        }
    )

    const [pageData, setpageData] = useState({
        pageName: 'Nouveau Page',
        pageID: null,
        lastModification: '',
        bloque: [],
    })

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

    const reloadElement = () => {
        const glitchBloque = pageData.bloque.map((bloque, key) => (
            <div
                key={key}
                className="w3-dropdown-click w3-block"
            >
                <div onContextMenu={() => openDropdown("bloqueNumber" + key)} className='w3-margin-bottom'>
                    {/* elementEditable */}
                    {bloque.element == 'p' &&
                        <p id={'elementNumber' + key} className='placeholder' data-placeholder='Écrivez votre texte ici...' contentEditable='true' style={{ minHeight: 24 }}>
                            {convertLinks(bloque.content)}
                        </p>
                    }
                    {bloque.element == 'div' &&
                        <div id={'elementNumber' + key} className='placeholder' data-placeholder='Ajoutez du contenu ici...' contentEditable='true' style={{ minHeight: 24 }}>
                            {convertLinks(bloque.content)}
                        </div>
                    }
                    {bloque.element == 'h1' &&
                        <h1 id={'elementNumber' + key} className='placeholder' data-placeholder='Titre principal...' contentEditable='true' style={{ minHeight: 24 }}>
                            {convertLinks(bloque.content)}
                        </h1>
                    }
                    {bloque.element == 'h2' &&
                        <h2 id={'elementNumber' + key} className='placeholder' data-placeholder='Sous-titre...' contentEditable='true' style={{ minHeight: 24 }}>
                            {convertLinks(bloque.content)}
                        </h2>
                    }
                    {bloque.element == 'h3' &&
                        <h3 id={'elementNumber' + key} className='placeholder' data-placeholder='Sous-titre secondaire...' contentEditable='true' style={{ minHeight: 24 }}>
                            {convertLinks(bloque.content)}
                        </h3>
                    }
                    {bloque.element == 'h4' &&
                        <h4 id={'elementNumber' + key} className='placeholder' data-placeholder='Petit titre...' contentEditable='true' style={{ minHeight: 24 }}>
                            {convertLinks(bloque.content)}
                        </h4>
                    }
                    {bloque.element == 'ul' &&
                        <ul id={'elementNumber' + key} style={{ paddingInline: 24 }}>
                            {
                                bloque.subElement.map((subBloque, k) => (
                                    <li onKeyDown={(e) => addNewListe(e.key, key, k)} key={k} className='placeholder' data-placeholder={'Élément de liste ' + k + '...'} id={'listeNumber' + key + 'Child' + k} contentEditable='true' style={{ minHeight: 24 }}>
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
                                    <li onKeyDown={(e) => addNewListe(e.key, key, k)} key={k} className='placeholder' data-placeholder={'Élément numéroté ' + k + '...'} id={'listeNumber' + key + 'Child' + k} contentEditable='true' style={{ minHeight: 24 }}>
                                        {subBloque.content}
                                    </li>
                                ))
                            }

                        </ol>
                    }

                </div>
                <div
                    id={"bloqueNumber" + key}
                    className="w3-dropdown-content w3-bar-block w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar w3-container"
                    style={{ left: -6, minWidth: 360, marginTop: 12, padding: 8 }}
                >
                    {/* liste des elements  */}
                    <div onClick={() => addThisElement('p')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                P
                            </div>
                            <div>Paragraphe</div>
                        </div>
                    </div>
                    <div onClick={() => addThisElement('div')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                div
                            </div>
                            <div>Conteneur</div>
                        </div>
                    </div>
                    <div onClick={() => addThisElement('ul')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                UL
                            </div>
                            <div>Liste a puce</div>
                        </div>
                    </div>
                    <div onClick={() => addThisElement('ol')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                OL
                            </div>
                            <div>Liste numerote</div>
                        </div>
                    </div>
                    <div onClick={() => addThisElement('h1')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                H1
                            </div>
                            <div>Titre niveau 1</div>
                        </div>
                    </div>
                    <div onClick={() => addThisElement('h2')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                H2
                            </div>
                            <div>Titre niveau 2</div>
                        </div>
                    </div>
                    <div onClick={() => addThisElement('h3')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                H3
                            </div>
                            <div>Titre niveau 3</div>
                        </div>
                    </div>
                    <div onClick={() => addThisElement('h4')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                        <div className='w3-flex-row w3-flex-center-v'>
                            <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                H4
                            </div>
                            <div>Titre niveau 4</div>
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

    }, [])


    return (
        <div id='notionCore' style={{ position: 'relative', padding: 8 }}>
            {/* Button list des pages */}
            <div className='w3-flex-row w3-flex-center-v'>
                <div
                    className="w3-dropdown-click"
                >
                    <div onClick={() => openDropdown("notionList")} style={{ width: 32, height: 32 }} className='w3-yellow w3-round w3-flex w3-flex-center'>
                        <FontAwesomeIcon icon={faCubes} />
                    </div>
                    <div
                        id="notionList"
                        className="w3-dropdown-content w3-bar-block w3-card w3-round w3-overflow-scroll w3-noscrollbar"
                        style={{ left: 0, minWidth: 224, marginTop: 8, paddingBottom: 4, padding: 4, height: 'calc(100vh - 96px)' }}
                    >
                        {/* liste des pages  */}
                        <div className="w3-button w3-round w3-hover-white">
                            <FontAwesomeIcon
                                className="w3-margin-right"
                                icon={faMuseum}
                            />
                            Liste des pages
                        </div>

                    </div>
                </div>
                <div className='w3-big w3-margin-left w3-flex-1' contentEditable='true' style={{ minHeight: 24 }}>
                    Nouveau page
                </div>
            </div>

            {/* Editable notion core  */}
            <div className='w3-margin-top' id='editableNotionCore'>
                {displayBloques}
            </div>

            {/* add notion element */}
            <div className='w3-margin-top'>
                <div className='w3-black w3-round' style={{ padding: 6 }}>
                    <div
                        className="w3-dropdown-click"
                    >
                        <div onClick={() => openDropdown("elementList")} style={{ width: 28, height: 28 }} className='w3-dark-grey w3-round w3-flex w3-flex-center'>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div
                            id="elementList"
                            className="w3-dropdown-content w3-bar-block w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar w3-container"
                            style={{ left: -6, minWidth: 360, marginTop: 12, padding: 8 }}
                        >
                            {/* liste des elements  */}
                            <div onClick={() => addThisElement('p')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        P
                                    </div>
                                    <div>Paragraphe</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('div')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        div
                                    </div>
                                    <div>Conteneur</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('ul')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        UL
                                    </div>
                                    <div>Liste a puce</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('ol')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        OL
                                    </div>
                                    <div>Liste numerote</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h1')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        H1
                                    </div>
                                    <div>Titre niveau 1</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h2')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        H2
                                    </div>
                                    <div>Titre niveau 2</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h3')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
                                <div className='w3-flex-row w3-flex-center-v'>
                                    <div style={{ width: 28, height: 28, marginRight: 8 }} className='w3-border w3-flex w3-small w3-flex-center w3-round'>
                                        H3
                                    </div>
                                    <div>Titre niveau 3</div>
                                </div>
                            </div>
                            <div onClick={() => addThisElement('h4')} className="w3-button w3-round w3-hover-white w3-half" style={{ padding: 8 }}>
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