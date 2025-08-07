"use client";

import {
  useState,
  useEffect,
  forwardRef,
  type ForwardedRef,
  ChangeEvent,
} from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { Input } from "./input";

interface DateTimeInputProps {
  id?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  isFetching?: boolean;
}

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  (
    {
      id,
      value,
      onChange,
      onBlur,
      disabled = false,
      isFetching,
    }: DateTimeInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [open, setOpen] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [time, setTime] = useState("08:00");
    const [isFocused, setIsFocused] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    useEffect(() => {
      if (!isFocused && value) {
        setTextValue(format(value, "yyyy-MM-dd"));
        const hour = String(value.getHours()).padStart(2, "0");
        const minute = String(value.getMinutes()).padStart(2, "0");
        setTime(`${hour}:${minute}`);
      }
      if (!value) {
        setTextValue("");
      }
    }, [value, isFocused]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setTextValue(input);

      const parsed = parse(input, "yyyy-MM-dd", new Date());
      if (isValid(parsed)) {
        const [hourStr, minuteStr] = time.split(":");
        parsed.setHours(Number(hourStr));
        parsed.setMinutes(Number(minuteStr));
        parsed.setSeconds(0);
        parsed.setMilliseconds(0);
        onChange(parsed);
      }
    };

    const handleCalendarSelect = (d?: Date) => {
      if (!d) return;
      const [hourStr, minuteStr] = time.split(":");
      d.setHours(Number(hourStr));
      d.setMinutes(Number(minuteStr));
      d.setSeconds(0);
      d.setMilliseconds(0);
      setTextValue(format(d, "yyyy-MM-dd"));
      onChange(d);
      setOpen(false);
    };

    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;
      setTime(newTime);

      if (!value) return;
      const updated = new Date(value);
      const [hourStr, minuteStr] = newTime.split(":");
      updated.setHours(Number(hourStr));
      updated.setMinutes(Number(minuteStr));
      updated.setSeconds(0);
      updated.setMilliseconds(0);
      onChange(updated);
    };

    return (
      <div onBlur={onBlur} className="grid grid-cols-3 gap-2 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative col-span-2">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={ref}
                id={id}
                type="text"
                value={textValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onClick={() => setOpen(true)}
                placeholder="yyyy-mm-dd"
                disabled={disabled}
                isFetching={isFetching}
                className="pl-9"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={handleCalendarSelect}
              disabled={{ before: today }}
              defaultMonth={value ?? undefined}
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
          onChange={handleTimeChange}
          disabled={disabled}
          isFetching={isFetching}
        />
      </div>
    );
  }
);

DateTimeInput.displayName = "DateTimeInput";

export default DateTimeInput;
