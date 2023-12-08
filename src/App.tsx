import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AdminPage } from './pages/AdminPage'
import { CandlesPage } from './pages/CandlesPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactPage } from './pages/ContactPage'
import { CreatePage } from './pages/CreatePage'
import { EditPage } from './pages/EditPage'
import { FavouritesPage } from './pages/FavouritesPage'

function App() {


  return (
    <Routes>
      <Route path="/" element={<CandlesPage />} />
      <Route path="/favourites" element={<FavouritesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/:id" element={<EditPage />} />
      <Route path="/admin/create" element={<CreatePage />} />
    </Routes>
  )
}

export default App
