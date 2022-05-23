import Image from "next/image";
import { disconnect } from "process";

export default function Toolbar({
  invert,
  disconnect,
}: {
  invert: () => void;
  disconnect: () => void;
}) {
  return (
    <>
      <div className="toolbar">
        <div className="toolbarButton"></div>
        <div className="toolbarButton" onClick={invert}></div>
        <div className="toolbarButton" onClick={disconnect}>
          <Image
            src={"/phone.png"}
            alt={"Colgar"}
            layout={"responsive"}
            height={30}
            width={30}
          />
        </div>
        <div className="toolbarButton"></div>
        <div className="toolbarButton"></div>
      </div>
    </>
  );
}
