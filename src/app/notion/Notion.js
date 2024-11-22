'use client'
import { faCubes, faMuseum, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function Notion() {

    const elementList = {
        p: "<p contentEditable='true' style='min-height:24px'></p>",
        div: "<div contentEditable='true' style='min-height:24px'></div>",
        ul: "<div style='padding-inline:16px'><ul id='listeNumber00'><li id='listeNumber00Child0' contentEditable='true' style='min-height:24px'></li></ul></div>",
        ol: "<div style='padding-inline:16px'><ol id='listeNumber00'><li id='listeNumber00Child0' contentEditable='true' style='min-height:24px'></li></ol></div>",
        h1: "<h1 contentEditable='true' style='min-height:24px'></h1>",
        h2: "<h2 contentEditable='true' style='min-height:24px'></h2>",
        h3: "<h3 contentEditable='true' style='min-height:24px'></h3>",
        h4: "<h4 contentEditable='true' style='min-height:24px'></h4>",
    }

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

    const addThisElement = (element) => {
        const containerEditable = document.getElementById('editableNotionCore')
        if (element == 'ol' || element == 'ul') {
            var counterList = 0
            do {
                counterList++;
            } while (document.getElementById('listeNumber'+counterList));
            containerEditable.innerHTML = containerEditable.innerHTML + elementList[element].replace(/00/g, counterList)
        } else {
            containerEditable.innerHTML = containerEditable.innerHTML + elementList[element]
        }

    }

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            console.log(e.key);
            if (e.key == 'Alt') {
                openDropdown("notionList")
            }
        })
    }, [])


    return (
        <div id='notionCore' style={{ position: 'relative' }}>
            {/* Button list des pages */}
            <div className='w3-flex-row w3-flex-center-v'>
                <div
                    className="w3-dropdown-click"
                >
                    <div onClick={() => openDropdown("notionList")} style={{ width: 32, height: 32 }} className='w3-blue w3-round w3-flex w3-flex-center'>
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
            <div id='editableNotionCore'>
                {/* <div contentEditable='true' style={{minHeight:24}}></div>
                <p contentEditable='true' style={{minHeight:24}}></p>
                <h1 contentEditable='true' style={{minHeight:24}}></h1>
                <h2 contentEditable='true' style={{minHeight:24}}></h2>
                <h3 contentEditable='true' style={{minHeight:24}}></h3>
                <h4 contentEditable='true' style={{minHeight:24}}></h4>
                <ul id='listeNumber + (test ul if the id at 0 exist else ++ )'>
                    <li id='listeNumber + (test ul if the id at 0 exist else ++ ) + Child + (test li if the id at 0 exist else ++ )' contentEditable='true' style={{minHeight:24}}>

                    </li>
                </ul>
                <ol id='listeNumber + (test ol if the id at 0 exist else ++ )'>
                    <li id='listeNumber + (test ol if the id at 0 exist else ++ ) + Child + (test li if the id at 0 exist else ++ )' contentEditable='true' style={{minHeight:24}}>

                    </li>
                </ol> */}
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