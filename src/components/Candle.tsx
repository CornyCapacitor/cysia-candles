import { useState } from 'react';
import './Candle.css';

type CandleProps = {
  image: string,
  name: string,
}

export const Candle = ({ image, name }: CandleProps) => {
  const [selectedVolume, setSelectedVolume] = useState<string>("130ml");
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");

  return (
    <div className="candle">
      <img className="candle-image" src={`/public/${image}`} alt={`Image of a ${name}`} />
      <span className="candle-name">{name}</span>
      <div className="candle-selections">
        <select className="candle-volume" value={selectedVolume} onChange={(e) => setSelectedVolume(e.target.value)}>
          <option value="130ml">130ml</option>
          <option value="250ml">250ml</option>
        </select>
        <input className="candle-color" type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
      </div>
      <span className="candle-price">{selectedVolume === "250ml" ? <>25.00zł</> : <>15.00zł</>}</span>
      <button className="candle-button">Add to cart</button>
      {/* {object.discounted ?
        <div className="candle-discount">{object.discounted_value}</div>
        :
        <></>
      } */}
    </div>
  )
}