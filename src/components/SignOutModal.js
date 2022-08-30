import React from 'react';

const closeSignOutModal = () => {
  document.body.style.overflowY = 'auto';
  document.querySelector('.sign-out-modal-container').style.display = 'none';
};

const checkForSignOutClick = (event) => {
  if (event.target.matches('.sign-out-modal-container')) closeSignOutModal();
};

const SignOutModal = (props) => {
  return (
    <div className="sign-out-modal-container" onClick={checkForSignOutClick}>
      <div className="sign-out-modal">
        <h2>Do you want to sign out?</h2>
        <div className="sign-out-buttons">
          <span onClick={props.signOutUser} id="sign-out-button">
            Yes, sign me out
          </span>
          <button onClick={closeSignOutModal} id="take-me-back-button">
            Take me back!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
