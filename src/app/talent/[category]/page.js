import { notFound } from "next/navigation";
import CategoryUsers from "./categoryUsers";
import axios from "axios";
import Home from "@/app/Home/page";
import slugify from "slugify";
import {console_source as source} from "@/app/data";

var titre =''
export default async function page({ params }) {

  try {
    const users = await axios
      .get(source + "/_auth/users")
      .then((res) => {
        const usersData = [];
        
        res.data.data.forEach((user) => {
          if ( slugify(user.designation,{lower:true}) == params.category ) {
            titre = user.designation;
            usersData.push(user);
          }
        });

        return usersData;
      })
      .catch((e) => {
        console.error("failure", e);
      });

    if (!users) {
      notFound();
    }
    return <Home core={<CategoryUsers content={users} />} />;
  } catch (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the post. Please try again later.</p>
      </div>
    );
  }
}

export async function metadata() {

  const meta = {
    title: titre,
    description: 'Vous trouverez ici ce que vous voulez',
  };
  return meta;
}
