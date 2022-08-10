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
          </div>
          <div className="Explore-cards">cards</div>
        </div>
        <div className="Explore-sidebar-container">Sidebar</div>
      </div>
    </div>
  );
}

export default Explore;
