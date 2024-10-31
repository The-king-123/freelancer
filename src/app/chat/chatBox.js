'use client'
import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";

function chatBox() {

  const firebaseConfig = {
    apiKey: "AIzaSyBI0egg-gSu_99VAcprwtbgRguW9GxrGIs",
    authDomain: "freelancer-chatbox.firebaseapp.com",
    projectId: "freelancer-chatbox",
    storageBucket: "freelancer-chatbox.appspot.com",
    messagingSenderId: "955747602246",
    appId: "1:955747602246:web:f9aac0f407c73196289f47",
    measurementId: "G-VTQ7112MF2",
    databaseURL: "https://freelancer-chatbox-default-rtdb.europe-west1.firebasedatabase.app/"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [chatCase, setchatCase] = useState([])
  const [displayChat, setdisplayChat] = useState('')

  const [userInfo, setuserInfo] = useState({
    fullname: '',
    key: '12345678',
    des_fullname: '',
    des_key: '87654321',
  })

  const [chatInfo, setchatInfo] = useState({
    key: '',
    des_key: '',
    timestamp: '',
    attachement: null,
    responseTo: null,
    message: "Je ne sais pas quoi dire, puisque c'est juste un esssaye gratuit de Netflix",
    reaction: null,
    deleted: false,
    state: 'sent'
  })

  const reloadChat = () => {
    onValue(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key), (snapshot) => {
      if (snapshot.exists()) {
        const chat = snapshot.val()
        displayMessage(Object.entries(chat).sort(([, a], [, b]) => a.timestamp - b.timestamp));
      } else {
        console.log("No data available");
      }
    }, (error) => {
      console.error("Error reading data:", error);
    });
  }

  const sendMessage = () => {

    chatInfo.key = userInfo.key
    chatInfo.des_key = userInfo.des_key

    if (chatInfo.message.trim().length > 0) {
      chatInfo.timestamp = Date.now()
      set(push(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key)), chatInfo)
        .then(() => {
          set(push(ref(database, 'chatcase/' + userInfo.des_key + '_' + userInfo.key)), chatInfo)
            .then(() => {
              console.log('Data written successfully!');
            })
            .catch((error) => {
              console.error('Error writing data:', error);
            });;
        })
        .catch((error) => {
          console.error('Error writing data:', error);
        });;
    }
  }

  function formatChatTimestamp(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);

    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const options = { hour: '2-digit', minute: '2-digit' };

    // On the same day
    if (diffInDays === 0) {
      return `at ${date.toLocaleTimeString([], options)}`;
    }
    // Yesterday
    else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], options)}`;
    }
    // Two days ago
    else if (diffInDays === 2) {
      return `Two days ago at ${date.toLocaleTimeString([], options)}`;
    }
    // Within a week
    else if (diffInDays < 7) {
      return `${diffInDays} days ago at ${date.toLocaleTimeString([], options)}`;
    }
    // Within the same year
    else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return diffInMonths === 1
          ? `a month ago`
          : `${diffInMonths} months ago`;
      }
    }
    // More than a year ago
    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? `a year ago` : `${diffInYears} years ago`;
  }

  const displayMessage = (chat) => {

    const glitchChat = chat.map(([index, bull], key, chatArray) => (
      <div key={key}>
        {bull.key == userInfo.key && (
          <div
            className="w3-block w3-nowrap w3-container"
            style={{
              paddingInline: 0,
              display: "table",
              paddingTop:
                key > 0
                  ? chatArray[key - 1][1].des_key == userInfo.key
                    ? 8
                    : 1
                  : 8,
              paddingBottom:
                key < chatArray.length - 1
                  ? chatArray[key + 1][1].des_key == userInfo.key
                    ? 8
                    : 1
                  : 8,
            }}
          >
            <div
              className="w3-container w3-block"
              style={{
                display: "table-cell",
                paddingBlock: 0,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <div
                className="w3-yellow w3-round-xlarge w3-small w3-right w3-nowrap"
                style={{
                  maxWidth: 220,
                  paddingInline: 16,
                  paddingBlock: 10,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius:
                    key < chatArray.length - 1
                      ? (chatArray[key + 1][1].key == userInfo.key ? 4 : 16)
                      : 16,
                  whiteSpace: "normal",
                  marginTop: 0,
                }}
              >
                {bull.message}
              </div>
            </div>
            <div
              style={{
                width: 0,
                display: "table-cell",
              }}
            ></div>
          </div>
        )}
        {bull.key != userInfo.key && (
          <div
            className="w3-block w3-nowrap w3-container"
            style={{
              paddingInline: 0,
              display: "table",
              paddingTop:
                key > 0
                  ? chatArray[key - 1][1].key == userInfo.key
                    ? 8
                    : 1
                  : 8,
              paddingBottom:
                key < chatArray.length - 1
                  ? chatArray[key + 1][1].key == userInfo.key
                    ? 8
                    : 1
                  : 8,
            }}
          >
            <div
              className="w3-container w3-block"
              style={{
                display: "table-cell",
                paddingBlock: 0,
                paddingRight: 0,
                paddingLeft: 0,
              }}
            >
              <div
                className="w3-black w3-round-xlarge w3-small w3-left w3-nowrap"
                style={{
                  maxWidth: 220,
                  paddingInline: 16,
                  paddingBlock: 10,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius:
                    key < chatArray.length - 1
                      ? chatArray[key + 1][1].des_key == userInfo.des_key
                        ? 4
                        : 16
                      : 16,
                  whiteSpace: "normal",
                  marginTop:
                    key > 0
                      ? chatArray[key - 1][1].des_key == userInfo.des_key
                        ? 0
                        : -8
                      : -8,
                }}
              >
                {bull.message}
              </div>
            </div>
          </div>
        )}
      </div>
    ));

    setdisplayChat(glitchChat);

    // setTimeout(() => {
    //   if (
    //     document.getElementById("chatField").scrollHeight >
    //     window.innerHeight - 160
    //   ) {
    //     document.getElementById("chatField").scrollTop =
    //       document.getElementById("chatField").scrollHeight -
    //       (window.innerHeight - 160);
    //   }
    //   activeTheme();
    // }, 50);
  };

  useEffect(() => {
    reloadChat();
  }, [])

  return (
    <div>
      <div style={{ padding: 16 }}>Bientôt, il sera possible d'envoyer des messages directement sur la plateforme, ce qui facilitera la communication et renforcera les interactions. Cette nouvelle fonctionnalité permettra d'échanger des idées, de poser des questions et de partager des expériences en temps réel, rendant l'expérience encore plus dynamique et conviviale.</div>
      <div style={{padding:8}}>
        {displayChat}
      </div>
    </div>
  )
}

export default chatBox