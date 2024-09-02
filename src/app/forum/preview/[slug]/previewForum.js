'use client'
import { console_source as source } from '@/app/data';
import Image from 'next/image';
import React, { useEffect } from 'react'

function previewForum({ forum }) {

    useEffect(() => {
        console.log(forum);

    }, [])

    return (
        <div>
            <div style={{padding:8}}>
                {forum.type == "image" &&
                    <Image
                        id="postImageMedia"
                        alt={forum.title}
                        unoptimized
                        loading="lazy"
                        height={420}
                        width={520}
                        src={
                            source +
                            "/images.php?w=720&h=720&zlonk=2733&zlink=" +
                            forum.link
                        }
                        style={{
                            objectPosition: "center",
                            objectFit: "cover",
                        }}
                        className="w3-light-grey post-image w3-round w3-overflow"
                    />
                }
                <div className='w3-big w3-large w3-margin-top'>
                    {forum.title}
                </div>
                <div style={{marginBlock:16}}>
                    {forum.content}
                </div>
            </div>
        </div>
    )
}

export default previewForum