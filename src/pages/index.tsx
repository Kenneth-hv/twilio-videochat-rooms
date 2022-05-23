import { connect, Room as TwilioRoom } from "twilio-video";
import { Client as ChatClient } from "twilio-chat";
import type { NextPage } from "next";
import { useState } from "react";
import Toolbar from "../components/Toolbar";
import Room from "../components/Room";
import ConnectPanel from "../components/ConnectPanel";
import Chat from "../components/Chat";

const Home: NextPage = () => {
  const [room, setRoom] = useState<TwilioRoom>();
  const [chatRoom, setChatRoom] = useState<ChatClient>();
  const [invertedView, setInvertedView] = useState(false);

  ChatClient;

  async function joinCall(
    name: string,
    roomName: string,
    audio: boolean,
    video: boolean
  ) {
    if (room) {
      alert("Already on a call");
      return;
    }
    const response = await fetch(
      `/api/token?identity=${name}&room=${roomName}`
    );

    const responseJson = await response.json();

    try {
      const room = await connect(responseJson.token, {
        audio,
        video,
      });
      const chatRoom = new ChatClient(responseJson.token);

      setRoom(room);
      setChatRoom(chatRoom);

      chatRoom.on("stateChanged", (state) => {
        console.log(state);
      });

      console.log("Connected", room);
    } catch (error) {
      console.error(error);
    }
  }

  async function leaveCall() {
    if (!room) return;
    room.disconnect();
    setRoom(undefined);
  }

  return (
    <>
      {room && chatRoom ? (
        <>
          <Room room={room} invertedView={invertedView}></Room>
          <Toolbar
            invert={() => {
              setInvertedView(!invertedView);
            }}
            disconnect={() => leaveCall()}
          />
          {/* {<Chat chatRoom={chatRoom}></Chat>} */}
        </>
      ) : (
        <ConnectPanel joinCall={joinCall}></ConnectPanel>
      )}
    </>
  );
};

export default Home;
