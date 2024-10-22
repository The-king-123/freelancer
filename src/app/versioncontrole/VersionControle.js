
'use client'
import { faAnchor, faArrowRight, faBookmark, faBullhorn, faExclamationCircle, faLaptop, faMobileAlt, faPlus, faRobot, faSave, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { console_source as source } from '@/app/data'
import axios from 'axios'

function VersionControle() {

  useEffect(() => {

    const xcode = localStorage.getItem("x-code");

    if (xcode) {
      axios
        .get(source + "/_accrocher/create")
        .then((res) => {
          if (res.data.data[0] != '_') {
            document.getElementById('appAnnonce').innerHTML = JSON.parse(res.data.data[0]).annonce
             document.getElementById('appAbout').innerHTML = JSON.parse(res.data.data[0]).about
            document.getElementById('appSupport').innerHTML = JSON.parse(res.data.data[0]).support

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
    <div id="versionCore" style={{ position: 'relative', display:'none' }}>
      <div
        className="w3-medium w3-big w3-flex-row w3-flex-center-v"
        style={{ padding: 8 }}
      >
        <div className="w3-flex-row w3-flex-center-v w3-flex-1">
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
            }}
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
            }}
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
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default VersionControle