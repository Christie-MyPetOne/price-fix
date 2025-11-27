"use client";

import { useState } from "react";
import { Camera, User, Shield, Sun, Globe2, Bell, Lock } from "lucide-react";
import Image from "next/image";

export default function PerfilPage() {
  const [userData, setUserData] = useState({
    name: "Christie Silva",
    email: "christie@example.com",
    role: "Administrador",
    phone: "(11) 99999-0000",
    password: "",
    newPassword: "",
    confirmPassword: "",
    theme: "dark",
    language: "pt-BR",
    notifications: true,
    twoFA: false,
  });

  const handleChange = (field: string, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-200px)] p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 ml-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-text">
            <User className="text-emerald-600 dark:text-emerald-400" />
            Perfil do Usuário
          </h1>
        </div>

        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="p-6 space-y-10">
            <section>
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border-dark group cursor-pointer">
                  <Image
                    src="/default-user.png"
                    alt="Foto de Perfil"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera size={22} className="text-white" />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-border-dark/60" />

            <section>
              <h3 className="text-base font-semibold mb-4">
                Informações Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-text-secondary">Nome</label>
                  <input
                    className="mt-1 w-full p-2.5 rounded bg-card border border-border-dark"
                    value={userData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-text-secondary">E-mail</label>
                  <input
                    className="mt-1 w-full p-2.5 rounded bg-card border border-border-dark"
                    value={userData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-text-secondary">
                    Cargo / Função
                  </label>
                  <input
                    className="mt-1 w-full p-2.5 rounded bg-card border border-border-dark"
                    value={userData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-text-secondary">
                    Telefone
                  </label>
                  <input
                    className="mt-1 w-full p-2.5 rounded bg-card border border-border-dark"
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-text-secondary flex items-center gap-1">
                    <Lock size={14} />
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="mt-1 w-full p-2.5 rounded bg-card border border-border-dark"
                    value={userData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-text-secondary">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    className="mt-1 w-full p-2.5 rounded bg-card border border-border-dark"
                    value={userData.newPassword}
                    onChange={(e) =>
                      handleChange("newPassword", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-text-secondary">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    className="mt-1 w-full p-2.5 rounded bg-card border border-border-dark"
                    value={userData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
              </div>

              <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm">
                Salvar Alterações
              </button>
            </section>

            <div className="h-px bg-border-dark/60" />

            <section>
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Shield size={18} className="text-emerald-600" />
                Segurança
              </h3>

              <div className="p-4 border border-border-dark rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">
                      Autenticação em Duas Etapas
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Torne sua conta mais segura com código adicional no login.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={userData.twoFA}
                      onChange={(e) => handleChange("twoFA", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-emerald-600 dark:bg-gray-700 rounded-full transition-all" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                  </label>
                </div>

                {userData.twoFA && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Escaneie o QR Code:
                      </p>
                      <div className="w-40 h-40 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-border-dark">
                        <span className="text-xs text-text-secondary">
                          QR CODE
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">
                        Código Secreto (Backup)
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          disabled
                          type="password"
                          value="JX94K-3MDLS-2PQ88"
                          className="w-full p-2.5 bg-card border border-border-dark rounded text-sm"
                        />
                        <button className="text-xs px-3 py-2 border border-border-dark rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-600">
                          Mostrar
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">
                        Digite o código de 6 dígitos
                      </p>

                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        className="w-32 p-2.5 bg-card border border-border-dark rounded text-center tracking-widest text-lg"
                      />

                      <button className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
                        Confirmar Ativação
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="h-px bg-border-dark/60" />

            <section>
              <h3 className="text-base font-semibold mb-4">Preferências</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-border-dark rounded-lg bg-card">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe2 size={18} /> Idioma
                  </label>

                  <select
                    className="mt-2 w-full p-2 rounded bg-card border border-border-dark"
                    value={userData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">Inglês</option>
                  </select>
                </div>

                <div className="p-4 border border-border-dark rounded-lg bg-card">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Bell size={18} /> Notificações
                  </label>

                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      checked={userData.notifications}
                      onChange={(e) =>
                        handleChange("notifications", e.target.checked)
                      }
                      className="w-5 h-5 accent-emerald-600"
                    />
                    <span className="ml-2 text-sm">
                      Receber alertas por e-mail
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
