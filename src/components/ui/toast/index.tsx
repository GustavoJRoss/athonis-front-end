"use client";

import {
  Toaster as ArkToaster,
  ToastCloseTrigger,
  ToastDescription,
  ToastRoot,
  ToastTitle,
  createToaster,
} from "@ark-ui/react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives";

/** Store global de toasts — chame `toaster.success/error/warning/info({ title, description })`. */
export const toaster = createToaster({
  placement: "bottom-end",
  gap: 12,
  overlap: false,
  max: 5,
});

const TYPE_ICON: Record<string, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const TYPE_COLOR: Record<string, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-info",
  loading: "text-primary",
};

/** Monta o portal global de toasts — inclua uma única vez nos providers do app. */
export function Toaster() {
  return (
    <ArkToaster toaster={toaster} className="z-50">
      {(toast) => {
        const type = toast.type ?? "info";
        const TypeIcon = TYPE_ICON[type] ?? Info;

        return (
          <ToastRoot className="flex w-80 items-start gap-3 rounded-lg border border-border bg-surface p-4 shadow-overlay">
            <Icon
              icon={TypeIcon}
              size="sm"
              className={cn(TYPE_COLOR[type], type === "loading" && "animate-spin")}
            />
            <div className="flex-1">
              {toast.title && (
                <ToastTitle className="text-body-sm font-medium text-foreground">
                  {toast.title}
                </ToastTitle>
              )}
              {toast.description && (
                <ToastDescription className="text-body-sm text-muted">
                  {toast.description}
                </ToastDescription>
              )}
            </div>
            <ToastCloseTrigger
              aria-label="Fechar notificação"
              className="text-muted hover:text-foreground"
            >
              <Icon icon={X} size="xs" />
            </ToastCloseTrigger>
          </ToastRoot>
        );
      }}
    </ArkToaster>
  );
}
