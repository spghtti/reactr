import smallLogo from '../images/small-logo.png';
import React from 'react';
import Navbar from './Navbar';
import LoginModal from './LoginModal';
import loading from '../images/loading.png';
import { Link } from 'react-router-dom';

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
        <Link to="/" style={{ display: 'flex' }}>
          <div className="Header-logo-container">
            <img className="Header-logo" src={smallLogo} alt="tumblr logo" />
          </div>
        </Link>
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
