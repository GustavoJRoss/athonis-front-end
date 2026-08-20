import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Heading, Inline, Stack, Text } from "@/components/ui/primitives";

export type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <Stack gap={3} className={cn("pb-2", className)}>
      {breadcrumb}
      <Inline justify="between" align="start" gap={4} wrap>
        <Stack gap={1}>
          <Heading level={1}>{title}</Heading>
          {description && <Text color="muted">{description}</Text>}
        </Stack>
        {actions && <Inline gap={2}>{actions}</Inline>}
      </Inline>
    </Stack>
  );
}

export type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, actions, className }: SectionHeaderProps) {
  return (
    <Inline justify="between" align="start" gap={4} wrap className={className}>
      <Stack gap={0.5}>
        <Heading level={3}>{title}</Heading>
        {description && (
          <Text size="body-sm" color="muted">
            {description}
          </Text>
        )}
      </Stack>
      {actions && <Inline gap={2}>{actions}</Inline>}
    </Inline>
  );
}
