import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import App from './App';
import Profile from './Profile';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const RouteSwitch = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function authStateObserver(user) {
    if (user) {
      setIsLoggedIn(true);
    } else {
    }
  }

  async function signIn() {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  function signOutUser() {
    signOut(getAuth());
  }

  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              signIn={signIn}
              initFirebaseAuth={initFirebaseAuth}
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
