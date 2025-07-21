import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        primary:
          "border-transparent bg-green-app-primary text-white shadow hover:bg-primary/80",
        pending:
          "border-transparent bg-yellow-100 text-yellow-800 shadow hover:bg-yellow-100/80",
        success:
          "border-transparent bg-green-100 text-green-800 shadow hover:bg-green-100/80",
        failed:
          "border-transparent bg-red-100 text-red-800 shadow hover:bg-red-100/80",
        cancelled:
          "border-transparent bg-gray-100 text-gray-700 shadow hover:bg-gray-100/80",
        refunded:
          "border-transparent bg-blue-100 text-blue-800 shadow hover:bg-blue-100/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
