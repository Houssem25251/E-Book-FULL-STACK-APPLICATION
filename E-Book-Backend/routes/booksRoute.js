import {books} from '../schema.js';
import {db} from '../db.js';
import express from 'express';

export const booksRouter=express.Router();
 
booksRouter.get('/',async (req,res)=>{
    const booksdata=await db.select().from(books);
    res.json(booksdata);
});