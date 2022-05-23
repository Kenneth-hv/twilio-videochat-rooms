import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  createLocalTracks,
  createLocalVideoTrack,
  LocalVideoTrack,
} from "twilio-video";

export default function ConnectPanel({
  joinCall,
}: {
  joinCall: (
    name: string,
    roomName: string,
    audio: boolean,
    video: boolean
  ) => void;
}) {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("Room 1");

  const [preview, setPreview] = useState(false);

  const [enableVideo, setEnableVideo] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);

  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack>();

  const previewVideoRef = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    if (!preview) return;
    if (enableVideo) {
      createLocalVideoTrack().then((track) => {
        setLocalVideoTrack(track);
      });
    } else {
      localVideoTrack?.stop();
      setLocalVideoTrack(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableVideo]);

  useEffect(() => {
    if (!preview) return;
    if (localVideoTrack) {
      localVideoTrack.attach(previewVideoRef.current);
    } else {
      previewVideoRef.current.srcObject = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localVideoTrack]);

  function connect() {
    if (localVideoTrack) {
      localVideoTrack.stop();
      previewVideoRef.current.srcObject = null;
    }
    joinCall(name, roomName, enableAudio, enableVideo);
  }

  return preview ? (
    <div id="previewPanel">
      <video ref={previewVideoRef} />
      <div className="row">
        <div id="enableAudio" onClick={() => setEnableAudio(!enableAudio)}>
          {enableAudio ? (
            <Image
              src="/mic-on.png"
              alt="Enable microphone"
              layout="responsive"
              height={86}
              width={86}
            ></Image>
          ) : (
            <Image
              src="/mic-off.png"
              alt="Disable microphone"
              layout="responsive"
              height={86}
              width={86}
            ></Image>
          )}
        </div>
        <div id="enableVideo" onClick={() => setEnableVideo(!enableVideo)}>
          {enableVideo ? (
            <Image
              src="/cam-on.png"
              alt="Enable camera"
              layout="responsive"
              height={86}
              width={86}
            ></Image>
          ) : (
            <Image
              src="/cam-off.png"
              alt="Disable camera"
              layout="responsive"
              height={86}
              width={86}
            ></Image>
          )}
        </div>
      </div>
      <button id="connectBtn" onClick={connect}>
        Connect
      </button>
    </div>
  ) : (
    <div id="connectPanel">
      <h1>Join Room</h1>
      <div className="row">
        <p>Name</p>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="row">
        <p>Room</p>
        <input
          type="text"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
        />
      </div>
      <button
        onClick={() => {
          setPreview(true);
          setEnableVideo(true);
        }}
      >
        Continue
      </button>
    </div>
  );
}
