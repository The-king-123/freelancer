'use client'
import { faBookmark, faPlus, faRobot, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { console_source as source } from '../data'
import axios from 'axios'

function ChatbotCreate() {

    const [singleTopicInfo, setsingleTopicInfo] = useState({
        id: null,
        name: '',
        info: {
            description: '',
        }
    })
    const [topics, setTopics] = useState('')

    const createTopic = () => {
        if (singleTopicInfo.name.length > 3) {
            showTopic({
                name: singleTopicInfo.name,
                info: JSON.stringify(singleTopicInfo.info)
            })
        }
    }

    const reloadTopics = (data) => {
        const glitchTopic = data.map((chatbot, key) => (
            <div key={key} style={{ paddingBlock: 4, marginBottom: -2 }}>
                <div
                    onClick={() => showTopic(chatbot)}
                    className="w3-light-grey w3-round w3-flex-row w3-flex-center-v"
                    style={{ padding: 8 }}
                >
                    <div className="w3-white w3-circle w3-flex w3-flex-center w3-margin-right" style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40, }}>
                        <FontAwesomeIcon
                            icon={faBookmark}
                        />
                    </div>
                    {chatbot.name}
                </div>
            </div>
        ));
        setTopics(glitchTopic);
    };

    const showTopic = (data) => {

        singleTopicInfo.id = data.id;
        singleTopicInfo.name = data.name;
        singleTopicInfo.info.description = JSON.parse(data.info).description;

        document.getElementById('topicTitle').innerText = data.name;
        document.getElementById('topicContent').innerHTML = JSON.parse(data.info).description;
        document.getElementById('modalShowTopic').style.display = 'block';
    }

    const closeModalShowTopic = () => {
        singleTopicInfo.id = null;
        singleTopicInfo.name = '';
        singleTopicInfo.info.description = '';

        document.getElementById('topicTitle').innerText = '';
        document.getElementById('topicContent').innerHTML = '';
        document.getElementById('modalShowTopic').style.display = 'none';
    };

    const saveTopic = async () => {
        const request = {
            name: topicInfo.name,
            info: JSON.stringify({
                description: topicInfo.info.description.replace(/\n/g, "<br/>"),
            }),
        };
        await axios
            .post(source + "/_topic", request)
            .then((res) => {
                reloadTopics(res.data.data.reverse());
            })
            .catch((e) => {
                console.error("failure", e);
            });
    };

    const deleteTopic = async (id) => {
        document.getElementById("modalWarning").style.display = "block";
        document.getElementById("textWarning").innerText =
            "Voulez vous vraiment supprimer ce Topic avec Ses elements ...";

        const deleteHandler = async () => {
            document.getElementById("confirmSpinner").style.display =
                "inline-block";
            await axios
                .delete(source + "/_topic/" + id)
                .then((res) => {
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

                    reloadTopics(res.data.data.reverse());
                })
                .catch((e) => {
                    console.error("failure", e);
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

        document
            .getElementById("confirmWarning")
            .addEventListener("click", deleteHandler);
        document
            .getElementById("cancelWarning")
            .addEventListener("click", cancelHandler);
    };

    useEffect(() => {
        const xcode = localStorage.getItem("x-code");
        if (xcode) {
            axios
                .get(source + "/_topic?xcode=" + xcode)
                .then((res) => {
                    if (res.data.logedin) {
                        reloadTopics(res.data.data)
                        document.getElementById('chatbotCore').style.display = 'block'
                    } else {
                        if (document.getElementById('modalLogin')) {
                            document.getElementById('modalLogin').style.display = 'block'
                        }
                    }
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        } else {
            if (document.getElementById('modalLogin')) {
                document.getElementById('modalLogin').style.display = 'block'
            }
        }
    }, [])


    return (
        <div id="chatbotCore" style={{ display: 'none' }}>
            <div
                className="w3-medium w3-big w3-flex-row w3-flex-center-v"
                style={{ padding: 8 }}
            >
                <div className="w3-flex-row w3-flex-center-v w3-flex-1">
                    <FontAwesomeIcon
                        className="w3-margin-right"
                        icon={faRobot}
                        style={{ width: 24, height: 24 }}
                    />{" "}
                    Gérer votre chatbot
                </div>
            </div>

            <div style={{ padding: 8 }}>
                <div className="w3-container" style={{ padding: 0 }}>
                    <div className="w3-right" style={{ width: '35%' }}>
                        <div
                            onClick={createTopic}
                            className="w3-black w3-center w3-round"
                            style={{ paddingBlock: 7 }}
                        >
                            <FontAwesomeIcon style={{ marginRight: 8 }} icon={faPlus} />Créer
                        </div>
                    </div>
                    <div className="w3-right" style={{ paddingRight: 16, width: '65%' }}>
                        <input
                            onChange={(e) => singleTopicInfo.name = e.target.value}
                            className="w3-input w3-border-0 w3-light-grey w3-round"
                            type="text"
                            maxLength={100}
                            placeholder="Nouveau topic"
                        />
                    </div>
                </div>
                <div className="w3-container" style={{ paddingBlock: 16, paddingInline: 0 }}>
                    {/* // content */}
                    {topics}
                </div>

            </div>
            {/* modal show topic */}
            <div id="modalShowTopic" className="w3-modal">
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: '15%' }}
                >
                    <div className='w3-flex w3-flex-row w3-flex-center-v' style={{ paddingInline: 16, paddingTop: 16 }}>
                        <div id='topicTitle' className='w3-flex-1 w3-big'>Titre du topic</div>
                        <div onClick={closeModalShowTopic} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 32, height: 32 }}>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>

                    <div style={{ paddingInline: 16, paddingBlock: 24 }}>
                        <div
                            contentEditable={true}
                            id="topicContent"
                            className="w3-border-0 w3-input w3-border w3-round w3-overflow-scroll w3-noscrollbar"
                            placeholder="Dite-nous, c'est quoi?"
                            style={{ height: 200 }}
                        ></div>
                    </div>

                    <div className="w3-flex w3-flex-row w3-flex-center-v w3-light-grey w3-padding w3-red">
                        <button
                            id="deleteButton"
                            className="w3-flex-1 w3-button w3-round w3-border w3-border-black"
                        >
                            Supprimer
                        </button>
                        <button
                            id="saveButton"
                            className="w3-flex-1 w3-button w3-round w3-white w3-black w3-margin-left"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
            {/* end modal show topic */}
        </div>
    )
}

export default ChatbotCreate