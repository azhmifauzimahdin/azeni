"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  bgColor?: string;
  textColor?: string;
  labelColor?: string;
  borderColor?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  bgColor = "bg-green-primary",
  textColor = "text-white",
  labelColor = "text-gray-700",
  borderColor,
}) => {
  const dateISO = new Date(targetDate).toISOString();

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(dateISO) - +new Date();
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, dateISO]);

  if (!mounted) {
    return (
      <div className="flex gap-4 justify-center text-center">
        {["Hari", "Jam", "Menit", "Detik"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div className="bg-green-primary text-white text-xl font-bold w-12 h-12 flex items-center justify-center rounded-md">
              --
            </div>
            <span className="text-sm text-gray-700 mt-1">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center text-center">
      {[
        { label: "Hari", value: String(timeLeft.days).padStart(2, "0") },
        { label: "Jam", value: String(timeLeft.hours).padStart(2, "0") },
        { label: "Menit", value: String(timeLeft.minutes).padStart(2, "0") },
        { label: "Detik", value: String(timeLeft.seconds).padStart(2, "0") },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className={cn(
              "text-xl font-bold w-12 h-12 flex items-center justify-center rounded-md",
              bgColor,
              textColor,
              borderColor && `border ${borderColor} shadow-md`
            )}
          >
            {value}
          </div>
          <span className={`text-sm mt-1 ${labelColor}`}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
