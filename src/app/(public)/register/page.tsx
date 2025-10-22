"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react"; // Ícone para o botão

// Componentes simulados de UI (em um projeto real, importe de /components/ui)
// Estes são os mesmos da página de login, idealmente estariam em arquivos separados
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

// --- Página de Cadastro ---
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    // --- Lógica de Cadastro (Substitua pelo seu método real) ---
    console.log("Tentando cadastrar com:", { name, email, password });
    // Exemplo: Chamar sua API de cadastro aqui
    // Exemplo de erro:
    // setTimeout(() => {
    //   setError('Este email já está em uso.');
    //   setLoading(false);
    // }, 1000);
    setTimeout(() => {
      // Simula sucesso (em um caso real, você redirecionaria para login ou dashboard)
      console.log("Cadastro bem-sucedido (simulado)");
      // Ex: window.location.href = '/login'; // Ou use router.push('/login')
      setLoading(false);
    }, 1000); // Simula um delay da API
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-text mb-2">
          Crie sua conta
        </h1>
        <p className="text-center text-text-secondary mb-6 text-sm">
          Comece a otimizar seus lucros hoje mesmo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Nome Completo
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Confirmar Senha
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <UserPlus className="w-4 h-4 mr-2" /> Criar Conta
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Já tem uma conta?{" "}
          <Link
            href="/login" // Link para sua página de login
            className="font-medium text-primary hover:text-primary-dark"
          >
            Faça login
          </Link>
        </p>
      </Card>
    </div>
  );
}
