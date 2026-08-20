import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/features/auth/login-form";
import { Container, Heading, Stack, Text } from "@/components/ui/primitives";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <Container width="content" className="max-w-sm px-0">
        <Stack gap={8}>
          <Stack gap={1}>
            <Heading level={2}>Entrar no ATHONIS</Heading>
            <Text color="muted">Acesse sua conta para continuar.</Text>
          </Stack>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </Stack>
      </Container>
    </div>
  );
}
