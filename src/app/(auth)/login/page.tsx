import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/features/auth/login-form";
import { AuthHeader } from "@/features/auth/auth-header";
import { Box, Heading, Stack, Text } from "@/components/ui/primitives";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <AuthHeader />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden flex-col gap-12 px-12 py-10 lg:flex lg:w-3/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/login-illustration.png"
            alt="Ilustração da plataforma ATHONIS"
            className="aspect-4/3 w-full max-w-280 object-contain"
          />
        </div>

        <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 lg:w-2/5">
          <Stack gap={8} className="w-full max-w-md">
            <Stack gap={2}>
              <Heading level="display">Bem-vindo de volta</Heading>
              <Text size="body-lg" color="muted">
                Acesse sua conta com email e senha para continuar acompanhando
                pedidos, rotas e entregas.
              </Text>
            </Stack>

            <Box surface="surface" border="default" radius="lg" padding={6} className="sm:p-8">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </Box>
          </Stack>
        </div>
      </div>
    </div>
  );
}
