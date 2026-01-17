import { ClientType } from "../components/clients/ClientDetails";

export type MetaRequest = {
  limit: number;
  page: number;
  pages: number;
  total: number;
};

export type RequestOptions = {
  headers?: HeadersInit;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
  body?: unknown;
};

export type ApiResponse<T> = {
  items?: T | undefined;
  error?: string | undefined;
  status?: number;
  meta?: MetaRequest | undefined;
  errors?: unknown;
  message?: string;
  success?: boolean;
  statusCode?: number;
};

export type DefaultResponseDataList = {
  items: any[];
  meta: {
    total: number;
  };
};

export type RequestResponseData<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type RequestResponseClientData = {
  success: boolean;
  data?: ClientType;
  message?: string;
};
