"use client";

import Image from "next/image";
import loadingLight from "../../public/images/loading.gif";
import loadingDark from "../../public/images/loadingDark.gif";
import { useTheme } from "@/context/ThemeContext";

export default function Loading() {
  const { theme } = useTheme();

  const gifSrc = theme === "dark" ? loadingLight : loadingDark;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-colors duration-300">
      <Image
        src={gifSrc}
        alt="Carregando..."
        width={300}
        height={300}
        priority
        unoptimized
      />
      <p className="text-[15px] mt-2 text-text">
        Aguarde enquanto carregamos o sistema
      </p>
      <div className="flex items-center justify-center mt-8">
        <div className="w-10 h-10 border-4 border-t-green-500 border-r-green-500 border-b-green-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
