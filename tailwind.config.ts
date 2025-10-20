import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        background: "var(--color-background)",
        card: "var(--color-card)",
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-light": "var(--color-primary-light)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        "border-dark": "var(--color-border-dark)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",
      },
    },
  },
  plugins: [],
};

export default config;

