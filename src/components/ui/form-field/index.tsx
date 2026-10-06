import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Heading, Separator, Stack, Text } from "@/components/ui/primitives";

export type FormFieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

/** Wrapper de label/description/error para controles que não têm isso embutido. */
export function FormField({ label, description, error, required, children, className }: FormFieldProps) {
  return (
    <Stack gap={1.5} className={className}>
      {label && (
        <Text as="label" size="label" weight="medium">
          {label}
          {required && <span className="text-danger"> *</span>}
        </Text>
      )}
      {children}
      {error ? (
        <Text size="caption" color="danger">
          {error}
        </Text>
      ) : description ? (
        <Text size="caption" color="muted">
          {description}
        </Text>
      ) : null}
    </Stack>
  );
}

export type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2;
  className?: string;
};

/** Agrupa um bloco de FormField sob um título de seção, com grid responsivo. */
export function FormSection({ title, description, children, columns = 2, className }: FormSectionProps) {
  return (
    <Stack gap={4} className={className}>
      <Stack gap={0.5}>
        <Heading level={4}>{title}</Heading>
        {description && (
          <Text size="body-sm" color="muted">
            {description}
          </Text>
        )}
      </Stack>
      <Separator />
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          columns === 2 && "sm:grid-cols-2",
        )}
      >
        {children}
      </div>
    </Stack>
  );
}
