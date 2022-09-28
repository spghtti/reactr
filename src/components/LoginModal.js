/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../style/LoginModal.css';
import fullLogo from '../images/tumblr-logo-transparent.png';
import googleLogo from '../images/google-logo.png';
import arrow from '../images/arrow-right.png';
import emailLogo from '../images/email-black.png';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
} from 'firebase/auth';

const checkForClick = (event) => {
  if (event.target.matches('.login-modal-container')) closeModal();
};
const showEmailPrompt = () => {
  document.getElementById('emailPrompt').style.display = 'flex';
  document.getElementById('initial-login-modal').style.display = 'none';
};

const closeModal = () => {
  document.body.style.overflowY = 'auto';
  document.getElementById('login-email-form').reset();
  document.getElementById('login-verify-password-form').reset();
  document.getElementById('login-set-password-form').reset();
  document.querySelector('.login-modal-container').style.display = 'none';
  document.getElementById('emailPrompt').style.display = 'none';
  document.getElementById('login-verify-password-form').style.display = 'none';
  document.getElementById('login-set-password-form').style.display = 'none';
  document.getElementById('email-input').disabled = '';
};

const showTemporarily = (target, seconds) => {
  target.style.display = 'flex';
  setTimeout(() => {
    target.style.display = 'none';
  }, seconds * 1000);
};

const showPasswordSignIn = () => {
  document.body.style.overflowY = 'hidden';
  document.getElementById('email-input').disabled = 'disabled';
  document.getElementById('login-verify-password-form').style.display = 'flex';
};

const showPasswordCreation = () => {
  document.getElementById('email-input').disabled = 'disabled';
  document.getElementById('login-set-password-form').style.display = 'flex';
};

const LoginModal = (props) => {
  const auth = getAuth();

  const determineAccountStatus = (event) => {
    event.preventDefault();
    const email = document.getElementById('email-input').value;
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        if (signInMethods[0] === 'google.com') {
          signInWithGoogle();
        } else if (signInMethods[0] === 'password') {
          showPasswordSignIn();
        } else if (signInMethods.length === 0) {
          showPasswordCreation();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showLoadingIcon = () => {
    props.setIsLoading(true);
  };

  const hideLoadingIcon = () => {
    props.setIsLoading(false);
  };

  function authStateObserver(user) {
    showLoadingIcon();
    if (user) {
      props.setIsLoggedIn(true);
      hideLoadingIcon();
    } else {
      props.setIsLoggedIn(false);
      hideLoadingIcon();
    }
  }

  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  async function signInWithGoogle() {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
    document.querySelector('.login-modal-container').style.display = 'none';
  }

  const isValidHttpUrl = (string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  };

  const createAccount = (event) => {
    event.preventDefault();
    const emailAddress = document.getElementById('email-input').value;
    const userName = document.getElementById('set-username-input').value;
    let profilePicture = document.getElementById('set-pfp-input').value;

    if (!isValidHttpUrl(profilePicture)) {
      profilePicture =
        'https://thumbs.dreamstime.com/t/default-male-avatar-profile-picture-icon-grey-man-photo-placeholder-vector-illustration-88414414.jpg';
    }
    const password = document.getElementById('set-password-input').value;
    createUserWithEmailAndPassword(auth, emailAddress, password)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: userName,
          photoURL: profilePicture,
        });
        closeModal();
      })
      .catch((error) => {
        const msg = document.getElementById('password-set-error-message');
        msg.innerText = error.message;
        showTemporarily(msg, 4);
      });
  };

  const login = (event) => {
    event.preventDefault();
    const emailAddress = document.getElementById('email-input').value;
    const password = document.getElementById('verify-password-input').value;
    signInWithEmailAndPassword(auth, emailAddress, password)
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        const msg = document.getElementById('password-login-error-message');
        msg.innerText = error.message;
        showTemporarily(msg, 4);
      });
  };

  return (
    <div
      className="login-modal-container"
      id="login-modal-container"
      onClick={checkForClick}
    >
      {/* Modal 1 - Get login method */}
      <div className="login-modal" id="initial-login-modal">
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
            <form
              className="login-form"
              id="login-verify-password-form"
              onSubmit={login}
            >
              <label
                htmlFor="verify-password-input"
                className="login-form-label"
              >
                Enter your password:
              </label>
              <input
                id="verify-password-input"
                name="verify-password-input"
                type="password"
                className="password-prompt"
                autoComplete="off"
              />
              <span
                className="login-error-message"
                id="password-login-error-message"
              ></span>
              <button
                type="submit"
                value="Submit"
                className="login-modal-submit-button"
              >
                <img src={arrow} alt="submit" />
              </button>
            </form>

            <form
              className="login-form"
              id="login-set-password-form"
              onSubmit={createAccount}
            >
              <label htmlFor="set-username-input" className="login-form-label">
                Choose a username:
              </label>
              <input
                id="set-username-input"
                name="set-username-input"
                type="text"
                className="username-prompt"
                autoComplete="off"
                required
                minLength="4"
                maxLength="20"
              />
              <label htmlFor="set-pfp-input" className="login-form-label">
                Profile picture URL:
              </label>
              <input
                id="set-pfp-input"
                name="set-pfp-input"
                type="url"
                className="pfp-prompt"
                autoComplete="off"
                minLength="5"
              />
              <label htmlFor="set-password-input" className="login-form-label">
                Set a password:
              </label>
              <input
                id="set-password-input"
                name="set-password-input"
                type="password"
                className="password-prompt"
                autoComplete="off"
                required
              />
              <span
                className="login-error-message"
                id="password-set-error-message"
              ></span>
              <button
                type="submit"
                value="Submit"
                className="login-modal-submit-button"
              >
                <img src={arrow} alt="submit" />
              </button>
            </form>
          </div>
        </div>
      </div>
      {initFirebaseAuth()}
    </div>
  );
};

export default LoginModal;
