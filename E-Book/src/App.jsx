import './App.css'
import {Header} from './Components/Header/Header.jsx';
import {MainPage} from './Components/MainPage/MainPage.jsx';
import {BrowserRouter} from 'react-router';
import {Routes,Route} from 'react-router';
import {BookPage} from './Components/BookPage/BookPage.jsx';
import {useState,useEffect} from 'react';
import {CategoryPage} from './Components/CategoryPage/CategoryPage.jsx';
import {FilteredBooks} from './Components/FilteredBooks/FilteredBooks.jsx';
import {CategoriesArray} from './Data/CategoriesData.jsx';
import axios from 'axios';
import LIBRARY from '../public/Library.png';



function MainPageApp({Search,setSearch,CategoriesArray,setbooksfav,books,booksfav,bookssaved,setbookssaved,onLoginSuccess}){
  const [showModal,setShowModal]=useState(false);
  const [type,setType]=useState('login');
  const [username,setUsername]=useState('');
  const [password,setPassowrd]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const[error,setError]=useState('');

  async function handleRegister(){
    if(password !== confirmPassword) return setError("Passwords don't match!");
    try{
        const {data} = await axios.post('http://localhost:3000/api/users/register', {username, password});
        localStorage.setItem('token', data.token);
        onLoginSuccess();  
        setShowModal(false);
        setError('');
    }
    catch(err){
        setError(err.response?.data?.message || 'Registration failed');
    }
}

  async function handleLogin(){
    try{
      const {data}=await axios.post('http://localhost:3000/api/users/login',{username,password});
      localStorage.setItem('token',data.token);
      setShowModal(false);
    }
    catch(err){
      setError(err.response?.data?.message);
    }
  }
  return(
    <div className="AppDiv">
        <Header setShowModal={setShowModal} setType={setType} Search={Search} setSearch={setSearch} />
        <MainPage CategoriesArray={CategoriesArray} setbooksfav={setbooksfav} booksfav={booksfav} books={books} bookssaved={bookssaved} setbookssaved={setbookssaved} />
        {showModal && 
          <div className="Modal" onClick={()=>{setShowModal(false);}}>
              <div className="Box" onClick={(e)=>{e.stopPropagation()}}>
                  <div className="Left">
                    <img src={LIBRARY} className="lib-icon" />
                    <p className="Welcome-SignUp">Welcome</p>
                  </div>
                  <div className="Right">
                    <input className="SignUp-Input" placeholder="Username" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                    <input type ="password" className="SignUp-Input" placeholder="Password" value={password} onChange={(e)=>{setPassowrd(e.target.value)}}/>
                    {type==='register' && <input type ="password" className="SignUp-Input" placeholder="Confirm password" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>} 
                    {type==='register' && <button onClick={handleRegister} className="SignUp-Button">Register</button>}
                    {type==='login' && <button onClick={handleLogin} className="SignUp-Button">Login</button>}
                    {error && <p className="register-text">{error}</p>}
                    {type==='login' && <p onClick={()=>{setType('register');}} className="register-text">Don't have an account? <span className="register-text-click">Click here!</span></p>}
                    {type==='register' && <p onClick={()=>{setType('login');}} className="register-text">Already have an account? <span className="register-text-click">Click here!</span></p>}
                  </div>
              </div>
          </div>
        }
    </div>
  )
}

function App(){
  const [books,setBooks]=useState([]);
  const [booksfav,setbooksfav]=useState([]);
  const [bookssaved,setbookssaved]=useState([]);
  const [Search,setSearch]=useState("");

  useEffect(()=>{
    const getBooks=async()=>{
      const response = await axios.get('http://localhost:3000/api/books');
      setBooks(response.data);
    }
    getBooks();  
  },[]);

  const fetchLibrary = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [favRes, savedRes] = await Promise.all([
        axios.get('http://localhost:3000/api/users/favorites', { headers }),
        axios.get('http://localhost:3000/api/users/saved', { headers })
      ]);
      setbooksfav(favRes.data);
      setbookssaved(savedRes.data);
    } catch (err) {
      console.error('Failed to fetch library', err);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const toggleFav = async (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first!');
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post(`http://localhost:3000/api/users/favorites/${bookId}`, {}, { headers });
    fetchLibrary();
  };

  const toggleSaved = async (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first!');
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post(`http://localhost:3000/api/users/saved/${bookId}`, {}, { headers });
    fetchLibrary();
  };

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPageApp
    Search={Search}
    setSearch={setSearch}
    CategoriesArray={CategoriesArray}
    books={books}
    booksfav={booksfav}
    bookssaved={bookssaved}
    toggleFav={toggleFav}     
    toggleSaved={toggleSaved}  
    onLoginSuccess={fetchLibrary}
/>}/>
        <Route path="/book/:id" element={<BookPage Search={Search} setSearch={setSearch} setbooksfav={toggleFav} booksfav={booksfav} books={books} />}/>
        <Route path="/category/:id" element={<CategoryPage Search={Search} setSearch={setSearch} CategoriesArray={CategoriesArray} setbooksfav={toggleFav} booksfav={booksfav} books={books} bookssaved={bookssaved} setbookssaved={toggleSaved}/>}/>
        <Route path="/filteredbooks" element={<FilteredBooks Search={Search} setSearch={setSearch} books={books} booksfav={booksfav} setbooksfav={toggleFav} bookssaved={bookssaved} setbookssaved={toggleSaved}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
// <Route path="/register" element={<Register />}/>
// <Route path="/register" element={<Login />}/>