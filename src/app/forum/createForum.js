"use client";
import React, { useEffect } from "react";
import { console_source as source } from "../data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faImage, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

function createForum() {
  useEffect(() => {
    // const code = localStorage.getItem("x-code");
    // if (code) {
    //   axios
    //     .get(`${source}/_auth/${code}/edit`)
    //     .then((res) => {
    //       if (res.data.logedin) {
    //         localStorage.setItem("userInfos", JSON.stringify(res.data.user));
    //         document.location = "https://freelancer.mg/forum";
    //       }else{
    //         document.location = `${source}/login?q=forum&c=${code}`
    //       }
    //     })
    //     .catch((e) => {
    //       console.error("failure", e);
    //     });
    // } else {
    //   let randomNumber = "";
    //   for (let i = 0; i < 15; i++) {
    //     randomNumber += Math.floor(Math.random() * 10);
    //   }
    //   localStorage.setItem("x-code", randomNumber);
    //   document.location = source + "/login?q=forum&c=" + randomNumber;
    // }
  }, []);

  return (
    <>
      <div className="w3-medium w3-big" style={{ padding: 8 }}>
        <FontAwesomeIcon icon={faNewspaper} style={{ width: 16, height: 16 }} />{" "}
        Creer votre forum
      </div>

      <form style={{ padding: 8 }}>
        <input
          className="w3-input w3-border-0 w3-light-grey"
          type="text"
          maxLength={100}
          placeholder="Titre"
        />
        <textarea
          className="w3-input w3-border-0 w3-light-grey"
          placeholder="Qu'est-ce que vous pense ?"
          style={{
            minHeight: 120,
            maxHeight: 120,
            minWidth: "100%",
            marginTop: 16,
          }}
        ></textarea>
        <div className="w3-container" style={{ padding: 0 }}>
          <div
            className="w3-right w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center"
            style={{ height: 40, width: 40, marginTop: 16 }}
          >
            <FontAwesomeIcon icon={faImage} style={{ width: 16, height: 16 }} />
          </div>

          <Image
            src='/images/user.jpg'
            className="w3-right w3-light-grey w3-round w3-text-grey w3-flex w3-flex-center w3-overflow"
            height={120}
            width={120}
            style={{marginTop: 16, display:none, objectFit:'cover', objectPosition:'center' }}
          />
            
        </div>
        <div style={{marginTop:24}}>
          <button className="w3-button w3-black w3-round-xxlarge w3-block w3-flex w3-flex-center">
            Publier votre forum <FontAwesomeIcon className="w3-margin-left" icon={faArrowRight} style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </form>
    </>
  );
}

export default createForum;
