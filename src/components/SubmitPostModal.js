import React from 'react';
import '../style/SubmitPostModal.css';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
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

const getProfPhoto = () => {
  return getAuth().currentUser.photoURL;
};

const getHashtags = (str) => {
  const splitString = str.split(' ');
  const newArr = [];
  splitString.forEach((word) => {
    if (word[0] !== '#') {
      newArr.push('#' + word);
    } else {
      newArr.push(word);
    }
  });
  return newArr;
};

async function createExploreRef(profileRef) {
  const postsRef = collection(profileRef, 'posts');
  const q = query(postsRef, orderBy('time', 'desc'), limit(1));
  const result = await getDocs(q);

  result.forEach((doc) => {
    console.log(doc.data());
  });
}

async function writePost(event) {
  event.preventDefault();
  const title = document.getElementById(
    'submit-post-modal-form-input-title'
  ).value;
  const photoURL = document.getElementById(
    'submit-post-modal-form-input-link'
  ).value;
  const caption = document.getElementById(
    'submit-post-modal-form-input-caption'
  ).value;
  const hashtags = getHashtags(
    document.getElementById('submit-post-modal-form-input-hashtags').value
  );

  const profileRef = doc(db, 'profiles', getUID());

  try {
    await addDoc(collection(profileRef, 'posts'), {
      name: getUserName(),
      title,
      photoURL,
      caption,
      hashtags,
      time: serverTimestamp(),
      profilePictureURL: getProfPhoto(),
      notes: 0,
    });
  } catch (error) {
    console.error('Error writing new message to Firebase Database', error);
  }
  createExploreRef(profileRef);
  closePostModal(event);
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
          <textarea
            placeholder="#hashtags"
            className="submit-post-modal-form-input"
            id="submit-post-modal-form-input-hashtags"
            wrap="wrap"
          ></textarea>
          <input
            type="submit"
            value="Post now"
            onClick={writePost}
            id="submit-post-button"
          />
          <button onClick={closePostModal} id="close-post-button">
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPostModal;
