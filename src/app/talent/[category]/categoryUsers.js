"use client";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";


export default function PostContent({ content }) {

  const [displayMembers, setdisplayMembers] = useState('')

  const reloadMembers = (data) => {

    const themeLight = localStorage.getItem('theme') == 'light' ? true : false

    var glitchMembers
    if (data.length > 0) {
      glitchMembers = data.map((user, key) => (
        user.designation != 'Admin' &&
        <Link
          href={"/user/" + user.key}
          key={key}
          className="categoryUser w3-half"
          style={{ padding: 8 }}
        >
          <div
            data-key={user.key}
            className={"beastUser w3-flex w3-flex-row w3-flex-center w3-round " +(themeLight ? "w3-light-grey" : "w3-black")}
            style={{ padding: 12 }}
          >
            <Image
              loading="lazy"
              unoptimized
              width={48}
              height={48}
              src={
                source + "/images.php?w=80&h=80&zlonk=3733&zlink=" + user.key
              }
              className="w3-circle w3-margin-right"
              alt={user.fullname}
              style={{ objectFit: "cover", objectPosition: "center", minHeight: 48, minWidth: 48 }}
            />
            <div className="w3-flex-1 w3-medium w3-big w3-nowrap w3-overflow w3-block">
              {user.fullname}
            </div>
          </div>
        </Link>
      ))
    } else {
      glitchMembers = (
        <div>
          <div
            className="w3-text-black w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            You will find users here...
          </div>
        </div>
      )
    }
    setdisplayMembers(glitchMembers)

  }

  useEffect(() => {
    reloadMembers(content)
  }, [])

  return (
    <div>
      {displayMembers}
    </div>
  );
}
