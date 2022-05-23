import { HTMLAttributes, useEffect, useRef } from "react";
import { Participant } from "twilio-video";

export const Video = ({
  participant,
  videoOnly,
  ...props
}: {
  participant?: Participant;
  videoOnly?: boolean;
} & HTMLAttributes<HTMLElement>) => {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const element = ref.current;
    if (participant) {
      participant.on("trackStarted", (track) => {
        if (track.kind === "audio" && !videoOnly) {
          const audioTrack = Array.from(participant.audioTracks.values())[0];
          audioTrack.track?.attach(element);
        } else if (track.kind === "video") {
          const videoTrack = Array.from(participant.videoTracks.values())[0];
          videoTrack.track?.attach(element);
        }
      });

      const videoTrack = Array.from(participant.videoTracks.values())[0];
      videoTrack.track?.attach(element);
      if (!videoOnly) {
        const audioTrack = Array.from(participant.audioTracks.values())[0];
        audioTrack?.track?.attach(element);
      }
    } else {
      element.srcObject = null;
    }
  }, [participant, videoOnly]);

  return (
    <div {...props}>
      <div className="videoContainer">
        <video ref={ref}></video>
        <p>{participant?.identity}</p>
      </div>
    </div>
  );
};
