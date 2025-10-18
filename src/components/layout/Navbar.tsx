"use client"; // Necessário para usar useState e outros hooks do React

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart,
  User,
  ChevronDown,
  HelpCircle,
  Bell,
} from "lucide-react";
// import Image from "next/image";

export function Navbar() {
  const [isGerenciarOpen, setIsGerenciarOpen] = useState(false);

  const toggleGerenciar = () => {
    setIsGerenciarOpen(!isGerenciarOpen);
  };

  return (
    <nav className="bg-white p-4 shadow-md flex justify-between items-center z-10">
      {/* Lado Esquerdo: Logo e Navegação Principal */}
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-gray-800"
        >
          {/* <Image
            src="/logo.svg"
            alt="Preço Certo Logo"
            className="h-8  mr-2"
          /> */}
          Preço Certo
        </Link>

        {/* Links de Navegação */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink href="/" icon={Home}>
            Dashboard
          </NavLink>

          {/* Dropdown "Gerenciar" */}
          <div className="relative">
            <button
              onClick={toggleGerenciar}
              className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200 focus:outline-none"
            >
              Gerenciar
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  isGerenciarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isGerenciarOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <DropdownLink
                  href="/produtos"
                  icon={Package}
                  onClick={toggleGerenciar}
                >
                  Produtos de venda
                </DropdownLink>
                <DropdownLink
                  href="/vendas"
                  icon={ShoppingCart}
                  onClick={toggleGerenciar}
                >
                  Pedidos de venda
                </DropdownLink>
                <DropdownLink
                  href="/custos"
                  icon={DollarSign}
                  onClick={toggleGerenciar}
                >
                  Custos
                </DropdownLink>
              </div>
            )}
          </div>

          <NavLink href="/relatorios" icon={BarChart}>
            Relatórios
          </NavLink>
          {/* Adicione outros links principais aqui (Otimizar, Histórico, Configurar) */}
          <NavLink href="#" icon={null}>
            Otimizar
          </NavLink>
          <NavLink href="#" icon={null}>
            Histórico
          </NavLink>
          <NavLink href="#" icon={null}>
            Configurar
          </NavLink>
        </div>
      </div>

      {/* Lado Direito: Ícones de Ação e Perfil */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          {/* Opcional: Badge de notificação */}
          <span className="absolute -mt-2 ml-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            3
          </span>
        </button>
        <div className="relative group">
          <button className="flex items-center text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
            <User className="w-5 h-5 mr-1" />
            <span className="hidden md:inline">gustavo@mypeto...</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          {/* Dropdown de usuário (opcional) */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-20">
            <DropdownLink href="/perfil" onClick={() => {}}>
              Perfil
            </DropdownLink>
            <DropdownLink href="/configuracoes" onClick={() => {}}>
              Configurações
            </DropdownLink>
            <DropdownLink href="/logout" onClick={() => {}}>
              Sair
            </DropdownLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Componente auxiliar para os links de navegação principais
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType | null; // Lucide Icon component
}

function NavLink({ href, children, icon: Icon }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200"
    >
      {Icon && <Icon className="w-5 h-5 mr-1" />}
      {children}
    </Link>
  );
}

// Componente auxiliar para os links de dropdown
interface DropdownLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ElementType | null;
  onClick: () => void;
}

function DropdownLink({
  href,
  children,
  icon: Icon,
  onClick,
}: DropdownLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Link>
  );
}
