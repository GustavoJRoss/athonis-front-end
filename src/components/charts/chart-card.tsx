import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Box, Heading, Stack, Text } from "@/components/ui/primitives";

export type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Box surface="surface" border="default" radius="lg" padding={5} className={cn("min-w-0", className)}>
      <Stack gap={4}>
        <Stack gap={0.5}>
          <Heading level={4}>{title}</Heading>
          {description && (
            <Text size="body-sm" color="muted">
              {description}
            </Text>
          )}
        </Stack>
        <div className="h-64 min-w-0">{children}</div>
      </Stack>
    </Box>
  );
}
