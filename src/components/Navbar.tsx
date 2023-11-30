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
      <div className={`upper-section ${theme === "light" ? "light-bg" : "dark-bg"}`}>
        <Link to="/">
          <div className={theme === "light" ? "logo light-logo" : "logo dark-logo"}>
            <img src={theme === "light" ? "/public/light-logo.svg" : "/public/dark-logo.svg"} className="logo-img" />
            <p className={theme === "light" ? "logo-name light-logo-name" : "logo-name dark-logo-name"}>Cysia Candles</p>
          </div>
        </Link>
      </div>
      <div className={`lower-section ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/">
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>Candles</span>
        </Link>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/contact">
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>Ask us a question</span>
        </Link>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/favourites">
          <img className="button-icon" src={theme === "light" ? "/public/black-border-heart.svg" : "/public/white-border-heart.svg"} />
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>Favourites</span>
        </Link>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/cart">
          <img className="button-icon" src={theme === "light" ? "/public/black-shopping-cart.svg" : "/public/white-shopping-cart.svg"} />
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>Cart</span>
        </Link>
        <div className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} onClick={() => changeTheme(theme)}>
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>Switch to {theme === "light" ? <>dark</> : <>light</>} theme</span>
        </div>
        <div className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} onClick={() => changeLanguage(language)}>
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>Switch to {language === "eng" ? <>polish</> : <>english</>} language</span>
        </div>
      </div>
    </nav>
  )
}