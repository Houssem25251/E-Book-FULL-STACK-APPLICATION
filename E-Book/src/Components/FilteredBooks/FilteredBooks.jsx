import {Header} from '../Header/Header.jsx';
import './FilteredBooks.css';
import {BookCard} from '../BookCard/BookCard.jsx';

export function FilteredBooks({
    Search,
    setSearch,
    books,
    booksfav,
    toggleFav,
    bookssaved,
    toggleSaved,
    user,
    onLogout,
    setShowModal,
    setType
}){
    const FilteredBooksSearch = [...new Map(
        books
    .filter(b => b.title.toLowerCase().includes(Search.toLowerCase()) || 
                 b.author.toLowerCase().includes(Search.toLowerCase()))
    .map(b => [b.title, b])
    ).values()];

    if(FilteredBooksSearch.length===0){
        return(
        <div className="MainFilteredBooksPage">
            <Header Search={Search} setSearch={setSearch}/>
            <div className="FilteredBooksPage">
                    <p className="NoBooksFound">Oops! no books found.</p>
            </div>
        </div>
    )
    }
    else{
        return(
        <div className="MainFilteredBooksPage">
            <Header Search={Search} setSearch={setSearch} user={user} onLogout={onLogout} setShowModal={setShowModal}
setType={setType}/>
            <div className="FilteredBooksPage">
                <div className="FilteredPage-Books">
                    {FilteredBooksSearch.map((c)=>{
                        return(
                            <BookCard key={c.id} s={c} booksfav={booksfav} toggleFav={toggleFav} bookssaved={bookssaved} toggleSaved={toggleSaved}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )   
    }
}
