import { useAtom } from 'jotai';
import { favouritesAtom } from "../atoms";
import { Candle } from "./Candle";
import './Candles.css';

type CandleProps = {
  id: number,
  image: string,
  name: string,
}

export const Favourites = () => {
  const [favourites] = useAtom<CandleProps[]>(favouritesAtom)

  return (
    <div className="candles">
      <div className="candles-info">
        <span>Here are your favourite candles.</span>
      </div>
      {favourites ? favourites.map((candle) => (
        <Candle key={candle.id} image={candle.image} name={candle.name} />
      )) : <>Loading products...</>}
    </div>
  )
}