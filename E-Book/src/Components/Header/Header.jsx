import './Header.css';
import {useLocation,useNavigate} from 'react-router';
import {scroller} from 'react-scroll';


export function Header({setShowModal,setType,Search,setSearch}){
    const l=useLocation();
    const n=useNavigate();
    function Click(PagePart){
        const mobile=window.innerWidth<=414;
        const offset=mobile?-140:-50;
        if(l.pathname==="/"){
            scroller.scrollTo(PagePart,{
                smooth: true,
                duration: 400,
                offset: offset
            })

        }
        else{
            n("/",{state: PagePart});
            scroller.scrollTo(PagePart,{
                smooth: true,
                duration: 400,
                offset: offset
            });

        }
    }
    
    return (
        <div className="Header-Wrapper">
            <div className="Header-Top">
                <input type="text" placeholder="Search books, authors" className="Header-Search" value={Search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") n("/filteredbooks"); }} />
                <button onClick={() => n("/filteredbooks")} className="Search-Btn">Search</button>
            </div>
            <div className="Header">
                <div className="Header-Part" onClick={() => Click("Home")}>Home</div>
                <div className="Header-Part" onClick={() => Click("Categories")}>Categories</div>
                <div className="Header-Part" onClick={() => Click("Library")}>Library</div>
                <div className="Header-Part" onClick={() => Click("Favorites")}>Favorites</div>
                <div className="Header-Part" onClick={() => Click("About")}>About</div>
                <button className="Header-SignUp" onClick={() => {setShowModal(true);setType('register');  }}>Sign up</button>
            </div>
        </div>
)
    
    
}