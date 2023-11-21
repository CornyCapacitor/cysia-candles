import { useState } from "react";
import { Candle } from "./Candle";
import './Candles.css';

type CandleProps = {
  image: string,
  name: string,
  popularity: number,
}

export const Candles = () => {
  const [candles] = useState<CandleProps[]>([
    {
      image: "/public/cherry.svg",
      name: "Cherry",
      popularity: 5,
      // 
    },
    {
      image: "/public/cedar-tree.svg",
      name: "Cedar tree",
      popularity: 5,
      // Do wyjebania
    }
  ]);

  return (
    <div className="candles">
      {candles.map((candle, index) => (
        <Candle key={index} image={candle.image} name={candle.name} popularity={candle.popularity} />
      ))}
    </div>
  )
}