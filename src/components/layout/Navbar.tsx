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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

            <div className="relative group">
              <button
                className="flex items-center px-3 py-2 rounded-md transition-colors duration-200 
                          text-text-secondary group-hover:bg-card group-hover:text-text 
                          focus:outline-none"
              >
                Gerenciar
                <ChevronDown
                  className="w-4 h-4 ml-1 transition-transform duration-200 
                            group-hover:rotate-180"
                />
              </button>

              <div
                className="absolute top-full left-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-20 
                          border border-border-dark opacity-0 invisible 
                          group-hover:opacity-100 group-hover:visible 
                          transition-all duration-200"
              >
                <DropdownLink
                  href="/produtos"
                  icon={Package}
                  onClick={() => {}}   // <- só pra satisfazer o tipo
                >
                  Meus Produtos
                </DropdownLink>

                <DropdownLink
                  href="/vendas"
                  icon={ShoppingCart}
                  onClick={() => {}}   // <- idem
                >
                  Pedidos de venda
                </DropdownLink>
              </div>
            </div>


            <NavLink href="/comprar" icon={null}>
              Comprar
            </NavLink>
            <NavLink href="#" icon={null}>
              Histórico
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

      {/* PERFIL — aparece no desktop e mobile */}
      <div className="relative group hidden lg:block">
        <button className="flex items-center text-text hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors">
          <User className="w-4 h-4 mr-1" />
          <span className="hidden lg:inline text-sm text-text-secondary">
            dodo@mypeto...
          </span>
          <ChevronDown className="w-4 h-4 ml-1 text-text-secondary" />
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 opacity-0 
                        group-hover:opacity-100 invisible group-hover:visible 
                        transition-all duration-200 z-20 border border-border-dark lg:w-56">
          <DropdownLink 
            href="/user/perfil" 
            onClick={() => setIsProfileOpen(false)}
          >
            Perfil
          </DropdownLink>
          <DropdownLink 
            href="/user/configuracao" 
            onClick={() => setIsProfileOpen(false)}
          >
            Configurações
          </DropdownLink>
          <DropdownLink 
            href="/login" 
            onClick={() => setIsProfileOpen(false)}
          >
            Sair
          </DropdownLink>
        </div>
      </div>

      
      <div className="relative lg:hidden">
        <button
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="flex items-center text-text-secondary hover:text-primary p-2 rounded-full hover:bg-card-light transition-colors"
        >
          <User className="w-5 h-5" />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 border border-border-dark z-20">
            <DropdownLink href="/user/perfil" onClick={() => setIsProfileOpen(false)}>
              Perfil
            </DropdownLink>
            <DropdownLink
              href="/user/configuracao"
              onClick={() => setIsProfileOpen(false)}
            >
              Configurações
            </DropdownLink>
            <DropdownLink href="/login" onClick={() => setIsProfileOpen(false)}>
              Sair
            </DropdownLink>
          </div>
        )}
      </div>

        </div>
      </nav>
            
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-card shadow-xl z-10 p-4 border-b border-border-dark">
          <div className="flex flex-col space-y-2 text-sm">
            <NavLink href="/" icon={Home} onClick={toggleMenu}>
              Dashboard
            </NavLink>

            <div className="relative group">
              <button
                onClick={toggleGerenciar}
                className={`flex items-center w-full px-3 py-2 rounded-md transition-colors duration-200 justify-between ${
                  isGerenciarOpen
                    ? "bg-card text-text font-semibold"
                    : "text-text-secondary hover:bg-card hover:text-text"
                }`}
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
                </div>
              )}
            </div>

            <NavLink href="/comprar" icon={null} onClick={toggleMenu}>
              Comprar
            </NavLink>
            <NavLink href="#" icon={null} onClick={toggleMenu}>
              Histórico
            </NavLink>           
          </div>
        </div>
      )}
    </>
  );
}
