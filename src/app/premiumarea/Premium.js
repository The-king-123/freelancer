'use client'
import { faCrown, faPlay, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Premium() {


    const [posts, setposts] = useState([])

    useEffect(() => {

        axios
            .get(source + "/_post/default?c=default")
            .then((res) => {
                setposts(res.data.data)
            })
            .catch((e) => {
                console.error("failure", e);
            });

    }, [])


    return (
        <div style={{ position: 'relative' }}>
            <div id="homePostCore">
                {posts.length > 0 &&
                    posts.map((post, key) => (
                        <Link href={'/post/' + post.slug} key={key} style={{ padding: 8, zIndex: 1, width: '50%', display: 'inline-block' }}>
                            <div className="w3-overflow w3-round w3-pointer w3-white">
                                <div
                                    className="w3-nowrap w3-overflow w3-light-grey w3-big w3-small"
                                    style={{ paddingBlock: 8, paddingInline: 16 }}
                                    title={parse(post.title)}
                                >
                                    {parse(post.title)}
                                </div>

                                <div
                                    // onClick={() => showSinglePost(post)}
                                    className="postMedia w3-display-container w3-light-grey post-image"
                                    style={{ zIndex: 2 }}
                                >
                                    <Image
                                        alt={"image" + key}
                                        unoptimized
                                        loading="lazy"
                                        onContextMenu={(e) => e.preventDefault()}
                                        height={260}
                                        width={260}
                                        src={
                                            source +
                                            "/images.php?w=260&h2600&zlonk=2733&zlink=" +
                                            post.link
                                        }
                                        style={{
                                            objectPosition: "center",
                                            objectFit: "cover",
                                            zIndex: 1,
                                            height: '65vw',
                                            maxHeight: 260
                                        }}
                                        className="w3-overflow w3-light-grey post-image"
                                    />
                                    {/* {(post.type == "image/audio" || post.type == "video" || post.type == "image/video") && (
                                        <div className="w3-black w3-opacity w3-block w3-height w3-padding w3-display-middle"></div>
                                    )} */}
                                    {post.type == "image/audio" && (
                                        <div
                                            className="w3-white w3-circle w3-display-middle"
                                            style={{ width: 40, height: 40 }}
                                        >
                                            <div className="w3-block w3-height w3-flex w3-flex-center">
                                                <FontAwesomeIcon
                                                    icon={faVolumeHigh}
                                                    style={{ height: 18, width: 18 }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {(post.type == "video" || post.type == "image/video") && (
                                        <div
                                            className="w3-white w3-circle w3-display-middle"
                                            style={{ width: 40, height: 40 }}
                                        >
                                            <div className="w3-block w3-height w3-flex w3-flex-center">
                                                <FontAwesomeIcon
                                                    icon={faPlay}
                                                    style={{ height: 18, width: 18, marginLeft: 4 }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="w3-yellow w3-circle w3-display-bottomright"
                                        style={{ width: 26, height: 26, margin:8 }}
                                    >
                                        <div className="w3-block w3-height w3-flex w3-flex-center">
                                            <FontAwesomeIcon
                                                icon={faCrown}
                                                style={{ height: 12, width: 12 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    ))}
            </div>

            {posts.length <= 0 && (
                <div style={{ paddingInline: 8 }}>
                    <div
                        className="w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
                        style={{ marginBlock: 16, padding: 12 }}
                    >
                        No more post found...
                    </div>
                </div>
            )}
        </div>
    );
}
