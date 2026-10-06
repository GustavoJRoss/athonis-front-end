import { NextResponse, type NextRequest } from "next/server";
import { createAuthenticatedApiClient } from "@/lib/api/client";

/**
 * Proxy autenticado para o download do CSV de rejeições.
 *
 * O link precisa carregar o token da sessão (cookie httpOnly, inacessível ao
 * navegador), então não dá para apontar direto para a API — a rota repassa a
 * chamada autenticada e devolve o arquivo como anexo.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const api = await createAuthenticatedApiClient();

  try {
    const response = await api.get(
      `/order-imports/download-rejected/${encodeURIComponent(filename)}`,
      { responseType: "arraybuffer" },
    );

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Arquivo de rejeição não encontrado" },
      { status: 404 },
    );
  }
}
