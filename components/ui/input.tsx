import * as React from "react";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  isFetching?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isFetching = false, value, onChange, ...props }, ref) => {
    const formatCurrency = (num: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
      }).format(num);

    const parseCurrency = (str: string) =>
      parseInt(str.replace(/[^\d]/g, ""), 10) || 0;

    if (isFetching) {
      return (
        <div
          className={cn(
            "flex h-10 w-full rounded-md bg-skeleton animate-pulse",
            className
          )}
          aria-busy="true"
          aria-label="Loading input content"
        />
      );
    }

    if (type === "file") {
      return (
        <div className="relative w-full">
          <input
            id={props.id || "file-input"}
            ref={ref}
            type="file"
            className="hidden"
            onChange={onChange}
            {...props}
          />
          <label htmlFor={props.id || "file-input"}>
            <div
              className={cn(
                "flex items-center justify-center gap-2 h-10 w-full cursor-pointer rounded-md border border-input bg-white/75 px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                className
              )}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Pilih File</span>
            </div>
          </label>
        </div>
      );
    }

    if (type === "currency") {
      return (
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            Rp
          </span>
          <input
            type="text"
            inputMode="numeric"
            className={cn(
              "pl-10 pr-3 flex h-10 w-full rounded-md border bg-white/75 border-input text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            value={formatCurrency(Number(value || 0))}
            onChange={(e) => {
              const parsed = parseCurrency(e.target.value);
              onChange?.({
                ...e,
                target: {
                  ...e.target,
                  value: parsed.toString(),
                },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            {...props}
          />
        </div>
      );
    }

    if (type === "percent") {
      return (
        <div className="relative w-full">
          <input
            type="text"
            inputMode="numeric"
            className={cn(
              "pl-3 pr-8 flex h-10 w-full rounded-md border bg-white/75 border-input text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            value={value}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/[^\d]/g, "");
              onChange?.({
                ...e,
                target: {
                  ...e.target,
                  value: onlyNumbers,
                },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            {...props}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            %
          </span>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white/75 border-input px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          type === "number" &&
            "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
          type === "datetime-local" && "appearance-auto",
          className
        )}
        ref={ref}
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
