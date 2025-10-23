import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <Image
        src="/images/loading.gif"
        alt="Carregando..."
        width={300}
        height={300}
        priority
        unoptimized
      />
    </div>
  );
}
