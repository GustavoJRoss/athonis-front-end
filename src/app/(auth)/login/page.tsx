"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/src/lib/api/auth";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon } from "lucide-react";

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-emerald-100 to-emerald-400">
      <div className="fixed top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-900 to-green-600 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Bem-vindo de volta
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Faça login para acessar o sistema Athonis.
            </p>
          </CardHeader>

          <CardContent>
            <form
              noValidate
              onSubmit={handleSubmit(onLoginButtonClick)}
              className="space-y-4"
            >
              <Label
                label="Usuário"
                status={formState.errors.username && "error"}
                errorText={formState.errors.username?.message}
              >
                <Input
                  {...register("username", { required: "Campo obrigatório" })}
                  placeholder="Digite seu usuário"
                  status={formState.errors.username && "error"}
                />
              </Label>
              <Label
                label="Senha"
                status={formState.errors.password && "error"}
                errorText={formState.errors.password?.message}
              >
                <Input
                  type="password"
                  {...register("password", { required: "Campo obrigatório" })}
                  placeholder="Digite sua senha"
                  status={formState.errors.password && "error"}
                />
              </Label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <button
                className="text-sm text-muted-foreground hover:text-primary transition flex items-center gap-4 justify-center w-full"
                onClick={() => router.push("/")}
              >
                <ArrowLeftIcon />
                Voltar para a página inicial
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
