'use client'
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { console_source as source } from '../data';


function Recrutement(props) {

    const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

    const [disaplayRecrutement, setdisaplayRecrutement] = useState('');

    const reloadRecrutement = (data) => {
        var glitchRecrutement
        const lightTheme = localStorage.getItem('theme') != 'dark' ? true : false;
        if (data.length > 0) {
            glitchRecrutement = data.map((recrutement, key) => (
                <div key={key} className='w3-half' style={{ padding: 8 }}>
                    <Link
                        href={"/recrutement/" + recrutement.slug}
                    >
                        <div
                            className={(lightTheme ? 'w3-light-grey' : 'w3-black') + " w3-round"}
                            style={{ padding: 16 }}
                        >
                            <div>
                                <div className='w3-big w3-nowrap w3-overflow'>
                                    {recrutement.fullname}
                                </div>
                                <div className='w3-nowrap w3-overflow'>
                                    {recrutement.title}
                                </div>
                            </div>
                            <div className='w3-border-top w3-border-bottom' style={{ marginTop: 8, paddingBlock: 8 }}>
                                <div className='w3-big w3-nowrap w3-overflow'>
                                    {recrutement.adresse}
                                </div>
                                <div className='w3-big w3-nowrap w3-overflow'>
                                    {recrutement.contact}
                                </div>
                                <div className='w3-small w3-text-grey'>
                                    Postulée le {dateMaker(recrutement.updated_at)}
                                </div>
                            </div>
                            <div className={(lightTheme ? 'w3-white' : 'w3-dark-grey') + ' w3-round'} style={{ marginTop: 16, paddingInline: 16, paddingBlock: 8 }} >
                                <div className='w3-nowrap-multiline w3-overflow' style={{ height: 68 }}>
                                    {recrutement.content}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))
        } else {
            glitchRecrutement = (
                <div style={{ padding: 16 }} className={(lightTheme ? 'w3-light-grey' : 'w3-black') + ' w3-round w3-center'}>
                    Aucun condidature pour le moment...
                </div>
            )
        }
        setdisaplayRecrutement(glitchRecrutement)
    }

    const dateMaker = (date) => {
        const dateBrut = date.split('-');
        return dateBrut[2].slice(0, 2) + ' ' + month[dateBrut[1] * 1 - 1] + ' ' + dateBrut[0]

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

        }
        const xcode = localStorage.getItem('x-code')
        axios
            .get(source + "/_recrutement?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    if (res.data.authorized) {
                        reloadRecrutement(res.data.data.reverse());
                    } else {
                        window.location = '/'
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
    }, [])
    return (
        <div className='w3-container'>
            {disaplayRecrutement}
        </div>
    )
}

export default Recrutement