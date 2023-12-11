import { useAtom } from 'jotai';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { themeAtom } from "../atoms";
import supabase from "../config/supabaseClient";
import { Candle } from "./Candle";

import '../config/i18n';
import '../theme.css';
import './Candles.css';

type CandleProps = {
  id: number,
  image: string,
  name: string,
}

export const Candles = () => {
  const [candles, setCandles] = useState<CandleProps[]>([]);
  const [isFetched, setIsFetched] = useState<boolean>();
  const [theme] = useAtom(themeAtom)

  const { t } = useTranslation();

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

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  return (
    <div className={`candles ${theme === "light" ? "light-toned-bg" : "dark-bg"}`}>
      <div className={`candles-info ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
        <span>{t('candles_header')}</span>
      </div>
      <div className="candles-container">
        {isFetched ? candles.map((candle) => (
          <Candle key={candle.id} image={candle.image} name={candle.name} />
        )) : <>{t('products_loading')}</>}
      </div>
    </div>
  )
}