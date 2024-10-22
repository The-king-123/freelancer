'use client'
import { faAnchor, faArrowRight, faBookmark, faBullhorn, faExclamationCircle, faLaptop, faMobileAlt, faPlus, faRobot, faSave, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { console_source as source } from '@/app/data'
import axios from 'axios'

function GestionVersion() {
  axios.defaults.withCredentials = true;

  async function setCSRFToken() {
    try {
      // Fetch CSRF token from the server
      const response = await axios.get(source + '/csrf-token');
      // Set CSRF token as a default header for all future requests
      axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
    }
  }

  const saveVerion = async () => {

    document.getElementById('postPublicIcon').style.display = 'none'
    document.getElementById('postPublicSpinner').style.display = 'inline-block'

    const request = {
      info: {
        annonce: document.getElementById('appAnnonce').innerHTML,
        about: document.getElementById('appAbout').innerHTML,
        support: document.getElementById('appSupport').innerHTML,
      }
    }

    request.info = JSON.stringify(request.info)

    const xcode = localStorage.getItem("x-code");
    await setCSRFToken()
    await axios
      .patch(source + "/_accrocher/82?topic=version&xcode=" + xcode, request)
      .then((res) => {
        document.getElementById('postPublicIcon').style.display = 'inline-block'
        document.getElementById('postPublicSpinner').style.display = 'none'
      })
      .catch((e) => {
        document.getElementById('postPublicIcon').style.display = 'inline-block'
        document.getElementById('postPublicSpinner').style.display = 'none'
        console.error("failure", e);
      });
  }

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
          }
          document.getElementById('chatbotStarter').innerHTML = res.data.data[0].info
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
    <div id="versionCore" style={{ position: 'relative' }}>
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
            contentEditable={true}
            className="w3-input w3-border-0 w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar"
            style={{
              height: 160,
              minWidth: "100%",
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
            contentEditable={true}
            className="w3-input w3-border-0 w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar"
            style={{
              height: 160,
              minWidth: "100%",
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
            className="w3-input w3-border-0 w3-light-grey w3-round w3-overflow-scroll w3-noscrollbar"
            style={{
              height: 160,
              minWidth: "100%",
              marginBottom: 20,
            }}
          ></div>
        </div>

        <div style={{ paddingBlock: 16 }}>
          <button
            onClick={() => saveVerion()}
            className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center"
          >
            Sauvegader les modifications{" "}
            <FontAwesomeIcon
              id="postPublicIcon"
              className="w3-margin-left"
              icon={faArrowRight}
              style={{ width: 16, height: 16 }}
            />
            <FontAwesomeIcon
              id="postPublicSpinner"
              className="w3-spin w3-margin-left"
              icon={faSpinner}
              style={{ width: 16, height: 16, display: "none" }}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GestionVersion