import Home from "@/app/Home/page";
import RecrutementView from "./RecrutementView";

function page({params}) {

    return (
        <Home core={<RecrutementView user={params.user} />} />
    )
}

export default page