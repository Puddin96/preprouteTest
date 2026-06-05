import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/home/home.tsx'
import Login from './components/login/login.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
