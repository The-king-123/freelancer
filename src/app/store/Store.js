'use client'
import axios from "axios";
import React, { useEffect, useState } from "react";
import { console_source as source } from "../data";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faDownload, faGift, faSave } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import Image from "next/image";


function Store() {
  const [displayStore, setdisplayStore] = useState('')

  const reloadStore = (data) => {
    console.log('Here');

    var glitchStore
    if (data.length > 0) {
      console.log('Exist');
      console.log(data[0]);


      glitchStore = data.map((product, key) => (
        <Link key={key} href={'/store/product/' + product.slug} style={{ padding: 8, zIndex: 1, width: '50%', display: 'inline-block' }}>
          <div className="w3-overflow w3-round w3-pointer w3-white">
            <div
              className="w3-light-grey w3-big w3-small w3-flex-row w3-flex-center-v"
              title={parse(product.name)}
            >
              <div className="w3-nowrap w3-overflow w3-flex-1" style={{ padding: 8 }}>{parse(product.name)}</div>

              <div
                title="Gratuit"
                className={"w3-circle " + (product.type == 'free' ? 'w3-green' : 'w3-yellow')}
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
              className="postMedia w3-display-container w3-light-grey product-image"
              style={{ zIndex: 2 }}
            >
              <Image
                alt={"image" + key}
                unoptimized
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
                height={180}
                width={180}
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
                  maxHeight: 180
                }}
                className="w3-overflow w3-light-grey product-image w3-block"
              />

              <div
                className="w3-white w3-circle w3-display-bottomright w3-card"
                style={{ width: 36, height: 36, margin:8 }}
              >
                <div className="w3-block w3-height w3-flex w3-flex-center">
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={{ height: 18, width: 18 }}
                  />
                </div>
              </div>
            </div>

          </div>
        </Link>
      ))
    } else {
      glitchStore = (<div style={{ padding: 8 }}>
        <div className="w3-light-grey w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
          <div style={{ paddingInline: 16 }}>
            Nous n'avons trouvé aucun produit pour le moment...
          </div>
        </div>
      </div>)
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
    //
    axios
      .get(source + "/_store")
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

export default Store