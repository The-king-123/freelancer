import Home from "@/app/Home/page";
import Gestion from "./Gestion";



export default async function page({ params }) {

    try {

        return <Home core={<Gestion />} />

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