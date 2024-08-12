import { notFound } from "next/navigation";
import TalentsListe from "./talentsListe";
import axios from "axios";
import Home from "@/app/Home/page";

export default async function page({ params }) {
  const source = "https://console.freelancer.mg";
  // const source = "http://127.0.0.1:8000";

  try {
    const talents = await axios
      .get(source + "/_auth/users")
      .then((res) => {
        const usersData = [];
        res.data.data.forEach((user) => {
          if (
            !usersData.includes(user.designation) &&
            user.designation != "Admin"
          ) {
            usersData.push(user.designation);
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
    title: "Decouvrez nos talents",
    description: 'Vous trouverez ici ce que vous voulez',
  };
  return meta;
}
