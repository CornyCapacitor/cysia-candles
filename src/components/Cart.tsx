import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { cartAtom, themeAtom } from '../atoms'

import '../config/i18n'
import '../theme.css'
import './Cart.css'

export const Cart = () => {
  const [cart, setCart] = useAtom(cartAtom)
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);
  const [theme] = useAtom(themeAtom);

  const { t } = useTranslation();

  const totalPrice = cart.reduce((sum, candle) => {
    const quantity = candle.quantity || 0;
    return sum + quantity * (candle.volume === "130ml" ? 15.00 : 25.00);
  }, 0).toFixed(2);

  const selectItem = (index: number) => {
    if (!selected.includes(index)) {
      setSelected((p) => [...p, index])
    } else if (selected.includes(index)) {
      setSelected((p) => p.filter(item => item !== index))
    }
  }

  const selectAll = () => {
    if (!selectedAll) {
      const allIds = cart.map(item => item.id)
      setSelected(allIds)
      setSelectedAll(true);
    } else if (selectedAll) {
      setSelected([])
      setSelectedAll(false);
    }
  }

  const isCandleSelected = (id: number) => {
    return selected.includes(id);
  }

  const removeItems = () => {
    setCart((p) => p.filter((candle) => !selected.includes(candle.id)))
    setSelected([]);
  };

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  return (
    <div className={`cart-page ${theme === "light" ? "light-toned-bg" : "dark-bg"}`}>
      <div className={`cart-display ${theme === "light" ? "light-bg" : "dark-toned-bg"}`}>
        {cart.length > 0 ?
          <>
            <div className={`cart-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>
              <span className="cart-width-medium">{t('select')}:</span>
              <span className="cart-width-medium">{t('image')}:</span>
              <span className="cart-width-large">{t('name')}:</span>
              <span className="cart-width-medium">{t('cart_quantity')}:</span>
              <span className="cart-width-medium">{t('volume')}:</span>
              <span className="cart-width-medium">{t('color')}:</span>
              <span className="cart-width-medium">{t('price')}:</span>
            </div>
            {cart.map((candle) => (
              <div className={`cart-item ${theme === "light" ? "black-font" : "white-font"}`} key={candle.id}>
                <div className="cart-width-medium">
                  <input className={`cart-select ${theme === "light" ? "light-var-shadow" : "dark-var-shadow"}`} type="checkbox" onChange={() => selectItem(candle.id)} checked={isCandleSelected(candle.id)} />
                </div>
                <img className="cart-image cart-width-medium" src={candle.image} />
                <div className="cart-name cart-width-large">{t(`${candle.name}`)}</div>
                <div className="cart-width-medium">{candle.quantity}</div>
                <div className="cart-width-medium">{candle.volume}</div>
                <div className="cart-candle-container cart-width-medium">
                  <img className="cart-candle-image" src={theme === "light" ? "/cart-candle.svg" : "/gray-cart-candle.svg"} />
                  <div className="cart-candle-color" style={{ backgroundColor: `${candle.color}`, color: `${candle.color}` }}>{candle.color}</div>
                </div>
                <div className="cart-width-medium">
                  {((candle.quantity ? candle.quantity : 0) * (candle.volume === '130ml' ? 15.00 : 25.00)).toFixed(2) as unknown as number}
                </div>
              </div>
            ))}
            <div className="bottom-section">
              <div className="bottom-upper-section">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {cart.length > 1 ?
                    <button className={`cart-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => selectAll()}>{selectedAll ? <>{t('unselect_all')}</> : <>{t('select_all')}</>}</button>
                    : <></>}
                  {selected.length > 0 ?
                    <button className={`cart-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => removeItems()}>{t('delete_selected_items')}</button>
                    : <span></span>}
                </div>
                <div className={`total-price ${theme === "light" ? "black-font" : "white-font"}`}>
                  <span>{t('total_price')}:</span>
                  <span>{totalPrice}</span>
                </div>
              </div>
              <div className="bottom-lower-section">
                <Link to="/checkout">
                  <button className={`cart-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('checkout')}</button>
                </Link>
              </div>
            </div>
          </> : <span className={theme === "light" ? "black-font" : "white-font"}>{t('cart_is_empty')}</span>}
      </div>
    </div>
  )
}