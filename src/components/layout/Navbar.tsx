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
  Sun,
  Moon,
  X,
  Menu,
} from "lucide-react";
import { IconsBrand } from "../svgs/IconsBrand/IconsBrand";

export function Navbar() {
  const [isGerenciarOpen, setIsGerenciarOpen] = useState(false);
  const [, setIsConfigOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleGerenciar = () => {
    setIsGerenciarOpen((prev) => !prev);
    setIsConfigOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsGerenciarOpen(false);
    setIsConfigOpen(false);
  };

  const NavLink: React.FC<NavLinkProps & { onClick?: () => void }> = ({
    href,
    children,
    icon: Icon,
    onClick,
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? "bg-primary text-white font-semibold"
            : "text-text-secondary hover:bg-card hover:text-primary"
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
    <>
      <nav className="bg-card py-2 shadow-lg flex justify-between items-center z-20 border-b border-border-dark sticky top-0">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-primary"
          >
            <IconsBrand className="ml-5 h-8 w-auto mr-1" />
          </Link>
          {/* Links de Navegação */}
          <div className="hidden text-sm lg:flex items-center space-x-2">
            <NavLink href="/" icon={Home}>
              Dashboard
            </NavLink>

            <div className="relative">
              <button
                onClick={toggleGerenciar}
                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
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
            <NavLink href="/configuracao" icon={null}>
              Configuração
            </NavLink>
          </div>
        </div>

        <div className="flex items-center space-x-4 lg:space-x-6">
          <button
            onClick={toggleMenu}
            className="lg:hidden text-text-secondary hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors"
            aria-label="Alternar menu de navegação"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <ThemeToggleButton />

          <div className="relative group hidden lg:block">
            <button className="flex items-center text-text hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors">
              <User className="w-4 h-4 mr-1" />
              <span className="hidden lg:inline text-sm text-text-secondary">
                dodo@mypeto...
              </span>
              <ChevronDown className="w-4 h-4 ml-1 text-text-secondary" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-20 border border-border-dark lg:w-56">
              <DropdownLink href="/perfil" onClick={() => {}}>
                Perfil
              </DropdownLink>
              <DropdownLink href="@/configuracoes" onClick={() => {}}>
                Configurações
              </DropdownLink>
              <DropdownLink href="/logout" onClick={() => {}}>
                Sair
              </DropdownLink>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-card shadow-xl z-10 p-4 border-b border-border-dark">
          <div className="flex flex-col space-y-2 text-sm">
            <NavLink href="/" icon={Home} onClick={toggleMenu}>
              Dashboard
            </NavLink>

            <div className="relative">
              <button
                onClick={toggleGerenciar}
                className={`flex items-center w-full px-3 py-2 rounded-md transition-colors duration-200 justify-between ${
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
                <div className="mt-2 w-full bg-card-light rounded-md shadow-inner py-1 z-20">
                  <DropdownLink
                    href="/produtos"
                    icon={Package}
                    onClick={() => {
                      toggleGerenciar();
                      toggleMenu();
                    }}
                  >
                    Meus Produtos
                  </DropdownLink>
                  <DropdownLink
                    href="/vendas"
                    icon={ShoppingCart}
                    onClick={() => {
                      toggleGerenciar();
                      toggleMenu();
                    }}
                  >
                    Pedidos de venda
                  </DropdownLink>
                  <DropdownLink
                    href="/custos"
                    icon={DollarSign}
                    onClick={() => {
                      toggleGerenciar();
                      toggleMenu();
                    }}
                  >
                    Custos
                  </DropdownLink>
                </div>
              )}
            </div>

            <NavLink href="/relatorios" icon={BarChart} onClick={toggleMenu}>
              Relatórios
            </NavLink>
            <NavLink href="/comprar" icon={null} onClick={toggleMenu}>
              Comprar
            </NavLink>
            <NavLink href="#" icon={null} onClick={toggleMenu}>
              Histórico
            </NavLink>
            <NavLink href="/configuracao" icon={null} onClick={toggleMenu}>
              Configuração
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
}
