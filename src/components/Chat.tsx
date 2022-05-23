import { Client as ChatClient } from "twilio-chat";

export default function Chat({ chatRoom }: { chatRoom: ChatClient }) {
  return (
    <div className={"chatWindow"}>
      <div className="header">
        Chat
        <button className="closeButton">X</button>
      </div>
      <div className="footer">
        <input type="text" />
        <button></button>
      </div>
    </div>
  );
}
