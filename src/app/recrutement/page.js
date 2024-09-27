'use client'
import axios from "axios";
import Home from "@/app/Home/page";
import { console_source as source } from "@/app/data";
import Recrutement from "./Recrutement";
import { useEffect, useState } from "react";

function page() {
  const [recrutements, setrecrutements] = useState([])

  useEffect(() => {

    const xcode = localStorage.getItem('x-code')

    axios
      .get(source + "/_recrutement?xcode=" + xcode)
      .then((res) => {
        console.log(res.data.data);
      })
      .catch((e) => {
        console.error("failure", e);
      });
  }, [])
  return (
    <Home core={<Recrutement recrutements={recrutements} />} />
  )
}

export default page