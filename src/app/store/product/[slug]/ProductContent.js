"use client";

import {
  faArrowLeft,
  faArrowRight,
  faDownload,
  faSpinner,
  faTimesCircle,
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
    id: content.data.id,
    category: content.data.category,
    description: content.data.description,
    slug: content.data.slug,
    name: content.data.name,
    type: content.data.type,
    link: content.data.link,
    file: content.data.file,
    updated_at: content.data.updated_at,
    created_at: content.data.created_at,
  };

  const [code, setcode] = useState({ code: '' })

  const download = async (id) => {

    if (content.data.type == 'premium') {
      document.getElementById('modalCodePremiumDownload').style.display = 'block'
    } else {
      document.getElementById('freeDownloadSpinner').style.display = 'inline-block'
      document.getElementById('freeDownloadIcon').style.display = 'none'

      await axios
        .get(source + "/_downloadcode/" + singleStoreInfo.id + "/edit")
        .then((res) => {
          if (res.data.exist) {

            const url = `${source}/download.php?zlonk=1733&zlink=${atob(res.data.file)}`;
            const link = document.createElement('a');

            link.href = url;
            link.download = singleStoreInfo.name;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            document.getElementById('freeDownloadSpinner').style.display = 'none'
            document.getElementById('freeDownloadIcon').style.display = 'inline-block'

          } else {

          }
        })
        .catch((e) => {
          document.getElementById('freeDownloadSpinner').style.display = 'none'
          document.getElementById('freeDownloadIcon').style.display = 'inline-block'
          console.error("failure", e);
        });
    }

  }

  const downloadPremiumFile = async () => {
    if (code.code.length > 3) {

      document.getElementById('premiumDownloadSpinner').style.display = 'inline-block'
      document.getElementById('premiumDownloadIcon').style.display = 'none'

      await axios
        .patch(source + "/_downloadcode/" + singleStoreInfo.id, { code: encryptString(code.code) })
        .then((res) => {
          if (res.data.exist) {

            const url = `${source}/download.php?zlonk=1733&zlink=${atob(res.data.file)}`;
            const link = document.createElement('a');

            link.href = url;
            link.download = singleStoreInfo.name;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            document.getElementById('premiumDownloadSpinner').style.display = 'none'
            document.getElementById('premiumDownloadIcon').style.display = 'inline-block'

          } else {

          }
        })
        .catch((e) => {
          document.getElementById('premiumDownloadSpinner').style.display = 'none'
          document.getElementById('premiumDownloadIcon').style.display = 'inline-block'
          console.error("failure", e);
        });
    }
  }

  // Simple Base64 encoding to simulate encryption
  function encryptString(plainText) {
    // Convert plain text to Base64 encoded string
    return btoa(plainText);  // btoa() encodes the string to Base64
  }

  useEffect(() => {

    document.getElementById('backButtonProduct').addEventListener('click', () => {
      if (window.history.length > 0) {
        window.history.back();
      }else{
        window.location = '/'
      }
    })

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

  }, []);

  return (
    <div>
      <h3 className="w3-wide w3-flex-row w3-flex-center-v w3-large">
        <div id="backButtonProduct" className="w3-wide w3-pointer w3-flex-row w3-flex-center-v w3-large" style={{ paddingInline: 4 }}>
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
          <div className="w3-overflow w3-black w3-round-large">
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
              className="w3-black store-image"
            />
          </div>
          <div className="w3-large w3-big" style={{ marginTop: 8 }}>
            {parse(singleStoreInfo.name)}
          </div>
          <div>{parse(singleStoreInfo.description)}</div>
          <div>
            <div onClick={() => download(singleStoreInfo.id)} className={"w3-button w3-round-xxlarge w3-yellow w3-text-black w3-flex-row w3-flex-center w3-margin-top " + (singleStoreInfo.type == "premium" ? 'w3-text-yellow' : '')}>
              <FontAwesomeIcon id="freeDownloadIcon" icon={faDownload} className="w3-margin-right" />
              <FontAwesomeIcon id="freeDownloadSpinner" icon={faSpinner} className="w3-margin-right w3-spin" style={{display:'none'}} />
              Download
            </div>
          </div>
          <div className="w3-big w3-margin-top">
            <u>Suggestion</u>
          </div>
          <div>
            {
              content.features.map((feature, key) => (
                <div key={key} style={{ paddingBlock: 8 }}>
                  <Link href={'/store/product/' + feature.slug} className="w3-pointer w3-black w3-round w3-flex-row w3-flex-center-v " style={{ padding: 8 }}>
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
                      className="w3-dark-grey w3-round"
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
      <div>

        {/* modal not registered */}
        <div
          id="modalCodePremiumDownload"
          className="w3-modal w3-noscrollbar w3-show-"
          style={{ padding: 24, zIndex: 999999 }}
        >
          <div
            className="w3-dark-grey w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
            style={{
              minHeight: 240,
              paddingBlock: 8,
              paddingInline: 0,
              maxWidth: 320,
            }}
          >
            <div
              className="w3-container"
              style={{ paddingBlock: 0, paddingInline: 8 }}
            >
              <div
                onClick={() => document.getElementById('modalCodePremiumDownload').style.display = 'none'}
                className="w3-pointer w3-right w3-flex w3-flex-center"
                style={{ width: 32, height: 32 }}
              >
                <FontAwesomeIcon
                  className='w3-text-yellow w3-hover-text-black'
                  icon={faTimesCircle}
                  style={{ width: 20, height: 20 }}
                />
              </div>
            </div>
            <div className="w3-block w3-flex-column w3-flex-center">
              <div className="w3-block">
                <div style={{ padding: 24 }} id='cardNotPremiumText'>
                  Ce contenu est payant. Pour y accéder, il est nécessaire d'entrer un code de téléchargement.
                </div>
                <div style={{ paddingInline: 24, paddingBlock: 8 }}>
                  <input style={{ paddingInline: 16 }} onChange={(e) => code.code = e.target.value} className="w3-input w3-border-0 w3-black w3-block w3-round-xxlarge" type="text" placeholder="Code de téléchargement" />
                </div>
                <div className="w3-center w3-dark-grey w3-flex w3-flex-center">
                  <div className="w3-margin w3-block" style={{ paddingInline: 16 }}>
                    <div
                      onClick={downloadPremiumFile}
                      className="transition w3-medium w3-text-yellow w3-button w3-block w3-round-xxlarge w3-light-grey"
                    >
                      <span id='buttonContactText'>Confirmer</span>
                      <FontAwesomeIcon id="premiumDownloadIcon" className='w3-margin-left' icon={faArrowRight} />
                      <FontAwesomeIcon id="premiumDownloadSpinner" className='w3-margin-left w3-spin' icon={faSpinner} style={{ display: 'none' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*end modal logedin */}
      </div>

    </div>
  );
}
