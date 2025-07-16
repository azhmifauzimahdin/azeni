"use client";

import { useState, forwardRef, type ForwardedRef } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";

interface DateInputProps {
  id?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  isFetching?: boolean;
}

const DateInput = forwardRef<HTMLButtonElement, DateInputProps>(
  (
    {
      id,
      value,
      onChange,
      onBlur,
      disabled = false,
      className,
      isFetching,
    }: DateInputProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const [open, setOpen] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div onBlur={onBlur} className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id}
              variant="outline"
              className={cn(
                "w-full h-10 justify-start items-center text-left text-base font-normal shadow-sm",
                className
              )}
              disabled={disabled}
              type="button"
              isFetching={isFetching}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="flex items-center h-full">
                {value ? format(value, "yyyy-MM-dd") : "Pilih tanggal"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto rounded-md overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={(d) => {
                onChange(d ?? null);
                if (d) setOpen(false);
              }}
              initialFocus
              captionLayout="dropdown"
              fromYear={today.getFullYear() - 20}
              toYear={today.getFullYear() + 2}
              defaultMonth={value ?? undefined}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
