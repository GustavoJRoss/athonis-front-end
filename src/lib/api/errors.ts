/**
 * O backend responde erro de validação como
 * `{ statusCode, message, errors: [{ field, messages }] }`.
 *
 * `error.message` do axios traz apenas "Request failed with status code 400",
 * então sem ler o corpo da resposta o usuário recebe um 400 genérico e não
 * descobre qual campo está errado.
 */

export type ApiFieldError = {
  field: string;
  messages: string[];
};

export type ApiErrorShape = {
  message: string;
  status?: number;
  fieldErrors?: ApiFieldError[];
};

type AxiosLikeError = {
  message?: string;
  code?: string;
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
      errors?: ApiFieldError[];
    };
  };
};

export function extractApiError(error: unknown): ApiErrorShape {
  const axiosError = error as AxiosLikeError;
  const payload = axiosError?.response?.data;
  const status = axiosError?.response?.status;

  const rawMessage = payload?.message;
  const message = Array.isArray(rawMessage)
    ? rawMessage.join(", ")
    : rawMessage || fallbackMessage(axiosError, status);

  return {
    message,
    status,
    fieldErrors: payload?.errors,
  };
}

function fallbackMessage(error: AxiosLikeError, status?: number): string {
  if (error?.code === "ECONNABORTED" || !error?.response) {
    return "Não foi possível conectar ao servidor. Verifique se a API está no ar.";
  }
  if (status === 401) return "Sessão expirada. Entre novamente.";
  if (status === 403) return "Você não tem permissão para esta ação.";
  if (status === 404) return "Registro não encontrado.";
  return error?.message || "Erro inesperado. Tente novamente.";
}

/**
 * Erro serializável para atravessar a fronteira de Server Action e chegar
 * intacto ao React Query no cliente.
 */
export class ApiError extends Error {
  status?: number;
  fieldErrors?: ApiFieldError[];

  constructor({ message, status, fieldErrors }: ApiErrorShape) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Converte qualquer falha de request numa mensagem única e legível. */
export function toApiErrorMessage(error: unknown): string {
  const { message, fieldErrors } = extractApiError(error);

  if (fieldErrors?.length) {
    const details = fieldErrors
      .map((fieldError) => `${fieldError.field}: ${fieldError.messages.join(", ")}`)
      .join(" | ");
    return `${message} — ${details}`;
  }

  return message;
}
