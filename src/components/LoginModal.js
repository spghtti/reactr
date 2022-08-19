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
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const showEmailPrompt = () => {
  document.getElementById('emailPrompt').style.display = 'flex';
};

const showPasswordPrompt = (event) => {
  event.preventDefault();
  document.getElementById('passwordPrompt').style.display = 'flex';
};

const closeModal = () => {
  document.querySelector('.login-modal-container').style.display = 'none';
  document.getElementById('emailPrompt').style.display = 'none';
  document.getElementById('passwordPrompt').style.display = 'none';
};

const checkForClick = (event) => {
  if (event.target.matches('.login-modal-container')) closeModal();
};

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

  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  return (
    <div className="login-modal-container" onClick={checkForClick}>
      {/* Modal 1 - Get login method */}
      <div className="login-modal">
        <div className="login-modal-header">
          <img src={fullLogo} alt="tumblr logo" className="login-modal-logo" />
        </div>
        <div className="login-content">
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
          <button className="login-modal-button" onClick={showEmailPrompt}>
            <img alt="" className="modal-button-icon" src={emailLogo} />
            Continue with email
          </button>
        </div>
      </div>
      {/* Modal 2 - Get email */}
      <div className="login-modal" id="emailPrompt">
        <div className="login-modal-header">
          <img src={fullLogo} alt="tumblr logo" className="login-modal-logo" />
        </div>
        <div className="login-content">
          <label className="login-prompt">Enter your email</label>
          <div>
            <form onSubmit={showPasswordPrompt}>
              <input
                type="email"
                className="email-prompt"
                id="email-input"
                autocomplete="off"
                required
              />
            </form>
          </div>
        </div>
      </div>
      {/* Modal 3 - Get password(s) */}
      <div className="login-modal" id="passwordPrompt">
        <div className="login-modal-header">
          <img src={fullLogo} alt="tumblr logo" className="login-modal-logo" />
        </div>
        <div className="login-content">
          <label for="password-input" className="login-prompt">
            Enter your password
          </label>
          <div>
            <input
              id="password-input"
              type="password"
              className="password-prompt"
              autocomplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
