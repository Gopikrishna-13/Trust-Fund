import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './components/Login';
import LandingPage from './components/LandingPage';
import ImpactDetail from './components/ImpactDetail';
import PaymentPage from './components/PaymentPage';
// 1. Import the new component
import AddCampaign from './components/AddCampaign';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/impact/:id" element={<ImpactDetail />} />
        <Route path="/checkout/:id" element={<PaymentPage />} />

        {/* 2. Add the new route right here! */}
        <Route path="/add-campaign" element={<AddCampaign />} />
      </Routes>
    </Router>
  );
}

export default App;