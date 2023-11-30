import { useAtom } from 'jotai'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cartAtom, themeAtom } from '../atoms'
import '../theme.css'
import './Cart.css'

export const Cart = () => {
  const [cart, setCart] = useAtom(cartAtom)
  const [selected, setSelected] = useState<number[]>([]);
  const [theme] = useAtom(themeAtom);

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

  const removeItems = () => {
    setCart((p) => p.filter((candle) => !selected.includes(candle.id)))
    setSelected([]);
  };

  return (
    <div className={`cart-page ${theme === "light" ? "light-toned-bg" : "dark-bg"}`}>
      <div className={`cart-display ${theme === "light" ? "light-bg" : "dark-toned-bg"}`}>
        {cart.length > 0 ?
          <>
            <div className={`cart-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>
              <span className="cart-width-medium">Select:</span>
              <span className="cart-width-medium">Image:</span>
              <span className="cart-width-large">Name:</span>
              <span className="cart-width-medium">Quantity:</span>
              <span className="cart-width-medium">Volume:</span>
              <span className="cart-width-medium">Color:</span>
              <span className="cart-width-medium">Price:</span>
            </div>
            {cart.map((candle) => (
              <div className={`cart-item ${theme === "light" ? "black-font" : "white-font"}`} key={candle.id}>
                <div className="cart-width-medium">
                  <input className={`cart-select ${theme === "light" ? "light-var-shadow" : "dark-var-shadow"}`} type="checkbox" onChange={() => selectItem(candle.id)} />
                </div>
                <img className="cart-image cart-width-medium" src={candle.image} />
                <div className="cart-name cart-width-large">{candle.name}</div>
                <div className="cart-width-medium">{candle.quantity}</div>
                <div className="cart-width-medium">{candle.volume}</div>
                <div className="cart-candle-container cart-width-medium">
                  <img className="cart-candle-image" src={theme === "light" ? "/public/cart-candle.svg" : "/public/gray-cart-candle.svg"} />
                  <div className="cart-candle-color" style={{ backgroundColor: `${candle.color}`, color: `${candle.color}` }}>{candle.color}</div>
                </div>
                <div className="cart-width-medium">
                  {((candle.quantity ? candle.quantity : 0) * (candle.volume === '130ml' ? 15.00 : 25.00)).toFixed(2) as unknown as number}
                </div>
              </div>
            ))}
            <div className="bottom-section">
              <div className="bottom-upper-section">
                {selected.length > 0 ?
                  <button className={`cart-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => removeItems()}>Delete selected items</button>
                  : <span></span>}
                <div className={`total-price ${theme === "light" ? "black-font" : "white-font"}`}>
                  <span>Total price:</span>
                  <span>{totalPrice}</span>
                </div>
              </div>
              <div className="bottom-lower-section">
                <Link to="/checkout">
                  <button className={`cart-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Checkout</button>
                </Link>
              </div>
            </div>
          </> : <>Cart is empty</>}
      </div>
    </div>
  )
}