'use client'
import { faCrown, faDollar, faDollarSign, faPlay, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Premium(props) {


    const [posts, setposts] = useState(null)

    const moneyMaker = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const extractDetails = (moduleTitle, title) => {
        let cleanTitle = moduleTitle.replace(title, "").trim();
        let parts = cleanTitle.split('|').map(part => part.trim());

        if (parts >= 3) {
            let secondPart = parts[1];
            let lastPart = parts[parts.length - 1];

            let middlePart = parts.slice(2, parts.length - 1).join(' ').replace(/\s+/g, ' ').trim();

            parts = [secondPart, middlePart, lastPart];
            parts[0] = parts[0].replace(/ /g, '');
            parts[2] = parts[2].replace(/[^\d]/g, '');
        }

        return parts
    }

    // animation: marquee 12s linear infinite;

    const makeMarqueeText = () => {
        const marquees = document.getElementsByClassName('marquee');

        for (let i = 0; i < marquees.length; i++) {
            const marquee = marquees[i].querySelector('span');
            marquee.style.animation = 'marquee '+(marquee.innerText.length/4.5)+'s linear infinite'
        }
    }

    useEffect(() => {

        axios
            .get(source + "/_post/" + props.user + "?c=premium")
            .then((res) => {
                setposts(res.data.data)
                setTimeout(() => {
                    makeMarqueeText();
                }, 200);
            })
            .catch((e) => {
                console.error("failure", e);
            });

    }, [])


    return (
        <div>
            <div>
                {posts && posts.length > 0 &&
                    posts.map((post, key) => (
                        <Link className="postCard" href={'/post/' + post.slug} key={key} style={{ padding: 8, zIndex: 1, width: '33.33%', display: 'inline-block' }}>
                            <div className="w3-overflow w3-round w3-pointer w3-white">
                                <div
                                    className="w3-light-grey w3-big w3-small w3-flex-row w3-flex-center-v"
                                    title={parse(post.title)}
                                >
                                    <div className="w3-nowrap w3-overflow w3-flex-1" style={{ padding: 8 }}>
                                        {
                                            extractDetails(post.title).length >= 3 &&
                                            <div class="marquee">
                                                <span>
                                                    {extractDetails(post.title)[0]} -
                                                    Module {extractDetails(post.title)[1]} :&nbsp;
                                                    {extractDetails(post.title)[2]}
                                                    &nbsp;({moneyMaker(extractDetails(post.title)[3])} Ar)
                                                </span>
                                            </div>
                                        }
                                        {
                                            extractDetails(post.title).length < 3 &&
                                            post.title.length > 36 &&

                                            <div class="marquee">
                                                <span>{parse(post.title)}</span>
                                            </div>
                                        }
                                        {
                                            extractDetails(post.title).length < 3 &&
                                            post.title.length < 36 &&
                                            <span>{parse(post.title)}</span>
                                        }
                                    </div>
                                    <div
                                        title="Premium"
                                        className="w3-yellow w3-circle"
                                        style={{ width: 26, height: 26, marginRight: 4 }}
                                    >
                                        <div className="w3-block w3-height w3-flex w3-flex-center">
                                            <FontAwesomeIcon
                                                icon={faDollar}
                                                style={{ height: 12, width: 12 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div
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
                                        <div className="w3-black w3-opacity-max w3-block w3-height w3-padding w3-display-middle"></div>
                                    )} */}
                                    {post.type == "image/audio" && (
                                        <div
                                            className="w3-white w3-circle w3-display-middle w3-card"
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
                                            className="w3-white w3-circle w3-display-middle w3-card"
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
                                </div>

                            </div>
                        </Link>
                    ))}
            </div>

            {posts && posts.length <= 0 && (
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
