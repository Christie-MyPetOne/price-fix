import React from "react";
import { CardVendasProps } from "@/lib/types";

const CardVendas: React.FC<CardVendasProps> = ({ Nome, Valor }) => {
  return (
    <div>
      <h1 className="font-bold text-2xl">{Nome}</h1>
      <p className="mt-4 text-xl">{Valor}</p>
    </div>
  );
};

export default CardVendas;
