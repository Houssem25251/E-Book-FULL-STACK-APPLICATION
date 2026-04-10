import './App.css'
import { Header } from './Components/Header/Header.jsx';
import { MainPage } from './Components/MainPage/MainPage.jsx';
import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router';
import { BookPage } from './Components/BookPage/BookPage.jsx';
import { useState, useEffect } from 'react';
import { CategoryPage } from './Components/CategoryPage/CategoryPage.jsx';
import { FilteredBooks } from './Components/FilteredBooks/FilteredBooks.jsx';
import { CategoriesArray } from './Data/CategoriesData.jsx';
import axios from 'axios';
import LIBRARY from '../public/Library.png';
import { API_URL } from './api.js';

function MainPageApp({ Search, setSearch, books, booksfav, bookssaved, toggleFav, toggleSaved, user, onLoginSuccess, onLogout }) {
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    async function handleRegister() {
        if (password !== confirmPassword) return setError("Passwords don't match!");
        try {
            const { data } = await axios.post(`${API_URL}/api/users/register`, { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            await onLoginSuccess();
            setShowModal(false);
            setError('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    }

    async function handleLogin() {
        try {
            const { data } = await axios.post(`${API_URL}/api/users/login`, { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            await onLoginSuccess();
            setShowModal(false);
            setError('');
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div className="AppDiv">
            <Header
                setShowModal={setShowModal}
                setType={setType}
                Search={Search}
                setSearch={setSearch}
                user={user}
                onLogout={onLogout}
            />
            <MainPage
                CategoriesArray={CategoriesArray}
                books={books}
                booksfav={booksfav}
                bookssaved={bookssaved}
                toggleFav={toggleFav}
                toggleSaved={toggleSaved}
            />
            {showModal &&
                <div className="Modal" onClick={() => setShowModal(false)}>
                    <div className="Box" onClick={(e) => e.stopPropagation()}>
                        <div className="Left">
                            <img src={LIBRARY} className="lib-icon" />
                            <p className="Welcome-SignUp">Welcome</p>
                        </div>
                        <div className="Right">
                            <input
                                className="SignUp-Input"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                className="SignUp-Input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {type === 'register' && (
                                <input
                                    type="password"
                                    className="SignUp-Input"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            )}
                            {type === 'register' && (
                                <button onClick={handleRegister} className="SignUp-Button">Register</button>
                            )}
                            {type === 'login' && (
                                <button onClick={handleLogin} className="SignUp-Button">Login</button>
                            )}
                            {error && (
                                <p className="register-text" style={{ color: 'red' }}>{error}</p>
                            )}
                            {type === 'login' && (
                                <p onClick={() => { setType('register'); setError(''); }} className="register-text">
                                    Don't have an account? <span className="register-text-click">Click here!</span>
                                </p>
                            )}
                            {type === 'register' && (
                                <p onClick={() => { setType('login'); setError(''); }} className="register-text">
                                    Already have an account? <span className="register-text-click">Click here!</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

function App() {
    const [books, setBooks] = useState([]);
    const [booksfav, setBooksfav] = useState([]);
    const [bookssaved, setBookssaved] = useState([]);
    const [Search, setSearch] = useState('');
    const [user, setUser] = useState(localStorage.getItem('username') || null);

    useEffect(() => {
        axios.get(`${API_URL}/api/books`).then(r => setBooks(r.data));
    }, []);

    const fetchLibrary = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [favRes, savedRes] = await Promise.all([
                axios.get(`${API_URL}/api/users/favorites`, { headers }),
                axios.get(`${API_URL}/api/users/saved`, { headers })
            ]);
            setBooksfav(favRes.data);
            setBookssaved(savedRes.data);
        } catch (err) {
            handleLogout();
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setUser(localStorage.getItem('username'));
            fetchLibrary();
        }
    }, []);

    const onLoginSuccess = async () => {
        setUser(localStorage.getItem('username'));
        await fetchLibrary();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
        setBooksfav([]);
        setBookssaved([]);
    };

    const toggleFav = async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please login first!');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            await axios.post(`${API_URL}/api/users/favorites/${bookId}`, {}, { headers });
            fetchLibrary();
        } catch {
            alert('Failed to update favorites');
        }
    };

    const toggleSaved = async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please login first!');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            await axios.post(`${API_URL}/api/users/saved/${bookId}`, {}, { headers });
            fetchLibrary();
        } catch {
            alert('Failed to update saved books');
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <MainPageApp
                        Search={Search}
                        setSearch={setSearch}
                        books={books}
                        booksfav={booksfav}
                        bookssaved={bookssaved}
                        toggleFav={toggleFav}
                        toggleSaved={toggleSaved}
                        user={user}
                        onLoginSuccess={onLoginSuccess}
                        onLogout={handleLogout}
                    />
                } />
                <Route path="/book/:id" element={
                    <BookPage
                        Search={Search}
                        setSearch={setSearch}
                        books={books}
                        booksfav={booksfav}
                        toggleFav={toggleFav}
                        user={user}
                        onLogout={handleLogout}
                    />
                } />
                <Route path="/category/:id" element={
                    <CategoryPage
                        Search={Search}
                        setSearch={setSearch}
                        CategoriesArray={CategoriesArray}
                        books={books}
                        booksfav={booksfav}
                        bookssaved={bookssaved}
                        toggleFav={toggleFav}
                        toggleSaved={toggleSaved}
                        user={user}
                        onLogout={handleLogout}
                    />
                } />
                <Route path="/filteredbooks" element={
                    <FilteredBooks
                        Search={Search}
                        setSearch={setSearch}
                        books={books}
                        booksfav={booksfav}
                        bookssaved={bookssaved}
                        toggleFav={toggleFav}
                        toggleSaved={toggleSaved}
                        user={user}
                        onLogout={handleLogout}
                    />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
