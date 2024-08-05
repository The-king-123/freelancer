"use client";
import Home from "@/app/Home/page";
import React, { useEffect, useState } from "react";

function page({params}) {
  const [core, setcore] = useState("");

  useEffect(() => {

    setcore(
      <Home user={params.user} core={"user"} settings={[params.user]} />
    );
    
  }, []);

  return <div>{core}</div>;
}

export default page;