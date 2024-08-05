"use client";
import React, { useEffect, useState } from "react";
import Home from "../Home/page";

function page() {
  const [talent, settalent] = useState("");

  useEffect(() => {

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const user = params.get("user");

    settalent(<Home user={user?user:"default"} core={"talent"} />);
    
  }, []);

  return <div>{talent}</div>;
}

export default page;
