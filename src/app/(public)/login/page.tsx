"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react"; // Ícone para o botão

// Componentes simulados de UI (em um projeto real, importe de /components/ui)
const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`bg-card rounded-lg border border-border-dark shadow-md ${className}`}
  >
    {children}
  </div>
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full p-3 border border-border-dark rounded-md bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
  }
>(({ className, variant = "primary", ...props }, ref) => {
  const variantClasses =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-dark"
      : "bg-background text-text-secondary hover:bg-opacity-80";
  return (
    <button
      ref={ref}
      className={`w-full inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors h-11 px-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${variantClasses} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- Página de Login ---
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // --- Lógica de Autenticação (Substitua pelo seu método real) ---
    console.log("Tentando logar com:", { email, password });
    // Exemplo: Chamar sua API de login aqui
    // Exemplo de erro:
    // setTimeout(() => {
    //   setError('Email ou senha inválidos.');
    //   setLoading(false);
    // }, 1000);
    setTimeout(() => {
      // Simula sucesso (em um caso real, você receberia um token e redirecionaria)
      console.log("Login bem-sucedido (simulado)");
      // Ex: document.cookie = 'token=seu_jwt_token; path=/';
      // Ex: window.location.href = '/dashboard'; // Ou use router.push('/dashboard')
      setLoading(false);
    }, 1000); // Simula um delay da API
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-text mb-2">
          Bem-vindo de volta!
        </h1>
        <p className="text-center text-text-secondary mb-6 text-sm">
          Faça login para acessar seu painel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary"
              >
                Senha
              </label>
              <div className="text-sm">
                <Link
                  href="/forgot-password" // Crie esta página se necessário
                  className="font-medium text-primary hover:text-primary-dark text-xs"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-error text-center">{error}</p>}

          <div>
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Entrar
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Não tem uma conta?{" "}
          <Link
            href="/e-mail"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Entre em contato
          </Link>
        </p>
      </Card>
    </div>
  );
}
