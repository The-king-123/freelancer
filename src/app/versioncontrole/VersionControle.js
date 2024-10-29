
'use client'
import { faAnchor, faArrowRight, faBookmark, faBullhorn, faExclamationCircle, faLaptop, faMobileAlt, faPlus, faRobot, faSave, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { console_source as source } from '@/app/data'
import axios from 'axios'
import Link from 'next/link'

function VersionControle() {

  const date = new Date()
  const copyright = date.getFullYear()

  useEffect(() => {

    const xcode = localStorage.getItem("x-code");

    if (xcode) {
      axios
        .get(source + "/_accrocher/create")
        .then((res) => {
          if (res.data.data[0].info != '_') {
            document.getElementById('appAnnonce').innerHTML = JSON.parse(res.data.data[0].info).annonce
            document.getElementById('appAbout').innerHTML = JSON.parse(res.data.data[0].info).about
            document.getElementById('appSupport').innerHTML = JSON.parse(res.data.data[0].info).support

            document.getElementById('versionCore').style.display = 'block'
          }
        })
        .catch((e) => {
          console.error("failure", e);
        });

    } else {
      if (document.getElementById('modalLogin')) {
        document.getElementById('modalLogin').style.display = 'block'
      }
    }
  }, [])

  return (
    <div id="versionCore" style={{ position: 'relative', display: 'none' }}>
      <div
        className="w3-medium w3-big w3-flex-row w3-flex-center-v"
        style={{ padding: 8 }}
      >
        <div className="w3-flex-row w3-flex-center-v w3-flex-1" style={{ marginTop: 12 }}>
          <FontAwesomeIcon
            className="w3-margin-right"
            icon={faExclamationCircle}
            style={{ width: 24, height: 24 }}
          />{" "}
          Version controle
        </div>
      </div>

      <div style={{ paddingInline: 8 }}>
        <hr />
        <div>
          <div className='w3-big' style={{ marginBottom: 8 }}>
            <FontAwesomeIcon className='w3-margin-right' icon={faBullhorn} />
            Annonce
          </div>
          <div
            id="appAnnonce"
            style={{
              marginBottom: 20,
              paddingLeft: 32,
            }}
            className='w3-text-grey'
          ></div>
        </div>

        <div>
          <div className='w3-big' style={{ marginBottom: 8 }}>
            <FontAwesomeIcon className='w3-margin-right' icon={faLaptop} />
            À propos de l'application
          </div>
          <div
            id="appAbout"
            style={{
              marginBottom: 20,
              paddingLeft: 32,
            }}
            className='w3-text-grey'
          ></div>
        </div>

        <div>
          <div className='w3-big' style={{ marginBottom: 8 }}>
            <FontAwesomeIcon className='w3-margin-right' icon={faAnchor} />
            Support
          </div>
          <div
            id="appSupport"
            contentEditable={true}
            style={{
              marginBottom: 20,
              paddingLeft: 32,
            }}
            className='w3-text-grey'
          ></div>
        </div>
        <Link href={'https://developer.mg'} target='_blank' className='w3-flex-column w3-center w3-light-grey w3-round' style={{ padding: 16 }}>
          <div className='w3-text-grey'>Powered by</div>
          <div className='w3-big w3-text-white'>www.developer.mg</div>
        </Link>
        <div style={{ paddingBlock: 8 }} className='w3-small w3-text-grey w3-center'>
          Copyright © {copyright}
        </div>
      </div>
    </div>
  )
}

export default VersionControle