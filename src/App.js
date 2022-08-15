import './style/Explore.css';
import './style/Header.css';
import Header from './components/Header';

function Explore() {
  return (
    <div className="Explore">
      <header className="Explore-header">
        <Header />
      </header>
      <div className="Explore-content">
        <div className="Explore-cards-container">
          <div className="Explore-trending-cards">
            <div className="Explore-trend-card">trend</div>
            <div className="Explore-trend-card">trend</div>
            <div className="Explore-trend-card">trend</div>
            <div className="Explore-trend-card">trend</div>
            <div className="Explore-trend-card">trend</div>
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
