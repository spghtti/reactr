import compass from '../images/navbar/compass.png';
import home from '../images/navbar/home.png';
import pencil from '../images/navbar/pencil.png';
import signout from '../images/navbar/signout.png';
import user from '../images/navbar/user.png';
import { getAuth, signOut } from 'firebase/auth';
import SubmitPostModal from './SubmitPostModal';
import SignOutModal from './SignOutModal';
import { Link } from 'react-router-dom';

const showSubmitPostModal = () => {
  document.body.style.overflowY = 'hidden';
  document.querySelector('.submit-post-modal-container').style.display = 'flex';
};

const signOutUser = () => {
  signOut(getAuth());
  // eslint-disable-next-line no-restricted-globals
  location.reload(true);
};

const openSignOutModal = () => {
  document.body.style.overflowY = 'hidden';
  document.querySelector('.sign-out-modal-container').style.display = 'flex';
  document.querySelector('.sign-out-modal').style.display = 'flex';
};

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className="Navbar-icon-container">
        {/* <button className="navbar-icon-button">
          <img className="Navbar-icon" src={home} alt="Home button" />
        </button> */}
        <button className="navbar-icon-button" onClick={openSignOutModal}>
          <img className="Navbar-icon" src={signout} alt="Sign out" />
        </button>
        <Link to="/" style={{ display: 'flex' }}>
          <button className="navbar-icon-button">
            <img className="Navbar-icon" src={compass} alt="Explore page" />
          </button>
        </Link>
        <Link
          to={`/profile/${getAuth().currentUser.uid}`}
          style={{ display: 'flex' }}
        >
          <button className="navbar-icon-button">
            <img className="Navbar-icon" src={user} alt="Profile page" />
          </button>
        </Link>
        <button
          className="navbar-icon-button submit-post-button"
          onClick={showSubmitPostModal}
        >
          <img className="Navbar-icon" src={pencil} alt="" />
        </button>
        <SignOutModal signOutUser={signOutUser} />
        <SubmitPostModal />
      </div>
    </div>
  );
};

export default Navbar;
