import * as React from "react";

import { cn } from "../utils";
import { cva } from "class-variance-authority";

const inputVariants = cva(
  [
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary",
    "selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full",
    "min-w-0 rounded-md border border-emerald-700 px-3 py-1 text-base shadow-xs transition-[color,box-shadow]",
    "outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm",
    "file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-emerald-700 focus-visible:ring-emerald-200 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ],
  {
    variants: {
      status: {
        default: "",
        error: [
          "ring-red-300",
          "focus-visible:ring-red-300",
          "border-red-500",
          "focus-visible:border-red-500",
          "text-red-400",
          "focus-visible:text-red-400",
          "placeholder:text-red-400",
          "focus-visible:placeholder:text-red-400",
        ],
      },
    },
  }
);

type InputProps = React.ComponentProps<"input"> & {
  status?: "error" | "default";
};

function Input({ className, status = "default", type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ status, className }))}
      {...props}
    />
  );
}

export { Input };
