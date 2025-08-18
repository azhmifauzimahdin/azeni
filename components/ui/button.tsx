import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-75 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-green-app-primary text-white shadow hover:bg-green-app-secondary",
        delete:
          "text-white hover:text-red-500 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-sm rounded-full",
        "outline-white":
          "bg-white text-gray-800 border border-transparent transition-colors duration-300 hover:bg-transparent hover:border-white hover:text-white",
        "white-outline":
          "bg-transparent text-white border border-white transition-colors duration-300 hover:bg-white hover:text-gray-800",
        "green-outline":
          "bg-green-primary border border-slate-50 hover:bg-slate-50 hover:text-green-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  isGenerate?: boolean;
  isFetching?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      isGenerate,
      isFetching,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative",
          buttonVariants({ variant, size }),
          isFetching && "animate-pulse bg-skeleton",
          className
        )}
        aria-busy={isFetching || isLoading}
        disabled={isLoading || props.disabled || isFetching || isGenerate}
        {...props}
      >
        {isFetching ? (
          <div className="inline-flex items-center justify-center gap-2 invisible">
            {children}
          </div>
        ) : (
          <>
            {isLoading && <Loader2 className="absolute h-4 w-4 animate-spin" />}
            {isGenerate && !isLoading && (
              <Sparkles className="absolute h-4 w-4 animate-pulse" />
            )}
            <div
              className={cn("inline-flex items-center justify-center gap-2", {
                invisible: isLoading || isGenerate,
              })}
            >
              {children}
            </div>
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
