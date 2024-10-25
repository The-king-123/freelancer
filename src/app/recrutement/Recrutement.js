import Link from 'next/link'
import React from 'react'


function Recrutement(props) {

    const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

    const dateMaker = (date) => {
        const dateBrut = date.split('-');
        return dateBrut[2].slice(0,2) + ' ' + month[dateBrut[1]*1-1] + ' ' + dateBrut[0]
        
    }
    return (
        <div className='w3-container'>
            {props.recrutements.length > 0 &&
                props.recrutements.map((recrutement, key) => (
                    <div key={key} className='w3-half' style={{padding:8}}>
                        <Link
                            href={"/recrutement/" + recrutement.slug}
                        >
                            <div
                                className="w3-light-grey w3-round"
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
                                    <div>
                                        {recrutement.adresse}
                                    </div>
                                    <div>
                                        {recrutement.contact}
                                    </div>
                                    <div className='w3-small w3-text-grey'>
                                        Postulée le {dateMaker(recrutement.updated_at)}
                                    </div>
                                </div>
                                <div className='w3-round w3-white' style={{ marginTop: 16, paddingInline: 16, paddingBlock: 8 }} >
                                    <div className='w3-nowrap-multiline w3-overflow' style={{height:68}}>
                                        {recrutement.content}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
        </div>
    )
}

export default Recrutement