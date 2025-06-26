"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Option = {
  value: string;
  label: React.ReactNode;
  searchText: string;
};

type ComboboxProps = {
  options: Option[];
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export default function Combobox({
  options,
  placeholder = "Pilih...",
  value,
  disabled,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<string | number>("100%");

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(buttonRef.current.offsetWidth);
    }
  }, [open]);

  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full relative text-left justify-start"
        >
          {selectedOption?.label ?? `Pilih ${placeholder}`}
          <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent style={{ width: popoverWidth }} className="p-0">
        <Command>
          <CommandInput placeholder={`Cari ${placeholder?.toLowerCase()}...`} />
          <CommandEmpty>Tidak ditemukan.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.searchText}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-green-app-primary",
                    option.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
