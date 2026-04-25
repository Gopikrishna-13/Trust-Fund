import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './components/Login';
import LandingPage from './components/LandingPage';
import ImpactDetail from './components/ImpactDetail';
import PaymentPage from './components/PaymentPage';
import AddCampaign from './components/AddCampaign';
import DonorDashboard from './components/DonorDashboard';
import ManagerDashboard from './components/ManagerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/impact/:id" element={<ImpactDetail />} />
        <Route path="/checkout/:id" element={<PaymentPage />} />
        <Route path="/add-campaign" element={<AddCampaign />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;