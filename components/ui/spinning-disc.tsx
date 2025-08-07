import { cn } from "@/lib/utils";
import { Music } from "lucide-react";
import React from "react";

interface SpinningDiscProps {
  play: boolean;
}
const SpinningDisc: React.FC<SpinningDiscProps> = ({ play }) => {
  return (
    <div
      className={cn(
        "fixed top-5 z-40 w-6 h-6 rounded-full bg-slate-950 flex-center",
        "right-5",
        "sm:right-[calc((100vw-390px)/2+1.25rem)]",
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
