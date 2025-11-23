"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="w-full py-6 bg-gradient-to-r from-blue-700 via-blue-600 to-green-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <span>Athonis</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#sobre" className="hover:text-gray-200 transition">
              Sobre
            </a>
            <a href="#ferramentas" className="hover:text-gray-200 transition">
              Ferramentas
            </a>
            <a href="#contato" className="hover:text-gray-200 transition">
              Contato
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl w-full mx-auto mt-16 px-6 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Impulsionando sua logística com o software de gestão da Athonis.
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Organize pedidos, motoristas, veículos e rotas automaticamente com um
          sistema ágil, moderno e inteligente.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button className="px-6 py-5 text-lg rounded-2xl shadow-lg" asChild>
            <a href="/login" className="flex items-center gap-2">
              Acessar Plataforma
              <ArrowRight size={18} />
            </a>
          </Button>
        </motion.div>
      </section>

      {/* MOCKUP */}
      <section className="mt-20 flex justify-center w-full px-6">
        <Card className="max-w-4xl w-full shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded-xl" />
          </CardContent>
        </Card>
      </section>

      {/* FERRAMENTAS */}
      <section id="ferramentas" className="max-w-6xl w-full mx-auto mt-24 px-6">
        <h2 className="text-3xl font-bold mb-6">Nossas Ferramentas</h2>
        <p className="text-gray-600 mb-10 max-w-xl">
          A Athonis oferece um conjunto completo de ferramentas para otimizar
          todo o fluxo de entrega da sua empresa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Gestão de Pedidos",
              desc: "Cadastre, edite e acompanhe pedidos de maneira simples e organizada.",
            },
            {
              title: "Controle de Motoristas",
              desc: "Gerencie motoristas, disponibilidade e atribuições com facilidade.",
            },
            {
              title: "Gerenciamento de Veículos",
              desc: "Mantenha informações atualizadas sobre veículos e capacidades.",
            },
            {
              title: "Importação por Excel",
              desc: "Importe lotes de pedidos rapidamente a partir de planilhas.",
            },
            {
              title: "Geração de Rotas",
              desc: "Rotas otimizadas automaticamente usando serviços de geolocalização.",
            },
            {
              title: "Painéis Operacionais",
              desc: "Visualize dados e métricas em tempo real para decisões rápidas.",
            },
          ].map((item, index) => (
            <Card key={index} className="shadow-md rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-xl">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contato" className="mt-32 py-12 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-semibold">Athonis</h4>
            <p className="text-sm max-w-xs">
              Plataforma inteligente para gestão logística, criada para
              facilitar seu dia a dia.
            </p>
          </div>

          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Athonis — Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
