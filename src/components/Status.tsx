import { useAtom } from "jotai"
import { Link } from "react-router-dom"
import { cartCountAtom, favouritesCountAtom, themeAtom } from "../atoms"
import '../theme.css'
import './Status.css'

export const Status = () => {

  const [favouriteCount] = useAtom(favouritesCountAtom)
  const [cartCount] = useAtom(cartCountAtom)
  const [theme] = useAtom(themeAtom)

  return (
    <div className={`shopping-status ${theme === "light" ? "light-bg" : "dark-toned-bg"}`}>
      <Link to="/favourites">
        <div className="shopping-status-container">
          <img className="shopping-status-icon" src={theme === "light" ? "black-border-heart.svg" : "white-border-heart.svg"} />
          <span className="shopping-status-number redbg">{favouriteCount}</span>
        </div>
      </Link>
      <Link to="/cart">
        <div className="shopping-status-container">
          <img className="shopping-status-icon" src={theme === "light" ? "black-shopping-cart.svg" : "white-shopping-cart.svg"} />
          <span className="shopping-status-number bluebg">{cartCount}</span>
        </div>
      </Link>
    </div>
  )
}