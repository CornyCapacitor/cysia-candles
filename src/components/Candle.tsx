import { useAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cartAtom, favouritesAtom, themeAtom } from '../atoms';

import '../config/i18n';
import '../theme.css';
import './Candle.css';

type CandleProps = {
  image: string,
  name: string,
}

export const Candle = ({ image, name }: CandleProps) => {
  const [selectedVolume, setSelectedVolume] = useState<string>("130ml");
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [selectedQuantity, setSelectedQuantity] = useState<string | number>(1);
  const [cart, setCart] = useAtom(cartAtom)
  const [favourites, setFavourites] = useAtom(favouritesAtom)
  const [theme] = useAtom(themeAtom)

  const navigate = useNavigate();

  const { t } = useTranslation();

  const candlePrice = Number(selectedQuantity) * (selectedVolume === "130ml" ? 15.00 : 25.00)

  const addToCart = () => {
    const selQuant = Number(selectedQuantity)
    const newItem = { id: Math.random(), name: name, image: image, volume: selectedVolume, color: selectedColor, quantity: selQuant };

    const existingItemIndex = cart.findIndex(item => item.name === name && item.color === selectedColor && item.volume === selectedVolume)

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      const existingItem = updatedCart[existingItemIndex];

      if (existingItem && existingItem.quantity !== undefined) {
        existingItem.quantity += selQuant
        setCart(updatedCart);
      }
    } else {
      const itemToAdd = { ...newItem, quantity: selQuant };
      setCart((prevCart) => [...prevCart, itemToAdd]);
    }

    let themeBackground
    let themeColor

    if (theme === "light") {
      themeBackground = "#ffffff"
      themeColor = "#000000"
    } else if (theme === "dark") {
      themeBackground = "#000000"
      themeColor = "#ffffff"
    }

    Swal.fire({
      icon: 'success',
      title: `${t('candle_swal_title_1')} ${selectedQuantity} ${selectedQuantity === 1 ? `${t('candle_swal_singular')}` : `${t('candle_swal_plural')}`} ${t('candle_swal_title_2')}!`,
      showCancelButton: true,
      cancelButtonText: `${t('continue_shopping')}`,
      showConfirmButton: true,
      confirmButtonText: `${t('cart')}`,
      background: `${themeBackground}`,
      color: `${themeColor}`,
      timer: 5000,
      customClass: {
        confirmButton: "confirm-button",
        cancelButton: "cancel-button",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/cart')
      }
    })

    const resetItem = () => {
      setSelectedVolume("130ml");
      setSelectedColor("#ffffff");
      setSelectedQuantity(1);
    }

    resetItem();
  };

  const options = Array.from({ length: 20 }, (_, index) => index + 1)

  const addToFavourites = () => {
    const newItem = { id: Math.random(), name: name, image: image };
    const existingItemIndex = favourites.findIndex(item => item.name === name);

    if (existingItemIndex !== -1) {
      const updatedFavourites = [...favourites];
      const existingItem = updatedFavourites[existingItemIndex];

      if (existingItem) {
        updatedFavourites.splice(existingItemIndex, 1);
        setFavourites(updatedFavourites);
      }
    } else {
      setFavourites((prevFavourites) => [...prevFavourites, newItem]);
    }
  }

  const nameToCheck = name;
  const isFavourite = favourites.some(item => item.name === nameToCheck)

  return (
    <div className={`candle ${theme === "light" ? "light-bg" : "dark-toned-bg"}`}>
      <img className="candle-image" src={`${image}`} alt={`${t('the_picture_shows')} ${t(`${name}`)}`} />
      <span className={`candle-name ${theme === "light" ? "light-var-font" : "dark-var-font"}`}>{t(`${name}`)}</span>
      <div className="candle-selections">
        <div className="candle-selection">
          <span className={`candle-header ${theme === "light" ? "light-var-font" : "dark-var-font"}`}>{t('select_volume')}</span>
          <select className={`candle-select ${theme === "light" ? "light-var-outline light-var-border" : "dark-var-outline dark-var-border dark-toned-bg white-font"}`} value={selectedVolume} onChange={(e) => setSelectedVolume(e.target.value)}>
            <option value="130ml">130ml</option>
            <option value="250ml">250ml</option>
          </select>
        </div>
        <div className="candle-selection">
          <span className={`candle-header ${theme === "light" ? "light-var-font" : "dark-var-font"}`}>{t('select_color')}</span>
          <input className={`candle-color ${theme === "light" ? "light-var-outline light-var-border" : "dark-var-outline dark-var-border dark-toned-bg white-font"}`} type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
        </div>
        <div className="candle-selection">
          <span className={`candle-header ${theme === "light" ? "light-var-font" : "dark-var-font"}`}>{t('quantity')}</span>
          <select className={`candle-select ${theme === "light" ? "light-var-outline light-var-border" : "dark-var-outline dark-var-border dark-toned-bg white-font"}`} value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)}>
            {options.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      <span className={`candle-price ${theme === "light" ? "light-var-font" : "dark-var-font"}`}>{candlePrice.toFixed(2)}</span>
      <button className={`candle-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={addToCart}>{t('add_to_cart')}</button>
      <img src={isFavourite ? "red-heart.svg" : theme === "light" ? "/black-border-heart.svg" : "/white-border-heart.svg"} className="favourite-icon" onClick={() => addToFavourites()} />
    </div>
  )
}