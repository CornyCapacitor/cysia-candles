import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { favouritesAtom, themeAtom } from "../atoms";
import { Candle } from "./Candle";

import '../config/i18n';
import '../theme.css';
import './Favourites.css';

type CandleProps = {
  id: number,
  image: string,
  name: string,
}

export const Favourites = () => {
  const [favourites] = useAtom<CandleProps[]>(favouritesAtom)
  const [theme] = useAtom(themeAtom)

  const { t } = useTranslation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  return (
    <div className={`favourites ${theme === "light" ? "light-toned-bg" : "dark-bg"}`}>
      <div className={`favourites-info ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
        {favourites.length > 0 ?
          <span>Here are your favourite candles.</span>
          :
          <span>You don't have any favourite candle.</span>
        }
      </div>
      <div className="favourites-container">
        {favourites ? favourites.map((candle) => (
          <Candle key={candle.id} image={candle.image} name={candle.name} />
        )) : <></>}
      </div>
    </div>
  )
}