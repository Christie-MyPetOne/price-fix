"use client";

import React, { useMemo, useState } from "react";
import { Plug } from "lucide-react";
import ErpConfig from "@/components/configuracao/sections/erp";

type ErpItem = { name: string; slug: string; desc: string; image?: string };

export default function IntegracoesErpsPage() {
  const [selected, setSelected] = useState<ErpItem | null>(null);

  const erps = useMemo<ErpItem[]>(
    () => [
      { name: "Tiny ERP", slug: "tiny", desc: "ERP leve para e-commerce e emissão de notas." },
      { name: "Bling", slug: "bling", desc: "Gestão integrada: venda, estoque e finanças." },
      { name: "Base", slug: "base", desc: "ERP completo com foco em automação e serviços." },
    ],
    []
  );

  return (
    <div >
      {!selected && (
        <section className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {erps.map((erp) => (
            <article
              key={erp.slug}
              className="group rounded-xl border border-border-dark bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full h-20 rounded-md bg-primary/10 flex items-center justify-center mb-3 overflow-hidden border border-border-dark">
                <span className="text-text-secondary text-sm">Logo do ERP</span>
              </div>

              <h3 className="text-center text-base font-semibold text-text truncate">{erp.name}</h3>
              <p className="text-center text-sm text-text-secondary line-clamp-2">{erp.desc}</p>

              <div className="justify-center mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSelected(erp)}
                  className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium text-white
                             bg-primary hover:bg-primary-dark shadow-sm hover:shadow transition-all active:scale-[0.99]"
                >
                  <Plug className="w-4 h-4" />
                  Configurar
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {selected && (
        <ErpConfig
          slug={selected.slug}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
