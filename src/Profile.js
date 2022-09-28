import Header from './components/Header';
import React, { useEffect, useState } from 'react';
import './style/Explore.css';
import './style/Header.css';
import './style/Profile.css';
import loading from './images/loading-black.png';
import chat from './images/content-card/chat.png';
import heart from './images/content-card/heart.png';
import {
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  limit,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  startAfter,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';
import { useParams, Link } from 'react-router-dom';

const Profile = (props) => {
  const [userPosts, setUserPosts] = useState();
  const [lastPost, setLastPost] = useState();
  const [comments, setComments] = useState();
  const [lastComment, setLastComment] = useState();
  const { id } = useParams();

  const profileRef = doc(db, 'profiles', id);
  const postsRef = collection(profileRef, 'posts');

  useEffect(() => {
    querySnapshot();
  }, []);

  useEffect(() => {
    addLikes();
  }, [userPosts]);

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
    const button = document.querySelector('.load-more-button');

    if (result.size === 0) button.style.display = 'none';

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

  const showCommentSection = (event) => {
    const postID = event.target.id;
    const index = postID.indexOf('-');
    const ref = postID.slice(index + 1);
    const commentSection = document.getElementById(`comments-${ref}`);

    if (commentSection.style.display === 'flex') {
      commentSection.style.display = 'none';
    } else {
      fetchComments(event);
      commentSection.style.display = 'flex';
    }
  };

  async function checkForLike(postID) {
    const docRef = doc(
      db,
      'profiles',
      id,
      'posts',
      postID,
      'liked',
      `${getUID()}`
    );
    const snap = await getDoc(docRef);
    return snap.exists();
  }

  async function addLikes() {
    if (getAuth().currentUser) {
      const cards = document.querySelectorAll('.content-card');
      cards.forEach((card) => {
        const heart = card.childNodes[5].childNodes[1].children[0];
        const result = checkForLike(card.id);
        result.then((value) => {
          if (value) {
            heart.dataset.liked = 'true';
            heart.style.backgroundColor = 'red';
          }
        });
      });
    }
  }

  async function addNote(postID) {
    const postRef = doc(db, 'profiles', id, 'posts', postID);

    const docRef = doc(
      db,
      'profiles',
      id,
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
          doc(db, 'profiles', id, 'posts', postID, 'liked', `${getUID()}`),
          {
            name: getUserName(),
            photoURL: getPicture(),
          }
        );
      } catch (error) {
        console.error('Error writing new message to Firebase Database', error);
      }
    }
  }
  async function removeNote(postID) {
    const postRef = doc(db, 'profiles', id, 'posts', postID);

    const docRef = doc(
      db,
      'profiles',
      id,
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
        doc(db, 'profiles', id, 'posts', postID, 'liked', `${getUID()}`)
      );
    }
  }

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
    document.getElementById(`input-${postID}`).value = '';
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

  async function fetchComments(event) {
    const loadingIcon =
      event.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[1];

    loadingIcon.style.display = 'flex';
    const postID = event.target.parentNode.parentNode.parentNode.id;
    hideOtherCommentSections(postID);
    // const result = await getDocs(
    //   collection(doc(db, 'profiles', id, 'posts', postID), 'comments'),
    //   orderBy('time'),
    //   limit(2)
    // );
    const commentsRef = collection(
      db,
      `/profiles/${id}/posts/${postID}/comments`
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
    if (commentSectionLength === 0) {
      event.target.style.display = 'none';
      return;
    }

    const postID = event.target.parentNode.parentNode.parentNode.id;
    const commentsRef = collection(
      db,
      `/profiles/${id}/posts/${postID}/comments`
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

  const hideOtherCommentSections = (postID) => {
    const commentSections = document.querySelectorAll(
      '.content-card-comment-section'
    );
    commentSections.forEach((commentSection) => {
      if (commentSection.id !== postID) commentSection.style.display = 'none';
    });
  };

  const showComments = () => {
    let currentComments = comments;
    document.querySelectorAll('.comments-loading-icon').forEach((icon) => {
      icon.style.display = 'none';
    });
    if (currentComments) {
      return (
        <div id="fetched-comments">
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
      const notes = event.target.parentNode.parentNode.childNodes[0];

      if (event.target.dataset.liked === 'true') {
        removeNote(postID);
        event.target.dataset.liked = 'false';
        event.target.style.background = 'none';
        incrementNote(notes, -1);
      } else if (event.target.dataset.liked === 'false') {
        addNote(postID);
        event.target.dataset.liked = 'true';
        event.target.style.backgroundColor = 'red';
        incrementNote(notes, 1);
      }
    } else openModal();
  }

  const showHashtags = (arr) => {
    if (arr === undefined) {
      return '';
    } else {
      const hashtags = [];
      arr.forEach((hashtag) => {
        hashtag[0] === '#'
          ? hashtags.push(`${hashtag} `)
          : hashtags.push(`#${hashtag}`);
      });
      return hashtags;
    }
  };

  const openModal = () => {
    document.body.style.overflowY = 'hidden';
    document.querySelector('.login-modal-container').style.display = 'flex';
    document.getElementById('initial-login-modal').style.display = 'flex';
  };

  const showUserComment = (id) => {
    console.log('TRUE');
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
                    data-liked="false"
                    onClick={handleLike}
                  />

                  <img
                    className="content-card-footer-icon"
                    alt="comments icon"
                    src={chat}
                    onClick={showCommentSection}
                    id={`chat-${post.id}`}
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
