"use client";
import Home from "@/app/Home/page";
import React, { useEffect, useState } from "react";

function page({params}) {
  const [core, setcore] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const param = new URLSearchParams(url.search);
    const user = param.get("user");

    setcore(
      <Home user={user ? user : "default"} core={"talent"} settings={[params.category]} />
    );
  }, []);

  return <div>{core}</div>;
}

export default page;
