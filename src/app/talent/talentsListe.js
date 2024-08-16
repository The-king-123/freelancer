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
          <div key={key} className="w3-half" style={{ padding: 8 }}>
            <Link
              href={"/talent/" + slugify(des, { lower: true })}
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
                  width={80}
                  height={80}
                  src={
                    source +
                    "/images.php?w=320&h=320&zlonk=5733&zlink=" +
                    slugify(des, { lower: true })
                  }
                  className="w3-round-large w3-margin-right"
                  alt={des}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    minHeight: 80,
                    minWidth: 80,
                  }}
                />
                <div
                  title={des}
                  className="w3-flex-1 w3-medium w3-big w3-nowrap w3-center w3-overflow w3-block"
                >
                  {des}
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
