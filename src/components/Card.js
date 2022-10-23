import React from 'react';
import placeholder from '../images/placeholder.png';
import chat from '../images/content-card/chat.png';
import heart from '../images/content-card/heart.png';
import reblog from '../images/content-card/retweet.png';

const Card = (props) => {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <div className="content-card-header-profile-info">
          <img src={placeholder} alt="" className="profile-picture" />
          <span>profilename</span>
        </div>
        <div className="content-card-header-profile-info-ellipsis">
          <span>...</span>
        </div>
      </div>
      <div className="content-card-image-container">
        <img src={placeholder} alt="" className="content-card-image" />
      </div>
      <div className="content-card-title"></div>
      <div className="content-card-caption"></div>
      <div className="content-card-hashtags"></div>
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
  );
};
export default Card;
