import smallLogo from '../images/small-logo.png';
import React from 'react';
import Navbar from './Navbar';

const Header = (props) => {
  const showLoggedOutButtons = () => {
    return (
      <div className="sign-in-buttons">
        <button id="log-in-button" onClick={props.signIn}>
          Log in
        </button>
        <button id="sign-up-button">Sign up</button>
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
          {/* <span>
            <img src={searchIcon} alt="search icon" />
          </span> */}
        </div>
      </div>
      {props.isLoggedIn ? <Navbar /> : showLoggedOutButtons()}
    </div>
  );
};

export default Header;
