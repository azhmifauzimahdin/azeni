import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-90 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-green-app-primary text-white shadow-sm hover:bg-green-app-secondary",
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

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  isFetching?: boolean;
  disabled?: boolean;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      children,
      href,
      target,
      rel,
      isFetching,
      disabled,
      ...props
    },
    ref
  ) => {
    const isExternal = target === "_blank";
    const relValue = rel ?? (isExternal ? "noopener noreferrer" : undefined);

    const isDisabled = isFetching || disabled;

    return (
      <Link href={isDisabled ? "#" : href} passHref legacyBehavior>
        <a
          ref={ref}
          className={cn(
            "relative",
            linkVariants({ variant, size }),
            isFetching && "animate-pulse bg-skeleton",
            isDisabled && "pointer-events-none opacity-50",
            className
          )}
          rel={relValue}
          target={target}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
          {...props}
        >
          <div
            className={cn("inline-flex items-center justify-center gap-2", {
              invisible: isFetching,
            })}
          >
            {children}
          </div>
        </a>
      </Link>
    );
  }
);

LinkButton.displayName = "LinkButton";

export { LinkButton, linkVariants };
