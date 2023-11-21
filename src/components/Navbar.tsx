import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  const [saleTime] = useState<boolean>(false);
  const [favouriteCount] = useState<number>(0);
  const [cartCount] = useState<number>(0);

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
        <div className="search-product">
          <input className="searchbar" type="textbox" placeholder="Search products..." />
          <img className="search-button" src="/public/magnifier.svg" />
        </div>
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
      </div>
    </nav>
  )
}