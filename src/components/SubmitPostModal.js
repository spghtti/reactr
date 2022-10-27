import React from 'react';
import '../style/SubmitPostModal.css';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  doc,
  updateDoc,
  Timestamp,
  getDocs,
  increment,
  query,
  orderBy,
  DocumentReference,
  limit,
  collection,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

const showTemporarily = (target, seconds) => {
  target.style.display = 'flex';
  setTimeout(() => {
    target.style.display = 'none';
  }, seconds * 1000);
};

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
  if (str.length === 0) return '';
  const splitString = str.split(' ');
  const newArr = [];
  splitString.forEach((word) => {
    if (word[0] === '#') {
      newArr.push(word.slice(1));
    } else {
      newArr.push(word);
    }
  });
  return newArr;
};

const calcTrendingScore = (notes, daysOld) => 3 * notes * (0.9 ^ daysOld);

const calculateDaysDifference = (firstDate, secondDate) => {
  const difference = secondDate - firstDate;
  return Math.ceil(Math.abs(difference / (1000 * 3600 * 24)));
};

async function updateHashtag(ref, data) {
  await updateDoc(ref, {
    time: serverTimestamp(),
    notes: increment(1),
    trendingScore: calcTrendingScore(
      data.notes,
      calculateDaysDifference(data.time.toMillis(), Timestamp.now().toMillis())
    ),
  });
}

async function writeHashtagsToTrending(hashtags) {
  for (let index in hashtags) {
    const q = query(
      collection(db, 'trending-hashtags'),
      where('hashtag', '==', hashtags[index])
    );
    const snap = await getDocs(q);

    if (snap.size > 0) {
      snap.forEach((document) => {
        const ref = new DocumentReference(document);
        const docID = ref.firestore._key.path.segments[6];
        const docRef = doc(db, 'trending-hashtags', docID);
        updateHashtag(docRef, document.data());
      });
    } else {
      await addDoc(collection(db, 'trending-hashtags'), {
        hashtag: hashtags[index],
        time: serverTimestamp(),
        notes: 1,
      });
    }
  }
}

async function pushToFeatured(path) {
  try {
    await addDoc(collection(db, 'featured'), {
      reference: doc(db, path),
      time: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error pushing featured post to Firebase Database', error);
  }
}

async function createExploreRef(profileRef) {
  const postsRef = collection(profileRef, 'posts');
  const q = query(postsRef, orderBy('time', 'desc'), limit(1));
  const result = await getDocs(q);
  result.forEach((doc) => {
    pushToFeatured(doc.ref.path);
  });
}

async function writePost(event) {
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
  writeHashtagsToTrending(hashtags);
  // UNCOMMENT THIS ONCE TRENDING HASHTAGS IS SOLVED
  // createExploreRef(profileRef);
  closePostModal(event);
}

const handleSubmit = (event) => {
  event.preventDefault();

  const caption = document.getElementById(
    'submit-post-modal-form-input-caption'
  ).value;
  const title = document.getElementById(
    'submit-post-modal-form-input-title'
  ).value;
  const photoURL = document.getElementById(
    'submit-post-modal-form-input-link'
  ).value;
  const error = document.getElementById('submit-post-error');

  if (caption.length === 0 && title.length === 0 && photoURL.length === 0) {
    showTemporarily(error, 3);
  } else {
    writePost(event);
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
            minLength="2"
            wrap="wrap"
          ></textarea>
          <textarea
            placeholder="#hashtags"
            className="submit-post-modal-form-input"
            id="submit-post-modal-form-input-hashtags"
            wrap="wrap"
          ></textarea>
          <div id="submit-post-error">
            You must include a title, image, or caption
          </div>
          <input
            type="submit"
            value="Post now"
            onClick={handleSubmit}
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
