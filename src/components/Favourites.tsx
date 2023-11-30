import { useAtom } from 'jotai';
import { favouritesAtom, themeAtom } from "../atoms";
import { Candle } from "./Candle";
import './Favourites.css';

type CandleProps = {
  id: number,
  image: string,
  name: string,
}

export const Favourites = () => {
  const [favourites] = useAtom<CandleProps[]>(favouritesAtom)
  const [theme] = useAtom(themeAtom)

  return (
    <div className={`favourites ${theme === "light" ? "light-toned-bg" : "dark-bg"}`}>
      <div className="favourites-info">
        {favourites.length > 0 ?
          <span>Here are your favourite candles.</span>
          :
          <span>You don't have any favourite candle.</span>
        }
      </div>
      {favourites ? favourites.map((candle) => (
        <Candle key={candle.id} image={candle.image} name={candle.name} />
      )) : <></>}
    </div>
  )
}