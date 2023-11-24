import { useAtom } from 'jotai';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { cartAtom, favouritesAtom } from '../App';
import './Candle.css';

type CandleProps = {
  image: string,
  name: string,
}

export const Candle = ({ image, name }: CandleProps) => {
  const [selectedVolume, setSelectedVolume] = useState<string>("130ml");
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [selectedQuantity, setSelectedQuantity] = useState<string | number>(1);
  const [, setCart] = useAtom(cartAtom)
  const [, setFavourites] = useAtom(favouritesAtom)

  const addToCart = () => {
    const newItem = { name: name, image: image, volume: selectedVolume, color: selectedColor };
    const itemsToAdd = Array.from({ length: Number(selectedQuantity) }, () => newItem).flat();
    setCart((prevCart) => [...prevCart, ...itemsToAdd]);

    Swal.fire({
      icon: 'success',
      title: `You've added ${selectedQuantity} ${name} candle(s) to cart!`,
      showConfirmButton: false,
      timer: 2000,
    })

    const resetItem = () => {
      setSelectedVolume("130ml");
      setSelectedColor("#ffffff");
      setSelectedQuantity(1);
    }

    resetItem();
  };

  const setFavourite = () => {
    const newFavourite = { name: name, image: image }
    setFavourites((prevFavourites) => [...prevFavourites, newFavourite])
  }

  const options = Array.from({ length: 20 }, (_, index) => index + 1)

  return (
    <div className="candle">
      <img className="candle-image" src={`/public/${image}`} alt={`Image of a ${name}`} />
      <span className="candle-name">{name}</span>
      <div className="candle-selections">
        <div className="candle-selection">
          <span className="candle-header">Select volume:</span>
          <select className="candle-select" value={selectedVolume} onChange={(e) => setSelectedVolume(e.target.value)}>
            <option value="130ml">130ml</option>
            <option value="250ml">250ml</option>
          </select>
        </div>
        <div className="candle-selection">
          <span className="candle-header">Select color:</span>
          <input className="candle-color" type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
        </div>
        <div className="candle-selection">
          <span className="candle-header">Quantity:</span>
          <select className="candle-select" onChange={(e) => setSelectedQuantity(e.target.value)}>
            {options.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      <span className="candle-price">{selectedVolume === "250ml" ? <>25.00zł</> : <>15.00zł</>}</span>
      <button className="candle-button" onClick={addToCart}>Add to cart</button>
      <img onClick={setFavourite} className="favourite-icon" src="/public/heart.svg" />
    </div>
  )
}