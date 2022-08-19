import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import App from './App';
import Profile from './Profile';

const RouteSwitch = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openModal = () => {
    document.querySelector('.login-modal-container').style.display = 'flex';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              openModal={openModal}
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
