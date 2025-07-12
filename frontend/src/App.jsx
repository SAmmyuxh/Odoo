import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/DashBoard';
import SwapForm from './components/SwapForm';
import UserList from './components/UserList';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Navbar from './components/Navbar'; // ✅ Import your Navbar

const AppRoutes = () => {
  const location = useLocation();

  // Hide navbar on login/register
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
     <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/swaps/new" element={<SwapForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
