"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  UserPlus,
  User,
  Phone,
  Building2,
  Mail,
  Lock,
  CheckCircle2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconsBrand } from "@/components/ui/svgs/IconsBrand";
import Image from "next/image";
import register from "../../../../public/images/register.svg";

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div
    className={`flex items-center text-xs ${
      met ? "text-green-500" : "text-gray-500"
    }`}
  >
    {met ? (
      <CheckCircle2 className="h-4 w-4 mr-2" />
    ) : (
      <XCircle className="h-4 w-4 mr-2" />
    )}
    {text}
  </div>
);

const FormInput = ({
  icon: Icon,
  id,
  ...props
}: {
  icon: React.ElementType;
  id: string;
  [key: string]: any;
}) => (
  <div className="relative">
    <span className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </span>
    <input
      id={id}
      {...props}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
    />
  </div>
);

const FormSelect = ({
  icon: Icon,
  id,
  children,
  ...props
}: {
  icon: React.ElementType;
  id: string;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <div className="relative">
    <span className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </span>
    <select
      id={id}
      {...props}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm appearance-none"
    >
      {children}
    </select>
  </div>
);

const formatPhone = (value: string) => {
  value = value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 10) {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length > 6) {
    return value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
    return value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    return value.replace(/(\d*)/, "($1");
  }
};

const formatCnpj = (value: string) => {
  value = value.replace(/\D/g, "");
  if (value.length > 14) value = value.slice(0, 14);

  return value
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

// --- COMPONENTE PRINCIPAL ---
const Register: React.FC = () => {
  const [nome, setNome] = useState("Lucas Cesar Silva Oliveira");
  const [celular, setCelular] = useState("31991134844");
  const [cnpj, setCnpj] = useState("37.677.337/0006-52");
  const [tipoEmpresa, setTipoEmpresa] = useState("ecommerce");
  const [email, setEmail] = useState("lucascesardev2023@outlook.com");
  const [senha, setSenha] = useState("130998Lucas!");
  const [confirmSenha, setConfirmSenha] = useState("130998Lucas!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    invalidChars: true,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const router = useRouter();

  useEffect(() => setCelular((prev) => formatPhone(prev)), []);
  useEffect(() => setCnpj((prev) => formatCnpj(prev)), []);

  useEffect(() => {
    setPasswordCriteria({
      minLength: senha.length >= 12,
      uppercase: /[A-Z]/.test(senha),
      lowercase: /[a-z]/.test(senha),
      number: /[0-9]/.test(senha),
      specialChar: /[!@#$%^&*()_+={}[\];,.<>?\\|`~]/.test(senha),
      invalidChars: !/[-"’:]/.test(senha),
    });
  }, [senha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-background)]">
      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 p-0 lg:p-0 flex-col justify-between relative overflow-hidden">
        {/* bg glow */}
        <div className="absolute top-1/4 -left-20 w-full lg:w-96 h-full lg:h-96 bg-[var(--color-primary)]/15 rounded-full blur-[150px] opacity-70"></div>

        <div className="px-14 pt-14">
          <div className="w-40 lg:w-60">
            <IconsBrand />
          </div>

          <p className="mt-4 text-lg lg:text-xl max-w-md text-[var(--color-text-secondary)] leading-relaxed">
            Crie sua conta e tenha acesso ao
            <br />
            <b>ecossistema inteligente de gestão PriceFix.</b>
          </p>

          <ul className="mt-8 space-y-3 max-w-sm">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-1 text-[var(--color-primary)]" />
              Cadastro simples e rápido
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-1 text-[var(--color-primary)]" />
              Ferramentas avançadas de automação
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-1 text-[var(--color-primary)]" />
              Gestão inteligente unificada
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center w-full">
          <Image
            src={register}
            alt="Dashboard Preview"
            className="w-full h-auto max-w-[26rem]"
            priority
          />
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] text-center z-10 mb-6">
          © 2025 PriceFix — Inteligência aplicada ao seu negócio.
        </p>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border-dark)] shadow-2xl p-8 sm:p-10 rounded-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[var(--color-text)]">
            Criar conta
          </h2>

          <p className="text-center text-sm sm:text-md mt-2 text-[var(--color-text-secondary)]">
            Comece gratuitamente em poucos minutos
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {/* Linha 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                icon={User}
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />

              <FormInput
                icon={Phone}
                id="celular"
                value={celular}
                onChange={(e) => setCelular(formatPhone(e.target.value))}
                placeholder="Celular"
                maxLength={15}
              />
            </div>

            {/* Linha 2 */}
            <FormInput
              icon={Building2}
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(formatCnpj(e.target.value))}
              placeholder="CNPJ"
              maxLength={18}
            />

            <FormInput
              icon={Mail}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            {/* SENHA */}
            <FormInput
              icon={Lock}
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
            />

            {/* CRITÉRIOS */}
            <div className="p-3 bg-[var(--color-background-soft)] rounded-lg space-y-2 border border-[var(--color-border-dark)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <PasswordRequirement
                  met={passwordCriteria.minLength}
                  text="Mínimo 12 caracteres"
                />
                <PasswordRequirement
                  met={passwordCriteria.uppercase}
                  text="Letra maiúscula"
                />
                <PasswordRequirement
                  met={passwordCriteria.lowercase}
                  text="Letra minúscula"
                />
                <PasswordRequirement
                  met={passwordCriteria.number}
                  text="Número"
                />
                <PasswordRequirement
                  met={passwordCriteria.specialChar}
                  text="Caractere especial"
                />
                <PasswordRequirement
                  met={passwordCriteria.invalidChars}
                  text='Não pode conter: -, ", ’, :'
                />
              </div>

              <PasswordRequirement
                met={passwordsMatch}
                text="As senhas coincidem"
              />
            </div>

            {/* CONFIRMAR SENHA */}
            <FormInput
              icon={Lock}
              id="confirmSenha"
              type="password"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              placeholder="Confirmar senha"
            />

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full flex justify-center gap-2 items-center py-3 px-4 rounded-lg text-white font-semibold transition-all shadow-md ${
                !isFormValid || loading
                  ? "bg-[var(--color-primary)]/70 cursor-not-allowed"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
              }`}
            >
              <UserPlus className="h-5 w-5" />
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            Já possui uma conta?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary)] font-semibold hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
