import {
  Settings,
  Store,
  CreditCard,
  Factory,
  Layers,
  Building2,
  GitFork,
} from "lucide-react";

export type ConfigSectionId =
  | "config-basica"
  | "canais-venda"
  | "formas-recebimento"
  | "fornecedores"
  | "linhas-produtos"
  | "depositos"
  | "integracoes";

export type ConfigSection = {
  id: ConfigSectionId;
  label: string;
  icon: any; // Lucide icon component
};

export const CONFIG_SECTIONS: ConfigSection[] = [
  { id: "config-basica",       label: "Configurações básicas", icon: Settings },
  { id: "canais-venda",        label: "Canais de venda",       icon: Store },
  { id: "formas-recebimento",  label: "Formas de recebimento", icon: CreditCard },
  { id: "fornecedores",        label: "Fornecedores",          icon: Factory },
  { id: "linhas-produtos",     label: "Linhas de produtos",    icon: Layers },
  { id: "depositos",           label: "Depósitos",             icon: Building2 },
  { id: "integracoes",         label: "Integrações",           icon: GitFork },
];
