import './App.css'
import Dashboard from './Pages/Dashboard';
import LandingPage from './Pages/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  )
}

export default App;
