"use client";
import React, { useEffect, useState } from "react";
import { console_source as source } from "@/app/data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faImage,
    faImages,
    faListDots,
    faNewspaper,
    faSpinner,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import slugify from "slugify";

function PostCreate() {
    axios.defaults.withCredentials = true;
    var inputImage = "";
    var inputAudio = "";

    const postInfos = {
        ownerId: null,
        title: "",
        content: "",
        image: null,
        type: "text",
        state: "",
        slug: "",
        xcode: null,
    };
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

        postInfos.state = state;
        postInfos.slug = slugify(postInfos.title, { lower: true });

        console.log(postInfos);

        if (postInfos.title.length > 0 && postInfos.content.length > 0) {
            document.getElementById("postPublicSpinner").style.display =
                "inline-block";
            document.getElementById("postPublicIcon").style.display = "none";
            var data;
            if (postInfos.image) {
                data = postInfos.image;

                data.append("title", postInfos.title);
                data.append("slug", postInfos.slug);
                data.append("ownerId", postInfos.ownerId);
                data.append("content", postInfos.content);
                data.append("type", postInfos.type);
                data.append("state", postInfos.state);
                data.append("xcode", postInfos.xcode);
            } else {
                data = {
                    ownerId: postInfos.ownerId,
                    title: postInfos.title,
                    content: postInfos.content,
                    type: postInfos.type,
                    slug: postInfos.slug,
                    state: postInfos.state,
                    xcode: postInfos.xcode,
                };
            }

            try {
                await setCSRFToken();

                const response = await axios.post(source + '/_post', data);
                document.getElementById('postPublicSpinner').style.display = 'inline-block';
                document.getElementById('postPublicIcon').style.display = 'none';
                closeModalPost();
                reloadPost(response.data.data);
            } catch (error) {
                document.getElementById('postPublicSpinner').style.display = 'inline-block';
                document.getElementById('postPublicIcon').style.display = 'none';

                if (error.response && error.response.status === 419) {
                    console.error('CSRF token missing or incorrect');
                } else {
                    console.error('Request failed:', error);
                }
            }

            await axios
                .post(source + "/_post", data)
                .then((res) => {
                    document.getElementById("postPublicSpinner").style.display =
                        "inline-block";
                    document.getElementById("postPublicIcon").style.display = "none";
                    closeModalPost();
                    reloadPost(res.data.data);
                })
                .catch((e) => {
                    document.getElementById("postPublicSpinner").style.display =
                        "inline-block";
                    document.getElementById("postPublicIcon").style.display = "none";
                    if (e.response && e.response.status === 419) {
                        console.error('CSRF token missing or incorrect');
                    } else {
                        console.error('Request failed:', error);
                    }
                });

        }
    };
    const [postInfo, setPostInfo] = useState({
        id: null,
        title: "",
        slug: "",
        type: "image",
        link: null,
        owner_id: null,
        category: null,
        info: {
            description: "",
        },
        media: null,
        videoUrl: "",
    });

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
                "w3-right w3-button w3-hover-green w3-green w3-round w3-flex-1";

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
                    "w3-text-green w3-margin-left w3-flex w3-white w3-border w3-border-green w3-circle w3-flex-center";

                document.getElementById("startRecord").disabled = false;
                document.getElementById("stopRecord").disabled = true;

                document.getElementById("recordingState").innerText =
                    "Voice recorded";
                document.getElementById("playRecord").className =
                    "w3-button w3-hover-text-white w3-green w3-hover-green w3-border w3-border-green w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";
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
                "w3-right w3-button w3-hover-green w3-green w3-round w3-flex-1";
            document.getElementById("postMediaImage").className =
                "w3-right w3-button w3-grey w3-round w3-flex-1";
            postInfo.type = data.type;
        }

        document.getElementById("deletePostButton").style.display =
            "inline-block";
        document.getElementById("modalPost").style.display = "block";
    };

    const deletePost = async () => {
        document.getElementById("postDeleteSpinner").style.display =
            "inline-block";
        await axios
            .delete(
                "/_post/" +
                postInfo.id +
                "?q=" +
                postInfo.owner_id +
                "&c=" +
                postInfo.category
            )
            .then((res) => {
                document.getElementById("postDeleteSpinner").style.display =
                    "none";

                closeModalPost();
                reloadPost(res.data.data.reverse());
            })
            .catch((e) => {
                console.error("failure", e);
                window.alert("There is a probleme, your post is not deleted!!");
                document.getElementById("postDeleteSpinner").style.display =
                    "none";
            });
    };

    const savePost = async () => {
        if (postInfo.title.length > 0) {
            if (postInfo.id == null) {
                document.getElementById("postSaveSpinner").style.display =
                    "inline-block";
                var data;
                if (postInfo.media) {
                    data = postInfo.media;

                    data.append("title", postInfo.title);
                    data.append("slug", postInfo.slug);
                    data.append("type", postInfo.type);
                    data.append("owner_id", postInfo.owner_id);
                    data.append("category", postInfo.category);
                    data.append("info", JSON.stringify(postInfo.info));
                } else {
                    data = {
                        title: postInfo.title,
                        slug: postInfo.slug,
                        type: postInfo.type,
                        owner_id: postInfo.owner_id,
                        category: postInfo.category,
                        info: JSON.stringify(postInfo.info),
                        videoUrl: postInfo.videoUrl,
                    };
                }

                await axios
                    .post("/_post", data)
                    .then((res) => {
                        document.getElementById(
                            "postSaveSpinner"
                        ).style.display = "none";

                        closeModalPost();
                        reloadPost(res.data.data);
                    })
                    .catch((e) => {
                        document.getElementById(
                            "postSaveSpinner"
                        ).style.display = "none";
                        window.alert(
                            "There is a probleme, your post is not saved!!"
                        );
                        console.error("failure", e);
                    });
            } else {
                document.getElementById("postSaveSpinner").style.display =
                    "inline-block";
                var data;
                if (postInfo.media) {
                    data = postInfo.media;

                    data.append("id", postInfo.id);
                    data.append("title", postInfo.title);
                    data.append("slug", postInfo.slug);
                    data.append("type", postInfo.type);
                    data.append("owner_id", postInfo.owner_id);
                    data.append("category", postInfo.category);
                    data.append("info", JSON.stringify(postInfo.info));

                    await axios
                        .post("/_post", data)
                        .then((res) => {
                            document.getElementById(
                                "postSaveSpinner"
                            ).style.display = "none";

                            closeModalPost();
                            reloadPost(res.data.data.reverse());
                        })
                        .catch((e) => {
                            console.error("failure", e);
                            document.getElementById(
                                "postSaveSpinner"
                            ).style.display = "none";
                            window.alert(
                                "There is a probleme, your post is not updated!!"
                            );
                        });
                } else {
                    postInfo;

                    await axios
                        .patch("/_post/" + postInfo.id, postInfo)
                        .then((res) => {
                            document.getElementById(
                                "postSaveSpinner"
                            ).style.display = "none";

                            closeModalPost();
                            reloadPost(res.data.data.reverse());
                        })
                        .catch((e) => {
                            console.error("failure", e);
                            document.getElementById(
                                "postSaveSpinner"
                            ).style.display = "none";
                            window.alert(
                                "There is a probleme, your post is not updated!!"
                            );
                        });
                }
            }
        }
    };

    const closeModalPost = () => {
        postInfo.title = "";
        postInfo.info.description = "";
        postInfo.type = "image";
        postInfo.slug = "";
        postInfo.media = null;
        postInfo.id = null;

        document.getElementById("postTitle").value = "";
        document.getElementById("postDescription").innerHTML = "";

        document.getElementById("videoSource").src = "";
        document.getElementById("videoSource").style.display = "none";
        document.getElementById("videoIcon").style.display = "inline-block";

        document.getElementById("postVideo").value = '';

        document.getElementById("imageShower").style.backgroundImage = "";
        document.getElementById("imageIcon").style.display = "inline-block";

        inputImage.value = "";
        inputVideo.value = "";

        document.getElementById("savePostButton").style.display =
            "inline-block";
        document.getElementById("deletePostButton").style.display = "none";

        document.getElementById("modalPost").style.display = "none";

        document.getElementById("audioBox").pause();
        document.getElementById("repeatRecord").click();
    };

    const previewVideo = () => {
        document.getElementById("videoSource").src = getUrl(postInfo.videoUrl);
        document.getElementById("videoSource").style.display = "block";
        document.getElementById("videoIcon").style.display = "none";
    };


    useEffect(() => {

        const code = localStorage.getItem("x-code");
        if (code) {
            axios
                .get(`${source}/_auth/${code}/edit`)
                .then((res) => {
                    if (res.data.logedin) {
                        localStorage.setItem("userInfos", JSON.stringify(res.data.user));
                        postInfos.ownerId = res.data.user.key;
                        postInfo.owner_id = res.data.user.key;
                        postInfos.xcode = code;
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

                postInfos.image = formData;
                postInfos.type = "image";
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
                    "w3-text-green w3-margin-left w3-flex w3-white w3-border w3-border-green w3-circle w3-flex-center";

                document.getElementById("startRecord").disabled = false;
                document.getElementById("stopRecord").disabled = true;

                document.getElementById("recordingState").innerText =
                    "Voice recorded";
                document.getElementById("playRecord").className =
                    "w3-button w3-hover-text-white w3-green w3-hover-green w3-border w3-border-green w3-text-white w3-round-xxlarge w3-flex w3-flex-row w3-flex-center-v";

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
                        style={{ width: 16, height: 16 }}
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
                <input
                    onChange={(e) => (postInfos.title = e.target.value)}
                    className="w3-input w3-border-0 w3-light-grey"
                    type="text"
                    maxLength={100}
                    placeholder="Titre"
                />
                <textarea
                    onChange={(e) => (postInfos.content = e.target.value)}
                    className="w3-input w3-border-0 w3-light-grey"
                    placeholder="Qu'est-ce que vous pense ?"
                    style={{
                        minHeight: 120,
                        maxHeight: 120,
                        minWidth: "100%",
                        marginTop: 16,
                    }}
                />
                <div className="w3-container" style={{ padding: 0 }}>
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
                                height={120}
                                width={120}
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                            <div className="w3-display-topright" style={{ padding: 4 }}>
                                <div
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
                <div style={{ marginTop: 24 }}>
                    <button
                        onClick={() => save("pubic")}
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
                </div>
            </div>
        </div>
    );
}

export default PostCreate;
