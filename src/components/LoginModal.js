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
  fetchSignInMethodsForEmail,
} from 'firebase/auth';

const checkForClick = (event) => {
  if (event.target.matches('.login-modal-container')) closeModal();
};
const showEmailPrompt = () => {
  document.getElementById('emailPrompt').style.display = 'flex';
};

const closeModal = () => {
  document.getElementById('login-email-form').reset();
  document.getElementById('login-verify-password-form').reset();
  document.getElementById('login-set-password-form').reset();
  document.querySelector('.login-modal-container').style.display = 'none';
  document.getElementById('emailPrompt').style.display = 'none';
  document.getElementById('login-verify-password-form').style.display = 'none';
  document.getElementById('login-set-password-form').style.display = 'none';
};

const showTemporarily = (target, seconds) => {
  target.style.display = 'flex';
  setTimeout(() => {
    target.style.display = 'none';
  }, seconds * 1000);
};

const showPasswordSignIn = () => {
  document.getElementById('login-verify-password-form').style.display = 'flex';
};

const showPasswordCreation = () => {
  document.getElementById('login-set-password-form').style.display = 'flex';
};

const LoginModal = (props) => {
  const auth = getAuth();

  const determineAccountStatus = (event) => {
    event.preventDefault();
    const email = document.getElementById('email-input').value;
    const errorMessage = document.getElementById('email-error-message');
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        signInMethods.length ? showPasswordSignIn() : showPasswordCreation();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function authStateObserver(user) {
    console.log(user);
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

  const createAccount = (event) => {
    event.preventDefault();
    const emailAddress = document.getElementById('email-input').value;
    const password = document.getElementById('set-password-input').value;
    createUserWithEmailAndPassword(auth, emailAddress, password)
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.log(`Error code: ${error.code}`);
        console.log(error.message);
      });
    initFirebaseAuth();
  };

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
      {/* Modal 2 - Get email and password */}
      <div className="login-modal" id="emailPrompt">
        <div className="login-modal-header">
          <img src={fullLogo} alt="tumblr logo" className="login-modal-logo" />
        </div>
        <div className="login-content">
          <div>
            <form
              className="login-form"
              id="login-email-form"
              onSubmit={determineAccountStatus}
            >
              <label className="login-form-label" htmlFor="email-input">
                Enter your email:
              </label>
              <input
                type="email"
                className="email-prompt"
                id="email-input"
                autoComplete="off"
                required
              />
            </form>
            <form className="login-form" id="login-verify-password-form">
              <label
                htmlFor="verify-password-input"
                className="login-form-label"
              >
                Enter your password:
              </label>
              <input
                id="verify-password-input"
                type="password"
                className="password-prompt"
                autoComplete="off"
              />
            </form>
            <span className="login-error-message" id="password-error-message">
              Sorry, that email and password combination does not match.
            </span>
            <form
              className="login-form"
              id="login-set-password-form"
              onSubmit={createAccount}
            >
              <label htmlFor="set-password-input" className="login-form-label">
                Set a password:
              </label>
              <input
                id="set-password-input"
                type="password"
                className="password-prompt"
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </div>
      {initFirebaseAuth()}
    </div>
  );
};

export default LoginModal;
