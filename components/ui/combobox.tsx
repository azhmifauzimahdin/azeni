"use client";

import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";

type Option = {
  value: string;
  label: React.ReactNode;
  searchText: string;
};

type ComboboxProps = {
  id?: string;
  options: Option[];
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      id,
      options,
      placeholder = "Pilih...",
      value,
      disabled,
      onChange,
    }: ComboboxProps,
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const internalRef = useRef<HTMLButtonElement>(null);
    const [popoverWidth, setPopoverWidth] = useState<string | number>("100%");
    const [inputValue, setInputValue] = useState("");

    useImperativeHandle(ref, () => internalRef.current!, []);

    useEffect(() => {
      if (internalRef.current) {
        setPopoverWidth(internalRef.current.offsetWidth);
      }
    }, [open]);

    const selectedOption = options.find((o) => o.value === value);

    const filteredOptions = options.filter((option) =>
      option.searchText.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleSelect = (val: string) => {
      onChange?.(val);
      setOpen(false);
      setInputValue("");
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            ref={internalRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full relative text-left justify-start text-base font-normal shadow-sm overflow-hidden"
          >
            {selectedOption?.label ?? `Pilih ${placeholder}`}
            <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent style={{ width: popoverWidth }} className="p-0">
          <Command>
            <CommandInput
              placeholder={`Cari ${placeholder?.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>Tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = "Combobox";

export default Combobox;
