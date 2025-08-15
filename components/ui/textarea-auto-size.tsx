import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  isFetching?: boolean;
}

const TextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isFetching = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useEffect(() => {
      if (textareaRef.current) {
        const el = textareaRef.current;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    }, [props.value]);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.currentTarget;
      target.style.height = "auto";
      target.style.height = target.scrollHeight + "px";
      if (props.onInput) props.onInput(e);
    };

    if (isFetching) {
      return (
        <div
          className={cn(
            "flex min-h-[40px] w-full rounded-md bg-skeleton animate-pulse",
            className
          )}
          aria-busy="true"
          aria-label="Loading textarea content"
        />
      );
    }

    return (
      <textarea
        {...props}
        ref={(node) => {
          textareaRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        onInput={handleInput}
        rows={1}
        className={cn(
          "flex w-full bg-white/75 rounded-md border border-input px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "overflow-hidden resize-none",
          "scrollbar-thin-modern",
          className
        )}
      />
    );
  }
);

TextareaAutosize.displayName = "TextareaAutosize";

export { TextareaAutosize };
