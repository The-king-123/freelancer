"use client";

import {
  faArrowLeft,
  faDownload,
  faPause,
  faPlay,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import Link from "next/link";
import axios from "axios";

export default function ProductContent({ content }) {


  const [stepper, setstepper] = useState({
    key: 0,
    scrollHeight: 0,
    intervalTyper: null,
    fielTester: null,
  });

  const singleStoreInfo = {
    category: content.data.category,
    description: content.data.description,
    slug: content.data.slug,
    name: content.data.name,
    type: content.data.type,
    link: content.data.link,
    updated_at: content.data.updated_at,
    created_at: content.data.created_at,
    fichier: content.data.fichier,
  };

  const download = (file) => {
    console.log(file);
    
    window.open(source+'/download.php?zlink='+file,'_blank')
  }
  useEffect(() => {

    audioBox.chaine = document.getElementById("audioBox");
    audioBox.chaine.src =
      source + "/audios.php?zlonk=1733&zlink=" + content.data.link;
    audioBox.chaine.load();
    audioBox.chaine.addEventListener("ended", () => {
      document.getElementById("iconPlay").style.display = "inline-block";
      document.getElementById("iconPause").style.display = "none";
    });

    if (document.getElementById("storeImageMedia")) {
      document.getElementById("storeImageMedia").style.transition = "1s";
      document.getElementById("storeImageMedia").style.height = "auto";
    }

    document.getElementById('backButton').addEventListener('click', () => {
      if (window.history.length > 0) {
        window.history.back();
      }
    })
  }, []);

  return (
    <div>
      <h3 className="w3-wide w3-flex-row w3-flex-center-v w3-large">
        <div id="backButton" className="w3-wide w3-pointer w3-flex-row w3-flex-center-v w3-large" style={{ paddingInline: 4 }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ width: 24 }}
          />
        </div>
      </h3>
      <div className="w3-container singleStoreFlex" style={{ padding: 8 }}>
        <div
          id="chatCoreWrapper"
          className="w3-overflow-scroll w3-noscrollbar"
          style={{
            maxWidth: 520,
            marginInline: "auto",
          }}
        >
          <div className="w3-overflow w3-light-grey w3-round-large">
            <Image
              id="storeImageMedia"
              alt={singleStoreInfo.name}
              onContextMenu={(e) => e.preventDefault()}
              unoptimized
              loading="lazy"
              height={420}
              width={520}
              src={
                source +
                "/images.php?w=720&h=720&zlonk=8733&zlink=" +
                singleStoreInfo.link
              }
              style={{
                objectPosition: "center",
                objectFit: "cover",
              }}
              className="w3-light-grey store-image"
            />
          </div>
          <div className="w3-large w3-big" style={{ marginTop: 8 }}>
            {parse(singleStoreInfo.name)}
          </div>
          <div>{parse(singleStoreInfo.description)}</div>
          <div>
            <div onClick={()=>download(singleStoreInfo.fichier)} className="w3-button w3-round-xxlarge w3-black w3-flex-row w3-flex-center w3-margin-top">
              <FontAwesomeIcon icon={faDownload} className="w3-margin-right" /> Download
            </div>
          </div>
          <div className="w3-big w3-margin-top">
            <u>Suggestion</u>
          </div>
          <div>
            {
              content.features.map((feature, key) => (
                <div key={key} style={{ paddingBlock: 8 }}>
                  <Link href={'/store/product/' + feature.slug} className="w3-pointer w3-light-grey w3-round w3-flex-row w3-flex-center-v " style={{ padding: 8 }}>
                    <Image
                      alt={feature.name}
                      unoptimized
                      loading="lazy"
                      height={64}
                      width={64}
                      src={
                        source +
                        "/images.php?w=720&h=720&zlonk=8733&zlink=" +
                        feature.link
                      }
                      style={{
                        objectPosition: "center",
                        objectFit: "cover",
                      }}
                      className="w3-white w3-round"
                    />

                    <div style={{ paddingInline: 16 }} className="w3-overflow w3-nowrap w3-big">
                      {feature.name}
                    </div>
                  </Link>
                </div>
              ))
            }

          </div>
        </div>
      </div>
    </div>
  );
}
