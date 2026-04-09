import { BookCard } from '../BookCard/BookCard.jsx';
import './Favorites.css';

export function Favorites({ booksfav, bookssaved, toggleFav, toggleSaved }) {
    return(
        <div id="Favorites" className="Favorites-Container">
            <p className="Favorites-Text">Favorites</p>
            <div className="FavoritesBook-Container">
                {booksfav.map((book) => {
                    return(
                        <BookCard 
                            key={book.id} 
                            s={book} 
                            booksfav={booksfav} 
                            bookssaved={bookssaved} 
                            toggleFav={toggleFav} 
                            toggleSaved={toggleSaved}
                        />
                    )
                })}
            </div>    
        </div>
    )    
}