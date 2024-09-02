"use client";
import React, { useEffect, useState } from "react";
import { console_source as source } from "@/app/data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
    faTrashAlt,
    faVideo,
    faWarning,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import slugify from "slugify";

function PostCreate() {

    axios.defaults.withCredentials = true;
    var inputImage = "";
    var inputAudio = "";

    const [postInfo, setPostInfo] = useState({
        id: null,
        title: "",
        slug: "",
        type: "text",
        link: null,
        owner_id: null,
        category: null,
        info: {
            description: "",
        },
        media: null,
        videoUrl: "",
        xcode: null,
        state: "",
    });

    const [userInfo, setuserInfo] = useState({
        id: null,
        email: "",
        key: "",
    });

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

        postInfo.state = state;
        postInfo.slug = slugify(postInfo.title, { lower: true });

        postInfo.info.description = document.getElementById('postContent').innerHTML

        if (postInfo.title.length > 0 && postInfo.info.description.length > 0) {
            document.getElementById("postPublicSpinner").style.display =
                "inline-block";
            document.getElementById("postPublicIcon").style.display = "none";
            var data;
            if (postInfo.media) {
                data = postInfo.media;

                data.append("title", postInfo.title);
                data.append("slug", postInfo.slug);
                data.append("owner_id", postInfo.owner_id);
                data.append("info", JSON.stringify(postInfo.info));
                data.append("type", postInfo.type);
                data.append("state", postInfo.state);
                data.append("xcode", postInfo.xcode);
            } else {
                data = {
                    owner_id: postInfo.owner_id,
                    title: postInfo.title,
                    info: JSON.stringify(postInfo.info),
                    type: postInfo.type,
                    slug: postInfo.slug,
                    state: postInfo.state,
                    xcode: postInfo.xcode,
                };
            }

            try {
                await setCSRFToken();
                if (forumInfos.id) {
                    await axios
                        .patch(source + "/_post/" + forumInfos.id, data)
                        .then((res) => {
                            if (res.data.logedin) {
                                if (state == 'public') {
                                    document.getElementById("forumPublicSpinner").style.display = "none";
                                    document.getElementById("forumPublicIcon").style.display = "inline-draft";
                                } else if (state == 'draft') {
                                    document.getElementById("forumDraftSpinner").style.display = "none";

                                }
                                reloadPost(res.data.data.reverse());
                                document.getElementById('modalForumListe').style.display = 'block'
                                document.getElementById('forumTitle').value = ''
                                document.getElementById('forumContent').innerHTML = 'Que pensez-vous ?'
                                cancelImageInsertion()
                                document.getElementById('deleteButton').style.display = 'none';
                            } else {
                                if (document.getElementById('modalLogin')) {
                                    document.getElementById('modalLogin').style.display = 'block'
                                }
                                if (state == 'public') {
                                    document.getElementById("forumPublicSpinner").style.display = "none";
                                    document.getElementById("forumPublicIcon").style.display = "inline-draft";
                                } else if (state == 'draft') {
                                    document.getElementById("forumDraftSpinner").style.display = "none";
                                }
                            }

                        })
                        .catch((e) => {
                            if (state == 'public') {
                                document.getElementById("forumPublicSpinner").style.display = "none";
                                document.getElementById("forumPublicIcon").style.display = "inline-draft";
                            } else if (state == 'draft') {
                                document.getElementById("forumDraftSpinner").style.display = "none";
                            }
                            if (e.response && e.response.status === 419) {
                                console.error('CSRF token missing or incorrect');
                            } else {
                                console.error('Request failed:', error);
                            }
                        });
                } else {
                    await axios
                        .post(source + "/_post", data)
                        .then((res) => {
                            if (res.data.logedin) {
                                if (state == 'public') {
                                    document.getElementById("forumPublicSpinner").style.display = "none";
                                    document.getElementById("forumPublicIcon").style.display = "inline-draft";
                                } else if (state == 'draft') {
                                    document.getElementById("forumDraftSpinner").style.display = "none";

                                }
                                reloadPost(res.data.data.reverse());
                                document.getElementById('modalForumListe').style.display = 'block'
                                document.getElementById('forumTitle').value = ''
                                document.getElementById('forumContent').innerHTML = 'Que pensez-vous ?'
                                cancelImageInsertion()
                            } else {
                                if (document.getElementById('modalLogin')) {
                                    document.getElementById('modalLogin').style.display = 'block'
                                }
                                if (state == 'public') {
                                    document.getElementById("forumPublicSpinner").style.display = "none";
                                    document.getElementById("forumPublicIcon").style.display = "inline-draft";
                                } else if (state == 'draft') {
                                    document.getElementById("forumDraftSpinner").style.display = "none";
                                }
                            }

                        })
                        .catch((e) => {
                            if (state == 'public') {
                                document.getElementById("forumPublicSpinner").style.display = "none";
                                document.getElementById("forumPublicIcon").style.display = "inline-draft";
                            } else if (state == 'draft') {
                                document.getElementById("forumDraftSpinner").style.display = "none";
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
                    document.getElementById("forumPublicSpinner").style.display = "none";
                    document.getElementById("forumPublicIcon").style.display = "inline-draft";
                } else if (state == 'draft') {
                    document.getElementById("forumDraftSpinner").style.display = "none";
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

    const [step, setstep] = useState({ at: 1, editID: null, this: null });

    const [displayPost, setdisplayPost] = useState("");

    const [displayStep, setdisplayStep] = useState("");

    const getUrl = (embed) => {
        const start = embed.indexOf('src="') + 5;
        const end = embed.indexOf('"', start);
        const result = embed.substring(start, end);
        return result;
    };

    const reloadPost = (data) => {
        const glitchPost = data.map((post, key) => (
            <div key={key} className="w3-half" style={{ padding: 8 }}>
                <div
                    onClick={() => displayThisPost(post)}
                    className="w3-flex-column w3-overflow w3-border w3-round w3-pointer"
                    style={{ height: 320 }}
                >
                    <div
                        className="w3-nowrap w3-overflow w3-light-grey w3-big w3-border-bottom"
                        style={{ paddingBlock: 8, paddingInline: 16 }}
                    >
                        {parse(post.title)}
                    </div>
                    <div
                        style={{ height: 81 }}
                        className="w3-overflow w3-border-bottom"
                    >
                        <div
                            className="w3-overflow w3-nowrap-multiline"
                            style={{
                                paddingInline: 16,
                            }}
                        >
                            {parse(JSON.parse(post.info).description)}
                        </div>
                    </div>
                    {(post.type == "image" || post.type == "image/audio") && (
                        <img
                            alt={"image"}
                            height={200}
                            src={
                                "/images.php?w=320&h=320&zlonk=2733&zlink=" +
                                post.link
                            }
                            style={{
                                objectPosition: "center",
                                objectFit: "cover",
                            }}
                            className="w3-overflow w3-block w3-light-grey"
                        />
                    )}
                    {post.type == "video" && (
                        <iframe
                            className="w3-block"
                            height={200}
                            src={getUrl(post.link)}
                            title={"Title"}
                            frameBorder={0}
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </div>
        ));
        setdisplayPost(glitchPost);
    };

    const displayThisPost = (data) => {
        postInfo.title = data.title;
        postInfo.id = data.id;
        postInfo.link = data.link;
        postInfo.type = data.type;
        postInfo.slug = data.slug;
        postInfo.media = null;
        postInfo.info.description = JSON.parse(data.info).description;

        document.getElementById("postTitle").value = parse(data.title);
        document.getElementById("postDescription").innerHTML = JSON.parse(
            data.info
        ).description;

        if (data.type == "image" || data.type == "image/audio") {
            document.getElementById("imageShower").style.backgroundImage =
                "url(/images/post/" + data.link + ")";
            document.getElementById("imageIcon").style.display = "none";

            document.getElementById("videoLoader").pause();
            document.getElementById("videoSource").src = "";
            document.getElementById("videoLoader").style.display = "none";
            document.getElementById("videoIcon").style.display = "inline-block";

            document.getElementById("postMediaVideo").className =
                "w3-right w3-button w3-grey w3-round w3-flex-1";
            document.getElementById("postMediaImage").className =
                "w3-right w3-button w3-hover-black w3-black w3-round w3-flex-1";

            if (data.type == "image/audio") {
                document.getElementById("audioBox").src =
                    "/audios/post/" + data.link;
                document.getElementById("audioBox").load();
                document.getElementById("pauseRecordIcon").style.display =
                    "none";
                document.getElementById("playRecordIcon").style.display =
                    "inline-block";
                document.getElementById("noRecordIcon").style.display = "none";

                document.getElementById("startRecord").className =
                    "w3-text-black w3-margin-left w3-flex w3-white w3-border w3-border-black w3-circle w3-flex-center";

                document.getElementById("startRecord").disabled = false;
                document.getElementById("stopRecord").disabled = true;

                document.getElementById("recordingState").innerText =
                    "Voice recorded";
                document.getElementById("playRecord").className =
                    "w3-button w3-hover-text-white w3-black w3-hover-black w3-border w3-border-black w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";
            }

            postInfo.type = data.type;
        } else if (data.type == "video") {
            postInfo.videoUrl = data.link;

            document.getElementById("videoSource").src = getUrl(data.link);
            document.getElementById("videoSource").style.display = "block";
            document.getElementById("videoIcon").style.display = "none";

            document.getElementById("postVideo").value = data.link;

            document.getElementById("imageShower").style.backgroundImage = "";
            document.getElementById("imageIcon").style.display = "inline-block";

            document.getElementById("postMediaVideo").className =
                "w3-right w3-button w3-hover-black w3-black w3-round w3-flex-1";
            document.getElementById("postMediaImage").className =
                "w3-right w3-button w3-grey w3-round w3-flex-1";
            postInfo.type = data.type;
        }

        document.getElementById("deletePostButton").style.display =
            "inline-block";
        document.getElementById("modalPost").style.display = "block";
    };

    const supprimer = async () => {
        const xcode = localStorage.getItem("x-code");
        if (forumInfos.id) {
            document.getElementById("modalWarning").style.display = "block";
            document.getElementById("textWarning").innerText =
                "Voulez vous vraiment supprimer ce Forum ...";

            const deleteHandler = async () => {
                document.getElementById("confirmSpinner").style.display =
                    "inline-block";
                await setCSRFToken();
                await axios
                    .delete(source + "/_post/" + forumInfos.id + '?xcode=' + xcode)
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

                            reloadForums(res.data.data.reverse());
                            document.getElementById('modalForumListe').style.display = 'block'
                            document.getElementById('forumTitle').value = ''
                            document.getElementById('forumContent').innerHTML = 'Que pensez-vous ?'
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



    const showThisForum = (data) => {
        forumInfos.title = data.title
        forumInfos.content = data.content
        forumInfos.id = data.id

        document.getElementById('forumTitle').value = data.title
        document.getElementById('forumContent').innerHTML = data.content

        if (data.type == 'image') {
            document.getElementById("showImage").src = source + "/images.php?w=100&h=100&zlonk=3733&zlink=" + data.link;
            document.getElementById("showImageWrapper").style.display = "block";
            document.getElementById("inputImage").style.display = "none";
        }

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
        const glitchCategory = data.map((element, key) => (
            <div key={key} className="w3-flex-row w3-hover-grey topicbar">
                <div
                    onClick={() => changeCoreCategory("category", element)}
                    className="w3-nowrap w3-hover-grey w3-button w3-left-align"
                    style={{ width: 205 }}
                >
                    {element.name}
                </div>
                <div
                    onClick={() => deleteCategory(element.id)}
                    className="w3-hover-red w3-button w3-flex-center topicdelete"
                    style={{ opacity: 0 }}
                >
                    <FontAwesomeIcon className="w3-medium" icon={faTrash} />
                </div>
            </div>
        ));
        document.getElementById("inputCategoryName").value = "";
        setCategories(glitchCategory);
    };

    const changeCoreCategory = (type, data) => {
        setCore("");
        setTimeout(() => {
            setCore(
                <Category
                    user={userInfo}
                    reloadCategory={reloadCategory}
                    data={data}
                />
            );
        }, 10);
    };

    const saveCategory = async () => {
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
        return 0;
        await axios
            .post(source + "/_category", request)
            .then((res) => {
                reloadCategory(res.data.data.reverse());
            })
            .catch((e) => {
                console.error("failure", e);
            });
    };

    const deleteCategory = async (id) => {
        document.getElementById("modalWarning").style.display = "block";
        document.getElementById("textWarning").innerText =
            "Voulez vous vraiment supprimer cette categorie avec Ses elements ...";

        const deleteHandler = async () => {
            document.getElementById("confirmSpinner").style.display =
                "inline-block";
            await axios
                .delete(source + "/_category/" + id)
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

    const cancelImageInsertion = () => {
        postInfo.media = null;
        postInfo.type = "text";

        document.getElementById("showImage").src = '';
        document.getElementById("showImageWrapper").style.display = "none";
        document.getElementById("inputImage").style.display = "flex";

        document.getElementById("audioSection").style.display = "none";
        document.getElementById("videoEmbed").style.display = "flex";
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

        const code = localStorage.getItem("x-code");
        if (code) {
            axios
                .get(`${source}/_auth/${code}/edit`)
                .then((res) => {
                    if (res.data.logedin) {
                        localStorage.setItem("userInfos", JSON.stringify(res.data.user));
                        postInfo.owner_id = res.data.user.key;
                        postInfo.owner_id = res.data.user.key;
                        postInfo.xcode = code;
                        document.getElementById('postCore').style.display = 'block'
                        document.getElementById('modalLogin').style.display = 'none'
                        console.log(JSON.parse(sessionStorage.getItem('userCredentials')));
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
        inputImage = document.createElement("input");
        inputImage.type = "file";
        inputImage.accept = "image/*";

        inputImage.onchange = (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("image", file);

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

        // Upload audio
        inputAudio = document.createElement("input");
        inputAudio.type = "file";
        inputAudio.accept = "audio/*";

        inputAudio.onchange = (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            postInfo.media.append("audio", file);

            reader.onload = (readerEvent) => {
                var content = readerEvent.target.result;
                document.getElementById("audioBox").src = content;

                document.getElementById("videoLoader").pause();
                document.getElementById("videoSource").src = "";

                document.getElementById("startRecord").className =
                    "w3-text-black w3-margin-left w3-flex w3-white w3-border w3-border-black w3-circle w3-flex-center";

                document.getElementById("startRecord").disabled = false;
                document.getElementById("stopRecord").disabled = true;

                document.getElementById("recordingState").innerText =
                    "Voice recorded";
                document.getElementById("playRecord").className =
                    "w3-button w3-hover-text-white w3-black w3-hover-black w3-border w3-border-black w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";

                document.getElementById("pauseRecordIcon").style.display = "none";
                document.getElementById("playRecordIcon").style.display =
                    "inline-block";
                document.getElementById("noRecordIcon").style.display = "none";

                inputAudio.value = "";
                postInfo.type = "image/audio";
            };
        };
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
                            <FontAwesomeIcon style={{ marginRight: 8 }} icon={faPlus} />Catégorie
                        </div>
                    </div>
                    <div className="w3-right" style={{ paddingRight: 16, width: '65%' }}>
                        <select
                            className="w3-light-grey w3-input w3-border-0 w3-block w3-nowrap w3-overflow w3-round"
                            style={{ paddingBlock: 8 }}
                            defaultValue={'category'}
                        >
                            <option value="category" disabled>Sélectionner une catégorie</option>
                            <option value="Acheteur">Acheteur</option>
                            <option value="Rédaction">Rédaction</option>

                        </select>
                    </div>
                </div>

                <input
                    id="postTitle"
                    onChange={(e) => (postInfo.title = e.target.value)}
                    className="w3-input w3-border-0 w3-light-grey"
                    type="text"
                    maxLength={100}
                    style={{ marginTop: 16 }}
                    placeholder="Titre"
                />
                <div
                    id="postContent"
                    className="w3-input w3-border-0 w3-light-grey w3-round"
                    style={{
                        height: 120,
                        minWidth: "100%",
                        marginTop: 16,
                    }}
                >Qu'est-ce que vous pense ?</div>
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
                        onClick={() => save("pubic")}
                        className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
                    >
                        Publier votre forum{" "}
                        <FontAwesomeIcon
                            id="forumPublicIcon"
                            className="w3-margin-left"
                            icon={faArrowRight}
                            style={{ width: 16, height: 16 }}
                        />
                        <FontAwesomeIcon
                            id="forumPublicSpinner"
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
                            id="forumDraftSpinner"
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
                        Supprimer le forum
                    </button>
                </div>
            </div>

            {/* modal add new category */}
            <div id="modalCategory" className="w3-modal">
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: '30%' }}
                >

                    <div onClick={closeModalCategory} className="w3-circle w3-light-grey w3-hover-black w3-flex w3-flex-center" style={{ width: 32, height: 32, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <div style={{ paddingInline: 16, paddingBlock: 24 }}>
                        <input
                            id="categoryTitle"
                            onChange={(e) => categoryInfo.name = e.target.value}
                            className="w3-border-0 w3-input w3-border w3-round"
                            placeholder="Nom de la catégorie"
                            type="text"
                        />
                    </div>

                    <div className="w3-container w3-light-grey w3-padding">
                        <button
                            onClick={saveCategory}
                            id="cancelWarning"
                            className="w3-button w3-right w3-round w3-white w3-black"
                        >
                            Créer une catégorie
                        </button>
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
        </div>
    );
}

export default PostCreate;
