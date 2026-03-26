import './MainPage.css';
import {Home} from '../Home/Home.jsx';
import {Categories} from '../Categories/Categories.jsx';
import {Library} from '../Library/Library.jsx';
import {Favorites} from '../Favorites/Favorites.jsx';
import {useLocation} from 'react-router';
import {useEffect} from 'react';
import {scroller} from 'react-scroll';
import {About} from '../About/About.jsx';



export function MainPage({CategoriesArray,setbooksfav,books,booksfav,bookssaved,setbookssaved}){
    const l=useLocation();
    useEffect(()=>{
        scroller.scrollTo(l.state,{
                smooth: true,
                duration: 400,
                offset: -50
        })
    },[l]);
    return(
        <div className="MainPage">
            <Home />
            <Categories CategoriesArray={CategoriesArray} />
            <Library setbooksfav={setbooksfav} books={books} booksfav={booksfav} bookssaved={bookssaved} setbookssaved={setbookssaved} />
            <Favorites setbooksfav={setbooksfav} booksfav={booksfav} bookssaved={bookssaved} setbookssaved={setbookssaved}/>
            <About />
        </div>
    )
}