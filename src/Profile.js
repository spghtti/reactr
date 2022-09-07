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

  function authStateObserver(user) {
    if (user) {
      console.log(`logged in as ${user.displayName}`);
      props.setIsLoggedIn(true);
    } else {
      props.setIsLoggedIn(false);
    }
  }

  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }

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

  const showPosts = () => {
    let currentPosts = userPosts;
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
                <div className="content-card-notes">XX notes</div>
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
                  />
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
