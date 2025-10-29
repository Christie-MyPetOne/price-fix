"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { NavLinkProps, DropdownLinkProps } from "@/lib/types";
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
  Sun,
  Moon,
} from "lucide-react";
import { IconsBrand } from "../svgs/IconsBrand/IconsBrand";

export function Navbar() {
  const [isGerenciarOpen, setIsGerenciarOpen] = useState(false);
  const pathname = usePathname();

  const toggleGerenciar = () => {
    setIsGerenciarOpen(!isGerenciarOpen);
  };

  const NavLink: React.FC<NavLinkProps> = ({ href, children, icon: Icon }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200
          ${
            isActive
              ? "bg-primary text-white font-semibold"
              : "text-text-secondary hover:bg-card hover:text-text"
          }`}
      >
        {Icon && <Icon className="w-5 h-4 mr-1" />}
        {children}
      </Link>
    );
  };

  const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
      <button
        onClick={toggleTheme}
        className="text-text-secondary hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors"
        aria-label="Alternar tema"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>
    );
  };
  const DropdownLink: React.FC<DropdownLinkProps> = ({
    href,
    children,
    icon: Icon,
    onClick,
  }) => {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center px-4 py-2 text-sm text-text hover:bg-card hover:text-primary transition-colors duration-200"
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-card py-2 shadow-lg flex justify-between items-center z-10 border-b border-border-dark">
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-primary"
        >
          <IconsBrand className="ml-5 h-8 w-auto mr-1" />
        </Link>

        {/* Links de Navegação */}
        <div className="hidden text-sm md:flex items-center space-x-2">
          <NavLink href="/" icon={Home}>
            Dashboard
          </NavLink>
          <div className="relative">
            <button
              onClick={toggleGerenciar}
              className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200
                ${
                  isGerenciarOpen
                    ? "bg-card text-text font-semibold"
                    : "text-text-secondary hover:bg-card hover:text-text"
                } focus:outline-none`}
            >
              Gerenciar
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  isGerenciarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isGerenciarOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-20 border border-border-dark">
                <DropdownLink
                  href="/produtos"
                  icon={Package}
                  onClick={toggleGerenciar}
                >
                  Meus Produtos
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
          <NavLink href="/comprar" icon={null}>
            Comprar
          </NavLink>
          <NavLink href="#" icon={null}>
            Histórico
          </NavLink>
          <NavLink href="#" icon={null}>
            Configurar
          </NavLink>
        </div>
      </div>

      <div className="flex items-center space-x-4">
      
        <ThemeToggleButton />
        <button className="text-text-secondary hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="relative text-text-secondary hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-error rounded-full">
            3
          </span>
        </button>
        <div className="relative group">
          <button className="flex items-center text-text hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors">
            <User className="w-4 h-4 mr-1" />
            <span className="hidden md:inline text-sm text-text-secondary">
              gustavo@mypeto...
            </span>
            <ChevronDown className="w-4 h-4 ml-1 text-text-secondary" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-20 border border-border-dark">
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
