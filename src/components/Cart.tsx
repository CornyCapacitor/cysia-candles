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
        <div className="cart-header">
          <span className="width-100px">Select:</span>
          <span className="width-100px">Image:</span>
          <span className="width-150px">Name:</span>
          <span className="width-100px">Quantity:</span>
          <span className="width-100px">Volume:</span>
          <span className="width-100px">Color:</span>
          <span className="width-100px">Price:</span>
        </div>
        {cart.map((candle) => (
          <div className="cart-item">
            <input className="width-100px" type="checkbox" />
            <img className="cart-image width-100px" src={candle.image} />
            <div className="cart-name width-150px">{candle.name}</div>
            <div className="width-100px">{candle.quantity}</div>
            <div className="width-100px">{candle.volume}</div>
            <div className="cart-color width-100px"><span className="color" style={{ backgroundColor: `${candle.color}`, color: `${candle.color}` }}>{candle.color}</span></div>
            <div className="width-100px">
              {((candle.quantity ? candle.quantity : 0) * (candle.volume === '130ml' ? 15.00 : 25.00)).toFixed(2) as unknown as number}
            </div>
          </div>
        ))}
        <div className="total-price">
          <span>Total price:</span>
          <span>{totalPrice}</span>
        </div>
      </div>
    </div>
  )
}