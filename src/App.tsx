import { Route, Routes } from 'react-router-dom'
import './App.css'
import { CandlesPage } from './pages/CandlesPage'
import { CartPage } from './pages/CartPage'

function App() {


  return (
    <Routes>
      <Route path="/" element={<CandlesPage />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  )
}

export default App
