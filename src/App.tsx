/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { CandlesPage } from './pages/CandlesPage'

type Item = {
  name: string,
  image: string,
  volume?: string,
  color?: string,
}

export const cartAtom = atomWithStorage<Item[]>('cart', [])

export const cartCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.length
})

export const favouritesAtom = atomWithStorage<Item[]>('favourites', [])

export const favouritesCountAtom = atom((get) => {
  const favourites = get(favouritesAtom);
  return favourites.length
})

function App() {


  return (
    <Routes>
      <Route path="/" element={<CandlesPage />} />
    </Routes>
  )
}

export default App
