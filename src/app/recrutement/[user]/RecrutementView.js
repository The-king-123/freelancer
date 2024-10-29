
import { console_source as source } from "@/app/data";
import parse from "html-react-parser";
import Image from "next/image";
import React from 'react'

function RecrutementView(props) {
    console.log(props.view);

    const nLangue = [
        '1 sur 6 = A1 (Débutant)',
        '2 sur 6 = A2 (Intermédiaire)',
        '3 sur 6 = B1 (Pré-intermédiaire)',
        '4 sur 6 = B2 (Intermédiaire avancé)',
        ' 5 sur 6 = C1 (Avancé)',
        '5 sur 6 = C2 (Maîtrise)',
    ]

    const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    const moneyMaker = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const dateMaker = (date) => {
        const dateBrut = date.split('-');
        return dateBrut[2].slice(0, 2) + ' ' + month[dateBrut[1] * 1 - 1] + ' ' + dateBrut[0]

    }
    return (
        <div>
            {props.view &&

                <div>

                    <div className="w3-large w3-big">{props.view.fullname}</div>
                    <div className="w3-text-grey">{props.view.title}</div>
                    <div className="w3-border-bottom w3-border-top w3-margin-top" style={{ paddingBlock: 8 }}>
                        <div className="w3-text-grey">{props.view.adresse}</div>
                        <div className="w3-text-grey">{props.view.contact}</div>
                    </div>
                    <div className="w3-border-bottom" style={{ paddingBlock: 8 }}>
                        <div>Prétention salarial : {moneyMaker(props.view.psalarial)}</div>
                        <div>Niveau de langue : {nLangue[JSON.parse(props.view.nlangue).fr * 1 - 1]}</div>
                        <div>{props.view.dactylot == 'true' && 'Je sais taper sans regarder le clavier'}</div>
                    </div>
                    <div style={{ paddingBlock: 8 }}>
                        <div className="w3-black w3-round" style={{ padding: 16 }}>{parse(props.view.content)}</div>
                    </div>


                    <div className="w3-text-grey w3-small">Postulée le {dateMaker(props.view.updated_at)}</div>

                    <div className="w3-margin-top w3-round w3-black" style={{ padding: 8,marginBlock:8 }}>Photo CIN :</div>
                    <Image
                        alt={props.view.title}
                        unoptimized
                        loading="lazy"
                        height={240}
                        width={320}
                        src={
                            source +
                            "/images.php?w=320&h=320&zlonk=6733&zlink=" +
                            props.view.cin
                        }
                        style={{
                            objectPosition: "center",
                            objectFit: "cover",
                            zIndex: 1,
                        }}
                        className="w3-black w3-round"
                    />

                    <div className="w3-margin-top w3-round w3-black" style={{ padding: 8,marginBlock:8 }}>CV :</div>

                    <Image
                        alt={props.view.title}
                        unoptimized
                        loading="lazy"
                        height={520}
                        width={620}
                        src={
                            source +
                            "/images.php?w=620&h=620&zlonk=7733&zlink=" +
                            props.view.cv
                        }
                        style={{
                            objectPosition: "center",
                            objectFit: "cover",
                            zIndex: 1,
                        }}
                        className="w3-black post-image"
                    />
                </div>

            }
        </div>
    )
}

export default RecrutementView