
'use client'
import { console_source as source } from "@/app/data";
import axios from "axios";
import parse from "html-react-parser";
import Image from "next/image";
import React, { useEffect, useState } from 'react'

function RecrutementView(props) {

    const [recrutement, setrecrutement] = useState('')
    const nLangue = [
        '1 sur 6 = A1 (Débutant)',
        '2 sur 6 = A2 (Intermédiaire)',
        '3 sur 6 = B1 (Pré-intermédiaire)',
        '4 sur 6 = B2 (Intermédiaire avancé)',
        '5 sur 6 = C1 (Avancé)',
        '6 sur 6 = C2 (Maîtrise)',
    ]

    const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    
    const moneyMaker = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const dateMaker = (date) => {
        const dateBrut = date.split('-');
        return dateBrut[2].slice(0, 2) + ' ' + month[dateBrut[1] * 1 - 1] + ' ' + dateBrut[0]

    }
    useEffect(() => {

        const lightTheme = localStorage.getItem('theme') != 'dark' ? true : false;
        const xcode = localStorage.getItem('x-code')

        axios
            .get(source + "/_recrutement/" + props.user + "/edit?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    if (res.data.authorized) {
                        setrecrutement(
                            <div>
                                <div className="w3-large w3-big">{res.data.data[0].fullname}</div>
                                <div className="w3-text-grey">{res.data.data[0].title}</div>
                                <div className="w3-border-bottom w3-border-top w3-margin-top" style={{ paddingBlock: 8 }}>
                                    <div className="w3-text-grey">{res.data.data[0].adresse}</div>
                                    <div className="w3-text-grey">{res.data.data[0].contact}</div>
                                </div>
                                <div className="w3-border-bottom" style={{ paddingBlock: 8 }}>
                                    <div>Prétention salarial : {moneyMaker(res.data.data[0].psalarial)}</div>
                                    <div>Niveau de langue : {nLangue[JSON.parse(res.data.data[0].nlangue).fr * 1 - 1]}</div>
                                    <div>{res.data.data[0].dactylot == 'true' && 'Je sais taper sans regarder le clavier'}</div>
                                </div>
                                <div style={{ paddingBlock: 8 }}>
                                    <div className={(lightTheme ? 'w3-light-grey' : 'w3-black') + " w3-round"} style={{ padding: 16 }}>{parse(res.data.data[0].content)}</div>
                                </div>


                                <div className="w3-text-grey w3-small">Postulée le {dateMaker(res.data.data[0].updated_at)}</div>

                                <div className={(lightTheme ? 'w3-light-grey' : 'w3-black') + " w3-margin-top w3-round"} style={{ padding: 8, marginBlock: 8 }}>Photo CIN :</div>
                                <Image
                                    alt={res.data.data[0].title}
                                    unoptimized
                                    loading="lazy"
                                    layout="intrinsic"
                                    height={340}
                                    width={380}
                                    src={
                                        source +
                                        "/images.php?w=420&h=420&zlonk=6733&zlink=" +
                                        res.data.data[0].cin
                                    }
                                    style={{
                                        objectPosition: "center",
                                        objectFit: "contain",
                                        zIndex: 1,
                                    }}
                                    className={(lightTheme ? 'w3-light-grey' : 'w3-black') + " w3-round"}
                                />

                                <div className={(lightTheme ? 'w3-light-grey' : 'w3-black') + " w3-margin-top w3-round"} style={{ padding: 8, marginBlock: 8 }}>Photo CV :</div>

                                <Image
                                    alt={res.data.data[0].title}
                                    unoptimized
                                    loading="lazy"
                                    layout="intrinsic"
                                    height={520}
                                    width={620}
                                    src={
                                        source +
                                        "/images.php?w=1024&h=1024&zlonk=7733&zlink=" +
                                        res.data.data[0].cv
                                    }
                                    style={{
                                        objectPosition: "center",
                                        objectFit: "contain",
                                        zIndex: 1,
                                    }}
                                    className={(lightTheme ? 'w3-light-grey' : 'w3-black') + " post-image"}
                                />
                            </div>
                        );
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
        <div>
            {recrutement}
        </div>
    )
}

export default RecrutementView