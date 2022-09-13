import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Explore from './Explore';
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
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="/"
          element={
            <Explore
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              openModal={openModal}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }
        />
        <Route
          path="/profile/:id"
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
