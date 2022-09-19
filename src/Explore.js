import './style/Explore.css';
import './style/Header.css';
import React from 'react';
import Header from './components/Header';
import placeholderSmall from './images/placeholder-small.jpg';
import { firebaseApp, db } from './firebase';
import { doc, getDocs, collection } from 'firebase/firestore';

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
