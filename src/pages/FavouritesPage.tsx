import { Favourites } from "../components/Favourites"
import { Navbar } from "../components/Navbar"
import { Status } from "../components/Status"

export const FavouritesPage = () => {
  return (
    <>
      <Status />
      <Navbar />
      <Favourites />
    </>
  )
}