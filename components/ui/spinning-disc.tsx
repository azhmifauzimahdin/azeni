import clsx from "clsx";
import { Disc3 } from "lucide-react";
import React from "react";

interface SpinningDiscProps {
  play: boolean;
}
const SpinningDisc: React.FC<SpinningDiscProps> = ({ play }) => {
  return (
    <Disc3
      className={clsx("fixed w-5 h-5 text-green-primary top-5 right-5 z-40", {
        "animate-spin [animation-duration:2s]": play,
        hidden: !play,
      })}
    />
  );
};

export default SpinningDisc;
