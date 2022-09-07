import Header from './components/Header';
import React, { useEffect, useState } from 'react';
import './style/Explore.css';
import './style/Header.css';
import './style/Profile.css';
import placeholder from './images/placeholder.png';
import chat from './images/content-card/chat.png';
import heart from './images/content-card/heart.png';
import reblog from './images/content-card/retweet.png';
import {
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  limit,
  collection,
  doc,
  getDocs,
  startAfter,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';
import { useParams } from 'react-router-dom';

const Profile = (props) => {
  const [userPosts, setUserPosts] = useState();
  const [lastPost, setLastPost] = useState();
  const { id } = useParams();

  // NEED TO MAKE THIS GET UID FROM URL
  const profileRef = doc(db, 'profiles', id);
  const postsRef = collection(profileRef, 'posts');

  useEffect(() => {
    querySnapshot();
  }, []);

  async function querySnapshot() {
    const q = query(postsRef, orderBy('time', 'desc'), limit(3));
    const allPosts = [];
    const result = await getDocs(q);

    const lastVisible = result.docs[result.docs.length - 1];

    result.forEach((doc) => {
      allPosts.push(doc.data());
      allPosts[allPosts.length - 1].id = doc.id;
    });
    setUserPosts(allPosts);
    setLastPost(lastVisible);
  }

  async function loadMorePosts() {
    const q = query(
      postsRef,
      orderBy('time', 'desc'),
      limit(3),
      startAfter(lastPost)
    );
    const allPosts = [...userPosts];
    const result = await getDocs(q);
    const lastVisible = result.docs[result.docs.length - 1];

    result.forEach((doc) => {
      allPosts.push(doc.data());
      allPosts[allPosts.length - 1].id = doc.id;
    });
    setUserPosts(allPosts);
    setLastPost(lastVisible);
  }

  const showNotes = (notes) => {
    if (notes === 0 || notes === undefined) {
      return `0 notes`;
    }
    if (notes === 1) {
      return `${notes} note`;
    }
    return `${notes} notes`;
  };

  const showComments = (event) => {
    const postID = event.target.id;
    const index = postID.indexOf('-');
    const ref = postID.slice(index + 1);
    console.log(event.target);
    const commentSection = document.getElementById(`comments-${ref}`);
    if (commentSection.style.display === 'flex') {
      commentSection.style.display = 'none';
    } else {
      commentSection.style.display = 'flex';
    }
  };

  const getUserName = () => getAuth().currentUser.displayName;
  const getPicture = () => getAuth().currentUser.photoURL;
  const getUID = () => getAuth().currentUser.uid;

  async function writeComment(event) {
    const postID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    const comment = document.getElementById(`input-${postID}`).value;
    const postsRef = doc(db, 'profiles', id, 'posts', postID);
    try {
      await addDoc(collection(postsRef, 'comments'), {
        name: getUserName(),
        photoURL: getPicture(),
        comment,
        uid: getUID(),
        time: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error);
    }
  }

  const showPosts = () => {
    let currentPosts = userPosts;
    console.log(getAuth().currentUser);
    if (currentPosts) {
      return (
        <div>
          {currentPosts.map((post, index) => (
            <div className="content-card" key={index} id={post.id}>
              <div className="content-card-header">
                <div className="content-card-header-profile-info">
                  <img
                    src={post.profilePictureURL}
                    alt=""
                    className="profile-picture"
                  />
                  <span>{post.name}</span>
                </div>
                <div className="content-card-header-profile-info-ellipsis">
                  <span>...</span>
                </div>
              </div>
              <div className="content-card-image-container">
                <img
                  src={post.photoURL}
                  alt=""
                  className="content-card-image"
                />
              </div>
              <div className="content-card-title">{post.title}</div>
              <div className="content-card-caption">{post.caption}</div>
              <div className="content-card-hashtags">{post.hashtags}</div>
              <div className="content-card-footer">
                <div className="content-card-notes">
                  {showNotes(post.notes)}{' '}
                </div>
                <div className="content-card-footer-icon-container">
                  <img
                    className="content-card-footer-icon"
                    alt="heart icon"
                    src={heart}
                  />
                  <img
                    className="content-card-footer-icon"
                    alt="reblog icon"
                    src={reblog}
                  />
                  <img
                    className="content-card-footer-icon"
                    alt="comments icon"
                    src={chat}
                    onClick={showComments}
                    id={`chat-${post.id}`}
                  />
                </div>
              </div>
              <div
                className="content-card-comment-section"
                id={`comments-${post.id}`}
              >
                <div className="content-card-comment">
                  <img
                    className="profile-picture"
                    src={getAuth().currentUser.photoURL}
                    alt=""
                  ></img>
                  <div className="content-card-comment-input-container">
                    <textarea
                      className="content-card-comment-input"
                      id={`input-${post.id}`}
                      type="text"
                      minLength="1"
                      maxLength="459"
                      placeholder="Leave a comment"
                      wrap="wrap"
                      rows="1"
                    ></textarea>
                    <button
                      className="content-card-comment-reply-button"
                      onClick={writeComment}
                    >
                      Reply
                    </button>
                  </div>
                </div>
                <div className="content-card-comment">
                  <img className="profile-picture" src="#"></img>
                  <div className="content-card-comment-caption">
                    Really short comment
                  </div>
                </div>
                <div className="content-card-comment">
                  <img className="profile-picture" src="#"></img>
                  <div className="content-card-comment-caption">
                    Really long comment goes here Really long comment goes here
                    Really long comment goes here Really long comment goes here
                  </div>
                </div>
                <div className="content-card-comment">
                  <img className="profile-picture" src="#"></img>
                  <div className="content-card-comment-caption">
                    Really long comment goes here Really long comment goes here
                    Really long comment goes here Really long comment goes here
                    Really long comment goes here Really long comment goes here
                    Really
                  </div>
                </div>
              </div>
            </div>
          ))}
          ;
        </div>
      );
    }
  };

  return (
    <div className="profile-page">
      <Header
        isLoggedIn={props.isLoggedIn}
        setIsLoggedIn={props.setIsLoggedIn}
        openModal={props.openModal}
        isLoading={props.isLoading}
        setIsLoading={props.setIsLoading}
      />
      <div className="profile-content">
        <div className="profile-card-column">{showPosts()}</div>
      </div>
      <div className="load-more-container">
        <button onClick={loadMorePosts} className="load-more-button">
          Load more
        </button>
      </div>
      {/* {initFirebaseAuth()} */}
    </div>
  );
};

export default Profile;
