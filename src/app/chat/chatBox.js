'use client'
import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faFaceSmileBeam, faImage, faPaperPlane, faReply, faSmile, faSmileBeam } from '@fortawesome/free-solid-svg-icons';

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
    sendHolder: false,
  })

  const [chatInfo, setchatInfo] = useState({
    key: '',
    des_key: '',
    timestamp: '',
    attachement: null,
    responseTo: null,
    message: "",
    reaction: null,
    deleted: false,
    state: 'sent'
  })

  const reloadChat = () => {
    onValue(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key), (snapshot) => {
      if (snapshot.exists()) {
        const chat = snapshot.val()
        displayMessage(Object.entries(chat).sort(([, a], [, b]) => a.timestamp - b.timestamp), chat);
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
    chatInfo.message = document.getElementById('messageTextarea').value.trim();

    if (chatInfo.message.length > 0 && !userInfo.sendHolder) {
      userInfo.sendHolder = true,
        chatInfo.timestamp = Date.now()
      set(push(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key)), chatInfo)
        .then(() => {
          set(push(ref(database, 'chatcase/' + userInfo.des_key + '_' + userInfo.key)), chatInfo)
            .then(() => {
              document.getElementById('messageTextarea').value = ''
              chatInfo.message = '';
              userInfo.sendHolder = false;
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

  const displayMessage = (chat, chatBrut) => {

    const themeLight = localStorage.getItem('theme') == 'light' ? true : false
    const glitchChat = chat.map(([index, bull], key, chatArray) => (
      <div key={key}>
        {bull.key == userInfo.key && (
          <div
            className="bullWrapper w3-block w3-nowrap w3-container w3-pointer w3-flex-row w3-flex-center-v"
            style={{
              paddingInline: 0,
              paddingTop:
                key > 0
                  ? (chatArray[key - 1][1].key == userInfo.key ? 2 : 8)
                  : 8,
              paddingBottom:
                key < chatArray.length - 1
                  ? (chatArray[key + 1][1].key == userInfo.key ? 2 : 8)
                  : 8,
            }}
          >

            <div className='w3-flex-1'></div>
            <div>
              <div className='bullOption w3-flex-row' style={{ marginLeft: 'auto', display: 'none' }}>
                <div style={{ padding: 8 }} title='React'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faFaceSmileBeam} /></div>
                <div style={{ padding: 8 }} title='Reply'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faReply} /></div>
                <div style={{ padding: 8 }} title='Option'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faEllipsisH} /></div>
              </div>
            </div>
            <div
              className="w3-container"
              style={{
                paddingBlock: 0,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              {/* Reply bull here */}
              {bull.responseTo &&
                <div>
                  <div
                    className={(themeLight ? "w3-opacity" : "w3-opacity-max") + " w3-yellow chatbull w3-round-xlarge w3-right w3-nowrap w3-overflow"}
                    style={{
                      paddingInline: 16,
                      paddingBlock: 10,
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                      fontSize: 14,
                    }}
                  >
                    {chatBrut[bull.responseTo].message}
                  </div>
                </div>
              }

              {/* Bull core */}
              <div
                className="chatbull w3-yellow w3-round-xlarge w3-right w3-nowrap"
                style={{
                  paddingInline: 16,
                  paddingBlock: 10,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius:
                    key < chatArray.length - 1
                      ? (chatArray[key + 1][1].key == userInfo.key ? 4 : 16)
                      : 16,
                  whiteSpace: "normal",
                  marginTop: key > 0
                  ? (chatArray[key - 1][1].key == userInfo.key ? (bull.responseTo ? -8 : 0) : (bull.responseTo ? -8 : 0))
                  : 0,
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
            className="bullWrapper w3-pointer w3-block w3-nowrap w3-container w3-flex-row w3-flex-center-v"
            style={{
              paddingInline: 0,
              paddingTop:
                key > 0
                  ? (chatArray[key - 1][1].key == userInfo.key ? 8 : 2)
                  : 8,
              paddingBottom:
                key < chatArray.length - 1
                  ? (chatArray[key + 1][1].key == userInfo.key ? 8 : 2)
                  : 8,
            }}
          >
            <div
              className="w3-container"
              style={{
                paddingBlock: 0,
                paddingRight: 0,
                paddingLeft: 0,
              }}
            >
              {/* Reply bull here */}
              {bull.responseTo &&
                <div>
                  <div
                    className={(themeLight ? "w3-light-grey w3-opacity-min" : "w3-black w3-opacity-max") + " chatbull w3-round-xlarge w3-left w3-nowrap w3-overflow"}
                    style={{
                      paddingInline: 16,
                      paddingBlock: 10,
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      fontSize: 14,
                    }}
                  >
                    {chatBrut[bull.responseTo].message}
                  </div>
                </div>
              }

              {/* Bull core here */}
              <div
                className={(themeLight ? "w3-light-grey" : "w3-black") + " chatbull w3-round-xlarge w3-left w3-nowrap"}
                style={{
                  paddingInline: 16,
                  paddingBlock: 10,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius:
                    key < chatArray.length - 1
                      ? (chatArray[key + 1][1].key != userInfo.key ? 4 : 16)
                      : 16,
                  whiteSpace: "normal",
                  marginTop:
                    key > 0
                      ? (chatArray[key - 1][1].key != userInfo.key ? (bull.responseTo ? -8 : 0) : (bull.responseTo ? -8 : -4))
                      : -4,
                }}
              >
                {bull.message}
              </div>
            </div>
            <div>
              <div className='bullOption w3-flex-row' style={{ marginLeft: 'auto', display: 'none' }}>
                <div style={{ padding: 8 }} title='React'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faFaceSmileBeam} /></div>
                <div style={{ padding: 8 }} title='Reply'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faReply} /></div>
                <div style={{ padding: 8 }} title='Option'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faEllipsisH} /></div>
              </div>
            </div>
            <div className='w3-flex-1'></div>
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

  // Bull option react reply

  const deletedBull = (id) => {

  }

  const reaction = (emoji, id) => {

  }

  const editBull = (id) => {

  }

  const reply = (id) => {

  }

  useEffect(() => {
    reloadChat();
    document.getElementById('messageTextarea').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          return;
        } else {
          sendMessage()
        }
      }
    });

    document.getElementById('bullField').style.height = window.innerHeight - 96 + 'px'
    document.getElementById('bullField').style.display = 'block'
  }, [])

  return (
    <div>
      <div id='bullField' className='w3-noscrollbar w3-overflow-scroll' style={{ padding: 8, display: 'none' }}>
        <div style={{ padding: 16 }}>Bientôt, il sera possible d'envoyer des messages directement sur la plateforme, ce qui facilitera la communication et renforcera les interactions. Cette nouvelle fonctionnalité permettra d'échanger des idées, de poser des questions et de partager des expériences en temps réel, rendant l'expérience encore plus dynamique et conviviale.</div>
        {displayChat}
        <div style={{ height: 52 }}></div>
      </div>
      <div style={{ maxWidth: 620, margin: "auto", paddingInline: 6, paddingBottom: 8 }} className='w3-dark-grey w3-block w3-display-bottommiddle'>
        <div style={{ padding: 16 }} className='w3-black w3-round w3-card' >
          <div className='w3-flex-row w3-flex-center-v'>
            <div className='w3-pointer w3-white w3-circle w3-flex w3-flex-center w3-margin-right' style={{ width: 32, height: 32 }}>
              <FontAwesomeIcon icon={faImage} />
            </div>
            <div className='w3-flex-1'>
              <textarea id='messageTextarea' style={{ paddingInline: 24, height: 40, resize: 'none' }} type='text' placeholder='Message' className='w3-input w3-border-0 w3-round-xxlarge w3-block w3-white w3-noscrollbar' />
            </div>
            <div onClick={sendMessage} className='w3-pointer w3-white w3-circle w3-flex w3-flex-center w3-margin-left' style={{ width: 32, height: 32 }}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default chatBox