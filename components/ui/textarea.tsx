import * as React from "react";
import { cn } from "../utils";
import { cva } from "class-variance-authority";

const textAreaVariants = cva(
  [
    "border-input",
    "border-emerald-700",
    "placeholder:text-muted-foreground",
    "focus-visible:border-emerald-700",
    "focus-visible:ring-emerald-200",
    "aria-invalid:ring-destructive/20",
    "dark:aria-invalid:ring-destructive/40",
    "aria-invalid:border-destructive",
    "dark:bg-input/30",
    "flex",
    "field-sizing-content",
    "min-h-16",
    "w-full",
    "rounded-md",
    "border",
    "bg-transparent",
    "px-3",
    "py-2",
    "text-base",
    "shadow-xs",
    "transition-[color,box-shadow]",
    "outline-none",
    "focus-visible:ring-[3px]",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50 md:text-sm",
  ],
  {
    variants: {
      status: {
        default: [],
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

function Textarea({
  className,
  status = "default",
  ...props
}: React.ComponentProps<"textarea"> & {
  status?: "default" | "error";
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textAreaVariants({ status, className }))}
      {...props}
    />
  );
}

export { Textarea };
