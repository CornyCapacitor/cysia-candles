import { Candles } from "../components/Candles"
import { Navbar } from "../components/Navbar"
import { Status } from "../components/Status"

export const CandlesPage = () => {
  return (
    <>
      <Status />
      <Navbar />
      <Candles />
    </>
  )
}