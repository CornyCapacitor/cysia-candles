/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  const [saleTime] = useState<boolean>(false);

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
            <img src="candle.svg" className="logo-img" />
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
          <img className="button-icon" src="heart.svg" />
          <span>Favourites</span>
        </Link>
        <Link className="nav-button" to="/cart">
          <img className="button-icon" src="shopping-cart.svg" />
          <span>Cart</span>
        </Link>
      </div>
    </nav>
  )
}