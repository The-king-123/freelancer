"use client";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import {console_source as source} from "@/app/data";


export default function PostContent({ content }) {   

  return (
    <div>
      {content.length > 0 &&
        content.map((user, key) => (
          user.designation != 'Admin' &&
          <Link
            href={"/user/" + user.key}
            key={key}
            className="categoryUser w3-half"
            style={{ padding: 8 }}
          >
            <div
              className="w3-flex w3-flex-row w3-light-grey w3-flex-center"
              style={{ padding: 16 }}
            >
              <Image
                loading="lazy"
                unoptimized
                width={64}
                height={64}
                src={
                  source + "/images.php?w=80&h=80&zlonk=3733&zlink=" + user.key
                }
                className="w3-circle w3-margin-right"
                alt={user.fullname}
                style={{ objectFit: "cover", objectPosition: "center", minHeight: 64, minWidth: 64 }}
              />
              <div className="w3-flex-1 w3-medium w3-big w3-nowrap w3-center w3-overflow w3-block">
                {user.fullname}
              </div>
            </div>
          </Link>
        ))}

      {content.length <= 0 && (
        <div>
          <div
            className="w3-text-black w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            You will find users here...
          </div>
        </div>
      )}
    </div>
  );
}
