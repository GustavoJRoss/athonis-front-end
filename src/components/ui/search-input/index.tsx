"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/primitives";

export type SearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
};

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Buscar...",
  loading,
  className,
}: SearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      loading={loading}
      clearable
      onClear={() => onValueChange("")}
      prefix={<Icon icon={Search} size="sm" />}
      containerClassName={className}
    />
  );
}
