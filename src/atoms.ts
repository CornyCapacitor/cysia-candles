import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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