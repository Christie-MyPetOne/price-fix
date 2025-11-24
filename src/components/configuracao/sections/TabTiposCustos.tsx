"use client";

import { useState } from "react";
import { DollarSign, Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface CostType {
  id: number;
  name: string;
  description: string;
  value: number;
}

export default function TabTiposCustos() {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newValue, setNewValue] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editValue, setEditValue] = useState("");

  const [costTypes, setCostTypes] = useState<CostType[]>([
    {
      id: 1,
      name: "Aluguel",
      description: "Custo mensal do espaço físico.",
      value: 3500,
    },
    {
      id: 2,
      name: "Salários",
      description: "Folha de pagamento.",
      value: 12000,
    },
    {
      id: 3,
      name: "Marketing",
      description: "Publicidade e promoção.",
      value: 800,
    },
  ]);

  const handleAddCost = () => {
    if (!newName.trim()) return;

    setCostTypes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName,
        description: newDesc,
        value: Number(newValue) || 0,
      },
    ]);

    setNewName("");
    setNewDesc("");
    setNewValue("");
  };

  const handleDeleteCost = (id: number) => {
    setCostTypes((prev) => prev.filter((c) => c.id !== id));
  };

  const startEditing = (c: CostType) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDesc(c.description);
    setEditValue(String(c.value));
  };

  const saveEditing = (id: number) => {
    setCostTypes((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: editName,
              description: editDesc,
              value: Number(editValue) || 0,
            }
          : c
      )
    );
    setEditingId(null);
  };

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] pt-6">
      <div className="mx-auto max-w-6xl">
        {/* ===== HEADER PADRÃO ===== */}
        <div className="mb-6 ml-4">
          <h1 className="text-2xl font-semibold text-text flex items-center gap-2">
            <DollarSign className="text-emerald-600 dark:text-emerald-400" />
            Gestão de Tipos de Custos
          </h1>
          <p className="text-sm text-text-secondary">
            Cadastre e atualize os tipos de custos utilizados nos relatórios
            financeiros.
          </p>
        </div>

        {/* ===== CARD PRINCIPAL ===== */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="p-6 space-y-10">
            {/* ===== FORMULARIO EM CARD ===== */}
            <section>
              <h3 className="text-base font-semibold mb-4">
                Adicionar Novo Tipo de Custo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  className="p-2.5 rounded bg-card border border-border-dark"
                  placeholder="Nome do Custo"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />

                <input
                  className="md:col-span-2 p-2.5 rounded bg-card border border-border-dark"
                  placeholder="Descrição"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />

                <input
                  className="p-2.5 rounded bg-card border border-border-dark"
                  placeholder="Valor (R$)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddCost}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded flex items-center gap-2"
              >
                <Plus size={16} /> Adicionar
              </button>
            </section>

            {/* ===== DIVISOR ===== */}
            <div className="h-px bg-border-dark/60" />

            {/* ===== TABELA ===== */}
            <section>
              <h3 className="text-base font-semibold mb-4">
                Tipos de Custos Cadastrados
              </h3>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 border-b border-border-dark text-xs uppercase text-text-secondary">
                      Nome
                    </th>
                    <th className="py-3 border-b border-border-dark text-xs uppercase text-text-secondary">
                      Descrição
                    </th>
                    <th className="py-3 border-b border-border-dark text-xs uppercase text-text-secondary">
                      Valor (R$)
                    </th>
                    <th className="py-3 border-b border-border-dark text-xs uppercase text-right text-text-secondary">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-border-dark">
                  {costTypes.map((c) => {
                    const isEditing = editingId === c.id;

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40"
                      >
                        <td className="py-3">
                          {isEditing ? (
                            <input
                              className="p-1.5 rounded bg-card border border-border-dark w-full"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          ) : (
                            c.name
                          )}
                        </td>

                        <td className="py-3">
                          {isEditing ? (
                            <input
                              className="p-1.5 rounded bg-card border border-border-dark w-full"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                            />
                          ) : (
                            c.description
                          )}
                        </td>

                        <td className="py-3">
                          {isEditing ? (
                            <input
                              className="p-1.5 rounded bg-card border border-border-dark w-32"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                          ) : (
                            "R$ " +
                            c.value.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })
                          )}
                        </td>

                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-3">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEditing(c.id)}
                                  className="text-emerald-600 hover:bg-emerald-600/10 p-1 rounded"
                                >
                                  <Check size={18} />
                                </button>

                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(c)}
                                  className="text-blue-500 hover:bg-blue-500/10 p-1 rounded"
                                >
                                  <Pencil size={18} />
                                </button>

                                <button
                                  onClick={() => handleDeleteCost(c.id)}
                                  className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
