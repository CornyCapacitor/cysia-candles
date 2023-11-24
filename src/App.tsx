/* eslint-disable react-refresh/only-export-components */
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { CandlesPage } from './pages/CandlesPage'

type Cart = {
  name: string,
  image: string,
  volume: string,
  color: string,
}

export const cartAtom = atomWithStorage<Cart[]>('cart', [])

export const cartCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.length
})

function App() {


  return (
    <Routes>
      <Route path="/" element={<CandlesPage />} />
    </Routes>
  )
}

export default App
