'use client'
import { faArrowLeft, faCrown, faDollarSign, faGift, faPause, faPlay, faRefresh, faSpinner, faTag, faTags, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import parse from "html-react-parser";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostContent({ posts }) {

  const [audioBox, setaudioBox] = useState({ chaine: null });
  const [killer, setkiller] = useState({ freepremium: false })

  const [displayPost, setdisplayPost] = useState(
    <div style={{ padding: 24 }} className='w3-center'>
      <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
    </div>
  )

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

  const makeMarqueeText = () => {
    const intervalMarqueeText = setInterval(() => {
      if (document.getElementsByClassName('marquee')) {
        clearInterval(intervalMarqueeText)
        const marquees = document.getElementsByClassName('marquee');

        for (let i = 0; i < marquees.length; i++) {
          const marquee = marquees[i].querySelector('span');
          marquee.style.animation = 'marquee ' + (marquee.innerText.length / 3) + 's linear infinite'
        }
      }
    }, 1000);

  }

  const loadPost = (type) => {
    const themeLight = localStorage.getItem('theme') != 'dark' ? true : false
    const glitchPost = posts.map((post, key) => (
      (type == 'premium' ? post.category == type : post.category != 'premium') &&
      <Link className="postCard" href={'/post/' + post.slug} key={key} style={{ padding: 8, zIndex: 1, width: '33.33%', display: 'inline-block' }}>
        <div className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-hover-shadow w3-overflow w3-round w3-pointer"}>
          <div
            className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-big w3-small w3-flex-row w3-flex-center-v"}
            title={parse(post.title)}
          >
            {post.category != 'premium' &&
              <>
                <div className="w3-nowrap w3-overflow w3-flex-1" style={{ padding: 8 }}>
                  <div class="marquee">
                    <span>{parse(post.title)}</span>
                  </div>
                </div>
                <div
                  title="Gratuit"
                  className="w3-green w3-circle"
                  style={{ width: 24, height: 24, marginRight: 4 }}
                >
                  <div className="w3-block w3-height w3-flex w3-flex-center">
                    <FontAwesomeIcon
                      icon={faGift}
                      style={{ height: 12, width: 12 }}
                    />
                  </div>
                </div>
              </>
            }
            {post.category == 'premium' &&
              <>
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
                    <div class="marquee">
                      <span>{parse(post.title)}</span>
                    </div>
                  }
                </div>
                <div
                  title="Premium"
                  className="w3-yellow w3-hover-yellow w3-circle"
                  style={{ width: 26, height: 26, marginRight: 4 }}
                >
                  <div className="w3-block w3-height w3-flex w3-flex-center">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      style={{ height: 12, width: 12 }}
                    />
                  </div>
                </div>
              </>
            }

          </div>

          <div
            className={(themeLight ? "w3-light-grey" : "w3-black") + " postMedia w3-display-container post-image"}
            style={{ zIndex: 2 }}
          >
            <Image
              alt={"image" + key}
              unoptimized
              loading="lazy"
              onContextMenu={(e) => e.preventDefault()}
              height={200}
              width={200}
              src={
                source +
                "/images.php?w=260&h=260&zlonk=2733&zlink=" +
                post.link
              }
              style={{
                objectPosition: 'center',
                objectFit: "cover",
                zIndex: 1,
                height: '65vw',
                maxHeight: 200,
              }}
              className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-overflow post-image"}
            />
            {/* {(post.type == "image/audio" || post.type == "video" || post.type == "image/video") && (
                <div className="w3-light-grey w3-opacity-max w3-block w3-height w3-padding w3-display-middle"></div>
              )} */}
            {post.type == "image/audio" && (
              <div
                className="w3-dark-grey w3-circle w3-display-middle w3-card"
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
                className="w3-dark-grey w3-circle w3-display-middle w3-card"
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
    ))
    if (type == 'premium') {

      if (document.getElementById('headerPageTitle')) {
        document.getElementById('headerPageTitle').innerText = ('Premium').toUpperCase()
      }
    } else {

      if (document.getElementById('headerPageTitle')) {
        document.getElementById('headerPageTitle').innerText = ('Gratuit').toUpperCase()
      }
    }
    setdisplayPost(glitchPost)
    makeMarqueeText();

  }


  const beastChangerSide = () => {

    // side menu button
    const premiumfreeText = document.querySelector("#premiumfreeText");
    const main = document.querySelector(".main") ? document.querySelector(".main") : document.querySelector(".active3");
    const freeIcon = document.querySelector("#freeSwitch");
    const premiumIcon = document.querySelector("#premiumSwitch");

    // bottom menu switch button
    const premiumfreeText1 = document.querySelector("#premiumfreeText1");
    const main1 = document.querySelector(".main1") ? document.querySelector(".main1") : document.querySelector(".active31");
    const freeIcon1 = document.querySelector("#freeSwitch1");
    const premiumIcon1 = document.querySelector("#premiumSwitch1");

    if (premiumIcon.style.display == 'none') {
      freeIcon.style.display = 'none'
      premiumIcon.style.display = 'flex'
      main.className = "active3 w3-pointer"
      premiumfreeText.innerText = "Gratuit"

      freeIcon1.style.display = 'none'
      premiumIcon1.style.display = 'flex'
      main1.className = "active31 w3-pointer"
      premiumfreeText1.innerText = "Gratuit"
      premiumfreeText1.style.textAlign = 'left'

      loadPost('free')

    } else {
      freeIcon.style.display = 'flex'
      premiumIcon.style.display = 'none'
      main.className = "main w3-pointer"
      premiumfreeText.innerText = "Premium"

      freeIcon1.style.display = 'flex'
      premiumIcon1.style.display = 'none'
      main1.className = "main1 w3-pointer"
      premiumfreeText1.innerText = "Premium"
      premiumfreeText1.style.textAlign = 'right'

      loadPost('premium')

    }

  }

  const beastChangerBottom = () => {
    // side menu button
    const premiumfreeText = document.querySelector("#premiumfreeText");
    const main = document.querySelector(".main") ? document.querySelector(".main") : document.querySelector(".active3");
    const freeIcon = document.querySelector("#freeSwitch");
    const premiumIcon = document.querySelector("#premiumSwitch");

    // bottom menu switch button
    const premiumfreeText1 = document.querySelector("#premiumfreeText1");
    const main1 = document.querySelector(".main1") ? document.querySelector(".main1") : document.querySelector(".active31");
    const freeIcon1 = document.querySelector("#freeSwitch1");
    const premiumIcon1 = document.querySelector("#premiumSwitch1");

    if (premiumIcon1.style.display == 'none') {

      freeIcon.style.display = 'none'
      premiumIcon.style.display = 'flex'
      main.className = "active3 w3-pointer"
      premiumfreeText.innerText = "Gratuit"

      freeIcon1.style.display = 'none'
      premiumIcon1.style.display = 'flex'
      main1.className = "active31 w3-pointer"
      premiumfreeText1.innerText = "Gratuit"
      premiumfreeText1.style.textAlign = 'left'

      loadPost('free')
    } else {
      freeIcon.style.display = 'flex'
      premiumIcon.style.display = 'none'
      main.className = "main w3-pointer"
      premiumfreeText.innerText = "Premium"

      freeIcon1.style.display = 'flex'
      premiumIcon1.style.display = 'none'
      main1.className = "main1 w3-pointer"
      premiumfreeText1.innerText = "Premium"
      premiumfreeText1.style.textAlign = 'right'

      loadPost('premium')
    }

  }

  function removeAllEventListeners(element) {
    const newElement = element.cloneNode(true); // true means deep clone
    element.parentNode.replaceChild(newElement, element);
  }

  useEffect(() => {

    if (document.getElementById('headerPageTitle')) {
      document.getElementById('headerPageTitle').innerText = ('FREELANCER').toUpperCase()
    }

    if (document.getElementById("audioBox")) {
      audioBox.chaine = document.getElementById("audioBox");
      audioBox.chaine.addEventListener("ended", () => {
        document.getElementById("iconPlay").style.display = "inline-block";
        document.getElementById("iconPause").style.display = "none";
      });
    }

    const myElement = document.getElementById('beastWrapper');
    removeAllEventListeners(myElement);

    // side menu button
    const premiumfreeText = document.querySelector("#premiumfreeText");
    const main = document.querySelector(".main") ? document.querySelector(".main") : document.querySelector(".active3");
    const freeIcon = document.querySelector("#freeSwitch");
    const premiumIcon = document.querySelector("#premiumSwitch");

    // bottom menu switch button
    const premiumfreeText1 = document.querySelector("#premiumfreeText1");
    const main1 = document.querySelector(".main1") ? document.querySelector(".main1") : document.querySelector(".active31");
    const freeIcon1 = document.querySelector("#freeSwitch1");
    const premiumIcon1 = document.querySelector("#premiumSwitch1");

    if (premiumfreeText && !killer.freepremium) {

      freeIcon.style.display = 'flex'
      premiumIcon.style.display = 'none'
      main.className = "main w3-pointer"
      premiumfreeText.innerText = "Premium"

      freeIcon1.style.display = 'flex'
      premiumIcon1.style.display = 'none'
      main1.className = "main1 w3-pointer"
      premiumfreeText1.innerText = "Premium"
      premiumfreeText1.style.textAlign = 'right'

      killer.freepremium = true;
      premiumfreeText.addEventListener("click", beastChangerSide);
      premiumfreeText1.addEventListener("click", beastChangerBottom);

      const choiceListenerInterval = setInterval(() => {
        if (document.getElementById("formationPayante")) {
          document.getElementById("formationPayante").addEventListener('click', () => {
            freeIcon.style.display = 'flex'
            premiumIcon.style.display = 'none'
            main.className = "main w3-pointer"
            premiumfreeText.innerText = "Premium"

            freeIcon1.style.display = 'flex'
            premiumIcon1.style.display = 'none'
            main1.className = "main1 w3-pointer"
            premiumfreeText1.innerText = "Premium"
            premiumfreeText1.style.textAlign = 'right'

            loadPost('premium')
          })
        }

        if (document.getElementById("formationGratuite")) {
          document.getElementById("formationGratuite").addEventListener('click', () => {
            freeIcon.style.display = 'none'
            premiumIcon.style.display = 'flex'
            main.className = "active3 w3-pointer"
            premiumfreeText.innerText = "Gratuit"

            freeIcon1.style.display = 'none'
            premiumIcon1.style.display = 'flex'
            main1.className = "active31 w3-pointer"
            premiumfreeText1.innerText = "Gratuit"
            premiumfreeText1.style.textAlign = 'left'

            loadPost('free')
          })
          clearInterval(choiceListenerInterval)
        }
      }, 1000);

      loadPost('premium')
    }
    // end switch animation

  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div id="homePostCore">
        {/* <div style={{ padding: 8 }}>
          <div onClick={createPost} className="w3-flex-row w3-flex-center-v w3-black w3-round" style={{ padding: 16 }}>
            <div id="userPDP" className="w3-circle w3-overflow w3-dark-grey w3-margin-right" style={{ width: 42, height: 42, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
            <input
              className="w3-dark-grey w3-input w3-round-xxlarge w3-border-0 w3-flex-1"
              style={{ height: 42, paddingInline: 16, }}
              placeholder="Qu'est-ce que vous pensez!?"
            />
          </div>
        </div> */}

        {displayPost}
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
