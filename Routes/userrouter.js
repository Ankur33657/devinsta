const express=require('express');
const router=express.Router();
const User=require('../Model/user');
const Bcrypt=require('bcrypt');
const {isValidation}= require('../utils/validation')
router.post('/signup',async(req,res)=>{
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

router.post('/login',async(req,res)=>{
   const {emailId,password}=req.body;
   try{
    const user=await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("Invalid Credentials");
    }
    const isCorrectPassword= await Bcrypt.compare(password,user.password);
    if(!isCorrectPassword){
        throw new Error("Invalid Credentials");
    }
    res.status(200).json("Login Succesfully");
   }
   catch(error){
    res.status(400).json(error.message);
   }
})

module.exports=router;
