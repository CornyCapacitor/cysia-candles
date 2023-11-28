import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { Candle } from "./Candle";
import './Candles.css';

type CandleProps = {
  id: number,
  image: string,
  name: string,
}

export const Candles = () => {
  const [candles, setCandles] = useState<CandleProps[]>([]);
  const [isFetched, setIsFetched] = useState<boolean>();

  useEffect(() => {
    const fetchCandles = async () => {
      const { data, error } = await supabase.from('candles').select();

      if (error) {
        console.error(error);
      }

      if (data) {
        setCandles(data);
        setIsFetched(true);
      }
    };

    fetchCandles();
  }, []);

  return (
    <div className="candles">
      <div className="candles-info">
        <span>Make sure to select correct volume, color and quantity for your candle. If not changed, candle will remain white.</span>
      </div>
      {isFetched ? candles.map((candle) => (
        <Candle key={candle.id} image={candle.image} name={candle.name} />
      )) : <>Loading products...</>}
    </div>
  )
}