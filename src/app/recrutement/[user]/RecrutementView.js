
import { console_source as source } from "@/app/data";
import parse from "html-react-parser";
import Image from "next/image";
import React from 'react'

function RecrutementView(props) {
    console.log(props.view);

    const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

    const dateMaker = (date) => {
        const dateBrut = date.split('-');
        return dateBrut[2].slice(0, 2) + ' ' + month[dateBrut[1] * 1 - 1] + ' ' + dateBrut[0]

    }
    return (
        <div>
            {props.view &&

                <div>

                    <div>{props.view.fullname}</div>
                    <div>{props.view.title}</div>
                    <div>{props.view.adress}</div>
                    <div>{props.view.contact}</div>
                    <div>{props.view.psalarial}</div>
                    <div>{props.view.nlangue}</div>
                    <div>{props.view.dactylot}</div>
                    <div>{parse(props.view.content)}</div>
                    <Image
                        alt={props.view.title}
                        unoptimized
                        loading="lazy"
                        height={520}
                        width={620}
                        src={
                            source +
                            "/images.php?w=620&h=620&zlonk=6733&zlink=" +
                            props.view.cin
                        }
                        style={{
                            objectPosition: "center",
                            objectFit: "cover",
                            zIndex: 1,
                        }}
                        className="w3-light-grey post-image"
                    />
            
                    <div>{props.view.cin}</div>
                    <div>{props.view.cv}</div>
                    <div>{dateMaker(props.view.updated_at)}</div>
                </div>

            }
        </div>
    )
}

export default RecrutementView