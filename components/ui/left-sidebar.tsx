"use client";

import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Img } from "./Img";

interface LeftSidebarProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  children: ReactNode;
  wrapperClassName?: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  imageSrc,
  children,
  wrapperClassName,
  ...rest
}) => {
  // const [petals, setPetals] = useState<number[]>([]);

  // useEffect(() => {
  //   setPetals(Array.from({ length: 15 }, (_, i) => i));
  // }, []);

  // const pastelColors = ["#FFDDEE", "#FFF0F5", "#FFE4E1", "#FFEFD5"]; // warna kelopak pastel

  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 right-[390px] hidden sm:flex items-end justify-center overflow-hidden z-10",
        wrapperClassName
      )}
      {...rest}
    >
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

      {/* {petals.map((petal) => {
        const size = 6 + Math.random() * 8;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 6 + Math.random() * 6;
        const rotate = Math.random() * 360;
        const color =
          pastelColors[Math.floor(Math.random() * pastelColors.length)];

        return (
          <div
            key={petal}
            className="absolute opacity-50 blur-sm"
            style={{
              width: `${size}px`,
              height: `${size * 0.5}px`,
              backgroundColor: color,
              left: `${left}%`,
              top: `-${Math.random() * 50}px`,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              animation: `fall ${duration}s ${delay}s linear infinite`,
              transform: `rotate(${rotate}deg)`,
              boxShadow: `0 0 ${size / 2}px rgba(255,255,255,0.3)`,
              zIndex: 0,
            }}
          />
        );
      })} */}

      <div className="relative p-6 w-full space-y-3 z-10">
        <div className="bg-white/1 backdrop-blur-[0px] rounded-2xl p-2">
          <div className="text-white animate-fade-in">{children}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0px);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(20px);
          }
          100% {
            transform: translateY(100vh) rotate(360deg) translateX(-20px);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LeftSidebar;
