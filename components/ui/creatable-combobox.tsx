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
import { buttonVariants } from "./button";

type Option = {
  value: string;
  label: React.ReactNode;
  searchText: string;
};

type CreatableComboboxProps = {
  id?: string;
  options: Option[];
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const CreatableCombobox = forwardRef<HTMLButtonElement, CreatableComboboxProps>(
  (
    { id, options, placeholder = "Pilih...", value, disabled, onChange },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const internalRef = useRef<HTMLButtonElement>(null);
    const [popoverWidth, setPopoverWidth] = useState<string | number>("100%");

    useImperativeHandle(ref, () => internalRef.current!, []);

    useEffect(() => {
      if (internalRef.current) {
        setPopoverWidth(internalRef.current.offsetWidth);
      }
    }, [open]);

    const selectedOption = options.find((o) => o.value === value);

    const filteredOptions = options.filter((opt) =>
      opt.searchText.toLowerCase().includes(inputValue.trim().toLowerCase())
    );

    const isCustomInput =
      inputValue.trim().length > 0 &&
      !options.some(
        (opt) =>
          opt.searchText.toLowerCase() === inputValue.trim().toLowerCase()
      );

    const handleSelect = (val: string) => {
      onChange?.(val);
      setInputValue("");
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            ref={internalRef}
            type="button"
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            aria-controls="combobox-popover"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full relative text-left justify-start text-base font-normal"
            )}
          >
            {selectedOption
              ? selectedOption.label
              : value?.trim()
              ? value
              : `Pilih ${placeholder}`}
            <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          style={{ width: popoverWidth }}
          className="p-0"
          id="combobox-popover"
        >
          <Command>
            <CommandInput
              id="combobox-input"
              placeholder={`Cari ${placeholder?.toLowerCase()}...`}
              value={inputValue}
              onValueChange={setInputValue}
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

                {isCustomInput && (
                  <CommandItem
                    onSelect={() => handleSelect(inputValue.trim())}
                    className="text-blue-600"
                  >
                    Gunakan &quot;{inputValue}&quot;
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

CreatableCombobox.displayName = "CreatableCombobox";

export default CreatableCombobox;
