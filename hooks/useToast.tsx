"use client";

import { ToasterContext, ToastProps } from "@/components/ui/toaster";
import * as React from "react";

export function useToast() {
  const context = React.useContext(ToasterContext);

  if (!context) {
    throw new Error("useToast must be used within ToasterProvider");
  }

  const { addToast } = context;

  return {
    toast: (props: Omit<ToastProps, "id">) => addToast(props),
    successToast: (description: string, title?: string) =>
      addToast({ description, title: title || "Sucesso!", variant: "success" }),
    errorToast: (description: string, title?: string) =>
      addToast({ description, title: title || "Erro!", variant: "error" }),
    warningToast: (description: string, title?: string) =>
      addToast({ description, title: title || "Atenção!", variant: "warning" }),
    infoToast: (description: string, title?: string) =>
      addToast({ description, title: title || "Informação", variant: "info" }),
  };
}
