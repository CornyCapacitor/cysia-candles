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
            <div className="cart-name">Name: {candle.name}</div>
            <div>Quantity: {candle.quantity}</div>
            <div>Volume: {candle.volume}</div>
            <span>Color:</span>
            <div style={{ color: `${candle.color}` }}>{candle.color}</div>
          </div>
        ))}
      </div>
    </div>
  )
}