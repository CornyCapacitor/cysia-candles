import { useAtom } from 'jotai';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { cartAtom } from '../atoms';
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

  const options = Array.from({ length: 20 }, (_, index) => index + 1)

  return (
    <div className="candle">
      <img className="candle-image" src={`${image}`} alt={`Image of a ${name}`} />
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
          <select className="candle-select" value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)}>
            {options.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      <span className="candle-price">{candlePrice.toFixed(2)}</span>
      <button className="candle-button" onClick={addToCart}>Add to cart</button>
    </div>
  )
}