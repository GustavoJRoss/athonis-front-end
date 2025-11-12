import { ApiResponse, MetaRequest, RequestOptions } from "./types";

// src/lib/utils/api-client.ts

class ApiClient {
  private defaultHeaders: HeadersInit;

  constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };

    // Adiciona token de autenticação se existir
    const token = process.env.API_SECRET;
    console.log("APIClient Token:", token);
    if (token) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  private async request<T>(
    endpoint: string,
    method: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = `${process.env.API_URL}${endpoint}`;
    console.log({ url });
    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      cache: options?.cache,
      next: {
        revalidate: options?.revalidate,
        tags: options?.tags,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      // Se a resposta não tem conteúdo (204)
      if (response.status === 204) {
        return {
          items: undefined,
          error: undefined,
          status: response.status,
          meta: undefined,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          items: undefined,
          error: undefined,
          status: response.status,
          meta: undefined,
          message: data.message || "Erro na requisição",
          success: false,
          statusCode: data.statusCode || response.status,
          errors: data.errors || undefined,
        };
      }

      return {
        items: data?.items as T,
        error: undefined,
        status: response.status,
        meta: data.meta,
      };
    } catch (error) {
      return {
        items: undefined,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        status: 500,
        meta: undefined,
      };
    }
  }

  /**
   * GET - Buscar dados
   * @param endpoint - Endpoint da API (ex: '/users' ou '/users/123')
   * @param options - Opções de cache e headers
   */
  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET", options);
  }

  /**
   * POST - Criar recurso
   * @param endpoint - Endpoint da API (ex: '/users')
   * @param body - Dados a serem enviados
   * @param options - Opções adicionais
   */
  async post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", body, options);
  }

  /**
   * PUT - Atualizar recurso completamente
   * @param endpoint - Endpoint da API (ex: '/users/123')
   * @param body - Dados a serem enviados
   * @param options - Opções adicionais
   */
  async put<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PUT", body, options);
  }

  /**
   * PATCH - Atualizar recurso parcialmente
   * @param endpoint - Endpoint da API (ex: '/users/123')
   * @param body - Dados a serem enviados
   * @param options - Opções adicionais
   */
  async patch<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PATCH", body, options);
  }

  /**
   * DELETE - Remover recurso
   * @param endpoint - Endpoint da API (ex: '/users/123')
   * @param options - Opções adicionais
   */
  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}

// Exporta instância única
export const apiClient = new ApiClient();

// Exporta também para criar instâncias customizadas
export { ApiClient };
