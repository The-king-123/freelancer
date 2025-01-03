'use client'
import { console_source as source } from '@/app/data'
import { faArrowLeft, faKey, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function UserGestion() {
    axios.defaults.withCredentials = true;
    const [imageShowPDP, setimageShowPDP] = useState(source + '/images.php?w=420&h=420&zlonk=3733&zlink=avatar')
    const [users, setusers] = useState([])
    const [search, setsearch] = useState({ keyword: '' })
    const [accessList, setaccessList] = useState({
        id: null,
        access: {
            store: 'ghest',
            post: 'ghest',
            prospecteo: 'ghest',
        }

    })
    const [displayUsers, setdisplayUsers] = useState(
        <div style={{ padding: 24 }} className='w3-center'>
            <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
        </div>
    )

    const reloadList = (data) => {
        var glitchUsers;
        if (data.length > 0) {
            const lightTheme = localStorage.getItem('theme') != 'dark' ? true : false;
            glitchUsers = data.map((user, key) => (
                <div key={key} style={{ padding: 8, display: 'inline-block', width: '33.33%' }}>
                    <div onClick={() => showThisUser(user)} className={(lightTheme ? 'w3-light-grey' : 'w3-black') + ' w3-round w3-pointer  w3-overflow'} style={{ padding: 8 }}>
                        <Image
                            loading='lazy'
                            src={source + '/images.php?w=420&h=420&zlonk=3733&zlink=' + user.key}
                            className={(lightTheme ? 'w3-white' : 'w3-dark-grey') + " w3-round w3-block"}
                            height={100}
                            width={100}
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                        <div style={{ paddingBlock: 8 }}>
                            <div className='w3-overflow w3-nowrap'>
                                {user.fullname}
                            </div>
                            <div className='w3-overflow w3-nowrap w3-small w3-text-grey'>
                                {user.email}
                            </div>
                        </div>
                        <div>
                            {
                                user.authority == 'ghest' &&
                                <div className={(lightTheme ? 'w3-white' : 'w3-dark-grey') + ' w3-circle'} style={{ width: 16, height: 16, marginInline: 4 }}></div>
                            }
                            {
                                user.authority != 'ghest' ?
                                    (JSON.parse(user.authority).post == 'master' && JSON.parse(user.authority).store == 'master' ?
                                        <div className='w3-green w3-circle' style={{ width: 16, height: 16, marginInline: 4 }}></div> :
                                        <div className='w3-amber w3-circle' style={{ width: 16, height: 16, marginInline: 4 }}></div>) : ''
                            }
                            {
                                user.authority == 'full' &&
                                <div className='w3-green w3-circle' style={{ width: 16, height: 16, marginInline: 4 }}></div>
                            }

                        </div>
                    </div>
                </div>
            ))
        } else {
            //
            glitchUsers = (<div style={{ padding: 8 }}>
                <div className="w3-border w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                    <div style={{ paddingInline: 16 }}>
                        Nous n'avons trouver uncun membres ...
                    </div>
                </div>
            </div>)
        }
        setdisplayUsers(glitchUsers)
    }

    const searchInput = (k) => {
        if (k == 'Enter') {
            searchUsers()
        }
    }

    const searchUsers = () => {
        const searchResults = users.filter(item =>
            item.fullname.toLowerCase().includes(search.keyword.toLowerCase()) ||
            item.email.toLowerCase().includes(search.keyword.toLowerCase())
        );
        reloadList(searchResults)
    }

    const showThisUser = (user) => {
        
        accessList.id = user.id

        if (user.authority == 'ghest') {
            accessList.access.store = 'ghest'
            accessList.access.post = 'ghest'
            accessList.access.prospecteo = 'ghest'

            document.getElementById('certainPost').click()
            document.getElementById('certainStore').click()
            document.getElementById('prospecteoGhest').click()

        } else {
            accessList.access.store = JSON.parse(user.authority).store
            accessList.access.post = JSON.parse(user.authority).post
            accessList.access.prospecteo = JSON.parse(user.authority).prospecteo ? JSON.parse(user.authority).prospecteo : 'ghest'

            accessList.access.post == 'ghest' && document.getElementById('certainPost').click()
            accessList.access.post == 'master' && document.getElementById('toutPost').click()
            accessList.access.store == 'ghest' && document.getElementById('certainStore').click()
            accessList.access.store == 'master' && document.getElementById('toutStore').click()
            accessList.access.prospecteo == 'ghest' && document.getElementById('prospecteoGhest').click()
            accessList.access.prospecteo == 'starter' && document.getElementById('prospecteoStarter').click()
            accessList.access.prospecteo == 'liberty' && document.getElementById('prospecteoLiberty').click()
            accessList.access.prospecteo == 'legend' && document.getElementById('prospecteoLegend').click()

        }

        document.getElementById('singleUserFullname').innerText = user.fullname
        document.getElementById('singleUserEmail').innerText = user.email

        document.getElementById('usersListeWrapper').style.display = 'none'
        document.getElementById('singleUserWrapper').style.display = 'block'

        setimageShowPDP(source + '/images.php?w=420&h=420&zlonk=3733&zlink=' + user.key)

    }

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

    const giveAccess = async (core, access) => {

        var accessRequest

        core == 'formation' ? accessList.access.post = access : false
        core == 'store' ? accessList.access.store = access : false
        core == 'prospecteo' ? accessList.access.prospecteo = access : false

        if (accessList.access.post == 'ghest' && accessList.access.store == 'ghest' && accessList.access.prospecteo == 'ghest') {
            accessRequest = {
                id: accessList.id,
                access: 'ghest'
            }
        } else {
            accessRequest = {
                id: accessList.id,
                access: JSON.stringify(accessList.access)
            }
        }

        document.body.style.cursor = 'wait'
        const xcode = localStorage.getItem('x-code');
        await axios
            .patch(source + "/_auth/access?xcode=" + xcode, accessRequest)
            .then((res) => {
                document.body.style.cursor = 'default'
            })
            .catch((e) => {
                console.error("failure", e);
            });
    }

    useEffect(() => {
        if (localStorage.getItem('theme') != 'dark') {

            const elementGrey = document.getElementsByClassName('w3-black').length
            const elementWhite = document.getElementsByClassName('w3-dark-grey').length
            const backTransparent = document.getElementsByClassName('black-opacity').length
            for (let i = 0; i < elementGrey; i++) {
                const element = document.getElementsByClassName('w3-black')[0];
                element.className = element.className.replace('w3-black', 'w3-light-grey')
            }
            for (let i = 0; i < elementWhite; i++) {
                const element = document.getElementsByClassName('w3-dark-grey')[0];
                element.className = element.className.replace('w3-dark-grey', 'w3-white')
            }
            for (let i = 0; i < backTransparent; i++) {
                const element = document.getElementsByClassName('black-opacity')[0];
                element.className = element.className.replace('black-opacity', 'white-opacity')
            }

            document.getElementById('htmlCore').style.display = 'block'
        }
        document.getElementById('backButtonUsergestion').addEventListener('click', () => {
            if (window.history.length > 0) {
                window.history.back();
            } else {
                window.location = '/'
            }
        })

        axios
            .get(source + "/_auth/create")
            .then((res) => {
                res.data.data.forEach((user) => {
                    users.push(user)
                })
                reloadList(res.data.data);


            })
            .catch((e) => {
                console.error("failure", e);
            });
    }, [])


    return (
        <div>

            <div id='usersListeWrapper'>
                <div style={{ padding: 8 }}>
                    <input onKeyUp={e => searchInput(e.key)} onChange={(e) => search.keyword = e.target.value} className='w3-input w3-black w3-round-xxlarge w3-border-0' style={{ paddingInline: 20 }} placeholder='Rechercher un nom ou un email' />
                </div>
                <div>
                    {displayUsers}
                </div>
            </div>

            <div id='singleUserWrapper' style={{ display: 'none' }}>
                <div onClick={() => {
                    document.getElementById('usersListeWrapper').style.display = 'block'
                    document.getElementById('singleUserWrapper').style.display = 'none'
                }} id="backButtonUsergestion" className="w3-wide w3-pointer w3-flex-row w3-flex-center-v w3-large" style={{ paddingInline: 4, marginTop: 10 }}>
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        style={{ width: 24 }}
                    />
                </div>

                <div className='w3-flex-row w3-flex-center-v w3-margin-top'>

                    <div>
                        <Image
                            loading='lazy'
                            id="showImageUser"
                            src={imageShowPDP}
                            className="w3-black w3-circle w3-block w3-overflow"
                            height={80}
                            width={80}
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                maxHeight: 80,
                                maxWidth: 80,
                                minHeight: 80,
                                minWidth: 80
                            }}
                        />
                    </div>

                    <div className='w3-flex-column' style={{ paddingInline: 16 }}>
                        <div id='singleUserFullname' className='w3-overflow w3-nowrap'>
                            RAMBININTSOA Safidy Nirina
                        </div>
                        <div id='singleUserEmail' className='w3-overflow w3-nowrap w3-small w3-text-grey'>
                            thekingluffy132@gmail.com
                        </div>
                    </div>

                </div>

                <div className='w3-margin-top w3-big'>
                    <FontAwesomeIcon
                        icon={faKey}
                        className='w3-margin-right'
                    />
                    Accès au contenu premium
                </div>

                <div style={{ marginTop: 16 }}>
                    <table id="choiceAccess" class="w3-table-all">
                        <thead>
                            <tr>
                                <th>Post (Formation)</th>
                                <th>Boutique (Produits)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className='w3-container' style={{ padding: 0 }}>
                                        <div className='w3-half'>
                                            <input onClick={() => giveAccess('formation', 'master')} style={{ marginRight: 8 }} type="radio" id="toutPost" name="post" />
                                            <label for="toutPost">Tout</label>
                                        </div>
                                        <div className='w3-half'>
                                            <input defaultChecked onClick={() => giveAccess('formation', 'ghest')} style={{ marginRight: 8 }} type="radio" id="certainPost" name="post" />
                                            <label for="certainPost">Certain</label>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className='w3-container' style={{ padding: 0 }}>
                                        <div className='w3-half'>
                                            <input onClick={() => giveAccess('store', 'master')} style={{ marginRight: 8 }} type="radio" id="toutStore" name="store" />
                                            <label for="toutStore">Tout</label>
                                        </div>
                                        <div className='w3-half'>
                                            <input defaultChecked onClick={() => giveAccess('store', 'ghest')} style={{ marginRight: 8 }} type="radio" id="certainStore" name="store" />
                                            <label for="certainStore">Certain</label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='w3-big' style={{ marginTop: 72 }}>
                    <FontAwesomeIcon
                        icon={faKey}
                        className='w3-margin-right'
                    />
                    Accès à la base de donnée Prospecteo
                </div>

                <div style={{ marginTop: 16 }}>
                    <table id="choiceAccessProspecteo" class="w3-table-all">

                        <tbody>
                            <tr>
                                <td>
                                    <div className='w3-container' style={{ padding: 0 }}>
                                        <div>
                                            <input onClick={() => giveAccess('prospecteo', 'starter')} style={{ marginRight: 8 }} type="radio" id="prospecteoStarter" name="prospecteo" />
                                            <label for="prospecteoStarter">🎖️Pack Starter</label>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className='w3-container' style={{ padding: 0 }}>
                                        <div>
                                            <input onClick={() => giveAccess('prospecteo', 'liberty')} style={{ marginRight: 8 }} type="radio" id="prospecteoLiberty" name="prospecteo" />
                                            <label for="prospecteoLiberty">🏅Pack Liberty</label>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className='w3-container' style={{ padding: 0 }}>
                                        <div>
                                            <input onClick={() => giveAccess('prospecteo', 'legend')} style={{ marginRight: 8 }} type="radio" id="prospecteoLegend" name="prospecteo" />
                                            <label for="prospecteoLegend">🥇Pack Legend</label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='w3-dark-grey'>
                                    <div className='w3-container' style={{ padding: 0 }}>
                                        <div>
                                            <input onClick={() => giveAccess('prospecteo', 'ghest')} style={{ marginRight: 8 }} type="radio" id="prospecteoGhest" name="prospecteo" />
                                            <label for="prospecteoGhest">Aucun abonnement</label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    )
}

export default UserGestion