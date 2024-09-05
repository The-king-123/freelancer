"use client";
import React, { useEffect, useState } from "react";
import { console_source as source } from "@/app/data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faEye,
    faImage,
    faImages,
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

function PostCreate() {

    axios.defaults.withCredentials = true;
    const [inputImage, setinputImage] = useState(null)
    const [inputAudio, setinputAudio] = useState(null)
    const [categoryListe, setcategoryListe] = useState('')
    const [selectCategoryList, setselectCategoryList] = useState([])

    const [postInfo, setPostInfo] = useState({
        id: null,
        title: "",
        slug: "",
        type: "text",
        category: null,
        info: {
            description: "",
        },
        media: null,
        videoUrl: "_",
        state: "",
    });

    const [userInfo, setuserInfo] = useState({
        id: null,
        email: "",
        key: "",
    });

    const [postListe, setpostListe] = useState('')

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

    const save = async (state) => {

        const xcode = localStorage.getItem("x-code");

        postInfo.state = state;
        postInfo.slug = slugify(postInfo.title, { lower: true });

        postInfo.info.description = document.getElementById('postContent').innerHTML

        if (postInfo.title.length > 0 && postInfo.info.description.length > 0 && postInfo.category) {
            document.getElementById("postPublicSpinner").style.display =
                "inline-block";
            document.getElementById("postPublicIcon").style.display = "none";
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
                    videoUrl: postInfo.videoUrl,
                };
            }

            try {
                await setCSRFToken();
                if (!postInfo.media && postInfo.id) {
                    await axios
                        .patch(source + "/_post/" + postInfo.id + "?xcode=" + xcode, data)
                        .then((res) => {
                            if (res.data.logedin) {
                                reloadPost(res.data.data.reverse());
                                cancel()
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
                                reloadPost(res.data.data.reverse());
                                cancel()
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

    const cancel = () => {
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
        cancelImageInsertion()

        postInfo.id = null
        postInfo.title = ""
        postInfo.slug = ""
        postInfo.type = "text"
        postInfo.category = null
        postInfo.info.description = ""
        postInfo.media = null
        postInfo.videoUrl = "_"
        postInfo.state = ""
    }

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
                    <div onClick={() => showThisPost(post)} className="w3-light-grey w3-round w3-padding w3-nowrap w3-overflow">
                        <div>{post.title}</div>
                        <div className="w3-small w3-text-grey">{post.state == 'public' ? 'Publique' : 'Brouillon'}</div>
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
        setpostListe(glitchPost)
    }

    const supprimer = async () => {
        const xcode = localStorage.getItem("x-code");
        if (postInfo.id) {
            document.getElementById("modalWarning").style.display = "block";
            document.getElementById("textWarning").innerText =
                "Voulez vous vraiment supprimer ce Post ...";

            const deleteHandler = async () => {
                document.getElementById("confirmSpinner").style.display =
                    "inline-block";
                await setCSRFToken();
                await axios
                    .delete(source + "/_post/" + postInfo.id + '?xcode=' + xcode)
                    .then((res) => {
                        if (res.data.logedin) {
                            document.getElementById("confirmSpinner").style.display = "none";
                            document.getElementById("modalWarning").style.display = "none";

                            document
                                .getElementById("confirmWarning")
                                .removeEventListener("click", deleteHandler);
                            document
                                .getElementById("cancelWarning")
                                .removeEventListener("click", cancelHandler);

                            reloadPosts(res.data.data.reverse());
                            document.getElementById('modalPostListe').style.display = 'block'
                            document.getElementById('postTitle').value = ''
                            document.getElementById('postContent').innerHTML = 'Que pensez-vous ?'
                            cancelImageInsertion()
                            document.getElementById('deleteButton').style.display = 'none';
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

    const showThisPost = (data) => {

        postInfo.title = data.title
        postInfo.info.description = JSON.parse(data.info).description
        postInfo.id = data.id
        postInfo.slug = data.slug
        postInfo.type = data.type
        postInfo.category = data.category
        postInfo.videoUrl = data.link

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

        } else if (data.type == 'video') {
            document.getElementById("inputImage").style.display = "none";
            document.getElementById("videoSection").style.display = "block";

            document.getElementById("iconVideo").style.display = "none";
            document.getElementById("iconTimes").style.display = "inline-block";
            document.getElementById("videoEmbed").style.display = "flex";

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-light-grey', 'w3-black').replace('w3-text-grey', 'w3-text-white');
            document.getElementById("postVideo").value = data.link;

            document.getElementById("showImageWrapper").style.display = "none";
            document.getElementById("audioSection").style.display = "none";
        } else {
            document.getElementById("inputImage").style.display = "flex";

            document.getElementById("videoSection").style.display = "none";

            document.getElementById("iconVideo").style.display = "inline-block";
            document.getElementById("iconTimes").style.display = "none";
            document.getElementById("videoEmbed").style.display = "flex";

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-light-grey', 'w3-black').replace('w3-text-grey', 'w3-text-white');

            document.getElementById("showImageWrapper").style.display = "none";
            document.getElementById("audioSection").style.display = "none";
        }

        document.getElementById('modalPostListe').style.display = 'none';
        document.getElementById('deleteButton').style.display = 'block';
    }

    const closeModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitle").value = "";
        document.getElementById("modalCategory").style.display = "none";
    };

    const openModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitle").value = "";
        document.getElementById("modalCategory").style.display = "block";
    };

    const previewVideo = () => {
        document.getElementById("videoSource").src = getUrl(postInfo.videoUrl);
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
        const glitchCategory = data.map((element, key) => (
            <div key={key} className="w3-flex-row w3-light-grey w3-round w3-overflow w3-flex-center-v" style={{ marginBlock: 4 }}>
                <div
                    className="w3-nowrap w3-hover-grey w3-flex-1 w3-overflow"
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
        document.getElementById("categoryTitle").value = "";
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

        document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-black', 'w3-light-grey').replace('w3-text-white', 'w3-text-grey');
    }

    const closeModalVideoPreview = () => {
        document.getElementById("videoSource").src = "";
        document.getElementById("modalVideoPreview").style.display = "none";
    };

    const addEmbedVideo = () => {

        if (document.getElementById("videoEmbed").className.includes('w3-black')) {
            postInfo.videoUrl = '';
            postInfo.type = 'text';
            document.getElementById("inputImage").style.display = "flex";
            document.getElementById("videoSection").style.display = "none";

            document.getElementById("iconVideo").style.display = "inline-block";
            document.getElementById("iconTimes").style.display = "none";

            document.getElementById("postVideo").value = '';

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-black', 'w3-light-grey').replace('w3-text-white', 'w3-text-grey');
        } else {
            postInfo.type = 'video';
            document.getElementById("inputImage").style.display = "none";
            document.getElementById("videoSection").style.display = "block";

            document.getElementById("iconVideo").style.display = "none";
            document.getElementById("iconTimes").style.display = "inline-block";

            document.getElementById("videoEmbed").className = document.getElementById("videoEmbed").className.replace('w3-light-grey', 'w3-black').replace('w3-text-grey', 'w3-text-white');
        }
    }

    useEffect(() => {

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
                .get(`${source}/_category?xcode=${xcode}`)
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
        } else {
            if (document.getElementById('modalLogin')) {
                document.getElementById('modalLogin').style.display = 'block'
            }
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
            if (
                postInfo.type == "image" &&
                document.getElementById("imageShower").style.backgroundImage
            ) {
                if (!audioElement.src) {
                    postInfo.type = "image/audio";
                    startButton.className =
                        "w3-text-white w3-margin-left w3-flex w3-green w3-border w3-border-green w3-circle w3-flex-center";

                    startButton.disabled = true;
                    stopButton.disabled = false;

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
                    iconPlay.style.display = "inline-block";
                    iconMicro.style.display = "none";

                    recordingState.innerText = "Recording...";
                }
            } else {
                alert("Une image est obligatoire pour ajouter une voix");
            }
        });

        stopButton.addEventListener("click", () => {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                startButton.className =
                    "w3-text-green w3-margin-left w3-flex w3-white w3-border w3-border-green w3-circle w3-flex-center";

                startButton.disabled = false;
                stopButton.disabled = true;

                mediaRecorder.stop();

                recordingState.innerText = "Voice recorded";
                playButton.className =
                    "w3-button w3-hover-text-white w3-green w3-hover-green w3-border w3-border-green w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";
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

                    audioElement.play().catch((error) => {
                        console.error("Error playing audio:", error);
                    });

                    recordingState.innerText = "Playing record...";
                } else {
                    audioElement.pause();

                    iconPause.style.display = "none";
                    iconPlay.style.display = "inline-block";

                    recordingState.innerText = "Voice recorded";
                    0;
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

                startButton.className =
                    "w3-text-green w3-margin-left w3-flex w3-white w3-border w3-border-green w3-circle w3-flex-center";

                stopButton.className =
                    "w3-text-green w3-margin-left w3-flex w3-white w3-border w3-border-green w3-circle w3-flex-center";

                iconPause.style.display = "none";
                iconPlay.style.display = "none";
                iconMicro.style.display = "inline-block";

                startButton.disabled = false;
                stopButton.disabled = true;

                playButton.disabled = true;
                playButton.className =
                    "w3-button w3-hover-text-green w3-hover-white w3-border w3-border-green w3-text-green w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";

                audioElement.removeAttribute("src");
                repeatButton.disabled = true;

                recordingState.innerText = "No record";

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

                playButton.className = "w3-flex-1 w3-button w3-hover-text-white w3-black w3-hover-black w3-border w3-border-black w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";
                postInfo.type = "image/audio";
            };
        };
        setinputAudio(audioSelector)

    }, []);

    return (
        <div id="postCore" style={{ display: 'none' }}>
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
                        onClick={() => document.getElementById("modalPostListe").style.display = 'block'}
                        className="w3-light-grey w3-circle w3-flex w3-flex-center"
                        style={{ width: 32, height: 32 }}
                    >
                        <FontAwesomeIcon
                            icon={faListDots}
                            style={{ width: 16, height: 16 }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ padding: 8 }}>
                <div className="w3-container" style={{ padding: 0 }}>
                    <div className="w3-right" style={{ width: '35%' }}>
                        <div
                            onClick={openModalCategory}
                            className="w3-black w3-center w3-round"
                            style={{ paddingBlock: 7 }}
                        >
                            Catégorie
                        </div>
                    </div>
                    <div className="w3-right" style={{ paddingRight: 16, width: '65%' }}>
                        <select
                            id="postCategory"
                            onChange={(e) => postInfo.category = e.target.value}
                            className="w3-light-grey w3-input w3-border-0 w3-block w3-nowrap w3-overflow w3-round"
                            style={{ paddingBlock: 8 }}
                            defaultValue={null}
                        >
                            <option value={null}>Sélectionner une catégorie</option>
                            {
                                selectCategoryList.map((category, key) => (
                                    <option value={category.id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <input
                    id="postTitle"
                    onChange={(e) => (postInfo.title = e.target.value)}
                    className="w3-input w3-border-0 w3-light-grey"
                    type="text"
                    maxLength={200}
                    style={{ marginTop: 16 }}
                    placeholder="Titre"
                />
                <div
                    contentEditable
                    id="postContent"
                    className="w3-input w3-border-0 w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar"
                    style={{
                        height: 160,
                        minWidth: "100%",
                        marginTop: 16,
                    }}
                >Qu'est-ce que vous pensez ?</div>
                <div className="w3-container" style={{ padding: 0 }}>

                    <div
                        id="videoEmbed"
                        onClick={addEmbedVideo}
                        className="w3-right w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center w3-margin-left"
                        style={{ height: 40, width: 40, marginTop: 16 }}
                    >
                        <FontAwesomeIcon id="iconVideo" icon={faVideo} style={{ width: 16, height: 16 }} />
                        <FontAwesomeIcon id="iconTimes" icon={faTimes} style={{ width: 16, height: 16, display: 'none' }} />
                    </div>
                    <div
                        id="inputImage"
                        onClick={() => inputImage.click()}
                        className="w3-right w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center"
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
                                className="w3-display-middle w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center w3-overflow"
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
                                    className="w3-circle w3-card w3-white w3-flex w3-flex-center"
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
                            className="w3-flex-1 w3-button w3-hover-text-black w3-hover-white w3-light-grey w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v"
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
                            className="w3-text-black w3-margin-left w3-flex w3-border w3-border-black w3-circle w3-flex-center"
                            style={{ width: 36, height: 36, display: 'none' }}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </div>
                        <div
                            disabled
                            id="stopRecord"
                            title="Arrêter l'enregistrement!"
                            className="w3-text-black w3-margin-left w3-flex w3-border w3-border-black w3-circle w3-flex-center"
                            style={{ width: 36, height: 36, display: 'none' }}
                        >
                            <FontAwesomeIcon icon={faStop} />
                        </div>
                        <div
                            id="startRecord"
                            title="Commencer l'enregistrement!"
                            className="w3-text-black w3-margin-left w3-flex w3-border w3-border-black w3-circle w3-flex-center"
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
                            onChange={(e) => postInfo.videoUrl = e.target.value}
                            className="w3-border-0 w3-flex-1 w3-block w3-input w3-light-grey w3-round-xxlarge"
                            type="text"
                            placeholder="Lien video"
                            style={{
                                paddingInline: 24,
                            }}
                        />
                        <div
                            onClick={previewVideo}
                            id="previewVideo"
                            className="w3-pointer w3-text-white w3-margin-left w3-flex  w3-black w3-round-xxlarge w3-flex-center"
                            style={{
                                height: 36,
                                paddingInline: 16,
                            }}
                        >
                            Preview
                        </div>
                    </div>
                </div>

                <hr />

                {/* buton save public | draft */}
                <div style={{ marginTop: 24 }}>
                    <button
                        onClick={() => save("public")}
                        className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
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
                        className="w3-button w3-border w3-border-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
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
                        className="w3-button w3-border w3-border-red w3-text-red w3-round-xxlarge w3-block w3-flex w3-flex-center"
                        style={{ marginTop: 16, display: 'none' }}
                    >
                        Supprimer le post
                    </button>
                </div>
            </div>

            {/* modal add new category */}
            <div id="modalCategory" className="w3-modal">
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 48 }}
                >

                    <div onClick={closeModalCategory} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 32, height: 32, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <div className="w3-flex-row w3-flex-center-v" style={{ paddingInline: 16, paddingBlock: 24 }}>
                        <input
                            id="categoryTitle"
                            onChange={(e) => categoryInfo.name = e.target.value}
                            className="w3-border-0 w3-input w3-border w3-round"
                            placeholder="Nom de la catégorie"
                            type="text"
                        />
                        <button
                            onClick={saveCategory}
                            className="w3-button w3-margin-left w3-round w3-white w3-black w3-flex w3-flex-center"
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
            <div id="modalVideoPreview" className="w3-modal">
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 64 }}
                >

                    <div onClick={closeModalVideoPreview} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 32, height: 32, marginInline: 16, marginTop: 16 }}>
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
            <div id="modalPostListe" className="w3-modal">
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 32 }}
                >

                    <div onClick={() => document.getElementById('modalPostListe').style.display = 'none'} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>

                    <div style={{ paddingInline: 16, paddingBlock: 16 }}>
                        <input
                            id="searchInput"
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
        </div>
    );
}

export default PostCreate;
