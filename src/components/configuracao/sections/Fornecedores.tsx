"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

type Fornecedor = {
  id: number;
  nome: string;
  origem?: "Tiny" | "Manual";
  mediaPrazoPagamentoDias: number | null;
  produtosVinculados: number;
};

const mockFornecedores: Fornecedor[] = [
  { id: 1, nome: "Sem fornecedor vinculado", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 482 },
  { id: 2, nome: "EVERALDO JUNIOR ELLER LTDA EP SP80081-3 // SP003204-2", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 212 },
  { id: 3, nome: "IMPORTADORA BAGE S.A.", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 191 },
  { id: 4, nome: "COVELI INDUSTRIA E COMERCIO LTDA", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 92 },
  { id: 5, nome: "QUALITYSACK EMBALAGENS LTDA", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 41 },
  { id: 6, nome: "Pearson Saúde Animal S.A", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 59 },
  { id: 7, nome: "CHEMITEC AGRO-VETERINARIA LTDA", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 37 },
  { id: 8, nome: "WORLD VETERINARIA COMERCIO E INDUSTRIA LTDA", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 227 },
  { id: 9, nome: "ELANCO SAUDE ANIMAL LTDA", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 244 },
  { id: 10, nome: "Petlook Produtos de Higiene e Acessorios Eireli", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 311 },
  { id: 11, nome: "NUTRISANTOS ALIMENTACAO ANIMAL LTDA", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 166 },
  { id: 12, nome: "MOAS INDUSTRIA E COMERCIO IMPORTACAO E EXPORTACAO LTDA", origem: "Tiny", mediaPrazoPagamentoDias: null, produtosVinculados: 49 },
];

const inputCls =
  "h-8 w-20 rounded-md border border-border-dark bg-card-light/40 px-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function Fornecedores() {
  const [busca, setBusca] = useState("");
  const [fornecedores, setFornecedores] = useState(mockFornecedores);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrazo, setTempPrazo] = useState("");

  const data = useMemo(
    () =>
      fornecedores.filter((f) =>
        f.nome.toLowerCase().includes(busca.trim().toLowerCase())
      ),
    [busca, fornecedores]
  );

  const tinyBadge = () => (
    <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-black">
      Tiny
    </span>
  );

  function toggleEditing(id: number, prazoAtual: number | null) {
    setEditingId(id);
    setTempPrazo(prazoAtual !== null ? String(prazoAtual) : "");
  }

  function savePrazo(id: number) {
    setFornecedores((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              mediaPrazoPagamentoDias:
                tempPrazo.trim() === "" ? null : Number(tempPrazo),
            }
          : f
      )
    );
    setEditingId(null);
  }

  const prazoCell = (fornecedor: Fornecedor) => {
    const isEditing = editingId === fornecedor.id;

    if (isEditing) {
      return (
        <input
          className={inputCls}
          autoFocus
          value={tempPrazo}
          onChange={(e) => setTempPrazo(e.target.value)}
          onBlur={() => savePrazo(fornecedor.id)}
          onKeyDown={(e) => e.key === "Enter" && savePrazo(fornecedor.id)}
          placeholder="dias"
        />
      );
    }

    if (fornecedor.mediaPrazoPagamentoDias == null) {
      return (
        <span
          onClick={() =>
            toggleEditing(fornecedor.id, fornecedor.mediaPrazoPagamentoDias)
          }
          className="tooglelist cursor-pointer flex items-center gap-1 text-red-500"
          title="Editar prazo de pagamento"
        >
          <span className="text-xs text-text-secondary">---</span>
          <AlertTriangle className="h-4 w-4" />
        </span>
      );
    }

    return (
      <span
        onClick={() =>
          toggleEditing(fornecedor.id, fornecedor.mediaPrazoPagamentoDias)
        }
        className="tooglelist cursor-pointer text-text hover:underline"
        title="Editar prazo de pagamento"
      >
        {fornecedor.mediaPrazoPagamentoDias} dias
      </span>
    );
  };

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] pt-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho da página */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="ml-4 text-2xl font-semibold text-text">Fornecedores</h1>
            <p className="ml-4 text-sm text-text-secondary max-w-xl">
              Todos os seus fornecedores aparecem aqui para que você possa
              atribuir o prazo de pagamento.
            </p>
          </div>

          <input
            placeholder="Buscar fornecedor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-10 ml-4 w-64 rounded-md border border-border-dark bg-card px-3 text-sm placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Card com tabela (mesmo estilo do ConfigBasica) */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-[960px] w-full">
                <thead className="border-b border-border-dark bg-card-light/40">
                  <tr className="text-left text-sm text-text-secondary">
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">
                      Média do Prazo de Pagamento (dias)
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Produtos vinculados
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-text">
                  {data.map((f) => (
                    <tr key={f.id} className="border-b border-border-dark">
                      <td className="px-4 py-3">
                        {f.nome}
                        {f.origem === "Tiny" && tinyBadge()}
                      </td>

                      <td className="px-4 py-3">{prazoCell(f)}</td>

                      <td className="px-4 py-3">{f.produtosVinculados}</td>
                    </tr>
                  ))}

                  {data.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-text-secondary"
                      >
                        Nenhum fornecedor encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-2 pt-3 text-sm text-text-secondary">
              <span>Mostrando {data.length} fornecedores</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
