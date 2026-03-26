import {saved,favorites} from '../schema.js';
import {db} from '../db.js';
import express from 'express';
import { authentificate } from '../middleware/authentificate.js';

export const booksRouter=express.Router();
 
booksRouter.post('/saved',async (req,res)=>{
    const bookId=20;
    const userId=11;
    const add=await db.insert(saved).values({user_id:userId,book_id:bookId});
    if(!add){
        return res.status(400).json({message:'Something went wrong!'});
    }
    return res.json({message:'Book has been successfully added!'});
});