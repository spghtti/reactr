import smallLogo from '../images/small-logo.png';
import searchIcon from '../images/magnifying-glass-black-small.png';

const Header = () => {
  return (
    <header className="Header">
      <div className="Header-container">
        <div className="Header-logo-container">
          <img className="Header-logo" src={smallLogo} alt="tumblr logo" />
        </div>
        <div class="Header-search-container">
          <input class="Header-search" type="text" placeholder="" />
          <span>
            <img src={searchIcon} alt="search icon" />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
