import compass from '../images/navbar/compass.png';
import home from '../images/navbar/home.png';
import email from '../images/navbar/email.png';
import pencil from '../images/navbar/pencil.png';
import user from '../images/navbar/user.png';
import bubble from '../images/navbar/bubble.png';
import bolt from '../images/navbar/bolt.png';
import { getAuth, signOut } from 'firebase/auth';

const Navbar = () => {
  function signOutUser() {
    signOut(getAuth());
    // eslint-disable-next-line no-restricted-globals
    location.reload(true);
  }

  return (
    <div className="Navbar">
      <div className="Navbar-icon-container">
        <button onClick={signOutUser}>sign out</button>
        <button className="navbar-icon-button">
          <img className="Navbar-icon" src={home} alt="" />
        </button>
        <button className="navbar-icon-button">
          <img className="Navbar-icon" src={compass} alt="" />
        </button>
        <button className="navbar-icon-button">
          <img className="Navbar-icon" src={email} alt="" />
        </button>
        <button className="navbar-icon-button">
          <img className="Navbar-icon" src={bubble} alt="" />
        </button>
        <button className="navbar-icon-button">
          <img className="Navbar-icon" src={bolt} alt="" />
        </button>
        <button className="navbar-icon-button">
          <img className="Navbar-icon" src={user} alt="" />
        </button>
        <button className="navbar-icon-button submit-post-button">
          <img className="Navbar-icon" src={pencil} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
