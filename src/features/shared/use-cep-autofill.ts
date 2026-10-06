"use client";

import { useCallback, useRef, useState } from "react";
import { lookupCep, type CepAddress } from "@/lib/api/cep";
import { isCompleteCep, onlyDigits } from "@/lib/utils/masks";

export type CepAutofillOptions = {
  /** Chamado quando o CEP é encontrado, para preencher os campos do endereço. */
  onFound: (address: CepAddress) => void;
};

/**
 * Preenchimento de endereço a partir do CEP.
 *
 * Dispara sozinho assim que os 8 dígitos são digitados e ignora repetições do
 * mesmo CEP, para não consultar de novo a cada tecla ou a cada blur.
 */
export function useCepAutofill({ onFound }: CepAutofillOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ultimoConsultado = useRef<string>("");

  const consultar = useCallback(
    async (cep: string, { force = false }: { force?: boolean } = {}) => {
      const digitos = onlyDigits(cep);

      if (!isCompleteCep(digitos)) {
        setError(null);
        return;
      }

      if (!force && digitos === ultimoConsultado.current) return;
      ultimoConsultado.current = digitos;

      setLoading(true);
      setError(null);

      try {
        const resultado = await lookupCep(digitos);

        if (resultado.found) {
          onFound(resultado.address);
        } else {
          // Permite tentar de novo depois de corrigir.
          ultimoConsultado.current = "";
          setError(resultado.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [onFound],
  );

  /** Limpa o estado ao trocar de contexto (ex.: outro cliente selecionado). */
  const reset = useCallback(() => {
    ultimoConsultado.current = "";
    setError(null);
  }, []);

  return { consultar, reset, loading, error };
}
