import { Route, Routes } from 'react-router-dom'
import './App.css'
import { CandlesPage } from './pages/CandlesPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactPage } from './pages/ContactPage'
import { FavouritesPage } from './pages/FavouritesPage'

function App() {


  return (
    <Routes>
      <Route path="/" element={<CandlesPage />} />
      <Route path="/favourites" element={<FavouritesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  )
}

export default App
