'use client'
import { faCheckCircle, faMoneyBill1 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { console_source as source } from '../data';


function Tarifs({ tarif }) {

    const tarifs = tarif ? tarif.sort((a, b) => a.rang - b.rang).reverse() : false;
    const colors = [
        'w3-green',
        'w3-blue',
        'w3-amber',
        'w3-red',
        'w3-pink',
        'w3-purple',
    ]
    const [displayTarifs, setdisplayTarifs] = useState('')

    const reloarTarifs = (data) => {
        var glitchTarif
        if (data.length > 0) {
            glitchTarif = data.map((tarif, key) => (
                <div key={key} className='w3-half' style={{ padding: 8 }}>
                    <div className='w3-light-grey w3-round'>
                        <div className={'w3-round w3-text-white ' + (data.length <= 3 ? colors[key + 1] : colors[key])} style={{ paddingBlock: 16, paddingInline: 20 }}>
                            <div className='w3-big w3-medium'>
                                {tarif.name}
                            </div>
                            <div className='w3-xlarge w3-big'>
                                {tarif.tarif}
                            </div>
                        </div>
                        <div style={{ padding: 16 }}>
                            {
                                JSON.parse(tarif.access).map((acc, k) => (
                                    <div key={k} className={'w3-flex-row w3-flex-center-v ' + ((k >= JSON.parse(tarif.access).length - 1) ? '' : 'w3-border-bottom ')} style={{ paddingBlock: 10 }}>
                                        <FontAwesomeIcon className='w3-text-green' icon={faCheckCircle} style={{ marginRight: 6 }} /> {acc}
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>
            ))

        } else {
            glitchTarif = (<div style={{ padding: 8 }}>
                <div className="w3-border w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
                    <div style={{ paddingInline: 16 }}>
                        Vous n'avez aucun tarif pour le moment...
                    </div>
                </div>
            </div>)
        }

        setdisplayTarifs(glitchTarif)
    }
    useEffect(() => {

        if (!tarif) {



            axios
                .get(source + "/_tarifs/default")
                .then((res) => {
                    reloarTarifs(res.data.data);
                })
                .catch((e) => {
                    console.error("failure", e);
                });
        } else {
            reloarTarifs(tarifs)
        }

    }, [])

    return (
        <div>
            <div className='w3-medium' style={{ padding: 8 }}>
                <div className='w3-flex w3-flex-center w3-circle w3-yellow w3-hover-yellow' style={{ width: 32, height: 32, marginBottom: 16 }}>
                    <FontAwesomeIcon icon={faMoneyBill1} className='w3-large' />

                </div>
                <div>
                    Afin de rendre nos programmes accessibles à tous, nous proposons une grille tarifaire flexible, adaptée à différents profils et besoins.
                </div>
            </div>
            <div>
                <div className='w3-container' style={{ padding: 0 }}>
                    {
                        displayTarifs
                    }
                </div>
            </div>
        </div>
    )
}

export default Tarifs