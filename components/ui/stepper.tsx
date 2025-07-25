"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
}

const steps = [
  { title: "Informasi", description: "Isi data undangan" },
  { title: "Pilih Tema", description: "Tentukan desain undangan" },
  { title: "Cek Pesanan", description: "Masukkan kode referral jika ada" },
  { title: "Pembayaran", description: "Aktifkan undangan" },
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeStep = stepRefs.current[currentStep];
    if (activeStep) {
      activeStep.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, [currentStep]);

  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex items-start justify-start gap-6 px-4 py-2 min-w-max">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              className="relative flex items-start gap-3"
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors",
                    isCompleted
                      ? "bg-green-app-primary text-white border-green-app-primary"
                      : isActive
                      ? "border-green-app-primary text-green-app-primary bg-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  )}
                >
                  {index + 1}
                </div>

                <div
                  className={cn(
                    "w-16 h-[2px] mt-4",
                    isCompleted || isActive
                      ? "bg-green-app-primary"
                      : "bg-gray-300"
                  )}
                />
              </div>

              <div className="min-w-[100px]">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isCompleted || isActive
                      ? "text-green-app-primary"
                      : "text-gray-400"
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
