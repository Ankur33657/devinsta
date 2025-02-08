const express=require('express');
const jwt = require('jsonwebtoken');
const User=require('../Model/user')

const UserAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Invalid token!!");
        }
        const decodemsg= await jwt.verify(token,process.env.SECRET_KEY);
        const {_id}=decodemsg;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("Invalid user!!");
        }
        req.user=user;
        next();

    }
    catch(error){
        res.status(400).json("Login first");
    }
}

module.exports={
    UserAuth,
}