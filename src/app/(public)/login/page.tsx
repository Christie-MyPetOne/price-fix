"use client";

import React, { useState } from "react";
import {
  Bot,
  LogIn,
  PackageCheck,
  TrendingUp,
  Mail,
  Lock,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/useAuthStore";
// import { setCookie } from "@/utils/cookies.utils";
import background from "../../../../public/images/background.svg";
import Image from "next/image";
import { IconsBrand } from "@/components/ui/svgs/IconsBrand";

export default function Login() {
  const [email, setEmail] = useState("lucascesardev2023@outlook.com");
  const [password, setPassword] = useState("130998Lucas!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const { login } = useAuthStore();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   const result = await login(email, password);
  //   if (result === "sucesso") {
  //     setCookie("from", "login");
  //     window.location.reload();
  //   } else if (result === "sessoes_ativas") {
  //     router.push("/sessao-ativa");
  //   } else {
  //     setError(useAuthStore.getState().error as string);
  //     setLoading(false);
  //   }
  //   setTimeout(() => setLoading(false), 5000);
  // };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-background)]">
      <div className="hidden md:flex md:w-1/2 lg:w-1/2 p-8 lg:p-14 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 lg:w-96 h-72 lg:h-96 bg-[var(--color-primary)]/15 rounded-full blur-[120px] lg:blur-[150px] opacity-70"></div>

        <div>
          <div className="w-40 lg:w-60">
            <IconsBrand />
          </div>

          <p className="mt-4 text-lg lg:text-xl max-w-md text-[var(--color-text-secondary)] leading-relaxed text-balance">
            Sistema de gestão inteligente para <b>maximizar suas margens</b> e
            otimizar o estoque.
          </p>

          {/* Features */}
          <ul className="mt-8 space-y-3 max-w-sm">
            {[
              { icon: TrendingUp, text: "Análise de margem em tempo real." },
              {
                icon: PackageCheck,
                text: "Controle de estoque centralizado e preciso.",
              },
              { icon: Bot, text: "Alertas inteligentes de saúde do produto." },
              {
                icon: ShoppingCart,
                text: "Gestão multi-canal (E-commerce e Físico).",
              },
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-1 text-[var(--color-primary)] flex-shrink-0" />
                <span className="text-sm lg:text-md text-[var(--color-text-secondary)]">
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 lg:p-6 max-w-md z-10 hidden md:flex items-center justify-center">
          <Image
            src={background}
            alt="Background Dashboard"
            className="w-full h-auto rounded-xl"
            priority
          />
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] text-center z-10 hidden md:block">
          © 2025 PriceFix — Inteligência aplicada ao seu negócio.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border-dark)] shadow-2xl p-8 sm:p-10 rounded-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[var(--color-text)] tracking-tight">
            Bem-vindo(a)
          </h2>

          <p className="text-center text-sm sm:text-md mt-2 text-[var(--color-text-secondary)] text-balance">
            Acesse seu painel de gestão PriceFix
          </p>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-sm font-medium text-[var(--color-text-secondary)] block mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text-secondary)] block mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
                <input
                  type="password"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)] rounded-lg">
                <AlertTriangle className="h-4 w-4 text-[var(--color-error)]" />
                <p className="text-[var(--color-error)] text-sm">{error}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center gap-2 items-center py-3 px-4 rounded-lg text-white font-semibold transition-all shadow-md
            ${
              loading
                ? "bg-[var(--color-primary)]/70 cursor-not-allowed"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
            }`}
            >
              <LogIn className="h-5 w-5" />
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            Não possui uma conta?{" "}
            <Link
              href="/register"
              className="text-[var(--color-primary)] font-semibold hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
