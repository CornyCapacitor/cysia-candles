import { useAtom } from 'jotai';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cartCountAtom } from '../App';
import './Navbar.css';

export const Navbar = () => {
  const [saleTime] = useState<boolean>(false);
  const [favouriteCount] = useState<number>(0);
  const [cartCount] = useAtom(cartCountAtom)

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
            <img src="/public/candle.svg" className="logo-img" />
            <p className="logo-name">Cysia Candles</p>
          </div>
        </Link>
        <div className="shopping-status">
          <Link to="/favourites">
            <div className="shopping-status-container">
              <img className="shopping-status-icon" src="/heart.svg" />
              <span className="shopping-status-number redbg">{favouriteCount}</span>
            </div>
          </Link>
          <Link to="/cart">
            <div className="shopping-status-container">
              <img className="shopping-status-icon" src="/shopping-cart.svg" />
              <span className="shopping-status-number bluebg">{cartCount}</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="lower-section">
        <Link className="nav-button" to="/">
          Candles
        </Link>
        <Link className="nav-button" to="/candlecreator">
          Create your own candle
        </Link>
        <Link className="nav-button" to="/favourites">
          <img className="button-icon" src="/public/heart.svg" />
          <span>Favourites</span>
        </Link>
        <Link className="nav-button" to="/cart">
          <img className="button-icon" src="/public/shopping-cart.svg" />
          <span>Cart</span>
        </Link>
      </div>
    </nav>
  )
}