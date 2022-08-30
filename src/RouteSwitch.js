import { HashRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import App from './App';
import Profile from './Profile';

const RouteSwitch = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => {
    document.body.style.overflowY = 'hidden';
    document.querySelector('.login-modal-container').style.display = 'flex';
    document.getElementById('initial-login-modal').style.display = 'flex';
  };

  return (
    <HashRouter basename="/">
      <Routes>
        <Route
          path="/"
          element={
            <App
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              openModal={openModal}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              openModal={openModal}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default RouteSwitch;
