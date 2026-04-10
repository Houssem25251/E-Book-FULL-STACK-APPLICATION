import { Header } from '../Header/Header.jsx';
import './CategoryPage.css';
import { useParams } from 'react-router';
import { BookCard } from '../BookCard/BookCard.jsx';

export function CategoryPage({
    Search,
    setSearch,
    CategoriesArray,
    books,
    booksfav,
    toggleFav,
    bookssaved,
    toggleSaved,
    user,
    onLogout,
    setShowModal,
    setType
}) {
    let { id } = useParams();

    const cat = CategoriesArray.find(k => k.id === Number(id));

    const CatBooks = books.filter(e => e.genre === cat?.title);

    return (
        <div className="MainCategoryPage">

            
            <Header
                Search={Search}
                setSearch={setSearch}
                user={user}
                onLogout={onLogout}
                setShowModal={setShowModal}
                setType={setType}
                
            />

            <div className="CategoryPage">
                <div className="CategoryPage-Books">
                    {CatBooks.map((c) => (
                        <BookCard
                            key={c.id}
                            s={c}
                            booksfav={booksfav}
                            toggleFav={toggleFav}
                            bookssaved={bookssaved}
                            toggleSaved={toggleSaved}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
