"use client";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import {console_source as source} from "@/app/data";

export default function PostContent({ content }) {

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
                  <span className="w3-small w3-text-grey w3-nowrap w3-overflow">{des.users} utilisateur{des.users>1?'s':''}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}

      {content.length <= 0 && (
        <div>
          <div
            className="w3-text-black w3-border w3-flex-row w3-flex-center-v w3-round w3-block w3-medium w3-big"
            style={{ marginBlock: 16, padding: 12 }}
          >
            You will find categories here...
          </div>
        </div>
      )}
    </div>
  );
}
