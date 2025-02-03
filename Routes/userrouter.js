const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const User=require('../Model/user');
const Bcrypt=require('bcrypt');
const {isValidation}= require('../utils/validation')
router.post('/user',async(req,res)=>{
    try{
        isValidation(req);
        const {firstName,lastName,emailId,password}=req.body;
       //add hashing
       const passwordHash=await Bcrypt.hash(password,12)
       const user=new User({
        firstName:firstName,
        lastName:lastName,
        emailId:emailId,
        password:passwordHash
       });
       await user.save();
       res.status(200).json("User Added Successfully");
    }
    catch(err){
        res.status(400).json(err.message);
    }
})

module.exports=router;
