import { useAtom } from 'jotai';
import { useState } from 'react';
import { cartAtom } from '../App';
import './Candle.css';

type CandleProps = {
  image: string,
  name: string,
}

export const Candle = ({ image, name }: CandleProps) => {
  const [selectedVolume, setSelectedVolume] = useState<string>("130ml");
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [cart, setCart] = useAtom(cartAtom)

  const addToCart = () => {
    const newItem = { name: name, image: image, volume: selectedVolume, color: selectedColor }
    setCart((prevCart) => [...prevCart, newItem])
  }

  return (
    <div className="candle">
      <img className="candle-image" src={`/public/${image}`} alt={`Image of a ${name}`} />
      <span className="candle-name">{name}</span>
      <div className="candle-selections">
        <div className="candle-selection">
          <span className="candle-header">Select volume:</span>
          <select className="candle-volume" value={selectedVolume} onChange={(e) => setSelectedVolume(e.target.value)}>
            <option value="130ml">130ml</option>
            <option value="250ml">250ml</option>
          </select>
        </div>
        <div className="candle-selection">
          <span className="candle-header">Select color:</span>
          <input className="candle-color" type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
        </div>
      </div>
      <span className="candle-price">{selectedVolume === "250ml" ? <>25.00zł</> : <>15.00zł</>}</span>
      <button className="candle-button" onClick={addToCart}>Add to cart</button>
    </div>
  )
}