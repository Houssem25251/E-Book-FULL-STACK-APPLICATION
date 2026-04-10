import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import {booksRouter} from './routes/booksRoute.js';
import {usersRouter} from './routes/usersRoute.js';

const app=express();
app.use(express.json());
app.use(cors({
  origin:"https://e-book-vf1v.onrender.com"
}));

app.use('/images',express.static('booksdata/images'));
app.use('/pdf',express.static('booksdata/pdf'));


app.use('/api/books',booksRouter);
app.use('/api/users',usersRouter);
app.listen(process.env.PORT,()=>{console.log(`Server is up and running on Port:${process.env.PORT}`)});






