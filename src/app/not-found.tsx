import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary px-4">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-4xl font-semibold text-text-secondary mb-6 text-center">
        Página Não Encontrada
      </h2>
      <p className="text-lg text-text-secondary mb-8 text-center max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Link
        href="/about"
        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-300 ease-in-out"
      >
        Voltar para a Landing Page
      </Link>
    </div>
  );
}
