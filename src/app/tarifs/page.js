import { notFound, redirect } from "next/navigation";
import axios from "axios";
import Home from "@/app/Home/page";
import { app_name, console_source as source } from "@/app/data";
import Tarifs from "./Tarifs";



export default async function page({ params }) {

    try {

        return <Home core={<Tarifs />} />

    } catch (error) {
        console.error(`Error rendering page for slug ${params.slug}:`, error);
        return (
            <div>
                <h1>Error</h1>
                <p>There was an error loading the post. Please try again later.</p>
            </div>
        );
    }
}