import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { Candle } from "./Candle";
import './Candles.css';

type CandleProps = {
  image: string,
  name: string,
}

export const Candles = () => {
  const [candles, setCandles] = useState<CandleProps[]>([]);
  const [isFetched, setIsFetched] = useState<boolean>();

  useEffect(() => {
    const fetchBoards = async () => {
      const { data, error } = await supabase.from('candles').select();

      if (error) {
        console.error(error);
      }

      if (data) {
        setCandles(data);
        setIsFetched(true);
      }
    };

    console.log(candles)
    fetchBoards();
  }, []);

  return (
    <div className="candles">
      {isFetched ? candles.map((candle, index) => (
        <Candle key={index} image={candle.image} name={candle.name} />
      )) : <>Loading products...</>}
    </div>
  )
}