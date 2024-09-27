'use client'
import axios from "axios";
import Home from "@/app/Home/page";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import RecrutementView from "./RecrutementView";

function page({ params }) {
    const [recrutement, setrecrutement] = useState([])
    useEffect(() => {
        const xcode = localStorage.getItem('x-code')

        axios
            .get(source + "/_recrutement/" + params.user + "/edit?xcode=" + xcode)
            .then((res) => {
                if (res.data.logedin) {
                    if (res.data.authorized) {
                        console.log(res.data.data);
                    } else {
                        window.location = '/'
                    }
                } else {
                    if (document.getElementById('modalLogin')) {
                        document.getElementById('modalLogin').style.display = 'block'
                    }
                }
            })
            .catch((e) => {
                console.error("failure", e);
            });
    }, [])
    return (
        <Home core={<RecrutementView />} />
    )
}

export default page