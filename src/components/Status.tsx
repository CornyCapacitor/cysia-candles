import { useAtom } from "jotai"
import { Link } from "react-router-dom"
import { cartCountAtom, favouritesCountAtom } from "../atoms"

export const Status = () => {

  const [favouriteCount] = useAtom(favouritesCountAtom)
  const [cartCount] = useAtom(cartCountAtom)

  return (
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
  )
}