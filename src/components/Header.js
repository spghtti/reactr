import smallLogo from '../images/small-logo.png';
import React from 'react';
import Navbar from './Navbar';
import LoginModal from './LoginModal';
import loading from '../images/loading.png';

const Header = (props) => {
  const showLoggedOutButtons = () => {
    return (
      <div className="sign-in-buttons">
        <button id="log-in-button" onClick={props.openModal}>
          Log in
        </button>
        <button id="sign-up-button" onClick={props.openModal}>
          Sign up
        </button>
      </div>
    );
  };

  return (
    <div className="Header">
      <div className="Header-container">
        <div className="Header-logo-container">
          <img className="Header-logo" src={smallLogo} alt="tumblr logo" />
        </div>
        <div className="Header-search-container">
          <input className="Header-search" type="text" placeholder="" />
        </div>
      </div>
      {props.isLoading ? (
        <div className="header-loading-icon-container">
          <img
            src={loading}
            alt="loading icon"
            className="header-loading-icon"
            id="header-loading-icon"
          />
        </div>
      ) : props.isLoggedIn ? (
        <Navbar />
      ) : (
        showLoggedOutButtons()
      )}
      <LoginModal
        setIsLoggedIn={props.setIsLoggedIn}
        isLoading={props.isLoading}
        setIsLoading={props.setIsLoading}
      />
    </div>
  );
};

export default Header;
