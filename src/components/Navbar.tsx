/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cartAtom, favouritesAtom } from '../atoms';
import './Navbar.css';

export const Navbar = () => {
  const [saleTime] = useState<boolean>(false);

  const [cart, setCart] = useAtom(cartAtom)
  const [, setFavourites] = useAtom(favouritesAtom)

  const resetCart = () => {
    setCart([]);
  }

  const resetFavourites = () => {
    setFavourites([]);
  }

  const resetAtoms = () => {
    resetCart()
    resetFavourites()
  }

  return (
    <nav>
      {saleTime ?
        <div className="promotional-section">
          Black friday sale! Every candle -20%!
        </div>
        :
        <></>
      }
      <div className="upper-section">
        <Link to="/">
          <div className="logo">
            <img src="src/assets/candle.svg" className="logo-img" />
            <p className="logo-name">Cysia Candles</p>
          </div>
        </Link>
      </div>
      <div className="lower-section">
        <Link className="nav-button" to="/">
          Candles
        </Link>
        <Link className="nav-button" to="/ask">
          Ask us a question
        </Link>
        <Link className="nav-button" to="/favourites">
          <img className="button-icon" src="/public/heart.svg" />
          <span>Favourites</span>
        </Link>
        <Link className="nav-button" to="/cart">
          <img className="button-icon" src="/public/shopping-cart.svg" />
          <span>Cart</span>
        </Link>
        <div className="nav-button" onClick={resetCart}>Reset cart</div>
        <div className="nav-button" onClick={resetFavourites}>Clear favs</div>
        <div className="nav-button" onClick={resetAtoms}>Reset atoms</div>
        <div className="nav-button" onClick={() => console.log(cart)}>Console log cart</div>
      </div>
    </nav>
  )
}