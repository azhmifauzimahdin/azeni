"use client";

import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Img } from "./Img";

interface LeftSidebarProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  children: ReactNode;
  wrapperClassName?: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  imageSrc,
  children,
  wrapperClassName,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 right-[390px] hidden sm:flex items-end justify-center overflow-hidden z-10",
        wrapperClassName
      )}
      {...rest}
    >
      {imageSrc ? (
        <>
          <div className="absolute inset-0 -z-20">
            <Img
              src={imageSrc}
              alt="Background"
              className="object-cover object-center"
              wrapperClassName="w-full h-full"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          <div className="relative p-6 w-full space-y-3 z-10">
            <div className="bg-white/1 backdrop-blur-[0px] rounded-2xl p-2">
              <div className="text-white animate-fade-in">{children}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative flex-center text-center w-full h-screen p-2 z-10">
            <div className="text-slate-800 animate-fade-in">{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSidebar;
