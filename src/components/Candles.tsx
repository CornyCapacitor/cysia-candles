import { useState } from "react";
import { Candle } from "./Candle";
import './Candles.css';

type CandleProps = {
  image: string,
  name: string,
}

export const Candles = () => {
  const [candles] = useState<CandleProps[]>([
    {
      image: "/public/cherry.svg",
      name: "Cherry"
    },
    {
      image: "/public/cedar-tree.svg",
      name: "Cedar tree",
    }
  ]);

  return (
    <div className="candles">
      {candles.map((candle, index) => (
        <Candle key={index} image={candle.image} name={candle.name} />
      ))}
    </div>
  )
}