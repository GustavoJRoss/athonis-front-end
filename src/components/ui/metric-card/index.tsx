import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Box, Heading, Icon, Inline, Text } from "@/components/ui/primitives";

export type MetricCardTrend = {
  direction: "up" | "down";
  label: string;
};

export type MetricCardProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: MetricCardTrend;
  loading?: boolean;
  className?: string;
};

export function MetricCard({ label, value, icon, trend, loading, className }: MetricCardProps) {
  return (
    <Box
      surface="surface"
      border="default"
      radius="lg"
      padding={5}
      className={cn("flex flex-col gap-3", className)}
    >
      <Inline justify="between" align="start">
        <Text size="body-sm" color="muted">
          {label}
        </Text>
        {icon && <Icon icon={icon} size="sm" color="muted" />}
      </Inline>

      {loading ? (
        <div className="h-8 w-24 animate-pulse rounded-md bg-surface-muted" />
      ) : (
        <Heading level={2}>{value}</Heading>
      )}

      {!loading && trend && (
        <Inline gap={1}>
          <Icon
            icon={trend.direction === "up" ? TrendingUp : TrendingDown}
            size="xs"
            color={trend.direction === "up" ? "success" : "danger"}
          />
          <Text size="caption" color={trend.direction === "up" ? "success" : "danger"}>
            {trend.label}
          </Text>
        </Inline>
      )}
    </Box>
  );
}
