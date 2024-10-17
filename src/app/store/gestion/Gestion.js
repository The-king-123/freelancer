"use client";
import React, { useEffect, useState } from "react";
import { console_source as source } from "@/app/data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faImage,
    faKey,
    faListDots,
    faPager,
    faPaperclip,
    faPlus,
    faSpinner,
    faTimes,
    faTrash,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import slugify from "slugify";

function Gestion() {
    axios.defaults.withCredentials = true;

    const [categoryListe, setcategoryListe] = useState('')
    const [inputImage, setinputImage] = useState(null)
    const [inputFichier, setinputFichier] = useState(null)
    const [keyListe, setkeyListe] = useState('')
    const [selectCategoryList, setselectCategoryList] = useState([])
    const categoryInfo = {
        name: null,
        type: "product",
        state: "publique",
        info: {
            description: "_",
        },
    };
    const [withcmInfo, setwithcmInfo] = useState({
        id: null,
        slug: '',
    })
    const [singleCategoryInfo, setsingleCategoryInfo] = useState({
        id: null,
        name: null,
        type: "actuality",
        state: "publique",
        info: {
            description: "_",
        },
    });
    const [productListe, setproductListe] = useState('')

    const [productInfos, setproductInfos] = useState({
        id: null,
        name: "",
        description: "",
        category: 'default',
        type: 'free',
        image: null,
        fichier: false,
        link: '',
        slug: '',
        info: '_'
    });

    const [codeInfo, setcodeInfo] = useState({
        email: '',
        id: ''
    });

    const openModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitle").value = "";
        document.getElementById("modalCategory").style.display = "block";
    };

    const closeModalCategory = () => {
        singleCategoryInfo.name = ''
        document.getElementById("categoryTitle").value = "";
        document.getElementById("modalCategory").style.display = "none";
    };

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
        console.log(data);
        
        var glicthKeyList
        if (data.length > 0) {
            glicthKeyList = data.map((code, key) => (
                <div key={key} style={{ padding: 4 }}>
                    <div className="w3-light-grey w3-round w3-padding w3-flex-row w3-flex-center-v">
                        <div className="w3-nowrap w3-overflow w3-flex-column w3-flex-1">
                            <div>{code.code}</div>
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
                <div className="w3-light-grey w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                    <div style={{ paddingInline: 16 }}>
                        Ce post n'a aucune code pour le moment...
                    </div>
                </div>
            </div>)
        }
        setkeyListe(glicthKeyList)
    }

    const addKeyToUser = async () => {
        if (isValidEmail(codeInfo.email)) {
            const xcode = localStorage.getItem('x-code');
            await setCSRFToken();
            await axios
                .post(source + "/_downloadcode?xcode=" + xcode, codeInfo)
                .then((res) => {
                    if (res.data.logedin) {
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

    const isValidEmail = (email) => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const showThisProduct = async (data) => {

        productInfos.name = data.name
        productInfos.description = data.description
        productInfos.id = data.id
        productInfos.type = data.type
        productInfos.fichier = true
        productInfos.info = data.info

        document.getElementById('productName').value = data.name
        document.getElementById('productDescription').value = data.description

        document.getElementById("showImage").src = source + "/images.php?w=200&h=200&zlonk=8733&zlink=" + data.link;;
        document.getElementById("showImageWrapper").style.display = "block";
        document.getElementById("inputImage").style.display = "none";

        document.getElementById(data.type + 'Radio').checked = true

        document.getElementById("fileName").innerText = data.name;
        document.getElementById("showFichierWrapper").style.display = "block";
        document.getElementById("inputFichier").style.display = "none";

        document.getElementById('cancelImageInsertion').style.display = 'none'

        document.getElementById('deleteButton').style.display = 'block';
        document.getElementById('modalProductListe').style.display = 'none';

        if (data.type == 'premium') {
            codeInfo.id = data.id
            displayKeyListArea()
            document.getElementById('premiumCodeManager').style.display = 'flex'

            const xcode = localStorage.getItem('x-code')
            await setCSRFToken();
            await axios
                .get(source + "/_downloadcode/" + data.id + "?xcode=" + xcode)
                .then((res) => {
                    if (res.data.logedin) {
                        if (res.data.authorized) {
                            reloadKeyList(res.data.data.reverse())
                        } else {
                            document.location = '/'
                        }
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

    const reloadProducts = (data) => {
        var glitchProduct
        if (data.length > 0) {
            glitchProduct = data.map((product, key) => (
                <div key={key} style={{ padding: 4 }}>
                    <div onClick={() => showThisProduct(product)} className="w3-light-grey w3-round w3-padding w3-nowrap w3-overflow">
                        <div>{product.name}</div>
                        <div className="w3-small w3-text-grey">{product.downloadcount} Downloads{product.type == 'premium' ? <span className="w3-text-yellow"> - Premium</span> : ''}</div>
                    </div>
                </div>
            ))
        } else {
            //
            <div style={{ padding: 8 }}>
                <div className="w3-border w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                    <div style={{ paddingInline: 16 }}>
                        Vous n'avez aucun product pour le moment...
                    </div>
                </div>
            </div>
        }
        setproductListe(glitchProduct)
    }

    const save = async (state) => {

        const xcode = localStorage.getItem("x-code");

        productInfos.slug = slugify(productInfos.name, { lower: true });

        if (productInfos.fichier &&
            productInfos.name.length >= 3 &&
            productInfos.description.length >= 3 &&
            productInfos.type.length >= 3 &&
            productInfos.category.length >= 3) {

            document.getElementById("productPublicSpinner").style.display = "inline-block";
            document.getElementById("productPublicIcon").style.display = "none";

            var data;
            if (productInfos.image) {
                data = productInfos.image;
                data.append("type", productInfos.type);
                data.append("category", productInfos.category);
                data.append("description", productInfos.description);
                data.append("name", productInfos.name);
                data.append("slug", productInfos.slug);
                data.append("info", productInfos.info);

                if (productInfos.id) {
                    data.append("id", productInfos.id)
                }

            } else {
                data = {
                    name: productInfos.name,
                    type: productInfos.type,
                    category: productInfos.category,
                    slug: productInfos.slug,
                    description: productInfos.description,
                    info: productInfos.info,
                };
            }

            try {
                await setCSRFToken();
                if (!productInfos.image && productInfos.id) {
                    await axios
                        .patch(source + "/_store/" + productInfos.id + "?xcode=" + xcode, data)
                        .then((res) => {
                            if (res.data.logedin) {
                                if (res.data.updated) {
                                    document.getElementById("productPublicSpinner").style.display = "none";
                                    document.getElementById("productPublicIcon").style.display = "inline-block";
                                    document.getElementById('productCore').style.display = 'none'

                                    document.getElementById('modalStateProductText').innerText = "Bravo ! Votre produit a bien été mis à jour avec succès..."
                                    document.getElementById('modalStateProduct').style.display = 'block';
                                    setTimeout(() => {
                                        document.getElementById('modalStateProduct').style.display = 'none';
                                        window.location.reload()
                                    }, 3000);
                                }
                            } else {
                                if (document.getElementById('modalLogin')) {
                                    document.getElementById('modalLogin').style.display = 'block'
                                }
                                if (state == 'public') {
                                    document.getElementById("productPublicSpinner").style.display = "none";
                                    document.getElementById("productPublicIcon").style.display = "inline-block";
                                } else if (state == 'draft') {
                                    document.getElementById("productDraftSpinner").style.display = "none";
                                }
                            }

                        })
                        .catch((e) => {
                            if (state == 'public') {
                                document.getElementById("productPublicSpinner").style.display = "none";
                                document.getElementById("productPublicIcon").style.display = "inline-block";
                            } else if (state == 'draft') {
                                document.getElementById("productDraftSpinner").style.display = "none";
                            }
                            if (e.response && e.response.status === 419) {
                                console.error('CSRF token missing or incorrect');
                            } else {
                                console.error('Request failed:', error);
                            }
                        });
                } else {
                    await axios
                        .post(source + "/_store?xcode=" + xcode, data)
                        .then((res) => {
                            if (res.data.saved) {
                                document.getElementById("productPublicSpinner").style.display = "none";
                                document.getElementById("productPublicIcon").style.display = "inline-block";
                                document.getElementById('productCore').style.display = 'none'
                                if (productInfos.id) {
                                    document.getElementById('modalStateProductText').innerText = "Bravo ! Votre produit a bien été mis à jour avec succès..."
                                } else {
                                    document.getElementById('modalStateProductText').innerText = "Bravo ! Votre produit a bien été publié avec succès..."
                                }

                                document.getElementById('modalStateProduct').style.display = 'block';
                                setTimeout(() => {
                                    document.getElementById('modalStateProduct').style.display = 'none';
                                    window.location.reload()
                                }, 3000);
                            }
                        })
                        .catch((e) => {
                            document.getElementById("productPublicSpinner").style.display = "none";
                            document.getElementById("productPublicIcon").style.display = "inline-block";
                            if (e.response && e.response.status === 419) {
                                console.error('CSRF token missing or incorrect');
                            } else {
                                console.error('Request failed:', error);
                            }
                        });
                }
            } catch (error) {
                if (state == 'public') {
                    document.getElementById("productPublicSpinner").style.display = "none";
                    document.getElementById("productPublicIcon").style.display = "inline-block";
                } else if (state == 'draft') {
                    document.getElementById("productDraftSpinner").style.display = "none";
                }

                if (error.response && error.response.status === 419) {
                    console.error('CSRF token missing or incorrect');
                } else {
                    console.error('Request failed:', error);
                }
            }

        }
    };

    const supprimer = async (cm) => {
        const xcode = localStorage.getItem("x-code");
        if (productInfos.id || withcmInfo.id) {
            document.getElementById("modalWarning").style.display = "block";
            document.getElementById("textWarning").innerText =
                "Voulez vous vraiment supprimer ce Product ...";

            const deleteHandler = async () => {
                document.getElementById("confirmSpinner").style.display =
                    "inline-block";
                await setCSRFToken();
                await axios
                    .delete(source + "/_product/" + (cm <= 0 ? productInfos.id : withcmInfo.id) + '?xcode=' + xcode)
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

                            reloadProducts(res.data.data.reverse());
                            document.getElementById('modalProductListe').style.display = 'block'
                            document.getElementById('productName').value = ''
                            document.getElementById('productDescription').innerHTML = 'Que pensez-vous ?'
                            cancelImageInsertion()
                            document.getElementById('deleteButton').style.display = 'none';
                            if (cm > 0) {
                                document.getElementById('modalOptionProduct').style.display = 'none';
                            }
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
        }

    }

    const cancelImageInsertion = () => {
        productInfos.image = null;

        document.getElementById("showImage").src = '';
        document.getElementById("showImageWrapper").style.display = "none";
        document.getElementById("inputImage").style.display = "flex";
        document.getElementById("inputFichier").style.opacity = "0.5";

    }

    const cancelFichierInsertion = () => {
        productInfos.fichier = false;

        if (productInfos.image) {
            productInfos.image.delete("fichier");
        } else {
            cancelImageInsertion()
        }

        document.getElementById("showFichierWrapper").style.display = "none";
        document.getElementById("inputFichier").style.display = "flex";
        document.getElementById('cancelImageInsertion').style.display = 'inline-block'
    }

    const closeModalOptionProduct = () => {
        document.getElementById('modalOptionProduct').style.display = 'none'
        withcmInfo.id = null;
        withcmInfo.slug = '';
    }

    const afficher = () => {
        window.location = '/product/preview/' + withcmInfo.slug
    }

    useEffect(() => {

        const xcode = localStorage.getItem("x-code");

        axios
            .get(source + "/_auth?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    if (res.data.user.designation != 'Admin') {
                        document.getElementById('productCore').innerHTML = null
                        document.location = '/'
                    } else {
                        document.getElementById('productCore').style.display = 'block'
                    }
                } else {
                    if (document.getElementById('modalLogin')) {
                        document.getElementById('modalLogin').style.display = 'block'
                        document.getElementById('productCore').style.display = 'none';
                    }
                }
            })
            .catch((e) => {
                console.error("failure", e);

            });

        if (xcode && xcode != 'null') {

            axios
                .get(`${source}/_store?xcode=${xcode}`)
                .then((res) => {
                    document.getElementById('productCore').style.display = 'block';
                    reloadProducts(res.data.data.reverse())
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        }

        axios
            .get(`${source}/_category/product?xcode=${xcode}`)
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


        // Upload Image
        var imageSelector = document.createElement("input");
        imageSelector.type = "file";
        imageSelector.accept = "image/*";

        imageSelector.onchange = (e) => {
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
                document.getElementById('inputFichier').style.opacity = '1'

                productInfos.image = formData;
            };
        };
        setinputImage(imageSelector)

        // Upload Fichier
        var fichierSelector = document.createElement("input");
        fichierSelector.type = "file";
        fichierSelector.accept = "*/*";

        fichierSelector.onchange = (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);

            productInfos.image.append("fichier", file);

            document.getElementById('cancelImageInsertion').style.display = 'none'

            reader.onload = (readerEvent) => {

                document.getElementById("fileName").innerText = file.name;
                document.getElementById("showFichierWrapper").style.display = "block";
                document.getElementById("inputFichier").style.display = "none";
                productInfos.fichier = true;
            };
        };
        setinputFichier(fichierSelector)
    }, []);

    return (
        <div id="productCore" style={{ position: 'relative', display: 'none' }}>
            <div>
                <div
                    className="w3-medium w3-big w3-flex-row w3-flex-center-v"
                    style={{ padding: 8 }}
                >
                    <div className="w3-flex-row w3-flex-center-v w3-flex-1">
                        <FontAwesomeIcon
                            className="w3-margin-right"
                            icon={faPager}
                            style={{ width: 24, height: 24 }}
                        />{" "}
                        Créer un product
                    </div>
                    <div>
                        <div
                            id="premiumCodeManager"
                            onClick={() => {
                                // document.getElementById('createProductCore').style.display = 'none'
                                document.getElementById("modalKeyListe").style.display = 'block'
                            }}
                            className="w3-black w3-circle w3-flex w3-flex-center w3-margin-right"
                            style={{ width: 32, height: 32, display: 'none' }}
                            title="Gérer votre code premium."
                        >
                            <FontAwesomeIcon
                                icon={faKey}
                                style={{ width: 16, height: 16 }}
                            />
                        </div>
                    </div>
                    <div id="openProductListeButton">
                        <div
                            onClick={() => document.getElementById('modalProductListe').style.display = 'block'}
                            className="w3-black w3-circle w3-flex w3-flex-center"
                            style={{ width: 32, height: 32 }}
                        >
                            <FontAwesomeIcon
                                icon={faListDots}
                                style={{ width: 16, height: 16 }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="w3-container" style={{ padding: 8 }}>
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
                                onChange={(e) => productInfos.category = e.target.value}
                                className="w3-light-grey w3-input w3-border-0 w3-block w3-nowrap w3-overflow w3-round"
                                style={{ paddingBlock: 8 }}
                                defaultValue={"default"}
                            >
                                <option value={'default'}>Sélectionner une catégorie</option>
                                {
                                    selectCategoryList.map((category, key) => (
                                        <option key={key} value={category.id}>{category.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ padding: 8 }}>
                    <label className="w3-margin-right">
                        <input id="premiumRadio" onChange={(e) => productInfos.type = e.target.value
                        } type="radio" name="option" value="premium" style={{ marginRight: 8 }} />
                        Premium
                    </label>
                    <label>
                        <input id="freeRadio" onChange={(e) => productInfos.type = e.target.value
                        } defaultChecked={true} type="radio" name="option" value="free" style={{ marginRight: 8 }} />
                        Free
                    </label>
                </div>

                <div style={{ padding: 8 }}>

                    <input
                        id="productName"
                        onChange={(e) => (productInfos.name = e.target.value)}
                        className="w3-input w3-border-0 w3-light-grey w3-round w3-margin-bottom"
                        type="text"
                        maxLength={200}
                        placeholder="Nom du produits"
                    />

                    <input
                        id="productDescription"
                        onChange={(e) => (productInfos.description = e.target.value)}
                        className="w3-input w3-border-0 w3-light-grey w3-round w3-margin-bottom"
                        type="text"
                        maxLength={200}
                        placeholder="Description courte du produit"
                    />

                    <hr />

                    <div className="w3-container" style={{ padding: 0 }}>
                        <div
                            id="inputImage"
                            onClick={() => inputImage.click()}
                            className="w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center-v"
                            style={{ height: 40, paddingInline: 24 }}
                        >
                            <FontAwesomeIcon className="w3-margin-right" icon={faImage} style={{ width: 16, height: 16 }} />
                            ¬ Importer une image miniature
                        </div>

                        <div style={{ padding: 0 }}>
                            <div
                                className="w3-display-container"
                                id="showImageWrapper"
                                style={{ display: "none", height: 120, width: 120, marginTop: 16 }}
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
                                <div id="cancelImageInsertion" className="w3-display-topright" style={{ padding: 4 }}>
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
                    <div className="w3-container" style={{ padding: 0 }}>
                        <div
                            id="inputFichier"
                            onClick={() => productInfos.image ? inputFichier.click() : false}
                            className="w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center-v"
                            style={{ height: 40, marginTop: 16, paddingInline: 24, opacity: 0.5 }}
                        >
                            <FontAwesomeIcon className="w3-margin-right" icon={faPaperclip} style={{ width: 16, height: 16 }} />
                            ¬ Importer votre fichier
                        </div>

                        <div style={{ padding: 0, marginTop: 16 }}>
                            <div
                                className="w3-display-container"
                                id="showFichierWrapper"
                                style={{ display: "none", width: 320, padding: 16, marginTop: 24 }}
                            >
                                <div id="fileName" className="w3-display-middle w3-block w3-height w3-light-grey w3-round w3-overflow w3-nowrap" style={{ padding: 16, height: 54 }}>
                                    Just a file name
                                </div>
                                <div className="w3-display-topright" style={{ padding: 4 }}>
                                    <div
                                        onClick={cancelFichierInsertion}
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
                    {/* //pdf reader */}
                    {/* <PdfReader /> */}
                    <div style={{ marginTop: 24 }}>
                        <button
                            onClick={() => save("public")}
                            className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
                        >
                            Mise en vente{" "}
                            <FontAwesomeIcon
                                id="productPublicIcon"
                                className="w3-margin-left"
                                icon={faArrowRight}
                                style={{ width: 16, height: 16 }}
                            />
                            <FontAwesomeIcon
                                id="productPublicSpinner"
                                className="w3-spin w3-margin-left"
                                icon={faSpinner}
                                style={{ width: 16, height: 16, display: "none" }}
                            />
                        </button>

                        <button
                            id="deleteButton"
                            onClick={() => supprimer(0)}
                            className="w3-button w3-hover-red w3-border w3-border-red w3-text-red w3-round-xxlarge w3-block w3-flex w3-flex-center"
                            style={{ marginTop: 16, display: 'none' }}
                        >
                            Supprimer le product
                        </button>
                    </div>
                </div>
            </div>

            {/* modal product liste */}
            <div id="modalProductListe" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', display: 'block', height: 'calc(100vh - 16px)' }}>
                <div
                    className="w3-modal-content w3-card w3-round w3-overflow"
                    style={{ maxWidth: 420, top: 32 }}
                >

                    <div onClick={() => document.getElementById('modalProductListe').style.display = 'none'} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>

                    <div style={{ paddingInline: 16, paddingBlock: 16 }}>
                        <input
                            id="searchInput"
                            className="input w3-border-0 w3-input w3-border w3-round-xxlarge"
                            placeholder="Chercher un product"
                            type="text"
                        />
                    </div>
                    <div style={{ height: '50vh', paddingInline: 12, marginBottom: 16 }} className="w3-overflow-scroll w3-noscrollbar">
                        {
                            productListe
                        }
                    </div>

                </div>
            </div>
            {/* end modal product liste */}

            {/* modal add new category */}
            <div id="modalCategory" className="w3-modal w3-round white-opacity" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
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

            {/* modal option */}
            <div id="modalStateProduct" className="white-opacity w3-modal w3-round" style={{ position: 'absolute', height: 'calc(100vh - 16px)' }}>
                <div
                    onClick={e => e.target.style.display = 'none'}
                    className="w3-modal-content w3-card-4 w3-animate-top w3-round w3-overflow"
                    style={{ width: 320, marginTop: '20vh', paddingBlock: 8 }}
                >
                    <div className="w3-padding">
                        <div id="modalStateProductText">
                            Bravo ! Votre produit a bien été publié avec succès...
                        </div>
                    </div>
                </div>
            </div>
            {/* end modal warning */}

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
                        }} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <div className="w3-flex-1"></div>
                        <div>
                            <div id="afficheNewKeyArea" title="Ajouter un nouveau code utilisateur" onClick={displayAddNewKeyArea} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16 }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                            <div id="afficheKeyListArea" title="Afficher la liste code utilisateur" onClick={displayKeyListArea} className="w3-circle w3-black w3-hover-black w3-flex w3-flex-center" style={{ width: 24, height: 24, marginInline: 16, marginTop: 16, display: 'none' }}>
                                <FontAwesomeIcon icon={faListDots} />
                            </div>
                        </div>
                    </div>
                    <div id="newKeyArea" style={{ display: 'none', paddingBottom: 24 }}>
                        <div className="w3-flex-row w3-flex-center-v" style={{ paddingInline: 16, paddingBlock: 24 }}>
                            <input
                                id="categoryTitle"
                                onChange={(e) => codeInfo.email = e.target.value}
                                className="w3-border-0 w3-input w3-border w3-round"
                                placeholder="E-mail ou clé de reference"
                                type="text"
                            />
                            <button
                                onClick={addKeyToUser}
                                className="w3-button w3-margin-left w3-round w3-white w3-black w3-flex w3-flex-center"
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
                                id="searchInput"
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

export default Gestion;
