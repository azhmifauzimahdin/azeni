"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> & {
  isFetching?: boolean;
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      isFetching = false,
      disabled,
      checked: controlledChecked,
      defaultChecked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
      defaultChecked ?? false
    );

    const checked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleChange = (val: boolean) => {
      if (!isControlled) {
        setUncontrolledChecked(val);
      }
      onCheckedChange?.(val);
    };

    if (isFetching) {
      return (
        <div
          className={cn(
            "h-5 w-12 rounded-full bg-muted relative overflow-hidden animate-pulse",
            className
          )}
        >
          <div className="absolute left-0 top-0 h-4 w-4 m-0.5 rounded-full bg-muted-foreground" />
        </div>
      );
    }

    return (
      <SwitchPrimitives.Root
        ref={ref}
        disabled={disabled}
        checked={checked}
        onCheckedChange={handleChange}
        className={cn(
          "relative inline-flex h-6 w-[3.8rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input px-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-app-primary",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "transition-opacity duration-200 absolute right-2 text-muted-foreground",
            checked ? "opacity-0" : "opacity-100"
          )}
        >
          OFF
        </span>
        <span
          className={cn(
            "transition-opacity duration-200 absolute left-2 text-background",
            checked ? "opacity-100" : "opacity-0"
          )}
        >
          ON
        </span>
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitives.Root>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
