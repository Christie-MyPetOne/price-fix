import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Mova o objeto 'colors' para fora do 'extend'
    colors: {
      // É importante manter as cores padrão que você pode precisar.
      // Você pode adicionar 'transparent' e 'current' para consistência.
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",

      // Suas cores personalizadas vêm aqui
      background: "#1a1a1a",
      card: "#2c2c2c",
      primary: "#10B981",
      "primary-dark": "#059669",
      "primary-light": "#34D399",
      text: "#e0e0e0",
      "text-secondary": "#a0a0a0",
      "border-dark": "#4a4a4a",
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      info: "#3B82F6",
    },
    // Você pode manter o 'extend' para outras propriedades que não sejam cores
    extend: {
      // Exemplo:
      // borderRadius: {
      //   'lg': '0.5rem',
      // },
    },
  },
  plugins: [],
};

export default config;
