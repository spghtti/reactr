import './style/Explore.css';
import './style/Header.css';
import Header from './components/Header';
import placeholderSmall from './images/placeholder-small.jpg';
import { firebaseApp, db } from './firebase';
import { doc, getDocs, collection } from 'firebase/firestore';

async function fetchTrendingHashtags() {
  const docRef = collection(db, 'trending-hashtags');
  const docs = await getDocs(docRef);
  docs.forEach((doc) => {
    console.log(doc.data());
  });
}

const updateTrendingHashtags = () => {};

// fetchTrendingHashtags();

function Explore() {
  return (
    <div className="Explore">
      <header className="Explore-header">
        <Header />
      </header>
      <div className="Explore-content">
        <div className="Explore-cards-container">
          <h2 className="Explore-trending-title">Trending 🚀</h2>
          <div className="Explore-trending-cards">
            <div className="Explore-trend-card">
              <div className="Explore-trend-hashtag-info">
                <div className="Explore-trend-hashtag-number">1</div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
              <div className="Explore-trend-hashtag-image-container">
                <img
                  src={placeholderSmall}
                  alt=""
                  className="Explore-trend-hashtag-image"
                />
              </div>
            </div>
            <div className="Explore-trend-card">
              <div className="Explore-trend-hashtag-info">
                <div className="Explore-trend-hashtag-number">1</div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
              <div className="Explore-trend-hashtag-image-container">
                <img
                  src={placeholderSmall}
                  alt=""
                  className="Explore-trend-hashtag-image"
                />
              </div>
            </div>
            <div className="Explore-trend-card">
              <div className="Explore-trend-hashtag-info">
                <div className="Explore-trend-hashtag-number">1</div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
              <div className="Explore-trend-hashtag-image-container">
                <img
                  src={placeholderSmall}
                  alt=""
                  className="Explore-trend-hashtag-image"
                />
              </div>
            </div>
            <div className="Explore-trend-card">
              <div className="Explore-trend-hashtag-info">
                <div className="Explore-trend-hashtag-number">1</div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
              <div className="Explore-trend-hashtag-image-container">
                <img
                  src={placeholderSmall}
                  alt=""
                  className="Explore-trend-hashtag-image"
                />
              </div>
            </div>
            <div className="Explore-trend-card">
              <div className="Explore-trend-hashtag-info">
                <div className="Explore-trend-hashtag-number">1</div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
              <div className="Explore-trend-hashtag-image-container">
                <img
                  src={placeholderSmall}
                  alt=""
                  className="Explore-trend-hashtag-image"
                />
              </div>
            </div>
            <div className="Explore-trend-card">
              <div className="Explore-trend-hashtag-info">
                <div className="Explore-trend-hashtag-number">1</div>
                <h3 className="Explore-trend-hashtag-headline">Trend</h3>
              </div>
              <div className="Explore-trend-hashtag-image-container">
                <img
                  src={placeholderSmall}
                  alt=""
                  className="Explore-trend-hashtag-image"
                />
              </div>
            </div>
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
