import { notFound } from "next/navigation";
import TalentsListe from "./talentsListe";
import axios from "axios";
import Home from "@/app/Home/page";
import { app_name, console_source as source } from "@/app/data";

export default async function page({ params }) {

  try {
    const talents = await axios
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
        return usersData;
      })
      .catch((e) => {
        console.error("failure", e);
      });

    if (!talents) {
      notFound();
    }
    return <Home core={<TalentsListe content={talents} />} />;
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
    title: "Decouvrez nos talents - " + app_name,
    description: 'Vous trouverez ici ce que vous voulez',
  };
  return meta;
}
