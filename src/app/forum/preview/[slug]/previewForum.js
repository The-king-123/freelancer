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
            <div style={{ padding: 8 }}>
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
                            "/images.php?w=720&h=720&zlonk=4733&zlink=" +
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
                <div className='postCore'>
                    <div id='post0' style={{ marginBlock: 16 }} className='w3-overflow w3-nowrap-multiline'>
                        {forum.content}
                    </div>
                </div>
                {
                    JSON.parse(forum.response).map((response, key) => (
                        <div key={key} className='w3-border-left w3-text-grey' style={{ paddingInline: 16, paddingBlock: 4, marginBlock: 4 }}>
                            {response}
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default previewForum