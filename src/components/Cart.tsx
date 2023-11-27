import { useAtom } from 'jotai'
import { cartAtom } from '../atoms'
import './Cart.css'

export const Cart = () => {
  const [cart] = useAtom(cartAtom)

  const totalPrice = cart.reduce((sum, candle) => {
    const quantity = candle.quantity || 0;
    return sum + quantity * (candle.volume === "130ml" ? 15.00 : 25.00);
  }, 0).toFixed(2);

  return (
    <div className="cart-page">
      <div className="cart-display">
        {cart.length > 0 ?
          <>
            <div className="cart-header">
              <span className="cart-width-medium">Select:</span>
              <span className="cart-width-medium">Image:</span>
              <span className="cart-width-large">Name:</span>
              <span className="cart-width-medium">Quantity:</span>
              <span className="cart-width-medium">Volume:</span>
              <span className="cart-width-medium">Color:</span>
              <span className="cart-width-medium">Price:</span>
            </div>
            {cart.map((candle) => (
              <div className="cart-item">
                <div className="cart-width-medium">
                  <input className="cart-select" type="checkbox" />
                </div>
                <img className="cart-image cart-width-medium" src={candle.image} />
                <div className="cart-name cart-width-large">{candle.name}</div>
                <div className="cart-width-medium">{candle.quantity}</div>
                <div className="cart-width-medium">{candle.volume}</div>
                <div className="cart-candle-container">
                  <img className="cart-candle-image" src="cart-candle.svg" />
                  <div className="cart-candle-color" style={{ backgroundColor: `${candle.color}`, color: `${candle.color}` }}>{candle.color}</div>
                </div>
                <div className="cart-width-medium">
                  {((candle.quantity ? candle.quantity : 0) * (candle.volume === '130ml' ? 15.00 : 25.00)).toFixed(2) as unknown as number}
                </div>
              </div>
            ))}
            <div className="total-price">
              <span>Total price:</span>
              <span>{totalPrice}</span>
            </div>

          </> : <>Cart is empty</>}
      </div>
    </div>
  )
}