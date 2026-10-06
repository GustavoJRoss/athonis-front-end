import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Box, Heading, Stack, Text } from "@/components/ui/primitives";

export type ChartCardProps = {
  title: string;
  description?: string;
  /** Sem dados no período: um painel em branco não explica nada a quem olha. */
  empty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
};

export function ChartCard({
  title,
  description,
  empty = false,
  emptyMessage = "Sem dados no período selecionado",
  children,
  className,
}: ChartCardProps) {
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
        <div className="h-64 min-w-0">
          {empty ? (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border">
              <Text size="body-sm" color="muted">
                {emptyMessage}
              </Text>
            </div>
          ) : (
            children
          )}
        </div>
      </Stack>
    </Box>
  );
}
