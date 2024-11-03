'use client'
import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faEllipsisH, faFaceSmileBeam, faImage, faPaperPlane, faReply, faShare, faSmile, faSmileBeam, faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import parse from "html-react-parser";

function chatBox() {

  const reactionListe = {
    heart: '❤️',
    laugh: '😆',
    sad: '😥',
    socked: '😮',
    angry: '😡',
    angry: '😡',
    fire: '🔥',
  }

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
    reactHolder: false,
    messageCounter: 0,
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
      userInfo.sendHolder = true;
      chatInfo.timestamp = Date.now()

      const chatRef = ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key);
      const chatPush = push(chatRef)

      if (userInfo.editBull) {

        set(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key + '/' + userInfo.editBull + '/message'), chatInfo.message)
        set(ref(database, 'chatcase/' + userInfo.des_key + '_' + userInfo.key + '/' + userInfo.editBull + '/message'), chatInfo.message)
        set(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key + '/' + userInfo.editBull + '/edited'), true)
        set(ref(database, 'chatcase/' + userInfo.des_key + '_' + userInfo.key + '/' + userInfo.editBull + '/edited'), true)
          .then(() => {
            userInfo.editBull = false
            document.getElementById('messageTextarea').value = ''
            chatInfo.message = '';
            userInfo.sendHolder = false;
            chatInfo.key = '';
            chatInfo.des_key = '';
            chatInfo.timestamp = '';
            chatInfo.attachement = null;
            chatInfo.responseTo = null;
            chatInfo.reaction = null;
            chatInfo.deleted = false;
            chatInfo.state = 'sent';
            cancelEdit()
          })
          .catch((error) => {
            console.error('Error writing data:', error);
          });
      } else {

        set(chatPush, chatInfo)
          .then(() => {
            set(ref(database, 'chatcase/' + userInfo.des_key + '_' + userInfo.key + '/' + chatPush.key), chatInfo)
              .then(() => {
                document.getElementById('messageTextarea').value = ''
                chatInfo.message = '';
                userInfo.sendHolder = false;
                chatInfo.key = '';
                chatInfo.des_key = '';
                chatInfo.timestamp = '';
                chatInfo.attachement = null;
                chatInfo.responseTo = null;
                chatInfo.reaction = null;
                chatInfo.deleted = false;
                chatInfo.state = 'sent';
                cancelReply()
              })
              .catch((error) => {
                console.error('Error writing data:', error);
              });
          })
          .catch((error) => {
            console.error('Error writing data:', error);
          });
      }
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
      return date.toLocaleTimeString([], options);
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

  const replyChecker = (idBull, chatArray) => {
    var replayed = false
    chatArray.map(([index, bull]) => {
      if (bull.responseTo) {
        if (bull.responseTo == idBull) {
          replayed = true
        }
      }
    });

    return replayed
  }

  const mostLongTextLine = (message) => {
    const lines = message.trim().split("\n");
    const maxLength = Math.max(...lines.map(line => line.length));
    return maxLength
  }

  const displayMessage = (chat, chatBrut) => {

    const themeLight = localStorage.getItem('theme') == 'light' ? true : false
    const glitchChat = chat.map(([index, bull], key, chatArray) => (
      <div key={key}>
        {bull.key == userInfo.key && (
          <div>
            {formatChatTimestamp(bull.timestamp) != (key > 0 ? formatChatTimestamp(chatArray[key - 1][1].timestamp) : 'first') &&
              <div className='w3-center w3-text-grey w3-small' style={{ paddingBlock: 4 }}>
                {formatChatTimestamp(bull.timestamp)}
              </div>
            }

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
                  <div style={{ paddingTop: 8 }}>
                    <div className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover"}>
                      <FontAwesomeIcon className='w3-large w3-text-grey' icon={faFaceSmileBeam} />
                      <div style={{ padding: 20, width: 260, marginLeft: -100 }} className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                        <div className='w3-flex-row w3-flex-center-v'>
                          <div onClick={() => reaction('heart', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.heart}
                          </div>
                          <div onClick={() => reaction('laugh', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.laugh}
                          </div>
                          <div onClick={() => reaction('sad', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.sad}
                          </div>
                          <div onClick={() => reaction('socked', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.socked}
                          </div>
                          <div onClick={() => reaction('angry', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.angry}
                          </div>
                          <div onClick={() => reaction('fire', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.fire}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 8 }} onClick={() => reply(index, bull.message)} title='Reply'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faReply} /></div>
                  <div style={{ paddingRight: 8, paddingBlock: 8 }} className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover"}>
                    <FontAwesomeIcon className='w3-large w3-text-grey' icon={faEllipsisH} />
                    <div style={{ maxWidth: 80, marginLeft: -60 }} className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                      <div id={index + 'FlashInfo'} className='w3-text-grey w3-small' style={{ padding: 8, display: 'none' }}>Texte copié...</div>
                      <div className='w3-flex-row w3-flex-center-v'>
                        <div title='Copier' onClick={() => copyBullMessage(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                          <FontAwesomeIcon icon={faCopy} />
                        </div>
                        {(!bull.reaction && !replyChecker(index, chatArray) && (Date.now() - (bull.timestamp * 1) < 160000)) &&
                          <>
                            <div title='Supprimer' onClick={() => deletedBull(index)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                              <FontAwesomeIcon icon={faTrash} />
                            </div>
                            <div title='Modifier' onClick={() => editBull(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                              <FontAwesomeIcon icon={faEdit} />
                            </div>
                          </>
                        }
                        <div title='Transférer' onClick={() => transferBull(bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                          <FontAwesomeIcon icon={faShare} />
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className='w3-container' style={{ padding: 0 }}>
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
                  {parse(bull.message.replace(/\n/g, "<br/>"))}
                  {
                    mostLongTextLine(bull.message)
                  }
                </div>

                {/* Bull reaction */}
                {bull.reaction &&
                  <div className='w3-container' style={{ padding: 0 }}>
                    <div
                      className={(themeLight ? "w3-light-grey" : "w3-black") + " chatbull w3-round-xlarge w3-right w3-small w3-card"}
                      style={{
                        paddingTop: 4,
                        paddingInline: 4,
                        borderRadius: 16,
                        marginTop: -8,
                        marginInline: 8
                      }}
                    >
                      {reactExtractor(bull.reaction).join('')}
                    </div>
                  </div>
                }

              </div>
              <div
                style={{
                  width: 0,
                  display: "table-cell",
                }}
              ></div>
            </div>
          </div>
        )}
        {bull.key != userInfo.key && (
          <div>
            {formatChatTimestamp(bull.timestamp) != (key > 0 ? formatChatTimestamp(chatArray[key - 1][1].timestamp) : 'first') &&
              <div className='w3-center w3-text-grey w3-small' style={{ paddingBlock: 4 }}>
                {formatChatTimestamp(bull.timestamp)}
              </div>
            }
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
                  <div className='w3-container' style={{ padding: 0 }}>
                    <div
                      className={(themeLight ? "w3-light-grey w3-opacity" : "w3-black w3-opacity-max") + " chatbull w3-round-xlarge w3-left w3-nowrap w3-overflow"}
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
                  {parse(bull.message.replace(/\n/g, "<br/>"))}
                </div>

                {/* Bull reaction */}
                {bull.reaction &&
                  <div className='w3-container' style={{ padding: 0 }}>
                    <div
                      className={(themeLight ? "w3-light-grey" : "w3-black") + " chatbull w3-round-xlarge w3-left w3-small w3-card"}
                      style={{
                        paddingTop: 4,
                        paddingInline: 4,
                        borderRadius: 16,
                        marginTop: -8,
                        marginInline: 8
                      }}
                    >
                      {reactExtractor(bull.reaction).join('')}
                    </div>
                  </div>
                }
              </div>
              <div>
                <div className='bullOption w3-flex-row w3-flex-center-v' style={{ marginRight: 'auto', marginLeft: 8, display: 'none' }}>
                  <div className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover"}>
                    <FontAwesomeIcon className='w3-large w3-text-grey' icon={faFaceSmileBeam} />
                    <div style={{ padding: 20, width: 260, marginLeft: -100 }} className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                      <div className='w3-flex-row w3-flex-center-v'>
                        <div onClick={() => reaction('heart', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.heart}
                        </div>
                        <div onClick={() => reaction('laugh', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.laugh}
                        </div>
                        <div onClick={() => reaction('sad', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.sad}
                        </div>
                        <div onClick={() => reaction('socked', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.socked}
                        </div>
                        <div onClick={() => reaction('angry', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.angry}
                        </div>
                        <div onClick={() => reaction('fire', index)} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.fire}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 8 }} onClick={() => reply(index, bull.message)} title='Reply'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faReply} /></div>
                  <div style={{ paddingRight: 8, paddingBlock: 8 }} className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover"}>
                    <FontAwesomeIcon className='w3-large w3-text-grey' icon={faEllipsisH} />
                    <div style={{ maxWidth: 80, marginLeft: -60 }} className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                      <div id={index + 'FlashInfo'} className='w3-text-grey w3-small' style={{ padding: 8, display: 'none' }}>Texte copié...</div>
                      <div className='w3-flex-row w3-flex-center-v'>
                        <div title='Copier' onClick={() => copyBullMessage(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                          <FontAwesomeIcon icon={faCopy} />
                        </div>
                        {(!bull.reaction && !replyChecker(index, chatArray) && (Date.now() - (bull.timestamp * 1) < 160000)) &&
                          <>
                            <div title='Supprimer' onClick={() => deletedBull(index)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                              <FontAwesomeIcon icon={faTrash} />
                            </div>
                            <div title='Modifier' onClick={() => editBull(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                              <FontAwesomeIcon icon={faEdit} />
                            </div>
                          </>
                        }
                        <div title='Transférer' onClick={() => transferBull(bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{paddingInline:0}}>
                          <FontAwesomeIcon icon={faShare} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w3-flex-1'></div>
            </div>
          </div>
        )}
      </div>
    ));

    setdisplayChat(glitchChat);

    if (chat.length > userInfo.messageCounter) {
      setTimeout(() => {
        if (document.getElementById("bullField").scrollHeight > window.innerHeight - 160
        ) {
          document.getElementById("bullField").scrollTop = document.getElementById("bullField").scrollHeight - (window.innerHeight - 160);
        }
        userInfo.messageCounter = chat.length
      }, 50);
    } else {
      userInfo.messageCounter = chat.length
    }
  };

  // Bull option react reply

  const deletedBull = (idBull) => {

    // 'Raha mbola tsy misy response na reaction na ao anatin'ny deux minute'
    set(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key + '/' + idBull), null)
    set(ref(database, 'chatcase/' + userInfo.des_key + '_' + userInfo.key + '/' + idBull), null)
      .then(() => {
        // deleted info
        cancelEdit()
      })
      .catch((error) => {
        console.error('Error writing data:', error);
      });

  }

  const reactExtractor = (reactions) => {
    const reactArray = []
    Object.entries(reactions).sort(([, a], [, b]) => a.timestamp - b.timestamp).map(([index, react]) => {
      var counter = 0
      for (let i = 0; i < reactArray.length; i++) {
        const element = reactArray[i];
        if (element == reactionListe[react.reaction]) {
          counter++
        }
      }
      if (counter <= 0) {
        reactArray.push(reactionListe[react.reaction])
      }
    });

    return reactArray
  }

  const reaction = (emoji, idBull) => {

    if (!userInfo.reactHolder) {
      userInfo.reactHolder = true;
      const react = {
        timestamp: Date.now(),
        reaction: emoji,
      }
      set(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key + '/' + idBull + '/reaction/' + userInfo.key), react)
        .then(() => {
          set(ref(database, 'chatcase/' + userInfo.des_key + '_' + userInfo.key + '/' + idBull + '/reaction/' + userInfo.key), react)
            .then(() => {
              userInfo.reactHolder = false
            })
            .catch((error) => {
              console.error('Error writing data:', error);
            });
        })
        .catch((error) => {
          console.error('Error writing data:', error);
        });

    }
  }

  const cancelEdit = () => {
    userInfo.editBull = false
    document.getElementById('editPanel').style.display = 'none'
    document.getElementById('messageTextarea').value = ''
  }

  const editBull = (idBull, bullMessage) => {
    userInfo.editBull = idBull
    document.getElementById('editPanelText').innerText = bullMessage.replace(/\n/g, " ")
    document.getElementById('messageTextarea').value = bullMessage
    document.getElementById('editPanel').style.display = 'flex'
  }

  const transferBull = (message) => {

  }

  const copyBullMessage = (index, message) => {
    navigator.clipboard.writeText(message).then(() => {
      document.getElementById(index + 'FlashInfo').innerText = 'Texte copié...'
      document.getElementById(index + 'FlashInfo').style.display = 'block'
      setTimeout(() => {
        document.getElementById(index + 'FlashInfo').style.display = 'none'
      }, 2000);
    }).catch(err => {
      console.error("Échec de la copie : ", err);
    });
  }

  const cancelReply = () => {
    chatInfo.responseTo = null
    document.getElementById('replyPanel').style.display = 'none'
  }

  const reply = (idBull, bullMessage) => {
    chatInfo.responseTo = idBull
    document.getElementById('replyPanelText').innerText = bullMessage.replace(/\n/g, " ")
    document.getElementById('replyPanel').style.display = 'flex'
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
    document.getElementById('bullField').style.display = 'flex'
  }, [])

  return (
    <div>
      <div id='bullField' className='w3-noscrollbar w3-overflow-scroll' style={{ padding: 8, display: 'flex', flexDirection: 'column-reverse' }}>
        <div className='w3-block'><div style={{ padding: 16 }}>Bientôt, il sera possible d'envoyer des messages directement sur la plateforme, ce qui facilitera la communication et renforcera les interactions. Cette nouvelle fonctionnalité permettra d'échanger des idées, de poser des questions et de partager des expériences en temps réel, rendant l'expérience encore plus dynamique et conviviale.</div>
          {displayChat}
          <div style={{ height: 96 }}></div>
        </div>
      </div>
      <div style={{ maxWidth: 620, margin: "auto", paddingInline: 6, paddingBottom: 8 }} className='w3-dark-grey w3-block w3-display-bottommiddle'>
        <div style={{ padding: 16 }} className='w3-black w3-round w3-card' >
          <div id='replyPanel' className='w3-flex-row w3-flex-center-v' style={{ paddingInline: 8, paddingBottom: 16, display: 'none' }}>
            <FontAwesomeIcon icon={faReply} />
            <div id='replyPanelText' className='w3-margin-left w3-margin-right w3-nowrap w3-overflow' style={{ maxWidth: 260 }}>some text here to reply sdfb sldkhflskdhklsjdhjh sdh </div>
            <FontAwesomeIcon onClick={cancelReply} className='w3-text-red w3-opacity w3-pointer' icon={faTimesCircle} />
          </div>
          <div id='editPanel' className='w3-flex-row w3-flex-center-v' style={{ paddingInline: 8, paddingBottom: 16, display: 'none' }}>
            <FontAwesomeIcon icon={faEdit} />
            <div id='editPanelText' className='w3-margin-left w3-margin-right w3-nowrap w3-overflow' style={{ maxWidth: 260 }}>some text here to reply sdfb sldkhflskdhklsjdhjh sdh </div>
            <FontAwesomeIcon onClick={cancelEdit} className='w3-text-red w3-opacity w3-pointer' icon={faTimesCircle} />
          </div>
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