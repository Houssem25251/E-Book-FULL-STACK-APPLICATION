import jwt from 'jsonwebtoken';

export const authentificate =(req,res,next)=>{
    const header=req.headers['authorization'];
    const token=header && header.split(' ')[1];
    if(!token) return res.status(401).json({error:'no token provided'});
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(403).json({error:'invalid token'});
        req.user=user;
        next();
    });
};