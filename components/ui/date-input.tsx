"use client";

import { useState, useEffect, forwardRef, type ForwardedRef } from "react";
import { format, parse, isMatch, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
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

const DATE_FORMAT = "yyyy-MM-dd";

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
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
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    useEffect(() => {
      if (value) {
        const formatted = format(value, DATE_FORMAT);
        if (formatted !== inputValue) {
          setInputValue(formatted);
        }
      } else {
        setInputValue("");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const validateInput = (val: string) => {
      const isValidFormat = isMatch(val, DATE_FORMAT);
      const parsed = parse(val, DATE_FORMAT, new Date());

      if (isValidFormat && isValid(parsed)) {
        onChange(parsed);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      if (val.length === DATE_FORMAT.length) {
        validateInput(val);
      }
    };

    const handleInputBlur = () => {
      if (inputValue.trim() === "") {
        onChange(null);
        return;
      }

      const parsed = parse(inputValue, DATE_FORMAT, new Date());
      const isValidFormat = isMatch(inputValue, DATE_FORMAT);

      if (isValidFormat && isValid(parsed)) {
        onChange(parsed);
      } else {
        setInputValue(value ? format(value, DATE_FORMAT) : "");
      }

      onBlur?.();
    };

    const handleSelectDate = (d: Date | undefined) => {
      if (!d) return;
      if (!value || d.getTime() !== value.getTime()) {
        onChange(d);
        setInputValue(format(d, DATE_FORMAT));
        setOpen(false);
      }
    };

    return (
      <div className="w-full relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative col-span-2">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={ref}
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={disabled}
                isFetching={isFetching}
                placeholder="yyyy-mm-dd"
                className={cn("pl-9", className)}
              />
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto rounded-md overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={handleSelectDate}
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
