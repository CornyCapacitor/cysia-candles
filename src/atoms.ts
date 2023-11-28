import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Item = {
  id: number,
  name: string,
  image: string,
  volume?: string,
  color?: string,
  quantity?: number,
}

export const cartAtom = atomWithStorage<Item[]>('cart', [])

export const cartCountAtom = atom((get) => {
  const cart = get(cartAtom);
  const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 0), 0)
  return totalQuantity
})

export const favouritesAtom = atomWithStorage<Item[]>('favourites', [])

export const favouritesCountAtom = atom((get) => {
  const favourites = get(favouritesAtom);
  return favourites.length
})