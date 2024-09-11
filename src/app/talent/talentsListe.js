"use client";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { console_source as source } from "@/app/data";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PostContent() {

  const [content, setcontent] = useState([])

  useEffect(() => {
    axios
      .get(source + "/_auth/users")
      .then((res) => {
        const usersData = [];
        res.data.data.forEach((user) => {
          if (
            !usersData.some(des => des.designation == user.designation) &&
            user.designation != "Admin"
          ) {
            usersData.push({
              designation: user.designation,
              users: 1,
            });
          } else if (user.designation != 'Admin') {
            const design = usersData.find(obj => obj.designation == user.designation);
            if (design) {
              design.users += 1;
            }
          }
        });
        setcontent(usersData);
      })
      .catch((e) => {
        console.error("failure", e);
      });
  }, [])


  return (
    <div>
      {content.length > 0 &&
        content.map((des, key) => (
          <div key={key} style={{ padding: 8 }}>
            <Link
              href={"/talent/" + slugify(des.designation, { lower: true })}
              key={key}
              className="categoryUser w3-half"
              style={{ padding: 8 }}
            >
              <div
                className="w3-flex w3-flex-row w3-light-grey w3-flex-center w3-round"
                style={{ padding: 16 }}
              >
                <Image
                  loading="lazy"
                  unoptimized
                  width={40}
                  height={40}
                  src={
                    source +
                    "/images.php?w=320&h=320&zlonk=5733&zlink=" +
                    slugify(des.designation, { lower: true })
                  }
                  className="w3-round-large w3-margin-right"
                  alt={des.designation}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    minHeight: 40,
                    minWidth: 40,
                  }}
                />
                <div
                  title={des.designation}
                  className="w3-flex-1 w3-flex-column w3-nowrap w3-overflow"
                >
                  <span className="w3-medium w3-big w3-nowrap w3-overflow">{des.designation}</span>
                  <span className="w3-small w3-text-grey w3-nowrap w3-overflow">{des.users} utilisateur{des.users > 1 ? 's' : ''}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
