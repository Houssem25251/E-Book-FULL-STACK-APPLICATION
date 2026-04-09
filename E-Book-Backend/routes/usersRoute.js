import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { users, favorites, saved } from '../schema.js';
import { eq, and } from 'drizzle-orm';

export const usersRouter = express.Router();

// Register
usersRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({ username, password: hashedPassword }).returning();
    const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET);
    res.json({ token });
});

// Login
usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.select().from(users).where(eq(users.username, username));
    if (!user.length) return res.status(401).json({ message: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);
    res.json({ token });
});

// Get favorites
usersRouter.get('/favorites', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const favs = await db.select().from(favorites).where(eq(favorites.user_id, decoded.id));
    res.json(favs.map(f => f.book_id));
});

// Get saved
usersRouter.get('/saved', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const savedBooks = await db.select().from(saved).where(eq(saved.user_id, decoded.id));
    res.json(savedBooks.map(s => s.book_id));
});

// Toggle favorite
usersRouter.post('/favorites/:bookId', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const bookId = parseInt(req.params.bookId);
    
    const existing = await db.select().from(favorites)
        .where(and(eq(favorites.user_id, decoded.id), eq(favorites.book_id, bookId)));
    
    if (existing.length) {
        await db.delete(favorites).where(and(eq(favorites.user_id, decoded.id), eq(favorites.book_id, bookId)));
        res.json({ action: 'removed' });
    } else {
        await db.insert(favorites).values({ user_id: decoded.id, book_id: bookId });
        res.json({ action: 'added' });
    }
});

// Toggle saved
usersRouter.post('/saved/:bookId', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const bookId = parseInt(req.params.bookId);
    
    const existing = await db.select().from(saved)
        .where(and(eq(saved.user_id, decoded.id), eq(saved.book_id, bookId)));
    
    if (existing.length) {
        await db.delete(saved).where(and(eq(saved.user_id, decoded.id), eq(saved.book_id, bookId)));
        res.json({ action: 'removed' });
    } else {
        await db.insert(saved).values({ user_id: decoded.id, book_id: bookId });
        res.json({ action: 'added' });
    }
});