"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/src/lib/requests/login/requests";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { register, formState, handleSubmit } = useForm<LoginFormProps>({
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { errorToast } = useToast();

  async function onLoginButtonClick(data: LoginFormProps) {
    setLoading(true);

    try {
      const response = await login({
        username: data.username,
        password: data.password,
      });

      if (response.success) {
        router.push("/home");
      } else {
        errorToast(response.message || "Erro ao fazer login");
      }
    } catch {
      errorToast("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
      }}
    >
      <h1>Login</h1>
      <form noValidate onSubmit={handleSubmit(onLoginButtonClick)}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Usuário:
            <Input
              {...register("username", { required: "Field is required" })}
              placeholder="Digite o seu usuário"
            />
            {formState.errors.username && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {formState.errors.username.message}
              </span>
            )}
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            Senha:
            <Input
              {...register("password", { required: "Field is required" })}
              placeholder="Digite a sua senha"
            />
            {formState.errors.password && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {formState.errors.password.message}
              </span>
            )}
          </label>
        </div>

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
