import Header from './components/Header';
import React from 'react';

const Profile = (props) => {
  return (
    <div>
      <Header
        isLoggedIn={props.isLoggedIn}
        setIsLoggedIn={props.setIsLoggedIn}
        openModal={props.openModal}
        isLoading={props.isLoading}
        setIsLoading={props.setIsLoading}
      />
      <h1>Hello from Profile</h1>
    </div>
  );
};

export default Profile;
