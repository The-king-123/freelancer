import { notFound } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import {app_name, console_source as source} from "@/app/data";
import Profile from "./Profile";

export default async function page() {

    return (
        <Home core={<Profile />} />
    );
  
}

export function metadata() {
  const meta = {
    title: app_name,
    description: 'Profile',
  };
  return meta;
}
