import express from 'express';
import { db } from '../db.js';
import { books } from '../schema.js';

export const booksRouter = express.Router();


booksRouter.get('/', async (req, res) => {
    try {
        const allBooks = await db.select().from(books);
        console.log(`Fetched ${allBooks.length} books`);
        res.json(allBooks);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});


booksRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await db.select().from(books).where({ id: parseInt(id) });
        
        if (book.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        res.json(book[0]);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});