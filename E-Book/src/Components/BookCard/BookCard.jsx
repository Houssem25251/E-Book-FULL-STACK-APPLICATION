import FILLEDSTAR from '../../assets/FILLEDSTAR.png';
import UNFILLEDSTAR from '../../assets/UNFILLEDSTAR.png';
import FILLEDCHECKMARK from '../../assets/FILLEDCHECKMARK.png';
import UNFILLEDCHECKMARK from '../../assets/UNFILLEDCHECKMARK.png';
import { Link } from 'react-router';
import './BookCard.css';
import { API_URL } from '../../api';

export function BookCard({ s, booksfav, bookssaved, toggleFav, toggleSaved }) {
    
    const isFav = booksfav.includes(s.id);
    const isSaved = bookssaved.includes(s.id);

    return (
        <div className="BookCard">
            <Link className="Link-To-Book" to={`/book/${s.id}`}>
                <img className="BookCard-Image" src={`${API_URL}${s.image}`} />
                <p className="bookcard-title">{s.title}</p>
            </Link>

            <button onClick={() => toggleFav(s.id)} className="BookCard-Button-Favorite">
                <img
                    title={isFav ? "Remove from favorites!" : "Add to favorites!"}
                    className="BookCardFavorite"
                    src={isFav ? FILLEDSTAR : UNFILLEDSTAR}
                />
            </button>

            <button onClick={() => toggleSaved(s.id)} className="BookCard-Button-Saved">
                <img
                    title={isSaved ? "Remove from saved books!" : "Add to saved books!"}
                    className="BookCardFavorite"
                    src={isSaved ? FILLEDCHECKMARK : UNFILLEDCHECKMARK}
                />
            </button>
        </div>
    );
}