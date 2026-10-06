"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { login } from "@/lib/auth/authentication";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon, Inline, Separator, Stack, Text } from "@/components/ui/primitives";

const SOCIAL_PROVIDERS = [
  { label: "Google", glyph: "G" },
  { label: "Facebook", glyph: "f" },
  { label: "Twitter", glyph: "t" },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    const result = await login(values);

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    const redirectTo = searchParams.get("redirect") ?? "/dashboard";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={4}>
        <Input
          label="Email"
          type="email"
          autoComplete="username"
          placeholder="voce@empresa.com"
          error={errors.email?.message}
          prefix={<Icon icon={Mail} size="sm" />}
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          prefix={<Icon icon={Lock} size="sm" />}
          {...register("password")}
        />

        <Inline justify="between" align="center">
          <Checkbox label="Lembrar de mim" />
          <Text as="button" type="button" size="body" color="primary">
            Esqueci minha senha
          </Text>
        </Inline>

        {formError && (
          <Text size="body-sm" color="danger" role="alert">
            {formError}
          </Text>
        )}

        <Inline gap={3}>
          <Button type="submit" size="lg" loading={isSubmitting} className="flex-1">
            Entrar
          </Button>
          <Button type="button" variant="tertiary" size="lg" className="flex-1">
            Criar conta
          </Button>
        </Inline>

        <Inline gap={3} align="center">
          <Separator className="flex-1" />
          <Text size="body-sm" color="muted">
            Ou continue com
          </Text>
          <Separator className="flex-1" />
        </Inline>

        <Inline gap={3} justify="center">
          {SOCIAL_PROVIDERS.map((provider) => (
            <button
              key={provider.label}
              type="button"
              aria-label={`Continuar com ${provider.label}`}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-body-sm font-semibold text-muted transition-colors hover:bg-surface-hover"
            >
              {provider.glyph}
            </button>
          ))}
        </Inline>
      </Stack>
    </form>
  );
}
