import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/auth-page/index'
import DashboardPage from './pages/dashboard-page/index'
import NewBookingPage from './pages/new-booking-page/index'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bookings/new" element={<NewBookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
