"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../utils";
import { ComponentProps, ReactNode } from "react";

type LabelProps = {
  errorText?: string;
  status?: "default" | "error";
  children: ReactNode;
  label?: ReactNode;
  className?: string;
};

function Label({
  className,
  children,
  status,
  errorText,
  label,
  ...props
}: LabelProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <span>{label}</span>}
      <div className="flex flex-col gap-1">
        {children}
        {errorText && status === "error" && (
          <span className="text-xs text-red-400">{errorText}</span>
        )}
      </div>
    </div>
  );
}

export { Label };
