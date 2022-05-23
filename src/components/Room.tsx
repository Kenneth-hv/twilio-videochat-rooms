import { useEffect, useState } from "react";
import {
  LocalParticipant,
  RemoteParticipant,
  Room as TwilioRoom,
} from "twilio-video";
import { Video } from "./Video";

export default function Room({
  room,
  invertedView,
}: {
  room: TwilioRoom;
  invertedView: boolean;
}) {
  const [local, setLocal] = useState<LocalParticipant>();
  const [remote, setRemote] = useState<RemoteParticipant>();
  const [showInverted, setShowInverted] = useState(false);

  useEffect(() => {
    room.on("participantConnected", (participant) => {
      console.log("Connected ", participant.sid);
      setRemote(participant);
    });

    room.on("participantDisconnected", (participant) => {
      console.log("Disconnected ", participant.sid);
      setRemote(undefined);
    });

    return () => {
      room.off("participantConnected", (participant) => {
        console.log("Connected ", participant.sid);
        setRemote(participant);
      });
      room.off("participantDisconnected", (participant) => {
        console.log("Disconnected ", participant.sid);
        setRemote(undefined);
      });
    };
  }, [room]);

  useEffect(() => {
    setShowInverted(invertedView || !remote);
  }, [invertedView, remote]);

  useEffect(() => {
    setLocal(room.localParticipant);
    room.participants.forEach((participant) => {
      console.log("Already on call", participant.sid);
      setRemote(participant);
    });
  }, [room, room.localParticipant]);

  return (
    <div id="room">
      <Video
        id={showInverted ? "mainVideo" : "secondaryVideo"}
        participant={local}
        videoOnly
      ></Video>
      <Video
        id={showInverted ? "secondaryVideo" : "mainVideo"}
        participant={remote}
      ></Video>
    </div>
  );
}
