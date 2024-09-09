import Home from "@/app/Home/page";
import {app_name} from "@/app/data";
import UserRegistre from "./userRegistre";

export default async function page() {

    return (
        <Home core={<UserRegistre />} />
    );
  
}

export function metadata() {
  const meta = {
    title: app_name,
    description: 'Profile',
  };
  return meta;
}