import './style/Explore.css';
import './style/Header.css';
import './style/Profile.css';
import loading from './images/loading-black.png';
import chat from './images/content-card/chat.png';
import heart from './images/content-card/heart.png';
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

// async function fetchTrendingHashtags() {
//   const docRef = collection(db, 'trending-hashtags');
//   const docs = await getDocs(docRef);
//   docs.forEach((doc) => {
//     console.log(doc.data());
//   });
// }

const updateTrendingHashtags = () => {};

// fetchTrendingHashtags();

function Explore(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [postKeys, setPostKeys] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastPost, setLastPost] = useState();
  const [comments, setComments] = useState();
  const [lastComment, setLastComment] = useState();

  const allPosts = [];

  useEffect(() => {
    querySnapshot();
  }, []);

  useEffect(() => {
    getFeaturedPost();
  }, [postKeys]);

  useEffect(() => {
    setIsLoaded(true);
    console.log(userPosts);
  }, [userPosts]);

  // useEffect(() => {
  //   addLikes();
  // }, [userPosts]);

  // const profileRef = doc(db, 'profiles', id);
  const featuredRef = collection(db, 'featured');

  async function getFeaturedPost() {
    const array = [];
    for (const key of postKeys) {
      const docRef = doc(db, 'profiles', key[0], 'posts', key[1]);
      const result = await getDoc(docRef);
      array.push(result.data());
    }
    setUserPosts(array);
  }

  async function querySnapshot() {
    const q = query(featuredRef);
    const results = await getDocs(q);
    const lastVisible = results.docs[results.docs.length - 1];
    const keys = [];

    results.forEach((doc) => {
      const UID = doc.data().reference._key.path.segments[6];
      const postID = doc.data().reference._key.path.segments[8];
      keys.push([UID, postID]);
    });
    setPostKeys(keys);
    // setLastPost(lastVisible);
  }

  const showPosts = () => {
    if (userPosts) {
      return (
        <div>
          {userPosts.map((post, index) => (
            <div className="content-card" key={index} id={index}>
              {console.log('flag')}
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
              <div className="content-card-hashtags">
                {/* {showHashtags(post.hashtags)} */}
              </div>
              <div className="content-card-footer">
                <div className="content-card-notes">
                  {/* {showNotes(post.notes)}{' '} */}
                </div>
                <div className="content-card-footer-icon-container">
                  <img
                    className="content-card-footer-icon"
                    alt="heart icon"
                    src={heart}
                    data-liked="false"
                    // onClick={handleLike}
                  />

                  <img
                    className="content-card-footer-icon"
                    alt="comments icon"
                    src={chat}
                    // onClick={showCommentSection}
                  />
                </div>
              </div>
              <div className="content-card-comment-section">
                <div className="content-card-comment">
                  <img
                    className="profile-picture"
                    // src={getAuth().currentUser.photoURL}
                    alt=""
                  />
                  <div className="content-card-comment-input-container">
                    <textarea
                      className="content-card-comment-input"
                      // onChange={checkCommentLength}
                      type="text"
                      minLength="1"
                      maxLength="459"
                      placeholder="Leave a comment"
                      wrap="wrap"
                      rows="1"
                    ></textarea>
                    <button
                      className="content-card-comment-reply-button"
                      // onClick={writeComment}
                    >
                      Reply
                    </button>
                  </div>
                </div>
                <img src={loading} className="comments-loading-icon" alt="" />
                {/* {showComments()} */}
                <div className="load-more-comments-button">
                  {/* <button onClick={fetchMoreComments}>
                    Load more comments
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

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
            {/* <div className="Explore-featured-column">
              <div className="Explore-featured-card"></div> */}
            {userPosts ? showPosts() : ''}
          </div>
        </div>
        <div className="Explore-sidebar-container">Sidebar</div>
      </div>
    </div>
  );
}

export default Explore;
