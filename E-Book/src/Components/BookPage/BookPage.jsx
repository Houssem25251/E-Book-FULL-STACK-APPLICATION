import './BookPage.css';
import FILLEDSTAR from '../../assets/FILLEDSTAR.png';
import UNFILLEDSTAR from '../../assets/UNFILLEDSTAR.png';
import HALFFILLEDSTAR from '../../assets/HALFFILLEDSTAR.png';
import { Header } from '../Header/Header.jsx';
import { useParams } from 'react-router';
import { API_URL } from '../../api.js';

function renderStars(rev) {
    const stars = [];
    const full = Math.floor(rev);
    const half = !Number.isInteger(rev);
    for (let i = 0; i < full; i++) stars.push(<img key={`f${i}`} className="STAR" src={FILLEDSTAR} />);
    if (half) stars.push(<img key="h" className="STAR" src={HALFFILLEDSTAR} />);
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) stars.push(<img key={`e${i}`} className="STAR" src={UNFILLEDSTAR} />);
    return stars;
}

export function BookPage({ Search, setSearch, books, booksfav, toggleFav,user, onLogout}) {
    const { id } = useParams();
    const s = books.find(e => e.id === parseInt(id));
    if (!s) return null;

    const isFav = booksfav.includes(s.id);

    return (
        <div className="MainBookPage">
            <Header Search={Search} setSearch={setSearch} user={user} onLogout={onLogout} />
            <div className="BookPage">
                <p className="book-title">{s.title}</p>
                <div className="BookPage-Content">
                    <img className="BookPage-Image" src={`${API_URL}${s.image}`} />
                    <div className="sub-book-content">
                        <p className="book-author">By {s.author}</p>
                        <div className="ReviewsContainer">{renderStars(s.reviews)}</div>
                        <p className="book-description">{s.description}</p>
                        <div className="parent-download">
                            <a className="download" href={`${API_URL}${s.download}`} download>Download PDF</a>
                            <a onClick={() => toggleFav(s.id)} className="download" style={{ cursor: 'pointer' }}>
                                {isFav ? 'Remove from favorites' : 'Add to favorites'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}