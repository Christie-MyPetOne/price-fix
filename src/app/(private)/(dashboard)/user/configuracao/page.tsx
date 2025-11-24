"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SidebarConfig from "@/components/configuracao/SidebarConfig";
import { ConfigSectionId } from "@/lib/config-section";

// import os componentes reais
import ConfigBasica from "@/components/configuracao/sections/ConfigBasica";
import CanaisVenda from "@/components/configuracao/sections/CanaisVenda";
import FormasRecebimento from "@/components/configuracao/sections/FormasRecebimento";
import Fornecedores from "@/components/configuracao/sections/Fornecedores";
import Depositos from "@/components/configuracao/sections/Depositos";
import Integracoes from "@/components/configuracao/sections/Integracoes";
import TabEmpresas from "@/components/configuracao/sections/TabEmpresas";
import TabGeral from "@/components/configuracao/sections/TabGeral";
import TabTiposCustos from "@/components/configuracao/sections/TabTiposCustos";

const DEFAULT_TAB: ConfigSectionId = "config-basica";

export default function ConfiguracaoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const initial = (search.get("tab") as ConfigSectionId) || DEFAULT_TAB;
  const [active, setActive] = useState<ConfigSectionId>(initial);

  // sincroniza a URL sem navegar para outra página
  useEffect(() => {
    const params = new URLSearchParams(Array.from(search.entries()));
    params.set("tab", active);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const Content = useMemo(() => {
    switch (active) {
      case "config-basica":
        return <ConfigBasica />;
      case "canais-venda":
        return <CanaisVenda />;
      case "formas-recebimento":
        return <FormasRecebimento />;
      case "fornecedores":
        return <Fornecedores />;

      case "depositos":
        return <Depositos />;
      case "integracoes":
        return <Integracoes />;
      case "empresas":
        return <TabEmpresas />;
      case "geral":
        return <TabGeral />;
      case "custos":
        return <TabTiposCustos />;
      default:
        return <ConfigBasica />;
    }
  }, [active]);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <SidebarConfig active={active} onChange={setActive} />
      <main className="flex-1 bg-background pb-24 md:pb-6 overflow-x-hidden pt-6">
        {Content}
      </main>
    </div>
  );
}
