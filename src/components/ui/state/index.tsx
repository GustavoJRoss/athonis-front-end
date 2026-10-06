import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Box, Heading, Icon, Stack, Text, type TextColor } from "@/components/ui/primitives";
import type { ReactNode } from "react";

type StateShellProps = {
  icon: LucideIcon;
  iconColor: TextColor;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function StateShell({ icon, iconColor, title, description, action, className }: StateShellProps) {
  return (
    <Stack gap={4} align="center" className={cn("px-6 py-16 text-center", className)}>
      <Box surface="surface-muted" radius="full" padding={4}>
        <Icon icon={icon} size="xl" color={iconColor} />
      </Box>
      <Stack gap={1} align="center">
        <Heading level={4}>{title}</Heading>
        {description && (
          <Text color="muted" className="max-w-sm">
            {description}
          </Text>
        )}
      </Stack>
      {action}
    </Stack>
  );
}

export type EmptyStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon = Inbox,
  title = "Nenhum resultado encontrado",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <StateShell
      icon={icon}
      iconColor="muted"
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export type ErrorStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  icon = AlertTriangle,
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados. Tente novamente.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <StateShell
      icon={icon}
      iconColor="danger"
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = "Carregando...",
  description,
  className,
}: LoadingStateProps) {
  return (
    <Stack gap={4} align="center" className={cn("px-6 py-16 text-center", className)}>
      <Icon icon={Loader2} size="xl" color="primary" className="animate-spin" />
      <Stack gap={1} align="center">
        <Heading level={4}>{title}</Heading>
        {description && (
          <Text color="muted" className="max-w-sm">
            {description}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
