export default function HomePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg">Bem-vindo ao Preço Certo Clone!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Vendas Hoje</h2>
          <p className="text-3xl text-primary font-bold">R$ 1.250,00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Produtos em Estoque</h2>
          <p className="text-3xl text-green-600 font-bold">245</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Lucro Bruto</h2>
          <p className="text-3xl text-purple-600 font-bold">R$ 800,00</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Gráfico de Vendas Mensais
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Gráfico de Vendas
        </div>
      </div>
    </div>
  );
}
