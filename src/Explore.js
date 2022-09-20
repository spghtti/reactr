import './style/Explore.css';
import './style/Header.css';
import './style/Profile.css';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import placeholderSmall from './images/placeholder-small.jpg';
import { db } from './firebase';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  limit,
  query,
  orderBy,
} from 'firebase/firestore';

async function fetchTrendingHashtags() {
  const docRef = collection(db, 'trending-hashtags');
  const docs = await getDocs(docRef);
  docs.forEach((doc) => {
    console.log(doc.data());
  });
}

const randomBackgroundColor = () => {
  const colors = [
    'rgb(232, 215, 56)',
    'rgb(255, 138, 0)',
    'rgb(255, 73, 48)',
    'rgb(124, 92, 255)',
  ];
};

const updateTrendingHashtags = () => {};

// fetchTrendingHashtags();

function Explore(props) {
  const [userPosts, setUserPosts] = useState();
  const [lastPost, setLastPost] = useState();
  const [comments, setComments] = useState();
  const [lastComment, setLastComment] = useState();

  const allPosts = [];

  useEffect(() => {
    querySnapshot();
  }, []);

  // useEffect(() => {
  //   addLikes();
  // }, [userPosts]);

  // const profileRef = doc(db, 'profiles', id);
  const featuredRef = collection(db, 'featured');

  async function getFeaturedPost(UID, postID) {
    const docRef = doc(db, 'profiles', UID, 'posts', postID);
    const result = await getDoc(docRef);
    allPosts.push(result.data());
  }

  async function querySnapshot() {
    // const q = query(featuredRef, orderBy('time', 'desc'), limit(10));
    const q = query(featuredRef);
    const results = await getDocs(q);
    const lastVisible = results.docs[results.docs.length - 1];

    results.forEach((doc) => {
      const UID = doc.data().reference._key.path.segments[6];
      const postID = doc.data().reference._key.path.segments[8];
      console.log(`${UID}, ${postID}`);
      getFeaturedPost(UID, postID);
    });
    setUserPosts(allPosts);
    console.log(allPosts);
    setLastPost(lastVisible);
  }

  return (
    <div className="Explore">
      <header className="Explore-header">
        <Header
          isLoggedIn={props.isLoggedIn}
          setIsLoggedIn={props.setIsLoggedIn}
          openModal={props.openModal}
          isLoading={props.isLoading}
          setIsLoading={props.setIsLoading}
        />
      </header>
      <div className="Explore-content">
        <div className="Explore-cards-container">
          <h2 className="Explore-trending-title">Trending 🚀</h2>
          <div className="Explore-trending-cards">
            <div className="Explore-trend-card" id="hashtag-trend-one">
              <div className="Explore-trend-hashtag-info">
                <div
                  className="Explore-trend-hashtag-number"
                  id="hashtag-trend-one-number"
                >
                  1
                </div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
            </div>
            <div className="Explore-trend-card" id="hashtag-trend-two">
              <div className="Explore-trend-hashtag-info">
                <div
                  className="Explore-trend-hashtag-number"
                  id="hashtag-trend-two-number"
                >
                  2
                </div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
            </div>
            <div className="Explore-trend-card" id="hashtag-trend-three">
              <div className="Explore-trend-hashtag-info">
                <div
                  className="Explore-trend-hashtag-number"
                  id="hashtag-trend-three-number"
                >
                  3
                </div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
            </div>
            <div className="Explore-trend-card" id="hashtag-trend-four">
              <div className="Explore-trend-hashtag-info">
                <div
                  className="Explore-trend-hashtag-number"
                  id="hashtag-trend-four-number"
                >
                  4
                </div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
            </div>
          </div>
          <div className="Explore-featured">
            <div className="Explore-featured-column">
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
            </div>
            <div className="Explore-featured-column">
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
            </div>
            <div className="Explore-featured-column">
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
            </div>
            <div className="Explore-featured-column">
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
              <div className="Explore-featured-card"></div>
            </div>
          </div>
        </div>
        <div className="Explore-sidebar-container">Sidebar</div>
      </div>
    </div>
  );
}

export default Explore;
