import React from "react";

interface CardVendasProps {
  Nome: string;
  Valor: string | number;
}

const CardVendas: React.FC<CardVendasProps> = ({ Nome, Valor }) => {
  return (
    <div>
      <h1 className="font-bold text-2xl">{Nome}</h1>
      <p className="mt-4 text-xl">{Valor}</p>
    </div>
  );
};

export default CardVendas;
