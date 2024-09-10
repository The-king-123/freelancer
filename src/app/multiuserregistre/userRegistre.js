'use client'
import { faArrowRight, faSpinner, faTimesCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { console_source as source } from '../data';
import Papa from "papaparse";
import axios from 'axios';

function userRegistre() {
  axios.defaults.withCredentials = true;

  const [importInfo, setimportInfo] = useState({
    index: {
      email: 1,
      prenom: 2,
      nom: 3,
      phone: 4,
    },
    data: null,
  });

  const [inputCSV, setinputCSV] = useState(null)

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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateRandomNumber = (length) => {
    let randomNumber = "";
    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
  };

  const createStarter = async (key, name) => {
    const request = {
      name: "_accrocher_",
      info:
        "Bonjour ! Je suis " + name + ", Que puis-je faire pour vous!?",
      key: key,
    };
    await axios
      .post(source + "/_topic", request)
      .then((res) => {
        return true;
      })
      .catch((e) => {
        console.error("failure", e);
      });
  };

  const importLaunch = () => {
    if (importInfo.data) {
      Papa.parse(importInfo.data, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const filteredData = results.data.filter((row) => {
            const email = row[importInfo.index.email - 1];
            return email && isValidEmail(email);
          });
          if (filteredData.length > 0) {
            document.getElementById("register_text").className = "w3-hide";
            document.getElementById("import_text").innerHTML = "Ne pas fermer la fenetre...";
            document.getElementById("import_text").className = "w3-xlarge w3-big w3-animate-top";

            document.getElementById("iconImportUpload").style.display = "none";
            document.getElementById("iconImportSpinner").style.display = "inline-block";
            document.getElementById("uploadingText").innerText = "0 / " + filteredData.length;

            
            setTimeout(() => {
              document.getElementById("import_text").innerHTML = "Nous travaillons. Veuillez patienter...";
              document.getElementById("import_text").className = "w3-xlarge w3-big w3-animate-top";

              const failedData = [];

              const xcode = localStorage.getItem('x-code');

              setCSRFToken()
              filteredData.forEach(async (element, k) => {

                const key = generateRandomNumber(15);

                const dataInfo = {
                  fullname: element[importInfo.index.nom - 1].length > 0 || element[importInfo.index.nom - 1].length > 0 ? element[importInfo.index.nom - 1].toUpperCase() + " " + element[importInfo.index.prenom - 1] : element[importInfo.index.email],
                  email: element[importInfo.index.email - 1],
                  password: element[importInfo.index.email - 1],
                  contact: element[importInfo.index.phone - 1].length > 0 ? element[importInfo.index.phone - 1] : "_",
                  designation: "Undefined",
                  key: key,
                  state: "logedin",
                };


                await axios
                  .post(source + "/_auth?xcode=" + xcode, dataInfo)
                  .then(async (res) => {
                    if (res.data.logedin) {

                      if (res.data.exist) {
                        failedData.push(element);
                      } else {
                        if (!await createStarter(key, dataInfo.fullname)) {
                          failedData.push(element);
                        };
                      }
                      document.getElementById("uploadingText").innerText = k + " / " + filteredData.length;

                    } else {
                      if (document.getElementById('modalLogin')) {
                        document.getElementById('modalLogin').style.display = 'block'
                      }
                    }
                  })
                  .catch((e) => {
                    console.error("failure", e);
                    failedData.push(element);
                  });

                if (k == filteredData.length - 1) {
                  if (failedData.length > 0) {
                    document.getElementById("register_text").className = "w3-hide";
                    document.getElementById("import_text").innerHTML = "❌" + failedData.length + " n'ont pas été enregistrés";
                    document.getElementById("import_text").className = "w3-xlarge w3-big w3-animate-top";

                    setTimeout(() => {
                      document.getElementById("register_text").className = "w3-xlarge w3-big w3-animate-top";
                      document.getElementById("import_text").className = "w3-hide";
                    }, 3000);
                  } else {
                    document.getElementById("register_text").className = "w3-hide";
                    document.getElementById("import_text").innerHTML = "Enregistrement fini avec succé";
                    document.getElementById("import_text").className = "w3-xlarge w3-big w3-animate-top";

                    setTimeout(() => {
                      document.getElementById("register_text").className = "w3-xlarge w3-big w3-animate-top";
                      document.getElementById("import_text").className = "w3-hide";
                    }, 3000);
                  }

                  importInfo.data = null;
                  document.getElementById("fileName").innerText = "";
                  document.getElementById("iconImportUpload").style.display = "inline-block";
                  document.getElementById("iconImportSpinner").style.display = "none";
                  document.getElementById("uploadingText").innerText = "Importer";
                }
              });
            }, 2000);
          } else {
            document.getElementById("register_text").className = "w3-hide";
            document.getElementById("import_text").innerHTML = `❌E-mail colonne introuvable`;
            document.getElementById("import_text").className = "w3-xlarge w3-big w3-animate-top";
            setTimeout(() => {
              document.getElementById("register_text").className = "w3-xlarge w3-big w3-animate-top";
              document.getElementById("import_text").className = "w3-hide";
            }, 3000);
          }
        },
        error: (parseError) => {
          console.error("Error parsing CSV:", parseError);
          setError("Error parsing CSV");
        },
      });
    }
  };

  useEffect(() => {
    const xcode = localStorage.getItem('x-code');
    axios
      .get(source + "/_auth?xcode=" + xcode)
      .then((res) => {
        if (!res.data.logedin) {
          if (document.getElementById('modalLogin')) {
            document.getElementById('modalLogin').style.display = 'block'
          }
          document.getElementById('multiregistreCore').innerHTML = '';
        } else {
          if (res.data.authorized) {
            document.getElementById('multiregistreCore').style.display = 'block'
          } else {
            window.location = '/';
          }

        }
      })
      .catch((e) => {
        console.error("failure", e);
        if (document.getElementById('modalLogin')) {
          document.getElementById('modalLogin').style.display = 'block'
        }
        document.getElementById('multiregistreCore').innerHTML = '';
      });
    var inputCSVelement = document.createElement("input");
    inputCSVelement.type = "file";
    inputCSVelement.accept = ".csv";

    inputCSVelement.onchange = (e) => {
      importInfo.data = e.target.files[0];
      if (importInfo.data) {
        document.getElementById("fileName").innerText = importInfo.data.name;
      }
    };
    setinputCSV(inputCSVelement)
  }, [])

  return (
    <div id='multiregistreCore' style={{ display: 'none' }}>
      <div className="w3-flex-column">
        <div
          className="w3-animate-opacity w3-round-large w3-height w3-block w3-flex w3-flex-center-v"
          style={{ padding: 16 }}
        >
          <div className="w3-flex w3-flex-column">
            <div id="import_text" className="w3-hide">
              Working...
              <br />
              Please wait
            </div>
            <div
              id="register_text"
              className="w3-xlarge w3-big text-violet"
            >
              Enregistrer en masse!
            </div>
            <div className={"w3-round-xxlarge content-bar bg-violet"} >
              {" "}
            </div>
            <div className="w3-medium w3-text-grey w3-twothird w3-margin-top">
              Gagnez du temps en enregistrant des
              utilisateurs en masse grâce à l'importation
              de votre fichier CSV.
            </div>
            <div className="w3-margin-top w3-text-grey">
              <div style={{ marginBottom: 8 }}>
                [colonne] : Element (À changer si besoin)
              </div>
              <div>
                [
                <input
                  onChange={(e) => (importInfo.index.email = e.target.value)}
                  type="number"
                  className="w3-white w3-border-0 w3-center"
                  maxLength={2}
                  defaultValue={1}
                  style={{ width: 24 }}
                />
                ] : Adresse e-mail
              </div>
              <div>
                [
                <input
                  onChange={(e) => (importInfo.index.prenom = e.target.value)}
                  type="number"
                  className="w3-white w3-border-0 w3-center"
                  maxLength={2}
                  defaultValue={2}
                  style={{ width: 24 }}
                />
                ] : Prénom
              </div>
              <div>
                [
                <input
                  onChange={(e) => (importInfo.index.nom = e.target.value)}
                  type="number"
                  className="w3-white w3-border-0 w3-center"
                  maxLength={2}
                  defaultValue={3}
                  style={{ width: 24 }}
                />
                ] : Nom
              </div>
              <div>
                [
                <input
                  onChange={(e) => (importInfo.index.phone = e.target.value)}
                  type="number"
                  className="w3-white w3-border-0 w3-center"
                  maxLength={2}
                  defaultValue={4}
                  style={{ width: 24 }}
                />
                ] : Numéro de téléphone
              </div>
            </div>
          </div>
        </div>
        <div
          className="w3-animate-opacity w3-round-large w3-white w3-block w3-flex-column w3-flex-center"
          style={{ minHeight: 160 }}
        >
          <div
            onClick={() => inputCSV.click()}
            className="w3-circle w3-pointer w3-light-grey w3-flex w3-flex-column w3-flex-center"
            style={{ width: 120, height: 120 }}
          >
            <FontAwesomeIcon
              id="iconImportUpload"
              className="w3-xlarge"
              icon={faUpload}
            />
            <FontAwesomeIcon
              id="iconImportSpinner"
              className="w3-xlarge w3-spin"
              icon={faSpinner}
              style={{ display: "none" }}
            />
            <div
              id="uploadingText"
              className="w3-medium w3-big w3-center"
            >
              Importer
            </div>
          </div>

          <div
            style={{ maxWidth: 300 }}
            id="fileName"
            className="w3-margin-top w3-small w3-center w3-nowrap w3-overflow"
          ></div>
        </div>
        <div className="w3-block" style={{ padding: 16 }}>
          <button
            onClick={importLaunch}
            style={{ paddingInline: 24 }}
            className="w3-flex w3-flex-center w3-button w3-black w3-round-xxlarge w3-block"
          >
            LANCER
            <FontAwesomeIcon
              className="w3-margin-left"
              icon={faArrowRight}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default userRegistre