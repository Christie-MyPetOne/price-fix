"use client";

import { useState } from "react";
import { Building2, Trash2, Pencil, X } from "lucide-react";

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
}

interface Usuario {
  nome: string;
  sobrenome: string;
  email: string;
}

export default function TabEmpresas() {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "LB Admin",
    sobrenome: "Comércio",
    email: "gustavo@mypetone.com.br",
  });

  const [empresaPrincipal, setEmpresaPrincipal] = useState<Empresa>({
    id: 100,
    nome: "MyPetOne",
    cnpj: "00.000.000/0001-00",
  });

  const [empresas, setEmpresas] = useState<Empresa[]>([
    { id: 200, nome: "PetShop Online SP", cnpj: "22.222.222/0001-22" },
    { id: 201, nome: "MyPetOne E-commerce SP", cnpj: "33.333.333/0001-33" },
    { id: 202, nome: "Distribuidora MyPet MG", cnpj: "44.444.444/0001-44" },
    { id: 203, nome: "MyPetOne Centro-Oeste MG", cnpj: "55.555.555/0001-55" },
  ]);

  const [openEdit, setOpenEdit] = useState(false);

  const [formEdit, setFormEdit] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    empresa: "",
    cnpj: "",
  });

  const handleDelete = (id: number) => {
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
  };

  const openModalEditar = () => {
    setFormEdit({
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      empresa: empresaPrincipal.nome,
      cnpj: empresaPrincipal.cnpj,
    });
    setOpenEdit(true);
  };

  const salvarAlteracoes = () => {
    setUsuario({
      nome: formEdit.nome,
      sobrenome: formEdit.sobrenome,
      email: formEdit.email,
    });

    setEmpresaPrincipal({
      ...empresaPrincipal,
      nome: formEdit.empresa,
      cnpj: formEdit.cnpj,
    });

    setOpenEdit(false);
  };

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] pt-6">
      <div className="mx-auto max-w-6xl">
        {/* HEADER IGUAL AO CONFIGBASICA */}
        <div className="mb-6 ml-4">
          <h1 className="text-2xl font-semibold text-text flex items-center gap-2">
            <Building2 className="text-emerald-600 dark:text-emerald-400" />
            Gestão de Empresas
          </h1>
          <p className="text-sm text-text-secondary">
            Gerencie informações da conta e empresas vinculadas.
          </p>
        </div>

        {/* CARD PRINCIPAL — PADRÃO CONFIGBASICA */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="p-6 grid gap-8">
            {/* ======= INFORMAÇÕES DA CONTA ======= */}
            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-text">
                Informações da Conta
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <p className="text-text-secondary">Nome</p>
                  <p className="font-medium">{usuario.nome}</p>
                </div>

                <div>
                  <p className="text-text-secondary">Sobrenome</p>
                  <p className="font-medium">{usuario.sobrenome}</p>
                </div>

                <div>
                  <p className="text-text-secondary">Email</p>
                  <p className="font-medium">{usuario.email}</p>
                </div>

                <div>
                  <p className="text-text-secondary">Empresa Principal</p>
                  <p className="font-medium">{empresaPrincipal.nome}</p>
                </div>

                <div>
                  <p className="text-text-secondary">CNPJ</p>
                  <p className="font-medium">{empresaPrincipal.cnpj}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-2"
                  onClick={openModalEditar}
                >
                  <Pencil size={16} /> Editar Informações
                </button>

                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2">
                  <Trash2 size={16} /> Excluir Conta
                </button>
              </div>
            </section>

            {/* Divider padrão */}
            <div className="h-px bg-border-dark/60" />

            {/* ======= EMPRESAS VINCULADAS ======= */}
            <section className="grid gap-3">
              <h2 className="text-base font-semibold text-text">
                Empresas Vinculadas
              </h2>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 border-b border-border-dark text-xs uppercase text-text-secondary">
                      Empresa
                    </th>
                    <th className="py-3 border-b border-border-dark text-xs uppercase text-text-secondary">
                      CNPJ
                    </th>
                    <th className="py-3 border-b border-border-dark text-xs text-right uppercase text-text-secondary">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-border-dark">
                  {empresas.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-card-light transition-colors"
                    >
                      <td className="py-3">{e.nome}</td>
                      <td className="py-3">{e.cnpj}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 p-1 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-sm text-text-secondary mt-2">Página 1 de 1</p>
            </section>
          </div>
        </div>
      </div>

      {/* ========= MODAL IGUAL AO CONFIGBASICA ========= */}
      {openEdit && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border-dark p-6 rounded-xl shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">
                Editar Informações
              </h3>
              <button onClick={() => setOpenEdit(false)}>
                <X className="text-text-secondary hover:text-text" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-text-secondary">Nome</label>
                <input
                  className="w-full p-2 border border-border-dark rounded-md bg-background text-text"
                  value={formEdit.nome}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, nome: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary">Sobrenome</label>
                <input
                  className="w-full p-2 border border-border-dark rounded-md bg-background text-text"
                  value={formEdit.sobrenome}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, sobrenome: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary">Email</label>
                <input
                  className="w-full p-2 border border-border-dark rounded-md bg-background text-text"
                  value={formEdit.email}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary">
                  Empresa Principal
                </label>
                <input
                  className="w-full p-2 border border-border-dark rounded-md bg-background text-text"
                  value={formEdit.empresa}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, empresa: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary">CNPJ</label>
                <input
                  className="w-full p-2 border border-border-dark rounded-md bg-background text-text"
                  value={formEdit.cnpj}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, cnpj: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-text rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setOpenEdit(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                onClick={salvarAlteracoes}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
