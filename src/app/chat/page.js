import ChatBox from './chatBox'
import {app_name} from "@/app/data";
import Home from "@/app/Home/page";

export default async function page() {

  try {
    return <Home core={<ChatBox />} />;
  } catch (error) {
    console.error('Error rendering forum for default user ', error);
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the chat. Please try again later.</p>
      </div>
    );
  }
}

export function metadata() {
  const meta = {
    title: app_name + ' - Chat',
    description: 'Nos chats pour vous aider à interagir avec simplicité et rapidité.',
  };
  return meta;
}