/**
 * Máscaras e validações de documentos brasileiros.
 *
 * A máscara é de apresentação: o documento é gravado só com dígitos, para que
 * busca e comparação não dependam de pontuação.
 */

export function onlyDigits(value: string): string {
  return (value ?? "").replace(/\D/g, "");
}

// ------------------------------------------------------------------ CPF/CNPJ

export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function maskCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/** Máscara conforme o tipo do cliente: F = CPF, J = CNPJ. */
export function maskDocument(value: string, type: "F" | "J"): string {
  return type === "F" ? maskCpf(value) : maskCnpj(value);
}

export function isValidCpf(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 11) return false;
  // Sequências repetidas passam na conta dos dígitos, mas não são CPF válido.
  if (/^(\d)\1{10}$/.test(d)) return false;

  const digito = (fatiaAte: number, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < fatiaAte; i += 1) {
      soma += Number(d[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9, 10) === Number(d[9]) && digito(10, 11) === Number(d[10]);
}

export function isValidCnpj(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;

  const digito = (fatiaAte: number) => {
    const pesos =
      fatiaAte === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < fatiaAte; i += 1) {
      soma += Number(d[i]) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return digito(12) === Number(d[12]) && digito(13) === Number(d[13]);
}

export function isValidDocument(value: string, type: "F" | "J"): boolean {
  return type === "F" ? isValidCpf(value) : isValidCnpj(value);
}

// ------------------------------------------------------------------ Telefone

/** (11) 3456-7890 para fixo e (11) 91234-5678 para celular. */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function isValidPhone(value: string): boolean {
  const length = onlyDigits(value).length;
  return length === 10 || length === 11;
}

// ----------------------------------------------------------------------- CEP

export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function isCompleteCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

// ----------------------------------------------------------------------- CNH

/**
 * A CNH não tem separador convencional: são 11 dígitos corridos. "Formatar"
 * aqui é impedir letra e pontuação e travar no tamanho certo.
 */
export function maskCnh(value: string): string {
  return onlyDigits(value).slice(0, 11);
}

export function isValidCnh(value: string): boolean {
  return onlyDigits(value).length === 11;
}

// ---------------------------------------------------------------- Placa

/**
 * Placa brasileira, nos dois formatos que circulam: a antiga (ABC1234) e a
 * Mercosul (ABC1D23). Sem separador — o hifen da placa antiga nao existe na
 * Mercosul, e misturar os dois so confunde na hora de conferir.
 */
export function maskPlate(value: string): string {
  return (value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}

/** Aceita ABC1234 (antiga) e ABC1D23 (Mercosul). */
export function isValidPlate(value: string): boolean {
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(maskPlate(value));
}
