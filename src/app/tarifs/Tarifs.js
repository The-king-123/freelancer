import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Tarifs() {
    const tarifs = [
        {
            name: 'Pack Gold',
            price: '200.000 Ar',
            access: [
                'Access de contenu illimite',
                'Access de contenu illimite',
                'Access de contenu illimite',
                'Access de contenu illimite',
            ]
        },
        {
            name: 'Pack Diamand',
            price: '200.000 Ar',
            access: [
                'Access de contenu illimite',
                'Access de contenu illimite',
                'Access de contenu illimite',
                'Access de contenu illimite',
            ]
        },
        {
            name: 'Pack Silver',
            price: '200.000 Ar',
            access: [
                'Access de contenu illimite',
                'Access de contenu illimite',
                'Access de contenu illimite',
                'Access de contenu illimite',
            ]
        }
    ]
    const colors = [
        'w3-green',
        'w3-blue',
        'w3-amber',
        'w3-red',
        'w3-pink',
        'w3-purple',
    ]
    return (
        <div>
            <div>
                <div className='w3-container' style={{ padding: 0 }}>
                    {
                        tarifs.map((tarif, key) => (
                            <div key={key} className='w3-half' style={{ padding: 8 }}>
                                <div className='w3-light-grey w3-round'>
                                    <div className={'w3-round w3-text-white '+(tarifs.length<=3 ? colors[key+1] : colors[key])} style={{ paddingBlock: 16, paddingInline: 20 }}>
                                        <div className='w3-big w3-medium'>
                                            {tarif.name}
                                        </div>
                                        <div className='w3-xlarge w3-big'>
                                            {tarif.price}
                                        </div>
                                    </div>
                                    <div style={{ padding: 16 }}>
                                        {
                                            tarif.access.map((acc, k) => (
                                                <div key={k} className={'w3-flex-row w3-flex-center-v '+((k>=tarif.access.length-1) ? '' : 'w3-border-bottom ')} style={{ paddingBlock: 10 }}>
                                                    <FontAwesomeIcon className='w3-text-green' icon={faCheckCircle} style={{ marginRight: 6 }} /> {acc}
                                                </div>
                                            ))
                                        }
                                    </div>

                                </div>
                            </div>

                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Tarifs