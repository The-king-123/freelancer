'use client'
import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faCheckDouble, faCopy, faDownload, faEdit, faEllipsisH, faFaceSmileBeam, faFile, faFileDownload, faImage, faMicrophone, faMusic, faPaperclip, faPaperPlane, faPlay, faPlus, faReply, faShare, faSpinner, faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import parse from "html-react-parser";
import axios from 'axios';
import { console_source as source } from '../data';
import Image from 'next/image';
import { getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseConfig } from '../firebase';

function chatBox() {

  axios.defaults.withCredentials = true;

  const reactionListe = {
    heart: '❤️',
    laugh: '😆',
    sad: '😥',
    socked: '😮',
    angry: '😡',
    angry: '😡',
    fire: '🔥',
  }

  // Firebase configuration

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);
  auth.settings.appVerificationDisabledForTesting = true;
  auth.useDeviceLanguage();
  // Firebase configuration

  const [search, setsearch] = useState({ keyword: '' })
  const [discutionsData, setdiscutionsData] = useState([
    {
      fullname: 'FREELANCER.MG',
      key: '160471339156947',
      new: true,
    }
  ])
  const [attachementInfo, setattachementInfo] = useState({
    media: null,
    name: '',
    link: '',
    type: '',
  })
  const [chatCase, setchatCase] = useState([])
  const [displayChat, setdisplayChat] = useState('')
  const [chatListe, setchatListe] = useState(
    <div style={{ padding: 24 }} className='w3-center'>
      <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
    </div>
  )
  const [authPhoneNumber, setauthPhoneNumber] = useState({
    phoneNumber: '',
    code: null,
    holder: false,
    resend: 0,
  })
  const [usersData, setusersData] = useState([])

  const [userInfo, setuserInfo] = useState({
    fullname: '',
    des_fullname: '',
    key: null,
    des_key: null,
    sendHolder: false,
    reactHolder: false,
    messageCounter: 0,
  })

  const [chatInfo, setchatInfo] = useState({
    key: '',
    des_key: '',
    fullname: '',
    des_fullname: '',
    timestamp: '',
    attachement: null,
    responseTo: null,
    message: "",
    reaction: null,
    deleted: false,
    state: 'sent',
    responseText: '',
  })

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

  const download = (bull) => {
    const url = source + '/download.php?zlonk=2733&zlink=' + bull.attachement.link;
    const link = document.createElement('a');

    link.href = url;
    link.download = bull.attachement.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const reloadChat = () => {
    onValue(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key), (snapshot) => {
      if (snapshot.exists()) {
        const chat = snapshot.val()
        const chatCopie = { ...chat }
        delete chat.userInfo;
        if (document.getElementById('chatListeCore').style.display != 'block') {
          displayMessage(Object.entries(chat).sort(([, a], [, b]) => a.timestamp - b.timestamp), chat, chatCopie.userInfo);
        }
      } else {
        displayMessage([], false, false)
      }
    }, (error) => {
      console.error("Error reading data:", error);
    });
  }

  const sendMessage = async () => {

    chatInfo.key = userInfo.key
    chatInfo.des_key = userInfo.des_key
    chatInfo.message = document.getElementById('messageTextarea').value.trim();
    document.getElementById('bullField').style.scrollBehavior = 'smooth';

    if ((chatInfo.attachement || chatInfo.message.length > 0) && !userInfo.sendHolder) {
      userInfo.sendHolder = true;
      chatInfo.timestamp = Date.now()

      const chatRef = ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key);
      const chatPush = push(chatRef)

      if (userInfo.editBull) {

        await set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/' + userInfo.editBull + '/message'), chatInfo.message)
        await set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/' + userInfo.editBull + '/message'), chatInfo.message)
        await set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/' + userInfo.editBull + '/edited'), true)
        await set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/' + userInfo.editBull + '/edited'), true)
          .then(async () => {
            userInfo.editBull = false
            if (document.getElementById('messageTextarea')) {
              document.getElementById('messageTextarea').value = '';
            }

            userInfo.sendHolder = false;
            chatInfo.key = '';
            chatInfo.des_key = '';
            chatInfo.timestamp = '';
            chatInfo.attachement = null;
            chatInfo.reaction = null;
            chatInfo.deleted = false;
            chatInfo.state = 'sent';

            await set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/userInfo'), {
              fullname: userInfo.des_fullname,
              key: userInfo.des_key,
              timestamp: Date.now(),
              state: 'sent',
              lastmessage: {
                key: userInfo.key,
                message: chatInfo.responseTo ? 'A répondu: ' + chatInfo.message : chatInfo.message
              }
            }).then(async () => {
              await set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/userInfo'), {
                fullname: userInfo.fullname,
                key: userInfo.key,
                timestamp: Date.now(),
                state: 'sent',
                lastmessage: {
                  key: userInfo.key,
                  message: chatInfo.responseTo ? 'A répondu: ' + chatInfo.message : chatInfo.message
                }
              }).then(() => {
                chatInfo.message = '';
                chatInfo.responseTo = null;
              })
            })

            if (document.getElementById('mediaPanel')) {
              document.getElementById('mediaPanel').style.display = 'none'
            }

            attachementInfo.name = ''
            attachementInfo.type = ''
            attachementInfo.link = ''
            attachementInfo.media = null

            if (document.getElementById('uploadMediaSpinner')) {
              document.getElementById('uploadMediaSpinner').style.display = 'none'
            }

            cancelMedia();
            cancelReply();
            cancelEdit();
          })
          .catch((error) => {
            console.error('Error writing data:', error);
          });
      } else {

        set(chatPush, chatInfo)
          .then(() => {
            set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/' + chatPush.key), chatInfo)
              .then(() => {
                document.getElementById('messageTextarea').value = ''
                userInfo.sendHolder = false;
                chatInfo.key = '';
                chatInfo.des_key = '';
                chatInfo.timestamp = '';
                chatInfo.reaction = null;
                chatInfo.deleted = false;

                set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/userInfo'), {
                  fullname: userInfo.des_fullname,
                  key: userInfo.des_key,
                  timestamp: Date.now(),
                  state: 'sent',
                  lastmessage: {
                    key: userInfo.key,
                    message: chatInfo.responseTo ? 'A répondu à: ' + chatInfo.responseText : (chatInfo.attachement ? 'A envoyé une ' + (attachementInfo.type == 'image' ? 'photo' : (attachementInfo.type == 'video' ? 'video' : 'pièce jointe')) : chatInfo.message)
                  }
                }).then(() => {
                  set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/userInfo'), {
                    fullname: userInfo.fullname,
                    key: userInfo.key,
                    timestamp: Date.now(),
                    state: 'sent',
                    lastmessage: {
                      key: userInfo.key,
                      message: chatInfo.responseTo ? 'A répondu à: ' + chatInfo.responseText : (chatInfo.attachement ? 'A envoyé une ' + (attachementInfo.type == 'image' ? 'photo' : (attachementInfo.type == 'video' ? 'video' : 'pièce jointe')) : chatInfo.message)
                    }
                  }).then(() => {
                    chatInfo.message = '';
                    chatInfo.responseTo = null;
                    chatInfo.attachement = null;
                    cancelMedia()
                    cancelReply()
                  })
                })


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

  const formatChatTimestamp = (timestamp) => {
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

  const toggleBlink = (id) => {
    const element = document.getElementById(id)
    element.style.transition = '0.5s'
    const blinkInterval = setInterval(() => {
      element.style.opacity = (element.style.opacity == 1) ? 0.2 : 1;
    }, 200);
    setTimeout(() => {
      clearInterval(blinkInterval);
      element.style.opacity = 1;
    }, 2000);
  }

  const reactionNotifyMessage = (index, bull) => {
    if (bull.attachement) {
      if (bull.attachement.type == 'image') {
        return 'une photo'
      }
      if (bull.attachement.type == 'video') {
        return 'une video'
      }
      if (bull.attachement.type == 'attachement') {
        return 'un fichier'
      }
    } else {
      return bull.message;
    }
  }

  const displayMessage = async (chat, chatBrut, UI) => {

    const themeLight = localStorage.getItem('theme') != 'dark' ? true : false
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
                      <div
                        style={{
                          padding: 20,
                          width: 260,
                          marginLeft: (bull.attachement ? 0 : (bull.responseTo
                            ? (mostLongTextLine(chatBrut[bull.responseTo].message) > mostLongTextLine(bull.message)
                              ? (mostLongTextLine(chatBrut[bull.responseTo].message) > 26
                                ? 0
                                : -180 + mostLongTextLine(chatBrut[bull.responseTo].message) * 8)
                              : mostLongTextLine(bull.message) > 26 ? 0 : -180 + (mostLongTextLine(bull.message) * 8))
                            : mostLongTextLine(bull.message) > 26 ? 0 : -180 + (mostLongTextLine(bull.message) * 8)))
                        }}

                        className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                        <div className='w3-flex-row w3-flex-center-v'>
                          <div onClick={() => reaction('heart', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.heart}
                          </div>
                          <div onClick={() => reaction('laugh', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.laugh}
                          </div>
                          <div onClick={() => reaction('sad', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.sad}
                          </div>
                          <div onClick={() => reaction('socked', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.socked}
                          </div>
                          <div onClick={() => reaction('angry', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.angry}
                          </div>
                          <div onClick={() => reaction('fire', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                            {reactionListe.fire}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 8 }} onClick={() => reply(index, bull)} title='Reply'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faReply} /></div>
                  <div style={{ paddingRight: 8, paddingBlock: 8 }} className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover"}>
                    <FontAwesomeIcon className='w3-large w3-text-grey' icon={faEllipsisH} />
                    <div style={{
                      maxWidth: 80,
                      marginLeft: (bull.attachement ? 0 : (bull.responseTo
                        ? (mostLongTextLine(chatBrut[bull.responseTo].message) > mostLongTextLine(bull.message)
                          ? (mostLongTextLine(chatBrut[bull.responseTo].message) > 12
                            ? 0
                            : -120 + mostLongTextLine(chatBrut[bull.responseTo].message) * 8)
                          : mostLongTextLine(bull.message) > 12 ? 0 : -120 + (mostLongTextLine(bull.message) * 8))
                        : mostLongTextLine(bull.message) > 12 ? 0 : -120 + (mostLongTextLine(bull.message) * 8)))
                    }}
                      className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                      <div id={index + 'FlashInfo'} className='w3-text-grey w3-small' style={{ padding: 8, display: 'none' }}>Texte copié...</div>
                      <div className='w3-flex-row w3-flex-center-v'>
                        {bull.message.length > 0 &&
                          <div title='Copier' onClick={() => copyBullMessage(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                            <FontAwesomeIcon icon={faCopy} />
                          </div>
                        }
                        {(!bull.reaction && !replyChecker(index, chatArray) && (Date.now() - (bull.timestamp * 1) < 160000)) &&
                          <>
                            <div title='Supprimer' onClick={() => deletedBull(index)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                              <FontAwesomeIcon icon={faTrash} />
                            </div>
                            {bull.message.length > 0 &&
                              <div title='Modifier' onClick={() => editBull(index, bull)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                                <FontAwesomeIcon icon={faEdit} />
                              </div>
                            }
                          </>
                        }
                        {bull.attachement &&
                          <div title='Télécharger' onClick={() => download(bull)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                            <FontAwesomeIcon icon={faDownload} />
                          </div>
                        }
                        <div title='Transférer' onClick={() => transferBull(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
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
                  <div onClick={() => {
                    document.getElementById(bull.responseTo + (chatBrut[bull.responseTo].attachement ? 'Image' : '')).scrollIntoView(
                      {
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                      }
                    );
                    toggleBlink(bull.responseTo + (chatBrut[bull.responseTo].attachement ? 'Image' : ''))
                  }} className='w3-container' style={{ position: 'relative', padding: 0, zIndex: 0 }}>
                    {!chatBrut[bull.responseTo].attachement &&
                      <div
                        className={(themeLight ? "w3-opacity" : "w3-opacity-max") + " w3-yellow w3-hover-yellow chatbull w3-round-xlarge w3-right w3-nowrap w3-overflow"}
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
                    }
                    {chatBrut[bull.responseTo].attachement &&
                      <Image
                        loading="lazy"
                        unoptimized
                        layout="intrinsic"
                        width={80}
                        height={80}
                        src={
                          source + "/images.php?w=80&h=80&zlonk=9733&zlink=" + chatBrut[bull.responseTo].attachement.link
                        }
                        className={(themeLight ? "w3-opacity" : "w3-opacity-max") + " w3-round-large w3-right chat-image"}
                        alt={chatBrut[bull.responseTo].attachement.name}
                        style={{ objectFit: "cover", objectPosition: "center", minWidth: 80, maxWidth: 80 }}
                      />
                    }
                  </div>
                }

                {/* Bull core */}
                {bull.message.length > 0 &&
                  <div
                    id={index}
                    className="chatbull w3-yellow w3-hover-yellow w3-round-xlarge w3-right w3-nowrap w3-opacity-off"
                    style={{
                      paddingInline: 16,
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      position: 'relative',
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
                    {/\n.+/.test(bull.message) ? parse(bull.message.replace(/\n/g, "<br/>")) : bull.message}
                  </div>
                }
                {/* Bull media */}
                {bull.attachement &&
                  <div id={index + 'Image'} className='w3-container' style={{ padding: 0 }}>
                    {bull.attachement.type == 'image' &&
                      <Image
                        loading="lazy"
                        unoptimized
                        layout="intrinsic"
                        width={240}
                        height={200}
                        src={
                          source + "/images.php?w=320&h=320&zlonk=9733&zlink=" + bull.attachement.link
                        }
                        className="w3-round-large w3-right chat-image"
                        alt={bull.attachement.name}
                        style={{ objectFit: "cover", objectPosition: "center", minWidth: 180, maxWidth: 240 }}
                      />
                    }
                    {bull.attachement.type == 'video' &&
                      <video
                        style={{
                          width: 240,
                        }}
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-overflow w3-block w3-round-large"}
                        controls
                      >
                        <source
                          src={source + '/videos.php?zlonk=4733&zlink=' + bull.attachement.link}
                          type={"video/" + bull.attachement.link.split('.')[1]}
                        />
                        Your browser does not support the video tag.
                      </video>
                    }
                    {bull.attachement.type == 'application' &&
                      <div
                        onClick={() => download(bull)}
                        style={{
                          width: 240,
                          height: 200,
                          padding: 24,
                        }}
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-overflow w3-block w3-round-large w3-flex-column w3-flex-center"}
                      >
                        <FontAwesomeIcon icon={faPaperclip} className='w3-xxlarge w3-margin-bottom' />
                        <div className='w3-block w3-nowrap-multiline w3-overflow w3-center'>{bull.attachement.name}</div>
                      </div>
                    }
                  </div>
                }

                {/* Bull reaction */}
                {bull.reaction &&
                  <div className='w3-container' style={{ padding: 0 }}>

                    {/* // react list info */}
                    <div className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover w3-right"}>
                      <div
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " chatbull w3-round-xlarge w3-small w3-card"}
                        style={{
                          paddingTop: 4,
                          paddingInline: 4,
                          borderRadius: 16,
                          marginTop: -8,
                          marginInline: 8
                        }}
                      >
                        {reactExtractor(bull.reaction).map(react => (
                          <>
                            {react.react}{react.nb > 1 ? <span className='w3-tiny w3-text-grey' style={{ marginLeft: -1, marginRight: 3 }}>{react.nb}</span> : ''}
                          </>
                        ))}
                      </div>
                      <div style={{
                        maxWidth: 80,
                        marginLeft: - 124 + ((reactExtractor(bull.reaction).length - 1) * 12)
                      }}
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                        <div className='w3-flex-column'>
                          {
                            Object.entries(bull.reaction).sort(([, a], [, b]) => a.timestamp - b.timestamp).map(([idx, react]) => (
                              <div onClick={() => idx == userInfo.key ? removeMyReaction(index) : false} className='w3-button w3-flex-row w3-flex-center' style={{ paddingInline: 8 }}>
                                {reactionListe[react.reaction]}
                                <div className='w3-flex-1 w3-right-align'>{idx == userInfo.key ? 'Vous' : ''}</div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                    {/* // end react list info */}
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
                  <div onClick={() => {
                    document.getElementById(bull.responseTo + (chatBrut[bull.responseTo].attachement ? 'Image' : '')).scrollIntoView(
                      {
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                      }
                    ); toggleBlink(bull.responseTo + (chatBrut[bull.responseTo].attachement ? 'Image' : ''))
                  }} className='w3-container' style={{ padding: 0, zIndex: 0, position: 'relative' }}>
                    {!chatBrut[bull.responseTo].attachement &&
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
                    }
                    {chatBrut[bull.responseTo].attachement &&
                      <Image
                        loading="lazy"
                        unoptimized
                        layout="intrinsic"
                        width={80}
                        height={80}
                        src={
                          source + "/images.php?w=80&h=80&zlonk=9733&zlink=" + chatBrut[bull.responseTo].attachement.link
                        }
                        className={(themeLight ? "w3-opacity" : "w3-opacity-max") + " w3-round-large w3-left chat-image"}
                        alt={chatBrut[bull.responseTo].attachement.name}
                        style={{ objectFit: "cover", objectPosition: "center", minWidth: 80, maxWidth: 80 }}
                      />
                    }
                  </div>
                }

                {/* Bull core here */}
                {bull.message.length > 0 &&
                  <div
                    id={index}
                    className={(themeLight ? "w3-light-grey" : "w3-black") + " chatbull w3-opacity-off w3-round-xlarge w3-left w3-nowrap"}
                    style={{
                      paddingInline: 16,
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      position: 'relative',
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
                    {/\n.+/.test(bull.message) ? parse(bull.message.replace(/\n/g, "<br/>")) : bull.message}

                  </div>
                }

                {/* Bull media */}
                {bull.attachement &&
                  <div id={index + 'Image'} className='w3-container' style={{ padding: 0 }}>
                    {bull.attachement.type == 'image' &&
                      <Image
                        loading="lazy"
                        unoptimized
                        layout="intrinsic"
                        width={240}
                        height={200}
                        src={
                          source + "/images.php?w=320&h=320&zlonk=9733&zlink=" + bull.attachement.link
                        }
                        className="w3-round-large chat-image w3-left"
                        alt={bull.attachement.name}
                        style={{ objectFit: "cover", objectPosition: "center", minWidth: 180, maxWidth: 240 }}
                      />
                    }
                    {bull.attachement.type == 'video' &&
                      <video
                        style={{
                          width: 240,
                        }}
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-overflow w3-block w3-round-large"}
                        controls
                      >
                        <source
                          src={source + '/videos.php?zlonk=4733&zlink=' + bull.attachement.link}
                          type={"video/" + bull.attachement.link.split('.')[1]}
                        />
                        Your browser does not support the video tag.
                      </video>
                    }
                    {bull.attachement.type == 'application' &&
                      <div
                        onClick={() => download(bull)}
                        style={{
                          width: 240,
                          height: 200,
                          padding: 24,
                        }}
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-overflow w3-block w3-round-large w3-flex-column w3-flex-center"}
                      >
                        <FontAwesomeIcon icon={faPaperclip} className='w3-xxlarge w3-margin-bottom' />
                        <div className='w3-block w3-nowrap-multiline w3-overflow w3-center'>{bull.attachement.name}</div>
                      </div>
                    }
                  </div>
                }

                {/* Bull reaction */}
                {bull.reaction &&
                  <div className='w3-container' style={{ padding: 0 }}>

                    {/* // react list info */}
                    <div className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover w3-left"}>
                      <div
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " chatbull w3-round-xlarge w3-small w3-card"}
                        style={{
                          paddingTop: 4,
                          paddingInline: 4,
                          borderRadius: 16,
                          marginTop: -8,
                          marginInline: 8
                        }}
                      >
                        {reactExtractor(bull.reaction).map(react => (
                          <>
                            {react.react}{react.nb > 1 ? <span className='w3-tiny w3-text-grey' style={{ marginLeft: -1, marginRight: 3 }}>{react.nb}</span> : ''}
                          </>
                        ))}
                      </div>
                      <div style={{
                        maxWidth: 80,
                        marginLeft: 4
                      }}
                        className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                        <div className='w3-flex-column'>
                          {
                            Object.entries(bull.reaction).sort(([, a], [, b]) => a.timestamp - b.timestamp).map(([idx, react]) => (
                              <div onClick={() => idx == userInfo.key ? removeMyReaction(index) : false} className='w3-button w3-flex-row w3-flex-center' style={{ paddingInline: 8 }}>
                                {reactionListe[react.reaction]}
                                <div className='w3-flex-1 w3-right-align'>{idx == userInfo.key ? 'Vous' : ''}</div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                    {/* // end react list info */}
                  </div>
                }
              </div>
              <div>
                <div className='bullOption w3-flex-row w3-flex-center-v' style={{ marginRight: 'auto', marginLeft: 8, display: 'none' }}>
                  <div className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover"}>
                    <FontAwesomeIcon className='w3-large w3-text-grey' icon={faFaceSmileBeam} />
                    <div style={{
                      padding: 20,
                      width: 260,
                      marginLeft: (bull.attachement ? -240 : (bull.responseTo
                        ? (mostLongTextLine(chatBrut[bull.responseTo].message) > mostLongTextLine(bull.message)
                          ? (mostLongTextLine(chatBrut[bull.responseTo].message) > 26
                            ? -240
                            : - (mostLongTextLine(chatBrut[bull.responseTo].message) * 8))
                          : mostLongTextLine(bull.message) > 26 ? -240 : - (mostLongTextLine(bull.message) * 8))
                        : mostLongTextLine(bull.message) > 26 ? -240 : - (mostLongTextLine(bull.message) * 8)))
                    }}
                      className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                      <div className='w3-flex-row w3-flex-center-v'>
                        <div onClick={() => reaction('heart', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.heart}
                        </div>
                        <div onClick={() => reaction('laugh', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.laugh}
                        </div>
                        <div onClick={() => reaction('sad', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.sad}
                        </div>
                        <div onClick={() => reaction('socked', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.socked}
                        </div>
                        <div onClick={() => reaction('angry', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.angry}
                        </div>
                        <div onClick={() => reaction('fire', index, reactionNotifyMessage(bull.key, bull))} className='w3-flex-1 w3-center w3-xlarge w3-pointer'>
                          {reactionListe.fire}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 8 }} onClick={() => reply(index, bull)} title='Reply'><FontAwesomeIcon className='w3-large w3-text-grey' icon={faReply} /></div>
                  <div style={{ paddingRight: 8, paddingBlock: 8 }} className={(themeLight ? "w3-white" : "w3-dark-grey") + " w3-dropdown-hover"}>
                    <FontAwesomeIcon className='w3-large w3-text-grey' icon={faEllipsisH} />
                    <div style={{
                      maxWidth: 80,
                      marginLeft: (bull.attachement ? -120 : (bull.responseTo
                        ? (mostLongTextLine(chatBrut[bull.responseTo].message) > mostLongTextLine(bull.message)
                          ? (mostLongTextLine(chatBrut[bull.responseTo].message) > 9
                            ? -140
                            : -60 + mostLongTextLine(chatBrut[bull.responseTo].message) * 8)
                          : mostLongTextLine(bull.message) > 9 ? -140 : - 60 - (mostLongTextLine(bull.message) * 8))
                        : mostLongTextLine(bull.message) > 9 ? -140 : - 60
                          - (mostLongTextLine(bull.message) * 8)))
                    }}
                      className={(themeLight ? "w3-light-grey" : "w3-black") + " w3-dropdown-content w3-bar-block w3-card w3-round-large w3-overflow"}>
                      <div id={index + 'FlashInfo'} className='w3-text-grey w3-small' style={{ padding: 8, display: 'none' }}>Texte copié...</div>
                      <div className='w3-flex-row w3-flex-center-v'>
                        {bull.message.length > 0 &&
                          <div title='Copier' onClick={() => copyBullMessage(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                            <FontAwesomeIcon icon={faCopy} />
                          </div>
                        }
                        {(userInfo.key == bull.key && !bull.reaction && !replyChecker(index, chatArray) && (Date.now() - (bull.timestamp * 1) < 160000)) &&
                          <>
                            <div title='Supprimer' onClick={() => deletedBull(index)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                              <FontAwesomeIcon icon={faTrash} />
                            </div>
                            {bull.message.length > 0 &&
                              <div title='Modifier' onClick={() => editBull(index, bull)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                                <FontAwesomeIcon icon={faEdit} />
                              </div>
                            }
                          </>
                        }
                        {bull.attachement &&
                          <div title='Télécharger' onClick={() => download(bull)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
                            <FontAwesomeIcon icon={faDownload} />
                          </div>
                        }
                        <div title='Transférer' onClick={() => transferBull(index, bull.message)} className='w3-button w3-flex-1 w3-flex-center' style={{ paddingInline: 0 }}>
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

    if (UI) {
      if (UI.lastmessage.key * 1 != userInfo.key * 1) {
        await set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/userInfo/state'), 'read').then(async () => {
          await set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/userInfo/state'), 'read')
        })
      }
    }
    setTimeout(() => {
      document.getElementById('chattingCore').style.display = 'flex';
    }, 100);
    setdisplayChat(glitchChat);

    console.log(chat.length);
    console.log(userInfo.messageCounter);


    if (chat.length > userInfo.messageCounter) {
      setTimeout(() => {
        if (document.getElementById("bullField").scrollHeight > window.innerHeight - 160
        ) {
          document.getElementById("bullField").scrollTop = document.getElementById("bullField").scrollHeight - (window.innerHeight - 160);
        }
        userInfo.messageCounter = chat.length
        document.getElementById('bullField').style.display = 'flex';

      }, 50);
    } else {
      userInfo.messageCounter = chat.length
      document.getElementById('bullField').style.display = 'flex';

    }
  };

  // Bull option react reply

  const deletedBull = (idBull) => {

    // 'Raha mbola tsy misy response na reaction na ao anatin'ny deux minute'
    set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/' + idBull), null)
      .then(() => {
        set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/' + idBull), null)
          .then(() => {
            set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/userInfo'), {
              fullname: userInfo.des_fullname,
              key: userInfo.des_key,
              timestamp: Date.now(),
              state: 'sent',
              lastmessage: {
                key: userInfo.key,
                message: 'A supprimé un message'
              }
            }).then(() => {
              set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/userInfo'), {
                fullname: userInfo.fullname,
                key: userInfo.key,
                timestamp: Date.now(),
                state: 'sent',
                lastmessage: {
                  key: userInfo.key,
                  message: 'A supprimé un message'
                }
              }).then(() => cancelEdit())
            })
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

  const reactExtractor = (reactions) => {
    const reactArray = []
    Object.entries(reactions).sort(([, a], [, b]) => a.timestamp - b.timestamp).map(([index, react]) => {
      var counter = 0
      var idx
      for (let i = 0; i < reactArray.length; i++) {
        const element = reactArray[i].react;
        if (element == reactionListe[react.reaction]) {
          counter++
          idx = i
        }
      }
      if (counter <= 0) {
        reactArray.push({
          react: reactionListe[react.reaction],
          key: index,
          nb: 1,
        })
      } else {
        reactArray[idx].nb++
      }
    });

    return reactArray
  }

  const reaction = (emoji, idBull, message) => {

    if (!userInfo.reactHolder) {
      userInfo.reactHolder = true;
      const react = {
        timestamp: Date.now(),
        reaction: emoji,
      }
      set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/' + idBull + '/reaction/' + userInfo.key), react)
        .then(() => {
          set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/' + idBull + '/reaction/' + userInfo.key), react)
            .then(() => {
              set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/userInfo'), {
                fullname: userInfo.des_fullname,
                key: userInfo.des_key,
                timestamp: Date.now(),
                state: 'sent',
                lastmessage: {
                  key: userInfo.key,
                  message: 'A réagi ' + reactionListe[emoji] + ' à: ' + message
                }
              }).then(() => {
                set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/userInfo'), {
                  fullname: userInfo.fullname,
                  key: userInfo.key,
                  timestamp: Date.now(),
                  state: 'sent',
                  lastmessage: {
                    key: userInfo.key,
                    message: 'A réagi ' + reactionListe[emoji] + ' à: ' + message
                  }
                }).then(() => chatInfo.message = '')
              })
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

  const removeMyReaction = (idBull) => {

    set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/' + idBull + '/reaction/' + userInfo.key), null)
      .then(() => {
        set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/' + idBull + '/reaction/' + userInfo.key), null)
          .then(() => {
            set(ref(database, 'chatcase/' + userInfo.key + '/' + userInfo.des_key + '/userInfo'), {
              fullname: userInfo.des_fullname,
              key: userInfo.des_key,
              timestamp: Date.now(),
              state: 'sent',
              lastmessage: {
                key: userInfo.key,
                message: 'A supprimé une réaction'
              }
            }).then(() => {
              set(ref(database, 'chatcase/' + userInfo.des_key + '/' + userInfo.key + '/userInfo'), {
                fullname: userInfo.fullname,
                key: userInfo.key,
                timestamp: Date.now(),
                state: 'sent',
                lastmessage: {
                  key: userInfo.key,
                  message: 'A supprimé une réaction'
                }
              })
            })
          })
          .catch((error) => {
            console.error('Error writing data:', error);
          });
      })
      .catch((error) => {
        console.error('Error writing data:', error);
      });
  }

  const cancelEdit = () => {
    userInfo.editBull = false
    chatInfo.responseTo = null
    if (document.getElementById('editPanel')) {
      document.getElementById('editPanel').style.display = 'none'
    }
    if (document.getElementById('messageTextarea')) {
      document.getElementById('messageTextarea').value = ''
    }

  }

  const editBull = (idBull, bull) => {
    userInfo.editBull = idBull
    chatInfo.responseTo = bull.responseTo ? bull.responseTo : null

    document.getElementById('editPanelText').innerText = bull.message.replace(/\n/g, " ")
    document.getElementById('messageTextarea').value = bull.message
    document.getElementById('editPanel').style.display = 'flex'
  }

  const transferBull = (index, message) => {
    document.getElementById(index + 'FlashInfo').innerHTML = "La fonctionnalité <br/>\"Transférer\" n'est pas <br/>encore disponible pour <br/>le moment."
    document.getElementById(index + 'FlashInfo').style.display = 'block'
    setTimeout(() => {
      document.getElementById(index + 'FlashInfo').style.display = 'none'
    }, 2000);
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
    if (document.getElementById('replyPanel')) {
      document.getElementById('replyPanel').style.display = 'none'
    }
  }

  const reply = (idBull, bull) => {
    chatInfo.responseTo = idBull;
    chatInfo.responseText = bull.attachement ? (bull.attachement.type == 'image' ? 'Une Photo' : (bull.attachement.type == 'video' ? 'Une Video' : 'Une Pièce jointe')) : bull.message.replace(/\n/g, " ")
    if (bull.attachement) {
      document.getElementById('replyPanelImage').style.backgroundImage = `url(${source}/images.php?w=320&h=320&zlonk=9733&zlink=${bull.attachement.link})`;
      document.getElementById('replyPanelText').innerText = bull.attachement ? (bull.attachement.type == 'image' ? 'Une Photo' : (bull.attachement.type == 'video' ? 'Une Video' : 'Une Pièce jointe')) : bull.message.replace(/\n/g, " ")
      document.getElementById('replyPanelImage').style.display = 'inline-block'
      document.getElementById('replyPanel').style.display = 'flex'
    } else {
      document.getElementById('replyPanelText').innerText = bull.message.replace(/\n/g, " ")
      document.getElementById('replyPanelImage').style.display = 'none'
      document.getElementById('replyPanel').style.display = 'flex'

    }
  }

  const reloadChatsList = (data, type) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].state == 'sent') {
        if (data[i].lastmessage) {
          if (data[i].lastmessage.key * 1 != userInfo.key * 1) {
            set(ref(database, 'chatcase/' + data[i].key + '/' + userInfo.key + '/userInfo/state'), 'received').then(() => {
              set(ref(database, 'chatcase/' + userInfo.key + '/' + data[i].key + '/userInfo/state'), 'received')
            })
          }
        }
      }
    }

    const themeLight = localStorage.getItem('theme') != 'dark' ? true : false
    var glitchChat
    if (data.length > 0) {
      glitchChat = data.map((user, key) => (
        <div key={key} style={{ padding: 4 }}>
          <div
            onClick={() => displayDiscution(user)}
            className={"w3-flex w3-flex-row w3-flex-center w3-round " + (themeLight ? "w3-white" : "w3-dark-grey")}
            style={{ paddingBlock: 8 }}
          >
            <Image
              loading="lazy"
              unoptimized
              width={48}
              height={48}
              src={
                source + "/images.php?w=80&h=80&zlonk=3733&zlink=" + user.key
              }
              className={"w3-circle w3-margin-right " + (themeLight ? "w3-light-grey" : "w3-black")}
              alt={user.fullname}
              style={{ objectFit: "cover", objectPosition: "center", minHeight: 48, minWidth: 48 }}
            />
            <div className="w3-flex-1 w3-medium w3-nowrap w3-overflow w3-block">
              {user.fullname} <br />
              {type != 'search' && !user.new &&
                <>
                  <span className={(user.lastmessage ? (user.lastmessage.key == userInfo.key ? false : true) : false) && user.state != 'read' && 'w3-big'}>
                    {user.lastmessage ? (user.lastmessage.key == userInfo.key ? 'Vous: ' : '') : ''}{user.lastmessage ? user.lastmessage.message : 'Aucune conversation'}
                  </span>
                  <div className='w3-small' style={{ marginTop: -4, textAlign: 'right' }}>
                    <span className='w3-text-grey'>{formatChatTimestamp(user.timestamp)}</span>
                    {user.state == 'sent' && <FontAwesomeIcon style={{ marginLeft: 8 }} className='w3-text-grey' icon={faCheck} />}
                    {user.state == 'received' && <FontAwesomeIcon style={{ marginLeft: 8 }} className='w3-text-blue' icon={faCheck} />}
                    {user.state == 'read' && <FontAwesomeIcon style={{ marginLeft: 8 }} className='w3-text-blue' icon={faCheckDouble} />}
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      ))
    } else {
      //
      var glitchChat = (
        <div style={{ padding: 8 }}>
          <div className="w3-round w3-flex w3-flex-center-v" style={{ height: 48 }}>
            <div style={{ paddingInline: 16 }}>
              {
                type == 'search'
                  ? "Aucun contact ne correspond à votre recherche..."
                  : "Vous n’avez aucune discussion pour le moment..."
              }

            </div>
          </div>
        </div>
      )
    }

    if (window.location.search.length > 0) {
      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("to")) {
        if (data.length > 0) {
          var searchFound = false;
          data.forEach(user => {
            if (user.key == urlParams.get("to")) {
              searchFound = true;
              displayDiscution(user)
            }
          });
          if (!searchFound) {
            const baseUrl = window.location.origin;
            const newUrl = `${baseUrl}/chat`;

            document.getElementById('chatListeCore').style.display = 'block'
            document.getElementById('chattingCore').style.display = 'none';

            history.pushState({}, "", newUrl);
          }
        }
      } else {
        const baseUrl = window.location.origin;
        const newUrl = `${baseUrl}/chat`;

        document.getElementById('chatListeCore').style.display = 'block'
        document.getElementById('chattingCore').style.display = 'none';

        history.pushState({}, "", newUrl);
      }
    } else if (userInfo.key != '160471339156947' && userInfo.key != '336302677822455') {
      if (data.length > 0) {
        var searchFound = false;
        data.forEach(user => {
          if (user.key == '160471339156947') {
            searchFound = true;
            displayDiscution(user)
          }
        });
        const baseUrl = window.location.origin;
        const newUrl = `${baseUrl}/chat?to=160471339156947`;

        document.getElementById('chatListeCore').style.display = 'block'
        document.getElementById('chattingCore').style.display = 'none';

        history.pushState({}, "", newUrl);
      }
    }


    setchatListe(glitchChat)
  }

  const searchUsers = () => {
    const searchResults = usersData.filter(user => user.fullname.toLowerCase().includes((search.keyword.toLowerCase()) || user.email.toLowerCase().includes(search.keyword.toLowerCase())) && user.key != userInfo.key);
    if (search.keyword.length >= 3) {
      reloadChatsList(searchResults, 'search')
    } else {
      reloadChatsList(discutionsData, 'discution')
    }

  }

  const displayDiscution = (user) => {

    userInfo.des_fullname = user.fullname
    userInfo.des_key = user.key

    //change the url to the chat url
    const baseUrl = window.location.origin;
    const newUrl = `${baseUrl}/chat?to=${user.key}`;

    document.getElementById('chatListeCore').style.display = 'none'
    document.getElementById('bullField').style.scrollBehavior = 'unset';
    document.getElementById('bullField').style.display = 'flex';

    history.pushState({}, "", newUrl);
    reloadChat()

  }

  const cancelMedia = () => {
    if (!userInfo.sendHolder) {
      if (document.getElementById('mediaPanel')) {
        document.getElementById('mediaPanel').style.display = 'none'
      }
      if (document.getElementById('uploadMediaSpinner')) {
        document.getElementById('uploadMediaSpinner').style.display = 'none'
      }

      attachementInfo.name = ''
      attachementInfo.type = ''
      attachementInfo.link = ''
      attachementInfo.media = null
    }
  }

  const uploadMedia = async () => {

    if (attachementInfo.media && !userInfo.sendHolder) {

      document.getElementById('uploadMediaSpinner').style.display = 'flex'
      document.getElementById('previewImageName').innerText = "En cours de téléversement..."

      userInfo.sendHolder = true;
      attachementInfo.media.append("type", 'chatMediaStore');

      const xcode = localStorage.getItem("x-code");
      await setCSRFToken();
      await axios
        .post(source + "/_post?xcode=" + xcode, attachementInfo.media)
        .then((res) => {
          if (res.data.logedin) {
            if (res.data.stored) {
              userInfo.sendHolder = false;
              attachementInfo.media = null;
              attachementInfo.link = res.data.medianame;
              chatInfo.attachement = attachementInfo;
              sendMessage();
            } else {
              userInfo.sendHolder = false;
              return;
            }
          } else {
            if (document.getElementById('modalLogin')) {
              document.getElementById('modalLogin').style.display = 'block'
            }
            userInfo.sendHolder = false;
            return;
          }

        })
        .catch((e) => {
          if (e.response && e.response.status === 419) {
            console.error('CSRF token missing or incorrect');
          } else {
            console.error('Request failed:', error);
          }
          userInfo.sendHolder = true;
          return;
        });
    }
  }

  function syncWidths() {
    if (document.getElementById('chatListeCore') && document.getElementById('chatHeadSearch')) {
      let element1 = document.getElementById('chatListeCore');
      let element2 = document.getElementById('chatHeadSearch');
      element2.style.width = `${element1.offsetWidth}px`;
    }
  }

  function setupRecaptcha(containerId) {
    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible", // Or 'normal' for visible reCAPTCHA
      callback: (response) => {
        console.log("reCAPTCHA verified:", response);
      },
    });
    return recaptchaVerifier;
  }

  function signInWithPhone() {
    const containerId = 'recaptchaContainer'
    const phoneNumber = authPhoneNumber.phoneNumber;

    if (formatPhoneNumber(phoneNumber)) {
      localStorage.setItem('userPhoneNumber', formatPhoneNumber(phoneNumber))
      window.location.reload();
    }
    // if (formatPhoneNumber(phoneNumber) && !authPhoneNumber.holder) {
    //   authPhoneNumber.holder = true;
    //   const recaptchaVerifier = setupRecaptcha(containerId);
    //   signInWithPhoneNumber(auth, formatPhoneNumber(phoneNumber), recaptchaVerifier)
    //     .then((confirmationResult) => {
    //       if (document.getElementById('smsCodeConfirmation')) {
    //         document.getElementById('smsCodeConfirmation').innerText = "Un code a été envoyé au numéro ********" + phoneNumber.slice(-2) + ". Veuillez le saisir ci-dessous pour confirmer."
    //         document.getElementById('modalCodeConfirmation').style.display = 'block'
    //         document.getElementById('modalNotLogedIn').style.display = 'none';

    //         if (authPhoneNumber.resend > 0) {
    //           document.getElementById('textErrorCC').className = 'w3-text-yellow w3-small'
    //           document.getElementById('textErrorCC').innerText = "Le code a été renvoyé."
    //           document.getElementById('textErrorCC').style.display = 'block'
    //           setTimeout(() => {
    //             document.getElementById('textErrorCC').style.display = 'none'
    //           }, 3000);
    //         }
    //         var wait = 60
    //         const sendCodeInterval = setInterval(() => {
    //           wait--;
    //           document.getElementById('resendCodeCompter').innerText = wait + 's'
    //         }, 1000);
    //         setTimeout(() => {
    //           authPhoneNumber.holder = false;
    //           clearInterval(sendCodeInterval)
    //           authPhoneNumber.resend++
    //           document.getElementById('resendCodeCompter').innerText = '';
    //         }, 60000);
    //       }

    //       window.confirmationResult = confirmationResult; // Store to confirm the code
    //     })
    //     .catch((error) => {
    //       document.getElementById('textErrorPN').innerText = "On n'a pas pu envoyer un code sur votre numero"
    //       document.getElementById('textErrorPN').style.display = 'block'
    //       setTimeout(() => {
    //         document.getElementById('textErrorPN').style.display = 'none'
    //         authPhoneNumber.holder = false;
    //       }, 3000);
    //     });
    // } else {
    //   document.getElementById('textErrorPN').innerText = "Veuillez vérifier votre numéro de téléphone."
    //   document.getElementById('textErrorPN').style.display = 'block'
    //   setTimeout(() => {
    //     document.getElementById('textErrorPN').style.display = 'none'
    //   }, 3000);
    // }

  }

  function formatPhoneNumber(phoneNumber) {
    const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
    if (sanitizedPhoneNumber !== phoneNumber) {
      return false;
    }
    if (sanitizedPhoneNumber.startsWith('0')) {
      return '+261' + sanitizedPhoneNumber.slice(1);
    }
    if (sanitizedPhoneNumber.startsWith('+')) {
      return sanitizedPhoneNumber;
    }
    return false;
  }

  const confirmCode = () => {
    if (authPhoneNumber.code.length > 5) {
      confirmationResult.confirm(authPhoneNumber.code).then((result) => {
        console.log(result.user);
        const user = result.user;
        window.location.reload();
      }).catch((error) => {
        console.log(error);
        document.getElementById('textErrorCC').className = 'w3-text-red w3-small'
        document.getElementById('textErrorCC').innerText = "Le code que vous avez saisi est incorrect."
        document.getElementById('textErrorCC').style.display = 'block'
        setTimeout(() => {
          document.getElementById('textErrorCC').style.display = 'none'
        }, 3000);
      });
    }

  }

  const fetchChatListe = () => {
    onValue(ref(database, 'chatcase/' + userInfo.key), (snapshot) => {

      if (snapshot.exists()) {
        const chats = snapshot.val();
        const discutions = [
          {
            fullname: 'FREELANCER.MG',
            key: '160471339156947',
            new: true,
          }
        ]
        var uicounter = 0;
        discutionsData.splice(1, discutionsData.length);
        const sortedChats = Object.entries(chats).sort(([, a], [, b]) => b.userInfo.timestamp - a.userInfo.timestamp)
        sortedChats.map(([index, chat]) => {
          if (chat.userInfo) {
            if (chat.userInfo.key == '160471339156947') {
              discutions[0] = chat.userInfo
              discutionsData[0] = chat.userInfo
            } else {
              discutions.push(chat.userInfo);
              discutionsData.push(chat.userInfo)
            }
          } else {
            uicounter++
          }

        });
        if (uicounter <= 0) {
          reloadChatsList(discutions, 'discution')
        }

      } else {
        reloadChatsList(discutionsData, 'discution')
      }
    }, (error) => {
      console.error("Error reading data:", error);
    });
  }

  useEffect(() => {

    document.getElementById('bullField').style.height = (window.innerHeight - 32 - (window.innerWidth < 992 ? 96 : 0)) + 'px';
    document.getElementById('bullField').style.maxHeight = (window.innerHeight - 32 - (window.innerWidth < 992 ? 96 : 0)) + 'px';

    if (document.getElementById('headerPageTitle')) {
      document.getElementById('headerPageTitle').innerText = ('Discussions').toUpperCase()
    }

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

    if (window.innerWidth <= 992) {
      document.getElementById('chatInputWrapper').style.marginBottom = '52px'
      document.getElementById('chatHeadSearch').style.marginTop = '48px'
      document.getElementById('chatListeCore').style.height = document.getElementById('coreMain').offsetHeight + 'px';
      document.getElementById('chatListeScrollable').style.height = document.getElementById('coreMain').offsetHeight - 132 + 'px';
    }

    syncWidths();
    window.addEventListener('resize', syncWidths);

    const xcode = localStorage.getItem('x-code');
    axios
      .get(source + "/_auth?xcode=" + xcode)
      .then((res) => {
        if (res.data.logedin) {

          userInfo.key = res.data.user.key;
          userInfo.fullname = res.data.user.fullname;

          if (res.data.user.designation == 'Admin' || res.data.user.key == '336302677822455') {
            document.getElementById('searchUserInputWrapper').style.display = 'block'
            document.getElementById('listeChatSpacer').style.height = '64px'
          }

          fetchChatListe()

          axios
            .get(source + "/_auth/create")
            .then((res) => {
              res.data.data.forEach(user => {
                usersData.push(user);
              });
            })
            .catch((e) => {
              console.error("failure", e);
            });

          document.getElementById('messageTextarea').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return;
              } else {
                attachementInfo.media ? uploadMedia() : sendMessage()
              }
            }
          });

        } else {
          // onAuthStateChanged(auth, (user) => {
          //   if (user) {
          //     userInfo.key = user.phoneNumber;
          //     userInfo.fullname = user.phoneNumber;
          //     fetchChatListe()
          //   } else {
          //     console.log("No user is signed in.");
          //     document.getElementById('chatListeCore').style.display = 'none'
          //     if (document.getElementById('modalNotLogedIn')) {
          //       document.getElementById('modalNotLogedIn').style.display = 'block'
          //     }
          //     document.getElementById('chattingCore').innerHTML = '';
          //     document.getElementById('chatListeCore').innerHTML = '';
          //   }
          // });

          if (localStorage.getItem('userPhoneNumber')) {
            userInfo.key = localStorage.getItem('userPhoneNumber');
            userInfo.fullname = localStorage.getItem('userPhoneNumber');
            fetchChatListe()
          } else {
            console.log("No user is signed in.");
            document.getElementById('chatListeCore').style.display = 'none'
            if (document.getElementById('modalNotLogedIn')) {
              document.getElementById('modalNotLogedIn').style.display = 'block'
            }
            document.getElementById('chattingCore').innerHTML = '';
            document.getElementById('chatListeCore').innerHTML = '';
          }
        }
      })
      .catch((e) => {
        console.error("failure", e);
        //
      });

    document.getElementById('searchUserInput').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        searchUsers()
      }
    });

    // image input selector
    var imageSelector = document.createElement("input");
    imageSelector.type = "file";
    imageSelector.accept = "image/*, video/*";

    imageSelector.onchange = (e) => {
      const file = e.target.files[0];

      if (file.size > (10 * 1024 * 1024) && file.type.split('/')[0] == 'image') {
        alert("L'image dépasse la taille maximale autorisée de 10 Mo.");
        return;
      }
      if (file.size > (25 * 1024 * 1024) && file.type.split('/')[0] == 'video') {
        alert("La video dépasse la taille maximale autorisée de 25 Mo.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("media", file);

      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;

        document.getElementById("previewImage").style.backgroundImage = `url(${content})`;
        document.getElementById("previewImageName").innerText = file.name;
        document.getElementById("mediaPanel").style.display = 'flex';

        attachementInfo.media = formData;
        attachementInfo.type = file.type.split('/')[0];
        attachementInfo.name = file.name;
      };
    };

    document.getElementById('imageSelector').addEventListener('click', () => imageSelector.click())

    // audio input selector
    var audioSelector = document.createElement("input");
    audioSelector.type = "file";
    audioSelector.accept = "audio/*";

    audioSelector.onchange = (e) => {
      const file = e.target.files[0];

      if (file.size > (10 * 1024 * 1024)) {
        alert("L'audio dépasse la taille maximale autorisée de 10 Mo.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("media", file);

      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;

        document.getElementById("previewImage").style.backgroundImage = `url(${content})`;
        document.getElementById("previewImageName").innerText = file.name;
        document.getElementById("mediaPanel").style.display = 'flex';

        attachementInfo.media = formData;
        attachementInfo.type = file.type.split('/')[0];
        attachementInfo.name = file.name;
      };
    };

    document.getElementById('audioSelector').addEventListener('click', () => audioSelector.click())

    // file input selector
    var fileSelector = document.createElement("input");
    fileSelector.type = "file";
    fileSelector.accept = "application/*, text/*";

    fileSelector.onchange = (e) => {
      const file = e.target.files[0];

      if (file.size > (25 * 1024 * 1024)) {
        alert("Le fichier dépasse la taille maximale autorisée de 25 Mo.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("media", file);

      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;

        document.getElementById("previewImage").style.backgroundImage = `url(${content})`;
        document.getElementById("previewImageName").innerText = file.name;
        document.getElementById("mediaPanel").style.display = 'flex';

        attachementInfo.media = formData;
        attachementInfo.type = file.type.split('/')[0];
        attachementInfo.name = file.name;
      };
    };

    document.getElementById('fileSelector').addEventListener('click', () => fileSelector.click())

    if (window.innerWidth < 620) {
      document.getElementById('chatInputWrapper').style.marginLeft = '-8px'
    }

  }, [])

  return (
    <div id='chatMainCore'>
      <div id='chattingCore' style={{ display: 'none' }}>
        <div id='bullField' className='w3-noscrollbar w3-overflow-scroll w3-block' style={{ padding: 8, display: 'flex', flexDirection: 'column-reverse' }}>
          <div className='w3-block'>
            <div className='w3-block' style={{ minHeight: 132 }}></div>
            {displayChat}
            <div className='w3-block' style={{ minHeight: 72 }}></div>
          </div>
        </div>
        <div id='chatInputWrapper' style={{ maxWidth: 620, paddingInline: 6, paddingBottom: 6, marginBottom: 8 }} className='w3-dark-grey w3-block w3-bottom'>
          <div style={{ padding: 16 }} className='w3-black w3-round w3-card' >
            <div id='replyPanel' className='w3-flex-row w3-flex-center-v' style={{ paddingInline: 8, paddingBottom: 16, display: 'none' }}>
              <FontAwesomeIcon icon={faReply} />
              <div id='replyPanelImage' className='w3-round w3-dark-grey' style={{ width: 42, height: 42, display: 'none', minWidth: 42, minHeight: 42, backgroundPosition: 'center', backgroundSize: 'cover', marginLeft: 8 }}>
              </div>
              <div id='replyPanelText' className='w3-margin-left w3-margin-right w3-nowrap w3-overflow' style={{ maxWidth: 260 }}>some text here to reply sdfb sldkhflskdhklsjdhjh sdh </div>
              <FontAwesomeIcon onClick={cancelReply} className='w3-text-red w3-opacity w3-pointer' icon={faTimesCircle} />
            </div>
            <div id='editPanel' className='w3-flex-row w3-flex-center-v' style={{ paddingInline: 8, paddingBottom: 16, display: 'none' }}>
              <FontAwesomeIcon icon={faEdit} />
              <div id='editPanelText' className='w3-margin-left w3-margin-right w3-nowrap w3-overflow' style={{ maxWidth: 260 }}>some text here to reply sdfb sldkhflskdhklsjdhjh sdh </div>
              <FontAwesomeIcon onClick={cancelEdit} className='w3-text-red w3-opacity w3-pointer' icon={faTimesCircle} />
            </div>
            <div id='mediaPanel' className='w3-flex-row w3-flex-center-v' style={{ paddingRight: 8, paddingBottom: 16, display: 'none' }}>
              <div id='previewImage' className='w3-round w3-dark-grey' style={{ width: 42, height: 42, minWidth: 42, minHeight: 42, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                <div id='uploadMediaSpinner' style={{ display: 'none' }} className='w3-block w3-height w3-flex w3-flex-center black-opacity'>
                  <FontAwesomeIcon className='w3-spin' icon={faSpinner} />
                </div>
              </div>
              <div id='previewImageName' className='w3-margin-left w3-margin-right w3-nowrap w3-overflow' style={{ maxWidth: 260 }}>some text here to reply sdfb sldkhflskdhklsjdhjh sdh </div>
              <FontAwesomeIcon onClick={cancelMedia} className='w3-text-red w3-opacity w3-pointer' icon={faTimesCircle} />
            </div>
            <div className='w3-flex-row w3-flex-center-v'>
              {/* Dropdown for attachement */}
              <div
                className="w3-dropdown-hover"
              >
                <div
                  id='selectorWrapper'
                  className="w3-dropdown-content w3-bar-block w3-card w3-round"
                  style={{ minWidth: 230, marginTop: 8, paddingBottom: 4, bottom: 32, paddingTop: 6, paddingInline: 6 }}
                >
                  <div
                    id='imageSelector'
                    className="w3-bar-item w3-button w3-round"
                  >
                    <FontAwesomeIcon
                      id="logoutIcon"
                      className="w3-margin-right"
                      icon={faImage}
                    />
                    Photo / Video
                  </div>
                  <div
                    id='audioSelector'
                    className="w3-bar-item w3-button w3-round"
                  >
                    <FontAwesomeIcon
                      id="logoutIcon"
                      className="w3-margin-right"
                      icon={faMusic}
                    />
                    Audio
                  </div>
                  <div
                    id='fileSelector'
                    className="w3-bar-item w3-button w3-round"
                  >
                    <FontAwesomeIcon
                      id="logoutIcon"
                      className="w3-margin-right"
                      icon={faPaperclip}
                    />
                    Fichier
                  </div>
                  {/* / arrow marker / */}
                  <div style={{ marginBottom: -20 }}>
                    <FontAwesomeIcon
                      icon={faPlay}
                      className="rotate90 w3-text-white"
                      style={{ marginTop: -4, marginLeft: 4 }}
                    />
                  </div>
                  {/* / arrow marker / */}
                </div>
                <div className='w3-pointer w3-yellow w3-hover-yellow w3-circle w3-flex w3-flex-center w3-margin-right' style={{ width: 32, height: 32 }}>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              </div>
              {/* End dropdown attachement */}

              <div className='w3-flex-1'>
                <textarea id='messageTextarea' style={{ paddingInline: 24, height: 40, resize: 'none' }} type='text' placeholder='Message' className='w3-input w3-border-0 w3-round-xxlarge w3-block w3-dark-grey w3-noscrollbar' />
              </div>
              <div onClick={() => attachementInfo.media ? uploadMedia() : sendMessage()} className='w3-pointer w3-yellow w3-hover-yellow w3-circle w3-flex w3-flex-center w3-margin-left' style={{ width: 32, height: 32 }}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id='chatListeCore'>
        <div id='chatHeadSearch' className='w3-dark-grey w3-top w3-block'>
          <div id='searchUserInputWrapper' style={{ paddingInline: 16, paddingBlock: 16, display: 'none' }}>
            <input
              id="searchUserInput"
              onChange={(e) => search.keyword = e.target.value}
              className="input w3-border-0 w3-input w3-border-0 w3-round-xxlarge w3-black "
              placeholder="Chercher un contact"
              type="text"
            />
          </div>
        </div>
        <div id='chatListeScrollable' style={{ paddingInline: 12, marginBottom: 16 }}>
          <div id='listeChatSpacer'></div>
          {
            chatListe
          }
        </div>
      </div>
      {/* modal not logedin */}
      <div
        id="modalNotLogedIn"
        className="w3-modal w3-noscrollbar"
        style={{ padding: 24, zIndex: 999999 }}
      >
        <div
          className="w3-dark-grey w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
          style={{
            minHeight: 240,
            paddingBlock: 8,
            paddingInline: 0,
            maxWidth: 320,
          }}
        >
          <div
            style={{ paddingBlock: 0, paddingInline: 8 }}
          >
            <div
              onClick={() => {
                if (document.getElementById('modalLogin')) {
                  document.getElementById('modalLogin').style.display = 'block'
                  document.getElementById('modalNotLogedIn').style.display = 'none'
                }
              }
              }
              className="w3-pointer w3-right w3-flex w3-flex-center"
              style={{ width: 32, height: 32 }}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                style={{ width: 20, height: 20 }}
              />
            </div>
          </div>
          <div className="w3-block w3-flex-column w3-flex-center" style={{ paddingInline: 8 }}>
            <div className="w3-block">
              <div style={{ paddingInline: 24, paddingBlock: 8 }} id='cardNotPremiumText'>
                Vous devez vous connecter pour voir les messages, ou bien utiliser votre numéro mobile.
              </div>
              <div id='textErrorPN' style={{ paddingInline: 24, paddingBlock: 8, display: 'none' }} className='w3-text-red w3-small'>
                Veuillez vérifier votre numéro de téléphone.
              </div>
              <div className="w3-center w3-dark-grey w3-flex-column w3-flex-center">
                <div className="w3-margin w3-block" style={{ paddingInline: 16 }}>
                  <input onChange={(e) => authPhoneNumber.phoneNumber = e.target.value} style={{ paddingInline: 16 }} className='w3-input w3-border-0 w3-block w3-round-xxlarge w3-black w3-margin-bottom' placeholder='Numéro de téléphone' type='text' />
                  <div
                    id='sendCode'
                    onClick={signInWithPhone}
                    className="transition w3-medium w3-yellow w3-hover-yellow w3-button w3-block w3-round-xxlarge"
                  >
                    <span id='buttonContactText'>Envoyer</span>
                    <FontAwesomeIcon className='w3-margin-left' icon={faArrowRight} />
                  </div>
                  <div
                    style={{ paddingTop: 16 }}
                    onClick={() => {
                      if (document.getElementById('modalLogin')) {
                        document.getElementById('modalLogin').style.display = 'block'
                        document.getElementById('modalNotLogedIn').style.display = 'none'
                      }
                    }
                    }
                    className="w3-small w3-center w3-pointer"
                  >
                    Vous avez un compte: <u>Se connecter</u>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      {/*end modal logedin */}

      {/* modal code confirmation */}
      <div
        id="modalCodeConfirmation"
        className="w3-modal w3-noscrollbar"
        style={{ padding: 24, zIndex: 999999 }}
      >
        <div
          className="w3-dark-grey w3-display-middle w3-block w3-noscrollbar w3-container w3-round-large w3-content w3-overflow"
          style={{
            minHeight: 240,
            paddingBlock: 8,
            paddingInline: 0,
            maxWidth: 320,
          }}
        >
          <div
            style={{ paddingBlock: 0, paddingInline: 8 }}
          >
            <div
              onClick={() => {
                if (document.getElementById('modalNotLogedIn')) {
                  document.getElementById('modalNotLogedIn').style.display = 'block'
                  document.getElementById('modalCodeConfirmation').style.display = 'none'
                }
              }
              }
              className="w3-pointer w3-left w3-flex w3-flex-center"
              style={{ width: 32, height: 32 }}
            >
              <FontAwesomeIcon
                className='w3-hover-text-black'
                icon={faArrowLeft}
                style={{ width: 20, height: 20 }}
              />
            </div>
          </div>
          <div className="w3-block w3-flex-column w3-flex-center">
            <div className="w3-block">
              <div style={{ paddingInline: 24, paddingBlock: 8 }} id='smsCodeConfirmation'>
                Un code a été envoyé au numéro ********. Veuillez le saisir ci-dessous pour confirmer.
              </div>
              <div id='textErrorCC' style={{ paddingInline: 24, paddingBlock: 8, display: 'none' }} className='w3-text-red w3-small'>
                Le code que vous avez saisi est incorrect.
              </div>
              <div className="w3-center w3-dark-grey w3-flex w3-flex-center">
                <div className="w3-margin w3-block" style={{ paddingInline: 8 }}>
                  <input onChange={(e) => authPhoneNumber.code = e.target.value} style={{ paddingInline: 16 }} className='w3-input w3-border-0 w3-block w3-round-xxlarge w3-black w3-margin-bottom' placeholder='Code de confirmation' type='text' />
                  <div
                    id='confirmCode'
                    onClick={confirmCode}
                    className="transition w3-medium w3-yellow w3-hover-yellow w3-button w3-block w3-round-xxlarge"
                  >
                    <span id='buttonContactText'>Confirmer</span>
                    <FontAwesomeIcon className='w3-margin-left' icon={faArrowRight} />
                  </div>

                  <div style={{ paddingBlock: 16 }}>
                    <div
                      onClick={!authPhoneNumber.holder && signInWithPhone}
                      className="w3-small w3-center w3-pointer"
                    >
                      Vous n'avez pas reçu de code ?<u>&nbsp;Réessayez. <span id='resendCodeCompter'></span></u>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*end modal code cofirmation */}
      <div id='recaptchaContainer' style={{ paddingInline: 8 }}></div>
    </div >
  )
}

export default chatBox