"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { login } from "@/lib/auth/authentication";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Stack, Text } from "@/components/ui/primitives";

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
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        {formError && (
          <Text size="body-sm" color="danger" role="alert">
            {formError}
          </Text>
        )}
        <Button type="submit" loading={isSubmitting} fullWidth>
          Entrar
        </Button>
      </Stack>
    </form>
  );
}
