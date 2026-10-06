"use client";

import type { ReactNode } from "react";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent as ArkDialogContent,
  DialogDescription as ArkDialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle as ArkDialogTitle,
  DialogTrigger,
  Portal,
} from "@ark-ui/react";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

export { DialogRoot, DialogTrigger };

const SIZE = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  // Formulários densos (pedido, cliente) usam a largura da tela no desktop
  // e continuam empilhados no mobile.
  "2xl": "max-w-4xl",
  "3xl": "max-w-6xl",
} as const;
export type DialogSize = keyof typeof SIZE;

export type DialogContentProps = {
  size?: DialogSize;
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

export function DialogContent({
  size = "md",
  loading = false,
  children,
  className,
}: DialogContentProps) {
  return (
    <Portal>
      <DialogBackdrop className="fixed inset-0 z-40 bg-foreground/40" />
      <DialogPositioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <ArkDialogContent
          className={cn(
            "relative flex max-h-[85vh] w-full flex-col rounded-lg border border-border bg-surface shadow-overlay",
            SIZE[size],
            className,
          )}
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-surface/70">
              <Icon icon={Loader2} size="lg" className="animate-spin text-primary" />
            </div>
          )}
          {children}
        </ArkDialogContent>
      </DialogPositioner>
    </Portal>
  );
}

export function DialogHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-4",
        className,
      )}
    >
      <div className="flex flex-col gap-1">{children}</div>
      <DialogCloseTrigger
        aria-label="Fechar"
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground"
      >
        <Icon icon={X} size="sm" />
      </DialogCloseTrigger>
    </div>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <ArkDialogTitle className="text-heading-4 text-foreground">{children}</ArkDialogTitle>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <ArkDialogDescription className="text-body-sm text-muted">{children}</ArkDialogDescription>;
}

/**
 * Formulário dentro de um dialog.
 *
 * O DialogContent limita a altura e distribui em coluna; um <form> comum no
 * meio quebra essa cadeia — o corpo deixa de rolar e o rodapé (com o botão de
 * salvar) é empurrado para fora da tela. Este wrapper mantém a cadeia flex.
 */
export function DialogForm({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex min-h-0 flex-1 flex-col", className)} {...rest}>
      {children}
    </form>
  );
}

export function DialogBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)}>{children}</div>;
}

export function DialogFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border-subtle px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
