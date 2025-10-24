import gif from "../../../public/images/loading.gif";
import Image from "next/image";
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background ">
      <Image
        src={gif}
        alt="Carregando..."
        width={300}
        height={300}
        priority
        unoptimized
      />
      <p className="text-[15px]">Aguarde enquanto carregamos o sistema</p>
      <div className="flex items-center justify-center mt-8">
        <div className="w-10 h-10 border-4 border-t-green-500 border-r-green-500 border-b-green-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
