import { Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { CandleCreatePage } from './pages/CandleCreatePage'
import { CandleEditPage } from './pages/CandleEditPage'
import { CandlesPage } from './pages/CandlesPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactPage } from './pages/ContactPage'
import { DeliveryEditPage } from './pages/DeliveryEditPage'
import { FavouritesPage } from './pages/FavouritesPage'
import { PaymentEditPage } from './pages/PaymentEditPage'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CandlesPage />} />
      <Route path="/favourites" element={<FavouritesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/create" element={<CandleCreatePage />} />
      <Route path="/admin/candle/:candleId" element={<CandleEditPage />} />
      <Route path="/admin/delivery/:deliveryId" element={<DeliveryEditPage />} />
      <Route path="/admin/payment/:paymentId" element={<PaymentEditPage />} />
    </Routes>
  )
}

export default App
