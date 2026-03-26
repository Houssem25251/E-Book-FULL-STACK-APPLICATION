import {users} from '../schema.js';
import {db} from '../db.js';
import express from 'express';
import bcrypt from 'bcrypt';
import {eq} from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import {authentificate} from '../middleware/authentificate.js';

export const usersRouter=express.Router();

usersRouter.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    const exists=await db.select().from(users).where(eq(users.username,username));
    if(exists.length>0){
        return res.status(409).json({message:"User already exists!"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const add=await db.insert(users).values({username:username,password:hashedPassword});
    if(!add){
        return res.status(401).json({message:"Addition failed!"});
    }
    return res.status(201).json({message:"Your account is successfuly created!"});
});

usersRouter.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=await db.select().from(users).where(eq(users.username,username));
    if(user.length===0) return res.status(404).json({message:"Username doesn't exist"});
    if(!await bcrypt.compare(password,user[0].password)){
        return res.status(401).json({message:"Wrong password!"});
    };
    const token=jwt.sign({id:user[0].id,username:user[0].username},process.env.JWT_SECRET,{expiresIn:'1h'});
    return res.json({token});
});

