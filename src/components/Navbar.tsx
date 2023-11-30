/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { languageAtom, themeAtom } from '../atoms';
import './Navbar.css';

export const Navbar = () => {
  const [saleTime] = useState<boolean>(false);
  const [theme, setTheme] = useAtom(themeAtom)
  const [language, setLanguage] = useAtom(languageAtom)

  const changeTheme = (theme: string) => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("light")
    }
  }

  const changeLanguage = (language: string) => {
    if (language === "eng") {
      setLanguage("pl")
    } else if (language === "pl") {
      setLanguage("eng")
    }
  }

  return (
    <nav>
      {saleTime ?
        <div className="promotional-section">
          Black friday sale! Every candle -20%!
        </div>
        :
        <></>
      }
      <div className="upper-section">
        <Link to="/">
          <div className="logo">
            <img src="candle.svg" className="logo-img" />
            <p className="logo-name">Cysia Candles</p>
          </div>
        </Link>
      </div>
      <div className="lower-section">
        <Link className="nav-button" to="/">
          Candles
        </Link>
        <Link className="nav-button" to="/contact">
          Ask us a question
        </Link>
        <Link className="nav-button" to="/favourites">
          <img className="button-icon" src="heart.svg" />
          <span>Favourites</span>
        </Link>
        <Link className="nav-button" to="/cart">
          <img className="button-icon" src="shopping-cart.svg" />
          <span>Cart</span>
        </Link>
        <div className="nav-button" onClick={() => changeTheme(theme)}>
          <span>Switch to {theme === "light" ? <>dark</> : <>light</>} theme</span>
        </div>
        <div className="nav-button" onClick={() => changeLanguage(language)}>
          <span>Switch to {language === "eng" ? <>polish</> : <>english</>} language</span>
        </div>
      </div>
    </nav>
  )
}