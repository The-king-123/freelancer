"use client";
import React, { useEffect, useState } from "react";
import { console_source as source } from "@/app/data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCrown,
    faEye,
    faImage,
    faImages,
    faKey,
    faListDots,
    faMicrophone,
    faNewspaper,
    faPause,
    faPlay,
    faPlus,
    faRecordVinyl,
    faSpinner,
    faStop,
    faTimes,
    faTrash,
    faTrashAlt,
    faVideo,
    faWarning,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import slugify from "slugify";

function PostCreate(props) {

    axios.defaults.withCredentials = true;
    const [inputImage, setinputImage] = useState(null)
    const [inputImageVideo, setinputImageVideo] = useState(null)
    const [inputAudio, setinputAudio] = useState(null)
    const [categoryListe, setcategoryListe] = useState(
        <div style={{ padding: 24 }} className='w3-center'>
            <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
        </div>
    )
    const [selectCategoryList, setselectCategoryList] = useState([])

    const [codeInfo, setcodeInfo] = useState({
        fullname: '',
        email: '',
        key: '',
        media_id: null,
    })
    const [postInfo, setPostInfo] = useState({
        id: null,
        title: "",
        slug: "",
        type: "text",
        category: null,
        info: {
            description: "",
            videoUrl: "_",
        },
        media: null,
        state: "",
    });

    const [userInfo, setuserInfo] = useState({
        id: null,
        email: "",
        key: "",
    });

    const [postListe, setpostListe] = useState(
        <div style={{ padding: 24 }} className='w3-center'>
            <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
        </div>
    )
    const [keyListe, setkeyListe] = useState(
        <div style={{ padding: 24 }} className='w3-center'>
            <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
        </div>
    )

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

    const deleteHandler = async () => {

        const xcode = localStorage.getItem("x-code");
        document.getElementById("confirmSpinner").style.display =
            "inline-block";
        await setCSRFToken();
        await axios
            .delete(source + "/_post/" + postInfo.id + '?xcode=' + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    cancel('supprimer')
                    reloadPost(res.data.data.reverse());
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
        document.getElementById("modalWarning").style.display = "none";

        document
            .getElementById("confirmWarning")
            .removeEventListener("click", deleteHandler);
        document
            .getElementById("cancelWarning")
            .removeEventListener("click", cancelHandler);
    };

    const cancel = (state) => {

        if (state == 'public') {
            document.getElementById("postPublicSpinner").style.display = "none";
            document.getElementById("postPublicIcon").style.display = "inline-block";
        } else if (state == 'draft') {
            document.getElementById("postDraftSpinner").style.display = "none";
        }
        document.getElementById('modalPostListe').style.display = 'block';
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').innerHTML = 'Que pensez-vous ?';
        document.getElementById('postCategory').value = null
        document.getElementById('deleteButton').style.display = 'none';
        document.getElementById("confirmSpinner").style.display = "none";
        document.getElementById("modalWarning").style.display = "none";

        postInfo.id = null
        postInfo.title = ""
        postInfo.slug = ""
        postInfo.type = "text"
        postInfo.category = null
        postInfo.info.description = ""
        postInfo.media = null
        postInfo.info.videoUrl = "_"
        postInfo.state = ""

        cancelImageInsertion()
        if (postInfo.type == 'video') {
            addEmbedVideo()
        }


        document
            .getElementById("confirmWarning")
            .removeEventListener("click", deleteHandler);
        document
            .getElementById("cancelWarning")
            .removeEventListener("click", cancelHandler);

    }

    const save = async (state) => {

        const xcode = localStorage.getItem("x-code");

        postInfo.state = state;
        postInfo.slug = slugify(postInfo.title, { lower: true });

        postInfo.info.description = document.getElementById('postContent').innerHTML

        const videoState = postInfo.type == 'image/video' ? (postInfo.info.videoUrl.length > 3 ? true : false) : true

        if (postInfo.title.length > 0 && postInfo.info.description.length > 0 && postInfo.category && postInfo.type != 'video' && postInfo.type != 'text' && videoState) {
            if (state == 'public') {
                document.getElementById("postPublicSpinner").style.display = "inline-block";
                document.getElementById("postPublicIcon").style.display = "none";
            } else if (state == 'draft') {
                document.getElementById("postDraftSpinner").style.display = "inline-block";
            }
            var data;
            if (postInfo.media) {
                data = postInfo.media;

                data.append("title", postInfo.title);
                data.append("slug", postInfo.slug);
                data.append("info", JSON.stringify(postInfo.info));
                data.append("type", postInfo.type);
                data.append("state", postInfo.state);
                data.append("category", postInfo.category);
                if (postInfo.id) {
                    data.append("id", postInfo.id);
                }
            } else {
                data = {
                    title: postInfo.title,
                    info: JSON.stringify(postInfo.info),
                    type: postInfo.type,
                    slug: postInfo.slug,
                    state: postInfo.state,
                    category: postInfo.category,
                };
            }

            try {
                await setCSRFToken();
                if (!postInfo.media && postInfo.id) {
                    await axios
                        .patch(source + "/_post/" + postInfo.id + "?xcode=" + xcode, data)
                        .then((res) => {
                            if (res.data.logedin) {
                                codeInfo.media_id = null
                                cancel(state)
                                reloadPost(res.data.data.reverse());
                            } else {
                                if (document.getElementById('modalLogin')) {
                                    document.getElementById('modalLogin').style.display = 'block'
                                }
                                if (state == 'public') {
                                    document.getElementById("postPublicSpinner").style.display = "none";
                                    document.getElementById("postPublicIcon").style.display = "inline-block";
                                } else if (state == 'draft') {
                                    document.getElementById("postDraftSpinner").style.display = "none";
                                }
                            }

                        })
                        .catch((e) => {
                            if (state == 'public') {
                                document.getElementById("postPublicSpinner").style.display = "none";
                                document.getElementById("postPublicIcon").style.display = "inline-block";
                            } else if (state == 'draft') {
                                document.getElementById("postDraftSpinner").style.display = "none";
                            }
                            if (e.response && e.response.status === 419) {
                                console.error('CSRF token missing or incorrect');
                            } else {
                                console.error('Request failed:', error);
                            }
                        });
                } else {
                    await axios
                        .post(source + "/_post?xcode=" + xcode, data)
                        .then((res) => {
                            if (res.data.logedin) {
                                codeInfo.media_id = null
                                if (document.getElementById('createPostOnDesktop')) {
                                    document.getElementById('createPostOnDesktop').style.display = 'none';
                                    console.log(res.data);

                                } else {
                                    cancel(state)
                                    reloadPost(res.data.data.reverse());

                                }
                            } else {
                                if (document.getElementById('modalLogin')) {
                                    document.getElementById('modalLogin').style.display = 'block'
                                }
                                if (state == 'public') {
                                    document.getElementById("postPublicSpinner").style.display = "none";
                                    document.getElementById("postPublicIcon").style.display = "inline-block";
                                } else if (state == 'draft') {
                                    document.getElementById("postDraftSpinner").style.display = "none";
                                }
                            }

                        })
                        .catch((e) => {
                            if (state == 'public') {
                                document.getElementById("postPublicSpinner").style.display = "none";
                                document.getElementById("postPublicIcon").style.display = "inline-block";
                            } else if (state == 'draft') {
                                document.getElementById("postDraftSpinner").style.display = "none";
                            }
                            if (e.response && e.response.status === 419) {
                                console.error('CSRF token missing or incorrect');
                            } else {
                                console.error('Request failed:', error);
                            }
                        });

                }
            } catch (error) {
                if (state == 'public') {
                    document.getElementById("postPublicSpinner").style.display = "none";
                    document.getElementById("postPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                    document.getElementById("postDraftSpinner").style.display = "none";
                }

                if (error.response && error.response.status === 419) {
                    console.error('CSRF token missing or incorrect');
                } else {
                    console.error('Request failed:', error);
                }
            }

        }
    };

    const [singleCategoryInfo, setsingleCategoryInfo] = useState({
        id: null,
        name: null,
        type: "actuality",
        state: "publique",
        info: {
            description: "_",
        },
    });

    const getUrl = (embed) => {
        const start = embed.indexOf('src="') + 5;
        const end = embed.indexOf('"', start);
        const result = embed.substring(start, end);
        return result;
    };

    const reloadPost = (data) => {
        var glitchPost
        if (data.length > 0) {
            glitchPost = data.map((post, key) => (
                <div key={key} style={{ padding: 4 }}>
                    <div onClick={() => showThisPost(post)} className="w3-black w3-round w3-padding w3-nowrap w3-overflow">
                        <div>{post.title}</div>
                        <div className="w3-small w3-text-grey">{post.state == 'public' ? 'Publique' : 'Brouillon'}{post.category == 'premium' ? ' - ' : ''}{post.category == 'premium' ? <span className="w3-text-yellow">Premium</span> : ''}</div>
                    </div>
                </div>
            ))
        } else {
            //
            glitchPost = (<div style={{ padding: 8 }}>
                <div className="w3-border w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                    <div style={{ paddingInline: 16 }}>
                        Vous n'avez aucun post pour le moment...
                    </div>
                </div>
            </div>)
        }
        document.getElementById('premiumCodeManager').style.display = 'none'
        setpostListe(glitchPost)
    }

    const supprimer = async () => {
        if (postInfo.id) {
            document.getElementById("modalWarning").style.display = "block";
            document.getElementById("textWarning").innerText = "Voulez vous vraiment supprimer ce Post ...";

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

    const showThisPost = async (data) => {

        codeInfo.media_id = data.id

        postInfo.title = data.title
        postInfo.info.description = JSON.parse(data.info).description
        postInfo.id = data.id
        postInfo.slug = data.slug
        postInfo.type = data.type
        postInfo.category = data.category
        postInfo.info.videoUrl = JSON.parse(data.info).videoUrl ? JSON.parse(data.info).videoUrl : data.link

        document.getElementById('postTitle').value = data.title;
        document.getElementById('postContent').innerHTML = JSON.parse(data.info).description;
        document.getElementById('postCategory').value = data.category;

        if (data.type == 'image' || data.type == 'image/audio') {
            document.getElementById("showImage").src = source + "/images.php?w=100&h=100&zlonk=2733&zlink=" + data.link;
            document.getElementById("showImageWrapper").style.display = "block";
            document.getElementById("inputImage").style.display = "none";

            document.getElementById("audioSection").style.display = "block";
            document.getElementById("videoEmbed").style.display = "none";
            document.getElementById("videoSection").style.display = "none";

            if (data.type == 'image/audio') {
                document.getElementById("audioBox").src = source + "/audios.php?zlonk=1733&zlink=" + data.link;

                document.getElementById("startRecord").style.display = 'none'
                document.getElementById("stopRecord").style.display = 'none'
                document.getElementById("repeatRecord").style.display = 'flex'
                document.getElementById("recordingState").innerText = "Écouter l'enregistrement"

                document.getElementById("playRecord").className = "w3-flex-1 w3-button w3-hover-text-white w3-light-grey w3-hover-black w3-border w3-border-black w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";

                document.getElementById("noRecordIcon").style.display = 'none'
                document.getElementById("pauseRecordIcon").style.display = 'none'
                document.getElementById("playRecordIcon").style.display = 'inline-block'
            }

        } else if (data.type == 'video' || data.type == 'image/video') {
            document.getElementById("inputImage").style.display = "none";
            document.getElementById("videoSection").style.display = "block";

            document.getElementById("iconVideo").style.display = "none";
            document.getElementById("iconTimes").style.display = "inline-block";
            document.getElementById("videoEmbed").style.display = "flex";

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-black', 'w3-light-grey').replace('w3-text-grey', 'w3-text-white');
            document.getElementById("postVideo").value = JSON.parse(data.info).videoUrl ? JSON.parse(data.info).videoUrl : data.link;

            document.getElementById("showImageWrapper").style.display = "none";
            document.getElementById("audioSection").style.display = "none";

            document.getElementById("showImageVideo").src = source + "/images.php?w=100&h=100&zlonk=2733&zlink=" + data.link;;
            document.getElementById("showImageVideoWrapper").style.display = "block";
            document.getElementById("inputImageVideoWrapper").style.display = "none";
        } else {
            document.getElementById("inputImage").style.display = "flex";

            document.getElementById("videoSection").style.display = "none";

            document.getElementById("iconVideo").style.display = "inline-block";
            document.getElementById("iconTimes").style.display = "none";
            document.getElementById("videoEmbed").style.display = "flex";

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-light-grey', 'w3-black').replace('w3-text-white', 'w3-text-grey');

            document.getElementById("showImageWrapper").style.display = "none";
            document.getElementById("audioSection").style.display = "none";
        }

        document.getElementById('modalPostListe').style.display = 'none';
        document.getElementById('deleteButton').style.display = 'block';
        document.getElementById('createPostCore').style.display = 'block';

        if (data.category == 'premium') {
            displayKeyListArea()
            document.getElementById('premiumCodeManager').style.display = 'flex'

            const xcode = localStorage.getItem('x-code')
            await setCSRFToken();
            await axios
                .get(source + "/_links/" + data.id + "?xcode=" + xcode)
                .then((res) => {
                    if (res.data.logedin) {
                        reloadKeyList(res.data.data)
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
            document.getElementById('premiumCodeManager').style.display = 'none'
        }
    }

    const closeModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitlePost").value = "";
        document.getElementById("modalCategory").style.display = "none";
    };

    const openModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitlePost").value = "";
        document.getElementById("modalCategory").style.display = "block";
    };

    const previewVideo = () => {
        document.getElementById("videoSource").src = getUrl(postInfo.info.videoUrl);
        document.getElementById("modalVideoPreview").style.display = "block";
    };

    const categoryInfo = {
        name: null,
        type: "actuality",
        state: "publique",
        info: {
            description: "_",
        },
    };

    const reloadCategory = (data) => {
        setselectCategoryList(data)
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

    const saveCategory = async () => {
        const xcode = localStorage.getItem('x-code')
        const request = {
            name: categoryInfo.name,
            type: categoryInfo.type,
            state: categoryInfo.state,
            info: JSON.stringify({
                description: categoryInfo.info.description.replace(
                    /\n/g,
                    "<br/>"
                ),
            }),
        };
        await setCSRFToken();
        await axios
            .post(source + "/_category?xcode=" + xcode, request)
            .then((res) => {
                reloadCategory(res.data.data.reverse());
            })
            .catch((e) => {
                console.error("failure", e);
            });
    };

    const deleteCategory = async (id) => {
        document.getElementById("modalWarning").style.display = "block";
        document.getElementById("textWarning").innerText = "Voulez vous vraiment supprimer cette categorie avec ses elements ...";

        const xcode = localStorage.getItem('x-code');
        const deleteHandler = async () => {
            document.getElementById("confirmSpinner").style.display = "inline-block";
            await axios
                .delete(source + "/_category/" + id + "?xcode=" + xcode)
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

    const cancelImageInsertion = () => {
        postInfo.media = null;
        postInfo.type = "text";

        document.getElementById("showImage").src = '';
        document.getElementById("showImageWrapper").style.display = "none";
        document.getElementById("inputImage").style.display = "flex";

        document.getElementById("audioSection").style.display = "none";
        document.getElementById("videoEmbed").style.display = "flex";

        document.getElementById("videoSection").style.display = "none";

        document.getElementById("iconVideo").style.display = "inline-block";
        document.getElementById("iconTimes").style.display = "none";

        document.getElementById("postVideo").value = '';

        document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-light-grey', 'w3-black').replace('w3-text-white', 'w3-text-grey');
    }

    const closeModalVideoPreview = () => {
        document.getElementById("videoSource").src = "";
        document.getElementById("modalVideoPreview").style.display = "none";
    };

    const addEmbedVideo = () => {

        if (document.getElementById("videoEmbed").className.includes('w3-light-grey')) {
            postInfo.info.videoUrl = '';
            postInfo.type = 'text';
            postInfo.media = null;

            document.getElementById("showImageVideo").src = '';
            document.getElementById("inputImageVideoWrapper").value = null;
            document.getElementById("showImageVideoWrapper").style.display = "none";
            document.getElementById("inputImageVideoWrapper").style.display = "flex";


            document.getElementById("inputImage").style.display = "flex";
            document.getElementById("videoSection").style.display = "none";

            document.getElementById("iconVideo").style.display = "inline-block";
            document.getElementById("iconTimes").style.display = "none";

            document.getElementById("postVideo").value = '';

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-light-grey', 'w3-black').replace('w3-text-white', 'w3-text-grey');
        } else {
            postInfo.type = 'video';
            document.getElementById("inputImage").style.display = "none";
            document.getElementById("videoSection").style.display = "block";

            document.getElementById("iconVideo").style.display = "none";
            document.getElementById("iconTimes").style.display = "inline-block";

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-black', 'w3-light-grey').replace('w3-text-grey', 'w3-text-white');
        }
    }

    const cancelImageVideoInsertion = () => {
        postInfo.media = null;
        postInfo.type = "video";

        document.getElementById("showImageVideo").src = '';
        document.getElementById("showImageVideoWrapper").style.display = "none";
        document.getElementById("inputImageVideoWrapper").style.display = "flex";
    }

    const deleteKey = (id) => {
        document.getElementById("modalWarning").style.display = "block";
        document.getElementById("textWarning").innerText = "Voulez vous vraiment supprimer ce code d'acces ...";

        const xcode = localStorage.getItem('x-code');
        const deleteHandler = async () => {
            document.getElementById("confirmSpinner").style.display = "inline-block";
            await axios
                .delete(source + "/_links/" + id + "?xcode=" + xcode)
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

                    reloadKeyList(res.data.data.reverse());
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
    }

    const reloadKeyList = (data) => {
        var glicthKeyList
        if (data.length > 0) {
            glicthKeyList = data.map((code, key) => (
                <div key={key} style={{ padding: 4 }}>
                    <div className="w3-black w3-round w3-padding w3-flex-row w3-flex-center-v">
                        <div className="w3-nowrap w3-overflow w3-flex-column w3-flex-1">
                            <div>{code.fullname}</div>
                            <div className="w3-small w3-text-grey">{code.email}</div>
                        </div>
                        <div onClick={() => deleteKey(code.id)} className="w3-margin-left ">
                            <FontAwesomeIcon icon={faTrashAlt} className="w3-opacity-min w3-hover-text-red" />
                        </div>
                    </div>
                </div>
            ))
        } else {
            //
            glicthKeyList = (<div style={{ padding: 8 }}>
                <div className="w3-black w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                    <div style={{ paddingInline: 16 }}>
                        Ce post n'a aucune code pour le moment...
                    </div>
                </div>
            </div>)
        }
        setkeyListe(glicthKeyList)
    }

    const isNumericSequence = (str) => {
        const numberRegex = /^\d+$/;
        return numberRegex.test(str);
    }

    const isValidEmail = (email) => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const copyToClipboard = (id) => {
        const copyText = document.getElementById(id).innerText;
        const textarea = document.createElement("textarea");
        textarea.value = copyText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Copied to clipboard: " + copyText);
    }

    const addKeyToUser = async () => {
        if (isValidEmail(codeInfo.email) || isNumericSequence(codeInfo.email)) {
            const xcode = localStorage.getItem('x-code')
            await setCSRFToken();
            await axios
                .post(source + "/_links?xcode=" + xcode, codeInfo)
                .then((res) => {
                    if (res.data.logedin) {
                        if (res.data.authexist) {
                            if (!res.data.codeexist) {
                                reloadKeyList(res.data.data.reverse());
                                document.getElementById('infoBull').innerHTML = "<div>L'utilisateur est ajouter avec succes</div>"
                                document.getElementById('infoBull').style.display = 'block'
                                setTimeout(() => {
                                    document.getElementById('infoBull').style.display = 'none'
                                }, 3000);
                            } else {
                                document.getElementById('infoBull').innerHTML = "<div class='w3-text-red w3-opacity'>Le code pour cet utilisateur exist deja.</div>"
                                document.getElementById('infoBull').style.display = 'block'
                                setTimeout(() => {
                                    document.getElementById('infoBull').style.display = 'none'
                                }, 3000);
                            }
                        } else {
                            document.getElementById('infoBull').innerHTML = "<div class='w3-text-red w3-opacity'>Cet utilisateur n'est inscrit sur la plateforme.</div>"
                            document.getElementById('infoBull').style.display = 'block'
                            setTimeout(() => {
                                document.getElementById('infoBull').style.display = 'none'
                            }, 3000);
                        }
                    }
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        } else {
            document.getElementById('infoBull').innerHTML = "<div class='w3-text-red w3-opacity'>Veuillez entrer un e-mail ou clé de reference valide.</div>"
            document.getElementById('infoBull').style.display = 'block'
            setTimeout(() => {
                document.getElementById('infoBull').style.display = 'none'
            }, 3000);
        }

    }

    const displayAddNewKeyArea = () => {
        document.getElementById('newKeyArea').style.display = 'block';
        document.getElementById('keyListArea').style.display = 'none';
        document.getElementById('afficheNewKeyArea').style.display = 'none';
        document.getElementById('afficheKeyListArea').style.display = 'flex';
    }

    const displayKeyListArea = () => {
        document.getElementById('newKeyArea').style.display = 'none';
        document.getElementById('keyListArea').style.display = 'block';
        document.getElementById('afficheNewKeyArea').style.display = 'flex';
        document.getElementById('afficheKeyListArea').style.display = 'none';
    }

    useEffect(() => {


        if (!props.fromHome) {
            document.getElementById('modalPostListe').style.display = 'block'
        }

        const xcode = localStorage.getItem("x-code");
        if (xcode) {
            axios
                .get(`${source}/_post?xcode=${xcode}`)
                .then((res) => {
                    if (res.data.logedin) {
                        document.getElementById('postCore').style.display = 'block'
                        reloadPost(res.data.data)
                    } else {
                        if (document.getElementById('modalLogin')) {
                            document.getElementById('modalLogin').style.display = 'block'
                        }
                    }
                })
                .catch((e) => {
                    console.error("failure", e);
                });

            axios
                .get(`${source}/_category/actuality?xcode=${xcode}`)
                .then((res) => {
                    if (res.data.logedin) {
                        reloadCategory(res.data.data.reverse())
                    } else {
                        if (document.getElementById('modalLogin')) {
                            document.getElementById('modalLogin').style.display = 'block'
                        }
                    }
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        }

        // Upload Image

        var imageSelector = document.createElement("input");
        imageSelector.type = "file";
        imageSelector.accept = "image/*";

        imageSelector.onchange = (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("media", file);

            reader.onload = (readerEvent) => {
                var content = readerEvent.target.result;

                document.getElementById("showImage").src = content;
                document.getElementById("showImageWrapper").style.display = "block";
                document.getElementById("inputImage").style.display = "none";

                document.getElementById("audioSection").style.display = "block";
                document.getElementById("videoEmbed").style.display = "none";

                postInfo.media = formData;
                postInfo.type = "image";
            };
        };
        setinputImage(imageSelector)

        // Upload Image for video miniature

        var imageVideoSelector = document.createElement("input");
        imageVideoSelector.type = "file";
        imageVideoSelector.accept = "image/*";

        imageVideoSelector.onchange = (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("media", file);

            reader.onload = (readerEvent) => {
                var content = readerEvent.target.result;

                document.getElementById("showImageVideo").src = content;
                document.getElementById("showImageVideoWrapper").style.display = "block";
                document.getElementById("inputImageVideoWrapper").style.display = "none";

                postInfo.media = formData;
                postInfo.type = "image/video";
            };
        };
        setinputImageVideo(imageVideoSelector)

        // Audio recording control
        const startButton = document.getElementById("startRecord");
        const stopButton = document.getElementById("stopRecord");
        const repeatButton = document.getElementById("repeatRecord");
        const playButton = document.getElementById("playRecord");
        const recordingState = document.getElementById("recordingState");

        const iconMicro = document.getElementById("noRecordIcon");
        const iconPause = document.getElementById("pauseRecordIcon");
        const iconPlay = document.getElementById("playRecordIcon");

        const audioElement = document.getElementById("audioBox");

        let mediaRecorder;
        let audioChunks = [];

        startButton.addEventListener("click", async () => {
            if (postInfo.media) {
                postInfo.type = "image/audio";
                startButton.style.display = 'none';
                stopButton.style.display = 'flex'

                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, {
                        type: "audio/wav",
                    });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioElement.src = audioUrl;

                    audioChunks = []; // Clear the audio chunks array
                    postInfo.media.append(
                        "audio",
                        audioBlob,
                        "recording.wav"
                    );
                };

                mediaRecorder.start();

                iconPause.style.display = "none";
                iconPlay.style.display = "none";
                iconMicro.style.display = "inline-block";

                recordingState.innerText = "En cours d'enregistrement...";
            } else {
                alert("Une image est obligatoire pour ajouter une voix");
            }
        });

        stopButton.addEventListener("click", () => {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
                startButton.style.display = 'none'
                stopButton.style.display = 'none'
                repeatButton.style.display = 'flex'
                recordingState.innerText = "Écouter l'enregistrement"

                playButton.className = "w3-flex-1 w3-button w3-hover-text-white w3-light-grey w3-hover-black w3-border w3-border-black w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";
                postInfo.type = "image/audio";

                iconMicro.style.display = 'none'
                iconPause.style.display = 'none'
                iconPlay.style.display = 'inline-block'
            }
        });

        playButton.addEventListener("click", () => {
            if (audioElement.src) {
                console.log(iconPause.style.display);

                if (iconPause.style.display == "none") {
                    if (mediaRecorder) {
                        mediaRecorder.stop();
                    }

                    startButton.disabled = false;
                    stopButton.disabled = true;

                    iconPause.style.display = "inline-block";
                    iconPlay.style.display = "none";

                    recordingState.innerText = "Arrêter l'écoute"

                    audioElement.play().catch((error) => {
                        console.error("Error playing audio:", error);
                    });

                } else {
                    audioElement.pause();

                    iconPause.style.display = "none";
                    iconPlay.style.display = "inline-block";
                    recordingState.innerText = "Écouter l'enregistrement"

                }
            }
        });

        repeatButton.addEventListener("click", () => {
            if (audioElement.src) {
                postInfo.type = "image";

                if (mediaRecorder) {
                    mediaRecorder.stop();
                }

                audioElement.pause();

                startButton.style.display = 'flex'
                stopButton.style.display = 'none'
                repeatButton.style.display = 'none'

                iconPause.style.display = "none";
                iconPlay.style.display = "none";
                iconMicro.style.display = "inline-block";

                playButton.className = "w3-flex-1 w3-button w3-hover-text-black w3-hover-white w3-black w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v"

                audioElement.removeAttribute("src");

                recordingState.innerText = "Pas d'enregistrement";

                postInfo.media.delete("audio");
            }
        });

        audioElement.addEventListener("ended", () => {
            iconPause.style.display = "none";
            iconPlay.style.display = "inline-block";

            recordingState.innerText = "Voice recorded";
        });

        // Upload audio
        var audioSelector = document.createElement("input");
        audioSelector.type = "file";
        audioSelector.accept = "audio/*";

        audioSelector.onchange = (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            postInfo.media.append("audio", file);

            reader.onload = (readerEvent) => {
                var content = readerEvent.target.result;
                audioElement.src = content;

                startButton.style.display = 'none'
                stopButton.style.display = 'none'
                repeatButton.style.display = 'flex'
                recordingState.innerText = "Écouter l'enregistrement"

                iconMicro.style.display = 'none'
                iconPause.style.display = 'none'
                iconPlay.style.display = 'inline-block'

                playButton.className = "w3-flex-1 w3-button w3-hover-text-white w3-light-grey w3-hover-black w3-border w3-border-black w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";
                postInfo.type = "image/audio";
            };
        };
        setinputAudio(audioSelector)

    }, []);

    return (
        <div id="postCore" style={{ position: 'relative' }}>
            <div
                className="w3-medium w3-big w3-flex-row w3-flex-center-v"
                style={{ padding: 8 }}
            >
                <div className="w3-flex-row w3-flex-center-v w3-flex-1">
                    <FontAwesomeIcon
                        className="w3-margin-right"
                        icon={faImages}
                        style={{ width: 24, height: 24 }}
                    />{" "}
                    Créer votre post
                </div>
                <div>
                    <div
                        id="premiumCodeManager"
                        onClick={() => {
                            document.getElementById('createPostCore').style.display = 'none'
                            document.getElementById("modalKeyListe").style.display = 'block'
                        }}
                        className="w3-light-grey w3-circle w3-flex w3-flex-center"
                        style={{ width: 32, height: 32, display: 'none' }}
                        title="Gérer votre code premium."
                    >
                        <FontAwesomeIcon
                            icon={faKey}
                            style={{ width: 16, height: 16 }}
                        />
                    </div>
                </div>
                <div id="openPostListeButton">
                    <div
                        onClick={() => {
                            document.getElementById('createPostCore').style.display = 'none'
                            document.getElementById("modalPostListe").style.display = 'block'
                        }}
                        className="w3-black w3-circle w3-flex w3-flex-center w3-margin-left"
                        style={{ width: 32, height: 32 }}
                    >
                        <FontAwesomeIcon
                            icon={faListDots}
                            style={{ width: 16, height: 16 }}
                        />
                    </div>
                </div>
            </div>

            <div id="createPostCore" style={{ padding: 8 }}>
                <div className="w3-container" style={{ padding: 0 }}>
                    <div className="w3-right" style={{ width: '35%' }}>
                        <div
                            onClick={openModalCategory}
                            className="w3-light-grey w3-center w3-round"
                            style={{ paddingBlock: 7 }}
                        >
                            Catégorie
                        </div>
                    </div>
                    <div className="w3-right" style={{ paddingRight: 16, width: '65%' }}>
                        <select
                            id="postCategory"
                            onChange={(e) => postInfo.category = e.target.value}
                            className="w3-black w3-input w3-border-0 w3-block w3-nowrap w3-overflow w3-round"
                            style={{ paddingBlock: 8 }}
                            defaultValue={null}
                        >
                            <option value={null}>Sélectionner une catégorie</option>
                            <option value="premium">Premium</option>
                            <option value="standard">Standard</option>
                            {
                                selectCategoryList.map((category, key) => (
                                    <option key={key} value={category.id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <input
                    id="postTitle"
                    onChange={(e) => (postInfo.title = e.target.value)}
                    className="w3-input w3-border-0 w3-black w3-round"
                    type="text"
                    maxLength={200}
                    style={{ marginTop: 16 }}
                    placeholder="Titre"
                />
                <div
                    contentEditable
                    id="postContent"
                    className="w3-input w3-border-0 w3-black w3-round w3-overflow-scroll w3-noscrollbar"
                    style={{
                        height: 160,
                        minWidth: "100%",
                        marginTop: 16,
                    }}
                ></div>
                <div className="w3-container" style={{ padding: 0 }}>

                    <div
                        id="videoEmbed"
                        onClick={addEmbedVideo}
                        className="w3-right w3-black w3-round w3-text-grey w3-flex w3-flex-center w3-margin-left"
                        style={{ height: 40, width: 40, marginTop: 16 }}
                    >
                        <FontAwesomeIcon id="iconVideo" icon={faVideo} style={{ width: 16, height: 16 }} />
                        <FontAwesomeIcon id="iconTimes" icon={faTimes} style={{ width: 16, height: 16, display: 'none' }} />
                    </div>
                    <div
                        id="inputImage"
                        onClick={() => inputImage.click()}
                        className="w3-right w3-black w3-round w3-text-grey w3-flex w3-flex-center"
                        style={{ height: 40, width: 40, marginTop: 16 }}
                    >
                        <FontAwesomeIcon icon={faImage} style={{ width: 16, height: 16 }} />
                    </div>

                    <div className="w3-right " style={{ padding: 0, marginTop: 16 }}>
                        <div
                            className="w3-display-container"
                            id="showImageWrapper"
                            style={{ display: "none", height: 120, width: 120 }}
                        >
                            <Image
                                id="showImage"
                                src={''}
                                className="w3-display-middle w3-black w3-round w3-text-grey w3-flex w3-flex-center w3-overflow"
                                height={100}
                                width={100}
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                            <div className="w3-display-topright" style={{ padding: 4 }}>
                                <div
                                    onClick={cancelImageInsertion}
                                    className="w3-circle w3-card w3-dark-grey w3-flex w3-flex-center"
                                    style={{ width: 24, height: 24 }}
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        style={{ width: 16, height: 16 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* show audio control when an image is selected */}
                <div id="audioSection" style={{ display: 'none' }}>
                    <audio
                        id="audioBox"
                        style={{ display: "none" }}
                        controls
                    ></audio>
                    <div className="w3-small w3-text-grey w3-margin-top" style={{ marginBottom: 4 }}>
                        ¬ Enregistrer ou téléverser un audio.
                    </div>
                    <div className="w3-flex w3-flex-row w3-flex-center">
                        <div
                            onContextMenu={() => {
                                if (postInfo.media) {
                                    inputAudio.click();
                                } else {
                                    alert(
                                        "Une image est obligatoire pour ajouter une voix"
                                    );
                                }
                            }}
                            disabled
                            id="playRecord"
                            style={{
                                width: 180,
                            }}
                            className="w3-flex-1 w3-button w3-hover-text-black w3-hover-white w3-black w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v"
                        >
                            <FontAwesomeIcon
                                id="noRecordIcon"
                                className="w3-margin-right"
                                icon={faMicrophone}
                            />
                            <FontAwesomeIcon
                                id="playRecordIcon"
                                className="w3-margin-right"
                                icon={faPlay}
                                style={{ display: "none" }}
                            />
                            <FontAwesomeIcon
                                id="pauseRecordIcon"
                                className="w3-margin-right"
                                icon={faPause}
                                style={{ display: "none" }}
                            />
                            <div id="recordingState">Pas d'enregistrement</div>
                        </div>
                        <div
                            disabled
                            id="repeatRecord"
                            title="Supprimer l'enregistrement!"
                            className="blacktext w3-margin-left w3-flex w3-border w3-border-black w3-circle w3-flex-center"
                            style={{ width: 36, height: 36, display: 'none' }}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </div>
                        <div
                            disabled
                            id="stopRecord"
                            title="Arrêter l'enregistrement!"
                            className="blacktext w3-margin-left w3-flex w3-border w3-border-black w3-circle w3-flex-center"
                            style={{ width: 36, height: 36, display: 'none' }}
                        >
                            <FontAwesomeIcon icon={faStop} />
                        </div>
                        <div
                            id="startRecord"
                            title="Commencer l'enregistrement!"
                            className="blacktext w3-margin-left w3-flex w3-border w3-border-black w3-circle w3-flex-center"
                            style={{ width: 36, height: 36 }}
                        >
                            <FontAwesomeIcon icon={faRecordVinyl} />
                        </div>
                    </div>
                </div>

                {/* show video section on square video symbol click */}
                <div id="videoSection" style={{ display: 'none' }}>
                    <div className="w3-small w3-text-grey w3-margin-top" style={{ marginBottom: 4 }}>
                        ¬ Coller un lien d'intégration ou url video.
                    </div>
                    <div
                        className="w3-flex w3-flex-row w3-flex-center-v"
                    >
                        <input
                            id="postVideo"
                            onChange={(e) => postInfo.info.videoUrl = e.target.value}
                            className="w3-border-0 w3-flex-1 w3-block w3-input w3-black w3-round-xxlarge"
                            type="text"
                            placeholder="Lien video"
                            style={{
                                paddingInline: 24,
                            }}
                        />
                        <div
                            onClick={previewVideo}
                            id="previewVideo"
                            className="w3-pointer w3-text-white w3-margin-left w3-flex  w3-light-grey w3-round-xxlarge w3-flex-center"
                            style={{
                                height: 36,
                                paddingInline: 16,
                            }}
                        >
                            Preview
                        </div>
                    </div>
                    <div>
                        <div id="inputImageVideoWrapper" onClick={() => inputImageVideo.click()} className="w3-pointer w3-flex-row w3-flex-center-v" style={{ marginTop: 16 }}>
                            <div
                                className="w3-black w3-round w3-text-grey w3-flex w3-flex-center"
                                style={{ height: 40, width: 40 }}
                            >
                                <FontAwesomeIcon icon={faImage} style={{ width: 16, height: 16 }} />
                            </div>
                            <div>
                                ¬ Ajouter un miniature a votre video
                            </div>
                        </div>

                        <div
                            className="w3-display-container"
                            id="showImageVideoWrapper"
                            style={{ display: "none", height: 120, width: 120 }}
                        >
                            <Image
                                id="showImageVideo"
                                src={''}
                                className="w3-display-middle w3-black w3-round w3-text-grey w3-flex w3-flex-center w3-overflow"
                                height={100}
                                width={100}
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    marginTop: 16,
                                    marginRight: 16
                                }}
                            />
                            <div className="w3-display-topright" style={{ paddingTop: 12, }}>
                                <div
                                    onClick={cancelImageVideoInsertion}
                                    className="w3-circle w3-card w3-dark-grey w3-flex w3-flex-center"
                                    style={{ width: 24, height: 24 }}
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        style={{ width: 16, height: 16 }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <hr />

                {/* buton save public | draft */}
                <div style={{ marginTop: 24 }}>
                    <button
                        onClick={() => save("public")}
                        className="w3-button w3-light-grey w3-round-xxlarge w3-block w3-flex w3-flex-center"
                    >
                        Publier votre post{" "}
                        <FontAwesomeIcon
                            id="postPublicIcon"
                            className="w3-margin-left"
                            icon={faArrowRight}
                            style={{ width: 16, height: 16 }}
                        />
                        <FontAwesomeIcon
                            id="postPublicSpinner"
                            className="w3-spin w3-margin-left"
                            icon={faSpinner}
                            style={{ width: 16, height: 16, display: "none" }}
                        />
                    </button>
                    <button
                        onClick={() => save("draft")}
                        className="w3-button w3-hover-black w3-border w3-border-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
                        style={{ marginTop: 16 }}
                    >
                        Enregistrer comme brouillon
                        <FontAwesomeIcon
                            id="postDraftSpinner"
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
                        Supprimer le post
                    </button>
                </div>
            </div>

            {/* modal add new category */}
            <div id="modalCategory" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 48 }}
                >

                    <div onClick={closeModalCategory} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 32, height: 32, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <div className="w3-flex-row w3-flex-center-v" style={{ paddingInline: 16, paddingBlock: 24 }}>
                        <input
                            id="categoryTitlePost"
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

            {/* modal video preview */}
            <div id="modalVideoPreview" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 64 }}
                >

                    <div onClick={closeModalVideoPreview} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 32, height: 32, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <div style={{ height: 320, marginTop: 16 }}>
                        <iframe
                            id="videoSource"
                            className="w3-block"
                            height="300"
                            src=""
                            frameBorder={0}
                            allowFullScreen
                        ></iframe>
                    </div>

                </div>
            </div>
            {/* end modal video preview */}

            {/* modal post liste */}
            <div id="modalPostListe" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 32 }}
                >

                    <div onClick={() => {
                        document.getElementById('createPostCore').style.display = 'block'
                        document.getElementById('modalPostListe').style.display = 'none'
                    }} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>

                    <div style={{ paddingInline: 16, paddingBlock: 16 }}>
                        <input
                            id="searchInputPostList"
                            className="input w3-border-0 w3-input w3-border w3-round-xxlarge"
                            placeholder="Chercher un post"
                            type="text"
                        />
                    </div>
                    <div style={{ height: '50vh', paddingInline: 12, marginBottom: 16 }} className="w3-overflow-scroll w3-noscrollbar">
                        {
                            postListe
                        }
                    </div>

                </div>
            </div>
            {/* end modal post liste */}

            {/* modal key liste */}
            <div id="modalKeyListe" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 32 }}
                >
                    <div className="w3-flex-row w3-flex-center-v">
                        <div onClick={() => {
                            document.getElementById('createPostCore').style.display = 'block'
                            document.getElementById('modalKeyListe').style.display = 'none'
                        }} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <div className="w3-flex-1"></div>
                        <div>
                            <div id="afficheNewKeyArea" title="Ajouter un nouveau code utilisateur" onClick={displayAddNewKeyArea} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                            <div id="afficheKeyListArea" title="Afficher la liste code utilisateur" onClick={displayKeyListArea} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16, display: 'none' }}>
                                <FontAwesomeIcon icon={faListDots} />
                            </div>
                        </div>
                    </div>
                    <div id="newKeyArea" style={{ display: 'none', paddingBottom: 24 }}>
                        <div className="w3-flex-row w3-flex-center-v" style={{ paddingInline: 16, paddingBlock: 24 }}>
                            <input
                                id="categoryTitlePostKey"
                                onChange={(e) => codeInfo.email = e.target.value}
                                className="w3-border-0 w3-input w3-border w3-round"
                                placeholder="E-mail ou clé de reference"
                                type="text"
                            />
                            <button
                                onClick={addKeyToUser}
                                className="w3-button w3-margin-left w3-round w3-dark-grey w3-light-grey w3-flex w3-flex-center"
                                style={{ height: 40 }}
                                title="Generer un code d'acces."
                            >
                                <FontAwesomeIcon icon={faKey} />
                            </button>
                        </div>
                        <div id="infoBull" style={{ marginBottom: 8, paddingInline: 16, display: 'none' }}>L'utilisateur est ajouter avec succes</div>
                    </div>
                    <div id="keyListArea">
                        <div style={{ paddingInline: 16, paddingBlock: 16 }}>
                            <input
                                id="searchInputPostKey"
                                className="input w3-border-0 w3-input w3-border w3-round-xxlarge"
                                placeholder="Chercher un key"
                                type="text"
                            />
                        </div>

                        <div style={{ height: '50vh', paddingInline: 12, marginBottom: 16 }} className="w3-overflow-scroll w3-noscrollbar">
                            {
                                keyListe
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* end modal key liste */}
        </div>
    );
}

export default PostCreate;
