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

  const [userInfo, setuserInfo] = useState({
    fullname: '',
    key: null,
    des_fullname: '',
    des_key: null,
  })

  const [chatInfo, setchatInfo] = useState({
    timestamp: '',
    attachement: null,
    responseTo: null,
    message: '',
    reaction: null,
    deleted: false,
  })

  const reloadChat = () => {
    onValue(ref(database, 'chatcase/340509348095805'), (snapshot) => {
      if (snapshot.exists()) {

        const chat = snapshot.val()
        Object.entries(chat).sort(([, a], [, b]) => a.timestamp - b.timestamp).map(([key, value]) => {
          console.log(formatChatTimestamp(new Date(value.timestamp)));
        });

      } else {
        console.log("No data available");
      }
    }, (error) => {
      console.error("Error reading data:", error);
    });
  }

  const sendMessage = () => {
    if (chatInfo.message.trim().length > 0) {
      chatInfo.timestamp = Date.now()
      set(push(ref(database, 'chatcase/' + userInfo.key + '_' + userInfo.des_key)), chatInfo)
        .then(() => {
          console.log('Data written successfully!');
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

  useEffect(() => {
    reloadChat();
  }, [])



  return (
    <div>
      <div style={{ padding: 16 }}>Bientôt, il sera possible d'envoyer des messages directement sur la plateforme, ce qui facilitera la communication et renforcera les interactions. Cette nouvelle fonctionnalité permettra d'échanger des idées, de poser des questions et de partager des expériences en temps réel, rendant l'expérience encore plus dynamique et conviviale.</div>
      <div>

      </div>
    </div>
  )
}

export default chatBox