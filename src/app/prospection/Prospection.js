'use client'
import axios from "axios";
import React, { useEffect, useState } from "react";
import { console_source as source } from "../data";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faDownload, faGift, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import Image from "next/image";


function Prospection() {
  const [displayStore, setdisplayStore] = useState(
    <div style={{ padding: 24 }} className='w3-center'>
      <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
    </div>
  )

  const reloadStore = (data) => {
    const themeLight = localStorage.getItem('theme') != 'dark' ? true : false
    var glitchStore
    if (data.length > 0) {
      glitchStore = data.map((product, key) => (
        <Link key={key} href={'/prospection/product/' + product.slug} style={{ padding: 8, zIndex: 1, width: '33.33%', display: 'inline-block' }}>
          <div className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-overflow w3-round w3-pointer"}>
            <div
              className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-big w3-small w3-flex-row w3-flex-center-v"}
              title={parse(product.name)}
            >
              <div className="w3-nowrap w3-overflow w3-flex-1" style={{ padding: 8 }}>{parse(product.name)}</div>

              <div
                title="Gratuit"
                className={"w3-circle " + (product.type == 'free' ? 'w3-green' : 'w3-yellow w3-hover-yellow')}
                style={{ width: 24, height: 24, marginRight: 4 }}
              >
                <div className="w3-block w3-height w3-flex w3-flex-center">
                  {product.type == 'free' &&
                    <FontAwesomeIcon
                      icon={faGift}
                      style={{ height: 12, width: 12 }}
                    />
                  }
                  {product.type == 'premium' &&
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      style={{ height: 12, width: 12 }}
                    />
                  }
                </div>
              </div>
            </div>
            <div
            style={{paddingInline:8, paddingBottom:8}}
              className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-big w3-small w3-flex-row w3-flex-center-v w3-nowrao w3-overflow"}
            >
              {parse(product.description)}
            </div>

            <div
              className={(themeLight ? "w3-light-grey" : "w3-black") + " postMedia w3-display-container product-image"}
              style={{ zIndex: 2 }}
            >
              <Image
                alt={"image" + key}
                unoptimized
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
                height={80}
                width={80}
                src={
                  source +
                  "/images.php?w=260&h=260&zlonk=8733&zlink=" +
                  product.link
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                  zIndex: 1,
                  height: '65vw',
                  maxHeight: 154,
                }}
                className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-overflow product-image w3-block"}
              />

              <div
                className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-circle w3-display-bottomright w3-card"}
                style={{ width: 32, height: 32, margin: 8 }}
              >
                <div className="w3-block w3-height w3-flex w3-flex-center">
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={{ height: 16, width: 16 }}
                  />
                </div>
              </div>
            </div>

          </div>
        </Link>
      ))
    } else {
      glitchStore = (
        <div style={{ padding: 8 }}>
          <div className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-round w3-flex w3-flex-center-v"} style={{ height: 48 }}>
            <div style={{ paddingInline: 16 }}>
              Nous n'avons trouvé aucun produit pour le moment...
            </div>
          </div>
        </div>
      )
    }

    setdisplayStore(glitchStore)
  }

  const getCategory = async (category) => {
    await axios
      .get(source + "/_store/" + category)
      .then((res) => {

      })
      .catch((e) => {

      });
  }

  useEffect(() => {

    if (localStorage.getItem('theme') != 'dark') {

      const elementGrey = document.getElementsByClassName('w3-black').length
      const elementWhite = document.getElementsByClassName('w3-dark-grey').length
      const backTransparent = document.getElementsByClassName('black-opacity').length
      for (let i = 0; i < elementGrey; i++) {
        const element = document.getElementsByClassName('w3-black')[0];
        if (element) {
          element.className = element.className.replace('w3-black', 'w3-light-grey')
        }

      }
      for (let i = 0; i < elementWhite; i++) {
        const element = document.getElementsByClassName('w3-dark-grey')[0];
        if (element) {
          element.className = element.className.replace('w3-dark-grey', 'w3-white')
        }

      }
      for (let i = 0; i < backTransparent; i++) {
        const element = document.getElementsByClassName('black-opacity')[0];
        if (element) {
          element.className = element.className.replace('black-opacity', 'white-opacity')
        }

      }

      document.getElementById('htmlCore').style.display = 'block'
    }
    //
    if (document.getElementById('headerPageTitle')) {
      document.getElementById('headerPageTitle').innerText = ('Boutique').toUpperCase()
    }
    axios
      .get(source + "/_store?where=prospection")
      .then((res) => {
        reloadStore(res.data.data);
      })
      .catch((e) => {

      });
  }, [])

  return (
    <div>
      {
        displayStore
      }
    </div>
  )
}

export default Prospection