import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cartAtom, favouritesAtom } from '../atoms';
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
  const [favourites, setFavourites] = useAtom(favouritesAtom)

  const navigate = useNavigate();

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
      showCancelButton: true,
      cancelButtonText: "Continue shopping",
      showConfirmButton: true,
      confirmButtonText: "Cart",
      timer: 5000,
      customClass: {
        confirmButton: "confirm-button",
        cancelButton: "cancel-button",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/cart')
      }
    })

    const resetItem = () => {
      setSelectedVolume("130ml");
      setSelectedColor("#ffffff");
      setSelectedQuantity(1);
    }

    resetItem();
  };

  const options = Array.from({ length: 20 }, (_, index) => index + 1)

  const addToFavourites = () => {
    const newItem = { id: Math.random(), name: name, image: image };
    const existingItemIndex = favourites.findIndex(item => item.name === name);

    if (existingItemIndex !== -1) {
      const updatedFavourites = [...favourites];
      const existingItem = updatedFavourites[existingItemIndex];

      if (existingItem) {
        console.log(`Removing ${name} from favourites!`);
        updatedFavourites.splice(existingItemIndex, 1);
        setFavourites(updatedFavourites);
      }
    } else {
      setFavourites((prevFavourites) => [...prevFavourites, newItem]);
      console.log(`Adding ${name} to favourites!`)
    }
  }

  const nameToCheck = name;
  const isFavourite = favourites.some(item => item.name === nameToCheck)

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
      <img src={isFavourite ? "/public/red-heart.svg" : "/public/empty-heart.svg"} className="favourite-icon" onClick={() => addToFavourites()} />
    </div>
  )
}