/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../style/LoginModal.css';
import fullLogo from '../images/tumblr-logo-transparent.png';
import googleLogo from '../images/google-logo.png';
import emailLogo from '../images/email-black.png';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const LoginModal = (props) => {
  function authStateObserver(user) {
    console.log(user.displayName);
    if (user) {
      props.setIsLoggedIn(true);
    } else {
      props.setIsLoggedIn(false);
    }
  }

  async function signInWithGoogle() {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
    document.querySelector('.login-modal-container').style.display = 'none';
    console.log('SIGNING IN');
    initFirebaseAuth();
  }

  const closeModal = () => {
    document.querySelector('.login-modal-container').style.display = 'none';
  };

  const checkForClick = (event) => {
    if (event.target.matches('.login-modal-container')) closeModal();
  };

  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  return (
    <div className="login-modal-container" onClick={checkForClick}>
      <div className="login-modal">
        <img src={fullLogo} alt="tumblr logo" className="login-modal-header" />
        <p className="login-modal-subcopy">
          Welcome to your corner of the internet. You'll never be bored again.
        </p>
        <p className="modal-cta">Sign up or log in:</p>
        <p className="modal-disclaimer">
          By continuing, you agree to our <a href="#">Terms of Service</a> and
          have read our <a href="#">Privacy Policy</a>.
        </p>
        <button className="login-modal-button" onClick={signInWithGoogle}>
          <img src={googleLogo} alt="" className="modal-button-icon" />
          Continue with Google
        </button>
        <button className="login-modal-button">
          <img src={emailLogo} alt="" className="modal-button-icon" />
          Continue with email
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
