import jwt from 'jsonwebtoken';

export const authentificate =(req,res,next)=>{
    const header=req.headers['authorization'];
    const token=header && header.split(' ')[1];
    if(!token) return res.status(401).json({message:'no token provdedi'});
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(403).json({message:'invalid token'});
    });
    req.user=user;
    next();
};