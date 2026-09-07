"use server";

import { onlyDigits } from "@/lib/utils/masks";

/**
 * Consulta de CEP no ViaCEP, feita no servidor.
 *
 * Fica server-side pelo mesmo motivo das demais chamadas: o navegador não
 * depende de um serviço externo nem de CORS, e trocar de provedor é uma
 * mudança num arquivo só.
 */

export type CepAddress = {
  zipCode: string;
  street: string;
  district: string;
  city: string;
  state: string;
};

export type CepResult =
  | { found: true; address: CepAddress }
  | { found: false; message: string };

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
};

export async function lookupCep(rawCep: string): Promise<CepResult> {
  const cep = onlyDigits(rawCep);

  if (cep.length !== 8) {
    return { found: false, message: "CEP incompleto" };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      // CEP muda muito raramente: vale cachear por um dia.
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { found: false, message: "Não foi possível consultar o CEP agora" };
    }

    const data = (await response.json()) as ViaCepResponse;

    // O ViaCEP responde 200 com { erro: true } quando o CEP não existe.
    if (data.erro || !data.localidade) {
      return { found: false, message: "CEP não encontrado" };
    }

    return {
      found: true,
      address: {
        zipCode: data.cep ?? rawCep,
        street: data.logradouro ?? "",
        district: data.bairro ?? "",
        city: data.localidade ?? "",
        state: (data.uf ?? "").toUpperCase(),
      },
    };
  } catch {
    return { found: false, message: "Não foi possível consultar o CEP agora" };
  }
}
