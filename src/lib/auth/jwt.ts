/**
 * Decodifica o payload de um JWT sem verificar assinatura — a verificação
 * real acontece no backend a cada chamada de API. Usado só para leitura
 * otimista de claims (exp, usuário) no cliente/edge.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function isJwtExpired(payload: { exp?: number } | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}
