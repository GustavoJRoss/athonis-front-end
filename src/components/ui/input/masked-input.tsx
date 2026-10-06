"use client";

import { forwardRef } from "react";
import { Input, type InputProps } from "./index";

export type MaskedInputProps = Omit<InputProps, "value" | "onChange"> & {
  /** Formata o que o usuário digita. Recebe o valor cru e devolve o exibido. */
  mask: (value: string) => string;
  value?: string;
  onValueChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

/**
 * Campo que formata enquanto se digita.
 *
 * O valor guardado no formulário é o mesmo que aparece na tela; a conversão
 * para dígitos puros (quando o backend espera assim) acontece no mapeamento
 * da API, não aqui.
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput({ mask, value = "", onValueChange, ...rest }, ref) {
    return (
      <Input
        ref={ref}
        value={mask(value)}
        onChange={(event) => onValueChange?.(mask(event.target.value))}
        inputMode="numeric"
        {...rest}
      />
    );
  },
);
