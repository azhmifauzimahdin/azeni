import clsx from "clsx";
import { Music } from "lucide-react";
import React from "react";

interface SpinningDiscProps {
  play: boolean;
}
const SpinningDisc: React.FC<SpinningDiscProps> = ({ play }) => {
  return (
    <div
      className={clsx(
        "w-6 h-6 rounded-full bg-slate-950 flex-center fixed top-5 right-5 z-40",
        {
          "animate-spin [animation-duration:2s]": play,
          hidden: !play,
        }
      )}
    >
      <div className="w-3 h-3 rounded-full bg-green-primary text-black flex-center ">
        <Music size={8} />
      </div>
    </div>
  );
};

export default SpinningDisc;
