import './style/Explore.css';
import './style/Header.css';
import './style/Profile.css';
import loading from './images/loading-black.png';
import chat from './images/content-card/chat.png';
import heart from './images/content-card/heart.png';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';
import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  DocumentReference,
  collection,
  limit,
  serverTimestamp,
  query,
  Timestamp,
  orderBy,
  where,
  setDoc,
  increment,
  startAfter,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Explore(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [postKeys, setPostKeys] = useState([]);
  const [lastPost, setLastPost] = useState();
  const [comments, setComments] = useState();
  const [lastComment, setLastComment] = useState();

  const allPosts = [];

  useEffect(() => {
    querySnapshot();
    fetchTrendingHashtags();
  }, []);

  useEffect(() => {
    getFeaturedPost();
  }, [postKeys]);

  useEffect(() => {
    addLikes();
  }, [userPosts]);

  const featuredRef = collection(db, 'featured');

  // FIX THIS TOMORROW

  async function updateTrendingScoresOnLoad(hashtags) {
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
          const newScore = calcTrendingScore(
            document.data().notes,
            calculateDaysDifference(
              document.data().time.toMillis(),
              Timestamp.now().toMillis()
            )
          );
          updateDoc(docRef, {
            trendingScore: newScore,
          });
          // updateHashtagDateAndScore(docRef, document.data());
        });
      }
    }
  }

  async function fetchTrendingHashtags() {
    const trendingRef = collection(db, 'trending-hashtags');
    const q = query(trendingRef, orderBy('trendingScore', 'desc'), limit(4));
    const result = await getDocs(q);
    const hashtags = [];
    result.forEach((document) => {
      hashtags.push({
        hashtag: document.data().hashtag,
        score: document.data().trendingScore,
      });
    });
    hashtags.sort((a, b) => {
      return b.trendingScore - a.trendingScore;
    });
    showTrendingHashtags(hashtags);
    updateTrendingScoresOnLoad(hashtags);
  }

  const showTrendingHashtags = (hashtags) => {
    const trendingHashtags = document.querySelectorAll(
      '.Explore-trend-hashtag-headline'
    );
    for (let i = 0; i < trendingHashtags.length; i++) {
      trendingHashtags[i].textContent = `${hashtags[i].hashtag}`;
    }
  };

  const calcTrendingScore = (notes, daysOld) => 3 * notes * (0.9 ^ daysOld);

  const calculateDaysDifference = (firstDate, secondDate) => {
    const difference = secondDate - firstDate;
    return Math.ceil(Math.abs(difference / (1000 * 3600 * 24)));
  };

  async function updateHashtagDateAndScore(ref, data) {
    await updateDoc(ref, {
      time: serverTimestamp(),
      notes: increment(1),
      trendingScore: calcTrendingScore(
        data.notes,
        calculateDaysDifference(
          data.time.toMillis(),
          Timestamp.now().toMillis()
        )
      ),
    });
  }

  async function getFeaturedPost() {
    const array = [];
    for (const key of postKeys) {
      const docRef = doc(db, 'profiles', key[0], 'posts', key[1]);
      const result = await getDoc(docRef);
      if (result.data()) {
        array.push(result.data());
        array[array.length - 1].userID = key[0];
        array[array.length - 1].id = key[1];
      }
    }
    setUserPosts(array);
  }

  async function querySnapshot() {
    const q = query(featuredRef, orderBy('time', 'desc'), limit(3));
    const results = await getDocs(q);
    const lastVisible = results.docs[results.docs.length - 1];
    const keys = [];

    results.forEach((doc) => {
      const UID = doc.data().reference._key.path.segments[6];
      const postID = doc.data().reference._key.path.segments[8];
      keys.push([UID, postID]);
    });
    setPostKeys(keys);
    setLastPost(lastVisible);
  }

  async function loadMorePosts() {
    const q = query(
      featuredRef,
      orderBy('time', 'desc'),
      limit(3),
      startAfter(lastPost)
    );
    const result = await getDocs(q);
    const lastVisible = result.docs[result.docs.length - 1];
    const button = document.querySelector('.load-more-button');

    if (result.size === 0) button.style.display = 'none';
    const allKeys = [...postKeys];

    result.forEach((doc) => {
      const UID = doc.data().reference._key.path.segments[6];
      const postID = doc.data().reference._key.path.segments[8];
      allKeys.push([UID, postID]);
    });
    setPostKeys(allKeys);
    setLastPost(lastVisible);
  }

  const showHashtags = (arr) => {
    if (arr === undefined || arr.length === 0) {
      return '';
    } else {
      const hashtags = [];
      arr.forEach((hashtag) => {
        hashtag[0] === '#'
          ? hashtags.push(`${hashtag} `)
          : hashtags.push(`#${hashtag} `);
      });
      return hashtags;
    }
  };

  const hideOtherCommentSections = (postID) => {
    const commentSections = document.querySelectorAll(
      '.content-card-comment-section'
    );
    commentSections.forEach((commentSection) => {
      if (commentSection.id !== postID) commentSection.style.display = 'none';
    });
  };

  async function updateHashtag(ref, incrementValue) {
    await updateDoc(ref, {
      time: serverTimestamp(),
      notes: increment(incrementValue),
    });
  }

  async function writeHashtagsToTrending(hashtags, incrementValue) {
    for (let index in hashtags) {
      const q = query(
        collection(db, 'trending-hashtags'),
        where('hashtag', '==', hashtags[index])
      );
      const snap = await getDocs(q);

      if (snap.size !== 0) {
        snap.forEach((document) => {
          const ref = new DocumentReference(document);
          const docID = ref.firestore._key.path.segments[6];
          const docRef = doc(db, 'trending-hashtags', docID);
          updateHashtag(docRef, incrementValue);
        });
      }
    }
  }

  async function removeNoteFromHashtag(userID, postID) {
    const postRef = doc(db, 'profiles', userID, 'posts', postID);

    const docRef = doc(
      db,
      'profiles',
      userID,
      'posts',
      postID,
      'liked',
      `${getUID()}`
    );

    const snap = await getDoc(docRef);
    const result = await getDoc(postRef);

    if (snap.exists()) {
      const hashtags = result.data().hashtags;
      writeHashtagsToTrending(hashtags, -1);
    }
  }

  async function addNoteToHashtag(userID, postID) {
    const postRef = doc(db, 'profiles', userID, 'posts', postID);

    const docRef = doc(
      db,
      'profiles',
      userID,
      'posts',
      postID,
      'liked',
      `${getUID()}`
    );

    const snap = await getDoc(docRef);
    const result = await getDoc(postRef);

    if (!snap.exists()) {
      const hashtags = result.data().hashtags;
      writeHashtagsToTrending(hashtags, 1);
    }
  }

  async function addNote(userID, postID) {
    const postRef = doc(db, 'profiles', userID, 'posts', postID);

    const docRef = doc(
      db,
      'profiles',
      userID,
      'posts',
      postID,
      'liked',
      `${getUID()}`
    );

    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      await updateDoc(postRef, {
        notes: increment(1),
      });
      try {
        await setDoc(
          doc(db, 'profiles', userID, 'posts', postID, 'liked', `${getUID()}`),
          {
            name: getUserName(),
            photoURL: getPicture(),
          }
        );
      } catch (error) {
        console.error('Error writing note to Firebase Database', error);
      }
    }
  }

  async function removeNote(userID, postID) {
    const postRef = doc(db, 'profiles', userID, 'posts', postID);

    const docRef = doc(
      db,
      'profiles',
      userID,
      'posts',
      postID,
      'liked',
      `${getUID()}`
    );

    let snap = await getDoc(docRef);

    if (snap.exists()) {
      await updateDoc(postRef, {
        notes: increment(-1),
      });
      await deleteDoc(
        doc(db, 'profiles', userID, 'posts', postID, 'liked', `${getUID()}`)
      );
    }
  }

  const incrementNote = (node, amount) => {
    const text = node.innerText;
    let num = Number(text.slice(0, text.indexOf(' '))) + amount;
    if (num === 1) {
      node.innerText = '1 note';
    } else {
      node.innerText = `${num} notes`;
    }
  };

  async function handleLike(event) {
    if (getAuth().currentUser) {
      const postID = event.target.parentNode.parentNode.parentNode.id;
      const userID =
        event.target.parentNode.parentNode.parentNode.dataset.profile;
      const notes = event.target.parentNode.parentNode.childNodes[0];

      if (event.target.dataset.liked === 'true') {
        removeNote(userID, postID);
        removeNoteFromHashtag(userID, postID);
        event.target.dataset.liked = 'false';
        event.target.style.background = 'none';
        incrementNote(notes, -1);
      } else if (event.target.dataset.liked === 'false') {
        addNote(userID, postID);
        addNoteToHashtag(userID, postID);
        event.target.dataset.liked = 'true';
        event.target.style.backgroundColor = 'red';
        incrementNote(notes, 1);
      }
    } else openModal();
  }

  async function fetchComments(event) {
    const loadingIcon =
      event.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[1];

    loadingIcon.style.display = 'flex';
    const postID = event.target.parentNode.parentNode.parentNode.id;
    const userID = event.target.dataset.profile;

    hideOtherCommentSections(postID);
    const commentsRef = collection(
      db,
      `/profiles/${userID}/posts/${postID}/comments`
    );
    const q = query(commentsRef, orderBy('time'), limit(3));
    const result = await getDocs(q);

    const lastVisible = result.docs[result.docs.length - 1];

    const allComments = [];

    result.forEach((doc) => {
      allComments.push(doc.data());
      allComments[allComments.length - 1].id = doc.id;
    });
    setComments(allComments);
    setLastComment(lastVisible);
  }

  async function fetchMoreComments(event) {
    const commentSectionLength =
      event.target.parentNode.parentNode.children[2].children.length;

    if (commentSectionLength === 1) {
      event.target.style.display = 'none';
    } else {
      const userID =
        event.target.parentNode.parentNode.parentNode.dataset.profile;
      const postID = event.target.parentNode.parentNode.parentNode.id;
      const commentsRef = collection(
        db,
        `/profiles/${userID}/posts/${postID}/comments`
      );
      const q = query(
        commentsRef,
        orderBy('time'),
        limit(3),
        startAfter(lastComment)
      );

      const allComments = [...comments];
      const result = await getDocs(q);

      if (result.size === 0) {
        event.target.display = 'none';
      }

      const lastVisible = result.docs[result.docs.length - 1];

      if (result.size === 0)
        event.target.parentNode.lastChild.style.display = 'none';

      result.forEach((doc) => {
        allComments.push(doc.data());
        allComments[allComments.length - 1].id = doc.id;
      });
      setComments(allComments);
      setLastComment(lastVisible);
    }
  }

  const checkCommentLength = (event) => {
    const replyBtn = event.target.parentNode.lastChild;
    if (event.target.value === '') {
      replyBtn.style.pointerEvents = 'none';
      replyBtn.style.color = 'gray';
      replyBtn.style.cursor = 'not-allowed';
    } else {
      replyBtn.style.pointerEvents = 'auto';
      replyBtn.style.color = '#0d8db0';
      replyBtn.style.cursor = 'pointer';
    }
  };

  async function checkForLike(userID, postID) {
    if (getAuth().currentUser) {
      const docRef = doc(
        db,
        'profiles',
        userID,
        'posts',
        postID,
        'liked',
        `${getUID()}`
      );
      const snap = await getDoc(docRef);
      return snap.exists();
    }
  }

  async function addLikes() {
    const cards = document.querySelectorAll('.content-card');
    cards.forEach((card) => {
      const userID = card.dataset.profile;
      const heart = card.childNodes[5].childNodes[1].children[0];
      const result = checkForLike(userID, card.id);
      result.then((value) => {
        if (value) {
          heart.dataset.liked = 'true';
          heart.style.backgroundColor = 'red';
        }
      });
    });
  }

  const showUserComment = (id) => {
    return (
      <div className="content-card-comment">
        <img
          className="profile-picture"
          src={getAuth().currentUser.photoURL}
          alt=""
        />
        <div className="content-card-comment-input-container">
          <textarea
            className="content-card-comment-input"
            onChange={checkCommentLength}
            id={`input-${id}`}
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
    );
  };
  const showNotes = (notes) => {
    if (notes === 0 || notes === undefined) {
      return `0 notes`;
    }
    if (notes === 1) {
      return `${notes} note`;
    }
    return `${notes} notes`;
  };

  const getUserName = () => getAuth().currentUser.displayName;
  const getPicture = () => getAuth().currentUser.photoURL;
  const getUID = () => getAuth().currentUser.uid;

  async function writeComment(event) {
    const postID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    const userID =
      event.target.parentNode.parentNode.parentNode.parentNode.dataset.profile;
    const comment = document.getElementById(`input-${postID}`).value;
    const postsRef = doc(db, 'profiles', userID, 'posts', postID);
    if (comment.length > 0) {
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
      addNote(userID, postID);
      addNoteToHashtag(userID, postID);
      event.target.style.pointerEvents = 'none';
      document.getElementById(`input-${postID}`).value = '';
    }
  }

  const openModal = () => {
    document.body.style.overflowY = 'hidden';
    document.querySelector('.login-modal-container').style.display = 'flex';
    document.getElementById('initial-login-modal').style.display = 'flex';
  };

  const showCommentSection = (event) => {
    const postID = event.target.id;
    const index = postID.indexOf('-');
    const ref = postID.slice(index + 1);
    const commentSection = document.getElementById(`comments-${ref}`);
    const fetchedComments = commentSection.children[1];

    if (commentSection.style.display === 'flex') {
      commentSection.style.display = 'none';
    } else {
      fetchComments(event);
      commentSection.style.display = 'flex';
      fetchedComments.style.display = '';
    }
  };

  const showComments = () => {
    let currentComments = comments;
    document.querySelectorAll('.comments-loading-icon').forEach((icon) => {
      icon.style.display = 'none';
    });
    if (currentComments) {
      return (
        <div className="fetched-comments">
          {comments.map((post, index) => (
            <div className="content-card-comment" key={index}>
              <Link to={`/profile/${post.uid}`} onClick={() => window.reload()}>
                <img className="profile-picture" src={post.photoURL} alt="" />
              </Link>
              <div className="content-card-comment-caption">{post.comment}</div>
            </div>
          ))}
        </div>
      );
    }
  };

  const showPosts = () => {
    if (userPosts) {
      return (
        <div className="">
          {userPosts.map((post, index) => (
            <div
              className="content-card"
              key={index}
              id={post.id}
              data-profile={post.userID}
            >
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
                {showHashtags(post.hashtags)}
              </div>
              <div className="content-card-footer">
                <div className="content-card-notes">
                  {showNotes(post.notes)}{' '}
                </div>
                <div className="content-card-footer-icon-container">
                  <img
                    className="content-card-footer-icon"
                    alt="heart icon"
                    src={heart}
                    data-profile={post.userID}
                    data-liked="false"
                    onClick={handleLike}
                  />

                  <img
                    className="content-card-footer-icon"
                    alt="comments icon"
                    src={chat}
                    id={`chat-${post.id}`}
                    onClick={showCommentSection}
                    data-profile={post.userID}
                  />
                </div>
              </div>
              <div
                className="content-card-comment-section"
                id={`comments-${post.id}`}
              >
                {getAuth().currentUser ? showUserComment(post.id) : ''}

                <img src={loading} className="comments-loading-icon" alt="" />
                {showComments()}
                <div className="load-more-comments-button">
                  <button onClick={fetchMoreComments}>
                    Load more comments
                  </button>
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
          <div className="Explore-trending-container">
            <div className="Explore-trending-cards">
              <h2 className="Explore-trending-title">Trending 🚀</h2>

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
          </div>
          <div className="Explore-featured">{userPosts ? showPosts() : ''}</div>
          <div className="load-more-button-container">
            <button onClick={loadMorePosts} className="load-more-button">
              Load more
            </button>
          </div>
        </div>
        <div className="Explore-sidebar-container">
          <div className="sidebar-container">
            <h2 className="Explore-sidebar-container-headline">
              Check out these blogs
            </h2>
            <div className="featured-profile">
              <div className="featured-profile-picture">
                <img
                  src="https://avatars.githubusercontent.com/u/2266075?v=4"
                  alt=""
                  className="profile-picture"
                />
              </div>
              <div className="featured-profile-info">
                <Link to={`profile/ZHdGiTZnIiPEOktJnqDcFFqgs1y2`}>
                  <span id="featured-username">Spghtti</span>
                </Link>
                <span id="featured-profile-description">I created this!</span>
              </div>
            </div>
          </div>
          <footer className="sidebar-footer">
            <ul>
              <li>
                <a
                  href="https://github.com/spghtti"
                  alt="Github link"
                  className=".Explore-l"
                >
                  Github
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Explore;
