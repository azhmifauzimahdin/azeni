"use client";

import { useState, useEffect, forwardRef, type ForwardedRef } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";

interface DateTimeInputProps {
  id?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

const DateTimeInput = forwardRef<HTMLButtonElement, DateTimeInputProps>(
  (
    { id, value, onChange, onBlur, disabled = false }: DateTimeInputProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const [open, setOpen] = useState<boolean>(false);
    const [date, setDate] = useState<Date | null>(value);
    const [time, setTime] = useState<string>(() =>
      value
        ? `${String(value.getHours()).padStart(2, "0")}:${String(
            value.getMinutes()
          ).padStart(2, "0")}`
        : "08:00"
    );

    useEffect(() => {
      if (!date) return onChange(null);
      const [hourStr, minuteStr] = time.split(":");
      const newDate = new Date(date);
      newDate.setHours(Number(hourStr));
      newDate.setMinutes(Number(minuteStr));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      onChange(newDate);
    }, [date, time, onChange]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div onBlur={onBlur} className="grid grid-cols-3 gap-2 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id ? `${id}` : undefined}
              variant="outline"
              className="col-span-2 w-full justify-start text-left text-base font-normal"
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "yyyy-MM-dd") : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date ?? undefined}
              onSelect={(d) => {
                setDate(d ?? null);
                if (d) setOpen(false);
              }}
              disabled={{ before: today }}
              initialFocus
              captionLayout="dropdown"
              fromYear={today.getFullYear()}
              toYear={today.getFullYear() + 5}
            />
          </PopoverContent>
        </Popover>

        <Input
          id={id ? `${id}-time` : undefined}
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }
);

DateTimeInput.displayName = "DateTimeInput";

export default DateTimeInput;
