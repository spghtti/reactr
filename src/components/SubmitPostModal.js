import React from 'react';
import '../style/SubmitPostModal.css';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  setDoc,
  collection,
  serverTimestamp,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

const clickOffModal = (event) => {
  document.body.style.overflowY = 'auto';
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

const getUID = () => {
  return getAuth().currentUser.uid;
};

const getUserName = () => {
  return getAuth().currentUser.displayName;
};

async function writePost(event) {
  event.preventDefault();
  const title = document.getElementById(
    'submit-post-modal-form-input-title'
  ).value;
  const url = document.getElementById(
    'submit-post-modal-form-input-link'
  ).value;
  const caption = document.getElementById(
    'submit-post-modal-form-input-caption'
  ).value;
  // const hashtags = document.getElementById('submit-post-modal-form-input-caption').value;
  const profileRef = doc(db, 'profiles', getUID());
  try {
    await addDoc(collection(profileRef, 'posts'), {
      name: getUserName(),
      title,
      url,
      caption,
      // hashtags,
      time: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error writing new message to Firebase Database', error);
  }
  closePostModal();
}

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
          ></textarea>
          <button onClick={closePostModal}>Close</button>
          <input type="submit" value="Post now" onClick={writePost} />
        </form>
      </div>
    </div>
  );
};

export default SubmitPostModal;
