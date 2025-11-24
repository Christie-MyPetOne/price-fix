import {
  Settings,
  Store,
  CreditCard,
  Factory,
  Building2,
  GitFork,
  DollarSign,
  Globe,
} from "lucide-react";

export type ConfigSectionId =
  | "geral"
  | "config-basica"
  | "canais-venda"
  | "formas-recebimento"
  | "fornecedores"
  | "depositos"
  | "integracoes"
  | "empresas"
  | "custos";

export type ConfigSection = {
  id: ConfigSectionId;
  label: string;
  icon: any; // Lucide icon component
};

export const CONFIG_SECTIONS: ConfigSection[] = [
  { id: "geral", label: "Geral", icon: Globe },
  { id: "config-basica", label: "Configurações básicas", icon: Settings },
  { id: "canais-venda", label: "Canais de venda", icon: Store },
  {
    id: "formas-recebimento",
    label: "Formas de recebimento",
    icon: CreditCard,
  },
  { id: "fornecedores", label: "Fornecedores", icon: Factory },
  { id: "depositos", label: "Depósitos", icon: Building2 },
  { id: "integracoes", label: "Integrações", icon: GitFork },
  { id: "empresas", label: "Empresas", icon: Building2 },

  { id: "custos", label: "Tipos de Custos", icon: DollarSign },
];
