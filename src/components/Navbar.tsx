/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { themeAtom } from '../atoms';
import '../theme.css';

import '../config/i18n';
import './Navbar.css';

export const Navbar = () => {
  const [saleTime] = useState<boolean>(false);
  const [theme, setTheme] = useAtom(themeAtom)

  const { t } = useTranslation()

  const changeTheme = (theme: string) => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("light")
    }
  }

  const languageSwitch = () => {
    const currentLanguage = localStorage.getItem('i18nextLng')
    console.log(currentLanguage)
    if (currentLanguage === "en") {
      localStorage.setItem('i18nextLng', "pl")
    } else {
      localStorage.setItem('i18nextLng', "en")
    }
    window.location.reload()
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
            <img src={theme === "light" ? "/light-logo.svg" : "/dark-logo.svg"} className="logo-img" />
            <p className={theme === "light" ? "logo-name light-logo-name" : "logo-name dark-logo-name"}>Cysia Candles</p>
          </div>
        </Link>
      </div>
      <div className={`lower-section ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/">
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>{t('candles')}</span>
        </Link>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/contact">
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>{t('ask_us_a_question')}</span>
        </Link>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/favourites">
          <img className="button-icon" src={theme === "light" ? "/black-border-heart.svg" : "/white-border-heart.svg"} />
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>{t('favourites')}</span>
        </Link>
        <Link className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} to="/cart">
          <img className="button-icon" src={theme === "light" ? "/black-shopping-cart.svg" : "/white-shopping-cart.svg"} />
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>{t('cart')}</span>
        </Link>
        <div className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} onClick={() => changeTheme(theme)}>
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>{t('switch_to')} {theme === "light" ? <>{t('dark_theme')}</> : <>{t('light_theme')}</>} {t('switch_theme')}</span>
        </div>
        <div className={`nav-button ${theme === "light" ? "black-font black-hover" : "white-font white-hover"}`} onClick={() => languageSwitch()}>
          <span style={theme === "light" ? { color: "black" } : { color: "white" }}>{t('language_switch')}</span>
        </div>
      </div>
    </nav>
  )
}