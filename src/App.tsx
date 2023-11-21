import { Route, Routes } from 'react-router-dom'
import './App.css'
import { CandlesPage } from './pages/CandlesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CandlesPage />} />
    </Routes>
  )
}

export default App
