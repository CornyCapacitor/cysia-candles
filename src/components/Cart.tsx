import { useAtom } from 'jotai'
import { cartAtom } from '../atoms'
import './Cart.css'

export const Cart = () => {
  const [cart] = useAtom(cartAtom)

  return (
    <div className="cart-page">
      <div className="cart-display">
        <div className="cart-header">
          <span>Image:</span>
          <span>Name:</span>
          <span>Quantity:</span>
          <span>Total price:</span>
        </div>
        {cart.map((candle) => (
          <div className="cart-item">
            <input type="checkbox" />
            <img className="cart-image" src={candle.image} />
            <div className="cart-name">{candle.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}