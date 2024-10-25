import Home from "@/app/Home/page";
import UserGestion from "./UserGestion";

export default async function page() {

    try {
        return <Home core={<UserGestion />} />

    } catch (error) {
       
        return (
            <div>
                <h1>Error</h1>
                <p>There was an error loading the post. Please try again later.</p>
            </div>
        );
    }
}