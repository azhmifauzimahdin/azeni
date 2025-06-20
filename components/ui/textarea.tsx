import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  isFetching?: boolean;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isFetching = false, ...props }, ref) => {
    if (isFetching) {
      return (
        <div
          className={cn(
            "flex min-h-[60px] w-full rounded-md bg-skeleton animate-pulse",
            className
          )}
          aria-busy="true"
          aria-label="Loading textarea content"
        />
      );
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full bg-white/75 rounded-md border border-input px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
