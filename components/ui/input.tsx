import * as React from "react";

import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  isFetching?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isFetching = false, ...props }, ref) => {
    if (isFetching) {
      return (
        <div
          className={cn(
            "flex h-10 w-full rounded-md bg-skeleton animate-pulse",
            className
          )}
          aria-busy="true"
          aria-label="Loading input content"
        />
      );
    }

    if (type === "file") {
      return (
        <div className="relative w-full">
          <input
            type="file"
            className="hidden"
            ref={ref}
            id={props.id || "file-input"}
            {...props}
          />
          <label htmlFor={props.id || "file-input"}>
            <div
              className={cn(
                "flex items-center justify-center gap-2 h-10 w-full cursor-pointer rounded-md border border-input bg-white/75 px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                className
              )}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Pilih File</span>
            </div>
          </label>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white/75 border-input px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          type === "number" &&
            "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
          type === "datetime-local" && "appearance-auto",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
