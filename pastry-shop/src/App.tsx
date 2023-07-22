import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import ShopWindowPage from './pages/ShopWindowPage';
import NavBar from './components/navigation/NavBar';
import ManagementPage from './pages/ManagementPage';
import LoginPage from './pages/LoginPage';
import NewUpdatePage from './pages/NewUpdatePage';
import { AuthContext } from './utils/context/authentication-context';
import { useAuthentication } from './utils/custom_hooks/authentication-hook';

function App() {
  const {token, login, logout } = useAuthentication();
  
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<ShopWindowPage />} />
          <Route path="/sales" element={<ManagementPage />} />
          <Route path="/sales/new" element={<NewUpdatePage />} />
          <Route path="/sales/:saleId" element={<NewUpdatePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
