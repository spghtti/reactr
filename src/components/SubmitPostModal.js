import React from 'react';
import '../style/SubmitPostModal.css';
import { getAuth } from 'firebase/auth';

const clickOffModal = (event) => {
  document.getElementById('submit-post-modal-form').reset();
  document.querySelector('.submit-post-modal-container').style.display = 'none';
};

const checkForClick = (event) => {
  if (event.target.matches('.submit-post-modal-container')) clickOffModal();
};

const closePostModal = (event) => {
  clickOffModal();
  if (event.target.parentElement.localName === 'form') {
    event.preventDefault();
  }
};
const SubmitPostModal = () => {
  const auth = getAuth();
  return (
    <div className="submit-post-modal-container" onClick={checkForClick}>
      <div className="submit-post-modal">
        <div className="submit-post-username">
          {auth.currentUser.displayName}
        </div>
        <form className="submit-post-modal-form" id="submit-post-modal-form">
          <input
            type="text"
            placeholder="Title"
            className="submit-post-modal-form-input"
            id="submit-post-modal-form-input-title"
          />
          <input
            type="url"
            placeholder="Image link"
            className="submit-post-modal-form-input"
            id="submit-post-modal-form-input-link"
          />
          <textarea
            placeholder="Go ahead, put anything"
            className="submit-post-modal-form-input"
            id="submit-post-modal-form-input-caption"
            wrap="wrap"
            reSize="none"
          ></textarea>
          <button onClick={closePostModal}>Close</button>
          <input type="submit" value="Post now" />
        </form>
      </div>
    </div>
  );
};

export default SubmitPostModal;
