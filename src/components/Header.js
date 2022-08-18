import smallLogo from '../images/small-logo.png';
import React from 'react';
import Navbar from './Navbar';
import LoginModal from './LoginModal';

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
        <div class="Header-search-container">
          <input class="Header-search" type="text" placeholder="" />
        </div>
      </div>
      {props.isLoggedIn ? <Navbar /> : showLoggedOutButtons()}
      <LoginModal setIsLoggedIn={props.setIsLoggedIn} />
    </div>
  );
};

export default Header;
